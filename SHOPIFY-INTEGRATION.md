# 🛍️ Shopify Integration - Final Steps

**Status:** ✅ Ready to deploy to Shopify  
**Digital Ocean URL:** `https://fyw-lrqe8.ondigitalocean.app`

---

## 🎯 What You Need to Do

### Step 1: Test Locally (2 minutes)

Open the test page to verify everything works:

```bash
open SHOPIFY-TEST.html
```

Click **"Run All Tests"** button. You should see:
- ✅ Test 1: Widget global object exists
- ✅ Test 2: Widget API methods available
- ✅ Test 3: Server health check passed
- ✅ Test 4: Widget files accessible
- ✅ Test 5: CORS headers configured correctly
- ✅ Test 6: API endpoint working

Then click **"Open Widget"** to test the full user flow.

---

### Step 2: Add to Shopify (5 minutes)

1. **Login to Shopify Admin**
   - Go to: https://admin.shopify.com
   - Navigate to: **Online Store → Themes**

2. **Edit Theme Code**
   - Click **Actions** → **Edit code**
   - In the left sidebar, find and click: `theme.liquid`

3. **Add Widget Code**
   - Scroll to the bottom, find the `</body>` tag
   - Add this code **RIGHT BEFORE** `</body>`:

```liquid
<!-- Find Your Word Widget -->
<link rel="stylesheet" href="https://fyw-lrqe8.ondigitalocean.app/widget/v2/style.css">
<script src="https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js" defer></script>

<!-- Trigger Button (customize as needed) -->
<button 
  onclick="window.FindYourWordWidget?.open()" 
  style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; 
         padding: 16px 32px; background: #000; color: #fff; border: none; 
         border-radius: 8px; cursor: pointer; font-weight: 600; 
         box-shadow: 0 4px 12px rgba(0,0,0,0.3);"
>
  Find Your Word
</button>
```

4. **Save**
   - Click the green **Save** button in the top right

---

### Step 3: Test on Shopify (2 minutes)

1. **Open Your Store**
   - Click **Online Store → View your store** (or visit your store URL)

2. **Look for the Button**
   - You should see a black "Find Your Word" button in the bottom right corner

3. **Test the Widget**
   - Click the button
   - Complete the questionnaire
   - Verify you get word suggestions

4. **Check Browser Console** (if issues)
   - Press F12 to open developer tools
   - Look for errors in the Console tab
   - Check Network tab for failed requests

---

## 🎨 Customizing the Button

### Change Button Position

Replace the `style` attribute in the button code:

**Bottom Left:**
```html
style="position: fixed; bottom: 20px; left: 20px; z-index: 9999; 
       padding: 16px 32px; background: #000; color: #fff; border: none; 
       border-radius: 8px; cursor: pointer; font-weight: 600; 
       box-shadow: 0 4px 12px rgba(0,0,0,0.3);"
```

**Top Right:**
```html
style="position: fixed; top: 20px; right: 20px; z-index: 9999; 
       padding: 16px 32px; background: #000; color: #fff; border: none; 
       border-radius: 8px; cursor: pointer; font-weight: 600; 
       box-shadow: 0 4px 12px rgba(0,0,0,0.3);"
```

**Centered at Bottom:**
```html
style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; 
       padding: 16px 32px; background: #000; color: #fff; border: none; 
       border-radius: 8px; cursor: pointer; font-weight: 600; 
       box-shadow: 0 4px 12px rgba(0,0,0,0.3);"
```

### Change Button Colors

**White Button:**
```html
background: #fff; color: #000; border: 2px solid #000;
```

**Purple Button:**
```html
background: #6B46C1; color: #fff;
```

**Pink Button:**
```html
background: #EC4899; color: #fff;
```

### Change Button Text

Replace `Find Your Word` with your preferred text:
- `Discover Your Word`
- `Get Your Personalized Word`
- `Find Your Perfect Word`
- `Personalize Your Jewelry`

---

## 🎯 Alternative Integration Methods

### Method 1: Product Page Only

Add to `product.liquid` or `product-template.liquid` instead of `theme.liquid`:

```liquid
<!-- Find Your Word Widget -->
<link rel="stylesheet" href="https://fyw-lrqe8.ondigitalocean.app/widget/v2/style.css">
<script src="https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js" defer></script>

<div class="product-widget-button">
  <button onclick="window.FindYourWordWidget?.open()">
    Personalize This Jewelry
  </button>
</div>
```

### Method 2: Custom Section

Create a new section file: `sections/find-your-word.liquid`

```liquid
<link rel="stylesheet" href="https://fyw-lrqe8.ondigitalocean.app/widget/v2/style.css">
<script src="https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js" defer></script>

<div class="find-your-word-section">
  <h2>{{ section.settings.heading }}</h2>
  <p>{{ section.settings.description }}</p>
  <button 
    class="btn"
    onclick="window.FindYourWordWidget?.open()"
  >
    {{ section.settings.button_text }}
  </button>
</div>

{% schema %}
{
  "name": "Find Your Word",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Find Your Perfect Word"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "Discover a personalized word for your jewelry"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Get Started"
    }
  ]
}
{% endschema %}
```

Then add this section in the Shopify theme customizer.

### Method 3: Navigation Menu

Add to `header.liquid` in your navigation:

```liquid
<li>
  <a href="#" onclick="window.FindYourWordWidget?.open(); return false;">
    Find Your Word
  </a>
</li>
```

---

## 🔧 Troubleshooting

### Issue: Button doesn't appear

**Check:**
1. Did you save `theme.liquid`?
2. Did you add code before `</body>`?
3. Clear browser cache and refresh

**Fix:**
```bash
# Verify files are loading
curl -I https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js
# Should return: HTTP/2 200
```

### Issue: Button appears but doesn't work

**Check:**
1. Open browser console (F12)
2. Look for error messages
3. Type: `window.FindYourWordWidget`
4. Should show object with `open()`, `close()`, `isOpen()` methods

**Fix:**
```javascript
// Test in console:
window.FindYourWordWidget.open()
```

### Issue: Widget opens but API fails

**Check:**
1. Network tab in browser console
2. Look for POST to `/api/suggest-words`
3. Check response status

**Fix:**
```bash
# Test API directly:
curl -X POST https://fyw-lrqe8.ondigitalocean.app/api/suggest-words \
  -H "Content-Type: application/json" \
  -d '{"userData":{"wordType":"mine","name":"Test","age":"25-35"}}'
```

If this fails, check Digital Ocean logs.

### Issue: CORS errors

**Symptom:**
```
Access to fetch has been blocked by CORS policy
```

**Fix:**
1. Check Digital Ocean runtime logs
2. Verify `server.js` has CORS headers
3. Restart app in Digital Ocean dashboard

---

## 📊 Monitoring

### Check Digital Ocean Logs

1. Go to: https://cloud.digitalocean.com/apps
2. Click on your app: **fyw**
3. Click **Runtime Logs**
4. Watch for:
   - `📝 Received request for word suggestions`
   - `✅ Received response from OpenAI`

### Successful Request Log:
```
📝 Received request for word suggestions
📊 User data: {"wordType":"mine","name":"Sarah",...}
🚀 Sending request to OpenAI...
✅ Received response from OpenAI
```

### Error in Logs:
```
❌ OpenAI API error: {...}
```

Check:
- OpenAI API key is correct
- OpenAI account has credits
- Prompt ID is correct

---

## 🔄 Updating the Widget

### When You Make Changes:

1. **Update code**
2. **Build:** `npm run build`
3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update widget"
   git push origin main
   ```
4. **Digital Ocean auto-deploys** (2-5 minutes)
5. **Users see updates** automatically (may need to refresh once)

**No changes needed in Shopify!** The URLs stay the same.

---

## ✅ Pre-Launch Checklist

- [ ] Ran `open SHOPIFY-TEST.html` - all tests pass
- [ ] Tested widget manually in test page
- [ ] API endpoint returns word suggestions
- [ ] Added code to Shopify `theme.liquid`
- [ ] Saved changes in Shopify
- [ ] Visited store and saw button
- [ ] Clicked button - widget opens
- [ ] Completed questionnaire - got suggestions
- [ ] Tested on mobile device

---

## 🎉 You're Done!

Your widget is now live on Shopify!

**Test URL:** Your Shopify store  
**Widget URL:** https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js  
**Server Status:** https://fyw-lrqe8.ondigitalocean.app/health

---

## 📞 Quick Reference

**Test locally:**
```bash
open SHOPIFY-TEST.html
```

**Check server:**
```bash
curl https://fyw-lrqe8.ondigitalocean.app/health
```

**Test API:**
```bash
curl -X POST https://fyw-lrqe8.ondigitalocean.app/api/suggest-words \
  -H "Content-Type: application/json" \
  -d '{"userData":{"wordType":"mine","name":"Test","age":"25-35"}}'
```

**View logs:**
Digital Ocean Dashboard → Apps → fyw → Runtime Logs

---

**Need help?** Check `DEPLOYMENT-STATUS.md` for detailed troubleshooting.

