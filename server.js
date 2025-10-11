/**
 * Express server for Digital Ocean App Platform
 * 1. Serves the built widget files with proper CORS headers for Shopify embedding
 * 2. Proxies OpenAI API requests (keeps API key secure on server)
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
 * API Proxy Endpoint for OpenAI
 * Proxies requests to OpenAI API to keep API key secure on server
 * POST /api/suggest-words
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

    // Check API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    const promptId = process.env.OPENAI_PROMPT_ID;

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Server configuration error: API key not set' 
      });
    }

    if (!promptId) {
      console.error('❌ OPENAI_PROMPT_ID not configured');
      return res.status(500).json({ 
        error: 'Server configuration error: Prompt ID not set' 
      });
    }

    console.log('📝 Received request for word suggestions');
    console.log('📊 User data:', JSON.stringify(userData, null, 2));

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

    console.log('🚀 Sending request to OpenAI...');

    // Make request to OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openaiPayload)
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text().catch(() => 'Unknown error');
      console.error('❌ OpenAI API error:', {
        status: openaiResponse.status,
        statusText: openaiResponse.statusText,
        error: errorText
      });
      
      return res.status(openaiResponse.status).json({ 
        error: `OpenAI API error: ${errorText}` 
      });
    }

    const openaiData = await openaiResponse.json();
    console.log('✅ Received response from OpenAI');

    // Return OpenAI response to client
    res.json(openaiData);

  } catch (error) {
    console.error('❌ Error in API proxy:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'find-your-word-widget',
    version: '2.0.0',
    timestamp: new Date().toISOString()
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

