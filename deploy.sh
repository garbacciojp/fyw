#!/bin/bash

###############################################################################
# Find Your Word Widget - Deployment Script
# Builds and prepares widget for deployment to Digital Ocean
###############################################################################

set -e  # Exit on error

echo "🚀 Building Find Your Word Widget v2.0..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Run type check
echo "🔍 Running type check..."
npm run typecheck
echo "✅ Type check passed"
echo ""

# Build production bundle
echo "🔨 Building production bundle..."
npm run build
echo ""

# Check if build succeeded
if [ ! -f "dist/find-your-word-v2.iife.js" ]; then
  echo "❌ Build failed - bundle not found"
  exit 1
fi

# Get bundle size
SIZE=$(wc -c < "dist/find-your-word-v2.iife.js" | tr -d ' ')
SIZE_KB=$((SIZE / 1024))
echo "📦 Bundle size: ${SIZE_KB}KB"
echo ""

# Check if bundle is too large (warning at 300KB)
if [ $SIZE_KB -gt 300 ]; then
  echo "⚠️  Warning: Bundle is larger than 300KB"
  echo "   Consider optimizing or code splitting"
  echo ""
fi

echo "✅ Build complete!"
echo ""
echo "📁 Build output:"
echo "   - dist/find-your-word-v2.iife.js (${SIZE_KB}KB)"
echo ""
echo "🌐 Next steps:"
echo "   1. Test locally: npm run preview"
echo "   2. Upload to Digital Ocean:"
echo "      scp dist/find-your-word-v2.iife.js user@your-droplet:/app/static/widget/v2/"
echo ""
echo "🔗 Integration example:"
echo '   <script src="https://your-domain.com/widget/v2/find-your-word-v2.iife.js"></script>'
echo '   <button onclick="FindYourWordWidget.open()">Find Your Word</button>'
echo ""


