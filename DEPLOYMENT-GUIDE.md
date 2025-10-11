# Digital Ocean Deployment Guide - Find Your Word Widget

## 🎯 Architecture Overview

```
Shopify Store
    ↓ (loads widget script)
Widget (Client-side)
    ↓ (POST /api/suggest-words)
Digital Ocean Server (Node.js + Express)
    ↓ (proxies to OpenAI)
OpenAI API
    ↓ (returns suggestions)
Digital Ocean Server
    ↓ (returns to widget)
Widget displays results
```

**Key Benefits:**
- ✅ API keys stay secure on server (never exposed to client)
- ✅ Server handles rate limiting and error handling
- ✅ Easy to monitor and log requests
- ✅ Can add caching, analytics, etc. on server

---

## 📋 Prerequisites

- [ ] Digital Ocean account with App Platform access
- [ ] OpenAI API key
- [ ] OpenAI Prompt ID (stored prompt)
- [ ] Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Node.js 18+ installed locally for testing

---

## 🚀 Step 1: Local Development Setup

### 1.1 Create Environment File

```bash
# In your project root
cp env.example .env
```

### 1.2 Configure Environment Variables

Edit `.env` and add your credentials:

```env
# Server Configuration (for server.js)
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_PROMPT_ID=pmpt_your-actual-prompt-id-here
PORT=8080

# Widget Build Configuration (for npm run build)
VITE_API_BASE_URL=http://localhost:8080
VITE_DEBUG_MODE=true
```

### 1.3 Install Dependencies

```bash
npm install
```

### 1.4 Test Locally

**Terminal 1 - Start the server:**
```bash
npm start
```

You should see:
```
🚀 Find Your Word Widget v2 server running on port 8080
📦 Widget JS available at: /widget/v2/find-your-word-v2.iife.js
🎨 Widget CSS available at: /widget/v2/style.css
🏥 Health check at: /health
```

**Terminal 2 - Build the widget:**
```bash
npm run build
```

**Terminal 3 - Test the widget:**
```bash
npm run dev
```

Open http://localhost:5173 and test the full flow.

### 1.5 Verify API Endpoint

Test the API proxy:

```bash
curl -X POST http://localhost:8080/api/suggest-words \
  -H "Content-Type: application/json" \
  -d '{
    "userData": {
      "wordType": "mine",
      "name": "Test",
      "age": "25-35"
    }
  }'
```

You should see a response from OpenAI (or an error with helpful details).

---

## 🌐 Step 2: Digital Ocean Deployment

### 2.1 Prepare Your Repository

**Commit your changes:**

```bash
git add server.js package.json env.example
git commit -m "Add API proxy server for secure OpenAI integration"
git push origin main
```

**⚠️ Important:** Make sure `.env` is in your `.gitignore` file:

```bash
# Check if .env is ignored
git check-ignore .env
# Should output: .env

# If not, add it:
echo ".env" >> .gitignore
git commit -am "Add .env to gitignore"
git push
```

### 2.2 Create Digital Ocean App

1. Log in to [Digital Ocean](https://cloud.digitalocean.com/)
2. Click "Create" → "Apps"
3. Choose "GitHub" (or your git provider)
4. Select your repository and branch (e.g., `main`)
5. Click "Next"

### 2.3 Configure Build Settings

**App Name:** `find-your-word-widget` (or your preference)

**Build Command:**
```bash
npm install && npm run build
```

**Run Command:**
```bash
npm start
```

**HTTP Port:** `8080`

**Environment:** `Node.js`

### 2.4 Set Environment Variables

In the Digital Ocean App settings, add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `OPENAI_API_KEY` | `sk-proj-...` | Your OpenAI API key |
| `OPENAI_PROMPT_ID` | `pmpt_...` | Your stored prompt ID |
| `PORT` | `8080` | (Usually set automatically by DO) |

**How to add:**
1. Go to your App → Settings → App-Level Environment Variables
2. Click "Edit"
3. Add each variable
4. Click "Save"

### 2.5 Deploy

Click "Deploy" and wait for the build to complete (usually 2-5 minutes).

Once deployed, you'll get a URL like:
```
https://find-your-word-widget-xxxxx.ondigitalocean.app
```

### 2.6 Test Deployment

**Test health endpoint:**
```bash
curl https://your-app.ondigitalocean.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "find-your-word-widget",
  "version": "2.0.0",
  "timestamp": "2025-10-11T..."
}
```

**Test widget files:**
```bash
# Should return JavaScript
curl https://your-app.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js

# Should return CSS
curl https://your-app.ondigitalocean.app/widget/v2/style.css
```

**Test API endpoint:**
```bash
curl -X POST https://your-app.ondigitalocean.app/api/suggest-words \
  -H "Content-Type: application/json" \
  -d '{
    "userData": {
      "wordType": "mine",
      "name": "Test",
      "age": "25-35"
    }
  }'
```

---

## 🛍️ Step 3: Shopify Integration

### 3.1 Update Widget Build

Now that your server is deployed, rebuild the widget to point to your production server:

**Update `.env`:**
```env
VITE_API_BASE_URL=https://your-app.ondigitalocean.app
VITE_DEBUG_MODE=false
```

**Rebuild:**
```bash
npm run build
```

**Upload to server:**

The build already includes the production API URL baked in. The server serves this from `/widget/v2/`.

Your widget is now available at:
```
https://your-app.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js
https://your-app.ondigitalocean.app/widget/v2/style.css
```

### 3.2 Add to Shopify Theme

**Method 1: Direct Script Tag**

Add to your Shopify theme's `theme.liquid` file, before `</body>`:

```liquid
<!-- Find Your Word Widget -->
<link rel="stylesheet" href="https://your-app.ondigitalocean.app/widget/v2/style.css">
<script src="https://your-app.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js" defer></script>

<!-- Trigger Button -->
<button 
  onclick="window.FindYourWordWidget?.open()" 
  style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; 
         padding: 16px 32px; background: #000; color: #fff; border: none; 
         border-radius: 8px; cursor: pointer; font-weight: 600;"
>
  Find Your Word
</button>
```

**Method 2: Shopify Section**

See `SHOPIFY-INTEGRATION-GUIDE.md` for detailed section setup.

### 3.3 Test on Shopify

1. Open your Shopify store
2. Click the "Find Your Word" button
3. Complete the form
4. Verify suggestions are returned

---

## 🔍 Monitoring & Debugging

### Check Server Logs

In Digital Ocean App Platform:
1. Go to your App
2. Click "Runtime Logs"
3. Watch for:
   - `📝 Received request for word suggestions`
   - `🚀 Sending request to OpenAI...`
   - `✅ Received response from OpenAI`

### Common Issues

#### Issue 1: Widget loads but API calls fail

**Check:**
- CORS headers are set correctly (check Network tab in DevTools)
- `VITE_API_BASE_URL` in widget build matches your DO server URL
- Environment variables are set in DO dashboard

**Fix:**
```bash
# Rebuild with correct API URL
VITE_API_BASE_URL=https://your-actual-url.ondigitalocean.app npm run build

# Redeploy (commit and push, or use DO dashboard)
```

#### Issue 2: API returns 500 error

**Check server logs in DO:**
- Look for "OPENAI_API_KEY not configured"
- Look for "OPENAI_PROMPT_ID not configured"

**Fix:**
Add missing environment variables in DO App Settings.

#### Issue 3: OpenAI API errors

**Check logs for:**
- `❌ OpenAI API error`
- Status code (401 = bad key, 429 = rate limit, etc.)

**Fix:**
- Verify API key is valid
- Check OpenAI account has credits
- Verify prompt ID exists

---

## 🔄 Updating the Widget

### For Code Changes:

```bash
# 1. Make changes to widget code
# 2. Build
npm run build

# 3. Commit and push
git add .
git commit -m "Update widget"
git push origin main

# 4. Digital Ocean will auto-deploy
```

### For Server Changes:

```bash
# 1. Update server.js
# 2. Commit and push
git add server.js
git commit -m "Update API proxy"
git push origin main

# 3. Digital Ocean will auto-deploy
```

### For Environment Variables:

1. Go to DO App → Settings → Environment Variables
2. Edit variables
3. Click "Save"
4. App will restart automatically

---

## 💰 Digital Ocean Pricing

**App Platform - Basic Plan:**
- $5/month for 512MB RAM, 1 vCPU
- Sufficient for most use cases
- Auto-scaling available if needed

**Bandwidth:**
- 1TB outbound transfer included
- Widget is ~330KB, so approximately 3 million loads per month

---

## 🔐 Security Checklist

- [x] API key stored only on server (not in widget bundle)
- [x] Environment variables in DO (not in git)
- [x] .env file in .gitignore
- [x] CORS headers properly configured
- [x] HTTPS enforced (automatic with DO)
- [ ] Optional: Add rate limiting to API endpoint
- [ ] Optional: Add request authentication
- [ ] Optional: Add IP whitelist for Shopify

---

## 📊 Performance Optimization

### Enable Caching

Add this to server.js for better performance:

```javascript
// Cache OpenAI responses for identical requests (optional)
const cache = new Map();

app.post('/api/suggest-words', async (req, res) => {
  const cacheKey = JSON.stringify(req.body);
  
  if (cache.has(cacheKey)) {
    console.log('✨ Returning cached result');
    return res.json(cache.get(cacheKey));
  }
  
  // ... existing code ...
  
  // After successful response:
  cache.set(cacheKey, openaiData);
  setTimeout(() => cache.delete(cacheKey), 3600000); // Clear after 1 hour
});
```

### Enable Gzip Compression

```javascript
import compression from 'compression';
app.use(compression());
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Tested locally with `npm start` and `npm run dev`
- [ ] Environment variables configured in `.env`
- [ ] All changes committed to git
- [ ] `.env` is in `.gitignore`

### Digital Ocean Setup
- [ ] App created and connected to repository
- [ ] Environment variables set in DO dashboard
- [ ] Build and run commands configured
- [ ] App deployed successfully
- [ ] Health check endpoint returns 200

### Testing
- [ ] Widget JS loads correctly
- [ ] Widget CSS loads correctly
- [ ] API endpoint returns data
- [ ] Full user flow works end-to-end
- [ ] No console errors in browser

### Shopify Integration
- [ ] Widget script added to theme
- [ ] Button/trigger added
- [ ] Widget opens correctly
- [ ] API calls work from Shopify
- [ ] Results display properly

---

## 🆘 Support & Troubleshooting

### Logs

**View server logs:**
```bash
# In Digital Ocean dashboard
Apps → Your App → Runtime Logs
```

**View build logs:**
```bash
# In Digital Ocean dashboard
Apps → Your App → Build Logs
```

### Test Endpoints

```bash
# Health check
curl https://your-app.ondigitalocean.app/health

# Widget info
curl https://your-app.ondigitalocean.app/widget/info

# API test
curl -X POST https://your-app.ondigitalocean.app/api/suggest-words \
  -H "Content-Type: application/json" \
  -d '{"userData":{"wordType":"mine","name":"Test","age":"25-35"}}'
```

---

## 📚 Additional Resources

- [Digital Ocean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Shopify Theme Development](https://shopify.dev/themes)

---

**Last Updated:** October 11, 2025  
**Widget Version:** 2.0.0  
**Architecture:** Client → DO Server → OpenAI

