/**
 * Express server for Digital Ocean App Platform
 * 1. Serves the built widget files with proper CORS headers for Shopify embedding
 * 2. Proxies OpenAI API requests (keeps API key secure on server)
 * 3. Implements API key rotation with automatic failover
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiKeyRotator } from './server-services/api-key-rotator.service.js';
import { validateAPIKeyConfig, RETRY_CONFIG } from './server-config/api-keys.config.js';

// Load environment variables
dotenv.config();

// Validate API key configuration on startup
const configValidation = validateAPIKeyConfig();
if (!configValidation.valid) {
  console.error('❌ API Key configuration errors:');
  configValidation.errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`✅ API Key configuration valid (${configValidation.keyCount} key(s) configured)`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Enable CORS for all origins (needed for Shopify embedding and API requests)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  // Set appropriate content types
  if (req.path.endsWith('.js')) {
    res.header('Content-Type', 'application/javascript; charset=utf-8');
  }
  if (req.path.endsWith('.css')) {
    res.header('Content-Type', 'text/css; charset=utf-8');
  }
  
  // Cache headers for widget files
  if (req.path.includes('/widget/')) {
    res.header('Cache-Control', 'public, max-age=86400'); // 24 hours
  }
  
  next();
});

// Serve test files from root (for local testing)
app.use(express.static(path.join(__dirname), {
  index: false, // Don't auto-serve index.html
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache'); // Don't cache test files
    }
  }
}));

// Serve widget files from dist directory
app.use('/widget/v2', express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    if (filepath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

// Also serve from root for easy access
app.use(express.static(path.join(__dirname, 'dist')));

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * API Proxy Endpoint for OpenAI with Automatic Key Rotation
 * Proxies requests to OpenAI API with intelligent retry logic
 * POST /api/suggest-words
 * 
 * Features:
 * - Automatic failover to backup API keys on failure
 * - Configurable retry attempts and timeout
 * - Smart error detection and retry logic
 */
app.post('/api/suggest-words', async (req, res) => {
  try {
    const { userData } = req.body;

    // Validate request
    if (!userData) {
      return res.status(400).json({ 
        error: 'Missing userData in request body' 
      });
    }

    console.log('📝 Received request for word suggestions');
    console.log('📊 User data:', JSON.stringify(userData, null, 2));

    /**
     * API call function that will be retried with different keys
     * @param {string} apiKey - The OpenAI API key to use
     * @returns {Promise<Object>} OpenAI API response
     */
    const makeOpenAIRequest = async (apiKey) => {
      // Get the prompt ID (same for all keys)
      const promptId = apiKeyRotator.getPromptId();
      
      // Prepare OpenAI API request
      const openaiPayload = {
        prompt: {
          id: promptId,
          version: '1'
        },
        input: [{ 
          role: 'user', 
          content: JSON.stringify(userData)
        }]
      };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(), 
        RETRY_CONFIG.REQUEST_TIMEOUT_MS
      );

      try {
        // Make request to OpenAI
        const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(openaiPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text().catch(() => 'Unknown error');
          
          const error = new Error(`OpenAI API error: ${errorText}`);
          error.status = openaiResponse.status;
          error.response = {
            status: openaiResponse.status,
            statusText: openaiResponse.statusText
          };
          
          throw error;
        }

        const openaiData = await openaiResponse.json();
        return openaiData;

      } catch (error) {
        clearTimeout(timeoutId);
        
        // Handle timeout errors
        if (error.name === 'AbortError') {
          const timeoutError = new Error(`Request timed out after ${RETRY_CONFIG.REQUEST_TIMEOUT_MS}ms`);
          timeoutError.name = 'TimeoutError';
          timeoutError.status = 408;
          throw timeoutError;
        }
        
        throw error;
      }
    };

    // Execute with automatic retry and key rotation
    const result = await apiKeyRotator.executeWithRetry(makeOpenAIRequest);
    
    console.log('✅ Successfully received response from OpenAI');
    
    // Return OpenAI response to client
    res.json(result);

  } catch (error) {
    console.error('❌ Error in API proxy:', error);
    
    // Determine appropriate status code
    const statusCode = error?.status || error?.response?.status || 500;
    
    res.status(statusCode).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const keyHealth = apiKeyRotator.getHealthStatus();
  
  res.json({ 
    status: 'healthy', 
    service: 'find-your-word-widget',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    apiKeys: {
      total: keyHealth.length,
      health: keyHealth.map(key => ({
        label: key.label,
        status: key.failures === 0 ? 'healthy' : 'degraded',
        failures: key.failures,
        lastFailure: key.lastFailure ? new Date(key.lastFailure).toISOString() : null
      }))
    }
  });
});

// API Key health endpoint (detailed diagnostics)
app.get('/api/health/keys', (req, res) => {
  const keyHealth = apiKeyRotator.getHealthStatus();
  const currentKey = apiKeyRotator.getCurrentKey();
  
  res.json({
    current: {
      label: currentKey.label,
      inUse: true
    },
    keys: keyHealth,
    config: {
      maxRetries: RETRY_CONFIG.MAX_TOTAL_ATTEMPTS,
      timeoutMs: RETRY_CONFIG.REQUEST_TIMEOUT_MS,
      retryDelayMs: RETRY_CONFIG.RETRY_DELAY_MS
    }
  });
});

// Widget info endpoint
app.get('/widget/info', (req, res) => {
  res.json({
    name: 'Find Your Word Widget',
    version: '2.0.0',
    widget_url: `${req.protocol}://${req.get('host')}/widget/v2/find-your-word-v2.iife.js`,
    css_url: `${req.protocol}://${req.get('host')}/widget/v2/style.css`,
    integration_code: `<link rel="stylesheet" href="${req.protocol}://${req.get('host')}/widget/v2/style.css">
<script src="${req.protocol}://${req.get('host')}/widget/v2/find-your-word-v2.iife.js"></script>`,
    status: 'active'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Find Your Word Widget v2.0',
    widget_js: `${req.protocol}://${req.get('host')}/widget/v2/find-your-word-v2.iife.js`,
    widget_css: `${req.protocol}://${req.get('host')}/widget/v2/style.css`,
    docs: `${req.protocol}://${req.get('host')}/widget/info`,
    health: `${req.protocol}://${req.get('host')}/health`
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Find Your Word Widget v2 server running on port ${PORT}`);
  console.log(`📦 Widget JS available at: /widget/v2/find-your-word-v2.iife.js`);
  console.log(`🎨 Widget CSS available at: /widget/v2/style.css`);
  console.log(`🏥 Health check at: /health`);
});

