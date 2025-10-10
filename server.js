/**
 * Simple Express server for Digital Ocean App Platform
 * Serves the built widget files with proper CORS headers for Shopify embedding
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all origins (needed for Shopify embedding)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
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

