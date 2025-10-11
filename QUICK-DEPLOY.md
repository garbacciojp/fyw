# Quick Deploy Guide - Find Your Word Widget

> **Goal:** Get widget running on Shopify in 15 minutes

## Architecture (What You Asked For!)

```
Shopify Store
    ↓ loads widget
Widget (JavaScript)
    ↓ POST request
Your Digital Ocean Server
    ↓ proxies to
OpenAI API
```

✅ API keys stay on YOUR server (secure!)  
✅ Shopify just loads the widget JavaScript  
✅ Widget talks to YOUR backend  
✅ Same setup as the old working version

---

## Step 1: Configure Environment (2 min)

```bash
# Copy example file
cp env.example .env

# Edit .env and add your keys:
# OPENAI_API_KEY=sk-proj-...
# OPENAI_PROMPT_ID=pmpt_...
# VITE_API_BASE_URL=http://localhost:8080  # for local testing
```

---

## Step 2: Install & Test Locally (3 min)

```bash
# Install dependencies (includes dotenv now)
npm install

# Terminal 1 - Start server
npm start

# Terminal 2 - Build widget
npm run build

# Terminal 3 - Test widget
npm run dev
```

Open http://localhost:5173 and test the flow.

---

## Step 3: Deploy to Digital Ocean (5 min)

### 3.1 Push to Git

```bash
git add .
git commit -m "Add API proxy server"
git push origin main
```

### 3.2 Create DO App

1. Digital Ocean Dashboard → Create → Apps
2. Connect your GitHub repo
3. Select branch (main)

### 3.3 Configure Build

- **Build Command:** `npm install && npm run build`
- **Run Command:** `npm start`
- **HTTP Port:** `8080`

### 3.4 Set Environment Variables

In DO App Settings → Environment Variables:

```
OPENAI_API_KEY = sk-proj-your-key-here
OPENAI_PROMPT_ID = pmpt_your-prompt-id-here
```

### 3.5 Deploy

Click "Deploy" and wait 2-3 minutes.

You'll get a URL like: `https://find-your-word-xxxxx.ondigitalocean.app`

### 3.6 Test Deployment

```bash
curl https://your-app.ondigitalocean.app/health
```

Should return:
```json
{"status": "healthy", "service": "find-your-word-widget", ...}
```

---

## Step 4: Rebuild Widget for Production (2 min)

Now that your server is live, rebuild widget to point to it:

```bash
# Update .env
VITE_API_BASE_URL=https://your-app.ondigitalocean.app
VITE_DEBUG_MODE=false

# Rebuild
npm run build

# Commit and push (DO will auto-deploy)
git add .
git commit -m "Update widget for production"
git push origin main
```

Wait 2-3 minutes for DO to rebuild.

---

## Step 5: Add to Shopify (3 min)

### Option A: Theme.liquid (Quick & Easy)

1. Shopify Admin → Online Store → Themes → Edit Code
2. Open `layout/theme.liquid`
3. Add before `</body>`:

```liquid
<!-- Find Your Word Widget -->
<link rel="stylesheet" href="https://your-app.ondigitalocean.app/widget/v2/style.css">
<script src="https://your-app.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js" defer></script>

<!-- Floating Button -->
<button 
  onclick="window.FindYourWordWidget?.open()" 
  style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; 
         padding: 16px 32px; background: #000; color: #fff; border: none; 
         border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"
>
  Find Your Word
</button>
```

4. Save

### Option B: Custom Section (Better for Theme Customizer)

1. Shopify Admin → Online Store → Themes → Edit Code
2. Create new section: `sections/find-your-word.liquid`
3. Paste:

```liquid
<link rel="stylesheet" href="https://your-app.ondigitalocean.app/widget/v2/style.css">
<script src="https://your-app.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js" defer></script>

<button 
  onclick="window.FindYourWordWidget?.open()" 
  class="fyw-trigger"
  style="padding: {{ section.settings.padding }}px; 
         background: {{ section.settings.bg_color }}; 
         color: {{ section.settings.text_color }};"
>
  {{ section.settings.button_text }}
</button>

{% schema %}
{
  "name": "Find Your Word",
  "settings": [
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Find Your Word"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#000000"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text Color",
      "default": "#FFFFFF"
    },
    {
      "type": "range",
      "id": "padding",
      "label": "Padding",
      "min": 8,
      "max": 32,
      "step": 2,
      "default": 16,
      "unit": "px"
    }
  ],
  "presets": [{ "name": "Find Your Word" }]
}
{% endschema %}
```

4. Save
5. Go to Theme Customizer
6. Add section "Find Your Word"
7. Customize and save

---

## Step 6: Test on Shopify ✅

1. Open your Shopify store
2. Click "Find Your Word" button
3. Fill out form
4. Submit and verify results appear

---

## Troubleshooting

### Widget loads but API fails

**Check:** Browser console for errors

**Fix:**
```bash
# Rebuild with correct API URL
VITE_API_BASE_URL=https://your-actual-url.ondigitalocean.app
npm run build
git commit -am "Fix API URL"
git push
```

### Server returns 500 error

**Check:** DO logs (Apps → Your App → Runtime Logs)

**Fix:** Add missing environment variables in DO dashboard

### CORS errors

**Already handled!** Server includes proper CORS headers for Shopify.

---

## Testing Endpoints

```bash
# Health check
curl https://your-app.ondigitalocean.app/health

# Widget JS (should return JavaScript code)
curl https://your-app.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js

# API test
curl -X POST https://your-app.ondigitalocean.app/api/suggest-words \
  -H "Content-Type: application/json" \
  -d '{"userData":{"wordType":"mine","name":"Test","age":"25-35"}}'
```

---

## What Changed From Old Version?

| Feature | Old (fyw2) | New (fyw) |
|---------|------------|-----------|
| **API Calls** | Client → OpenAI | Client → YOUR Server → OpenAI |
| **API Key** | In widget bundle | On server only ✅ |
| **CORS** | Configured ✅ | Configured ✅ |
| **Deployment** | DO serves widget | DO serves widget + API ✅ |
| **Security** | Exposed key ❌ | Secure ✅ |

The new version is MORE secure and works exactly the same way!

---

## URLs You'll Need

Replace `your-app` with your actual Digital Ocean app name:

- Widget JS: `https://your-app.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js`
- Widget CSS: `https://your-app.ondigitalocean.app/widget/v2/style.css`
- API Endpoint: `https://your-app.ondigitalocean.app/api/suggest-words`
- Health Check: `https://your-app.ondigitalocean.app/health`

---

## Next Steps

For more detailed info, see:
- `DEPLOYMENT-GUIDE.md` - Full deployment documentation
- `README.md` - Project overview
- `BUILD-STATUS.md` - Build metrics

---

**Last Updated:** October 11, 2025  
**Architecture:** Matches old working version (client → server → OpenAI) ✅

