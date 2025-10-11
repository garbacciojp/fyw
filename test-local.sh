#!/bin/bash

echo "🧪 Find Your Word - Local Mobile Testing"
echo "========================================"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
  echo "❌ dist/ folder not found!"
  echo "   Run 'npm run build' first"
  exit 1
fi

# Check if widget files exist
if [ ! -f "dist/find-your-word-v2.iife.js" ]; then
  echo "❌ Widget files not found in dist/"
  echo "   Run 'npm run build' first"
  exit 1
fi

echo "✅ Widget files found"
echo ""

# Build first
echo "📦 Building latest changes..."
npm run build
echo ""

# Start the server
echo "🚀 Starting local server..."
echo ""
echo "📱 Test URLs:"
echo "   - Desktop: http://localhost:8080/test-mobile-local.html"
echo "   - Mobile (same network): http://[YOUR_LOCAL_IP]:8080/test-mobile-local.html"
echo ""
echo "💡 To test on mobile:"
echo "   1. Find your computer's IP address:"
echo "      - Mac: System Settings → Network → Your IP"
echo "      - Or run: ifconfig | grep 'inet '"
echo "   2. Open http://[YOUR_IP]:8080/test-mobile-local.html on your phone"
echo ""
echo "🛑 Press Ctrl+C to stop"
echo ""

# Start the server
node server.js

