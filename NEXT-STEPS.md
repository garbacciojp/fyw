# Next Steps to Deploy

## What We've Done So Far

✅ Updated `server.js` to add API proxy endpoint  
✅ Updated `package.json` to include `dotenv`  
✅ Updated widget to call YOUR server instead of OpenAI directly  
✅ Updated your `.env` file with correct variables  
✅ Added environment variables to Digital Ocean dashboard  

## What You Need to Do Now

### Step 1: Install Dependencies

```bash
cd /Users/jp/Documents/3. Business/Clients/PRYA/fyw
npm install
```

This installs the `dotenv` package needed by server.js.

### Step 2: Build the Widget

```bash
npm run build
```

This builds the widget with the correct API URL (localhost for now).

### Step 3: Commit and Push to Git

```bash
git add .
git commit -m "Add API proxy server for secure OpenAI integration"
git push origin main
```

This pushes your code to GitHub/GitLab so Digital Ocean can deploy it.

### Step 4: Wait for Digital Ocean to Deploy

Digital Ocean will automatically:
- Detect the push
- Pull your code
- Run `npm install`
- Run `npm run build`
- Start server with `npm start`

**Time:** About 2-3 minutes

Watch the build logs in Digital Ocean dashboard to see progress.

### Step 5: Test Your Deployment

Once deployed, test it:

```bash
./test-deployment.sh https://your-app-name.ondigitalocean.app
```

Replace `your-app-name` with your actual Digital Ocean app URL.

You should see:
- ✓ Health check passed
- ✓ Widget info endpoint working
- ✓ Widget JS file accessible
- ✓ Widget CSS file accessible
- ✓ API endpoint working

### Step 6: Rebuild Widget for Production

Once your Digital Ocean app is live, rebuild the widget to point to it:

**Update `.env` file:**
```env
VITE_API_BASE_URL=https://your-app-name.ondigitalocean.app
```

**Rebuild:**
```bash
npm run build
```

**Commit and push:**
```bash
git add dist/
git commit -m "Update widget for production URL"
git push origin main
```

Wait for Digital Ocean to redeploy (2-3 minutes).

### Step 7: Add to Shopify

Once deployed, add these lines to your Shopify theme's `theme.liquid` file (before `</body>`):

```liquid
<!-- Find Your Word Widget -->
<link rel="stylesheet" href="https://your-app-name.ondigitalocean.app/widget/v2/style.css">
<script src="https://your-app-name.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js" defer></script>

<!-- Trigger Button -->
<button 
  onclick="window.FindYourWordWidget?.open()" 
  style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; 
         padding: 16px 32px; background: #000; color: #fff; border: none; 
         border-radius: 8px; cursor: pointer; font-weight: 600; 
         box-shadow: 0 4px 12px rgba(0,0,0,0.2);"
>
  Find Your Word
</button>
```

Replace `your-app-name` with your actual Digital Ocean app URL.

### Step 8: Test on Shopify

1. Visit your Shopify store
2. Click the "Find Your Word" button
3. Complete the form
4. Verify suggestions appear

---

## Summary

**Commands to run:**
```bash
# 1. Install
npm install

# 2. Build
npm run build

# 3. Push to Git
git add .
git commit -m "Add API proxy server for secure OpenAI integration"
git push origin main

# 4. Wait for DO to deploy (watch dashboard)

# 5. Test deployment
./test-deployment.sh https://your-app-name.ondigitalocean.app

# 6. Update .env with production URL, then:
npm run build
git add dist/
git commit -m "Update widget for production URL"
git push origin main

# 7. Add to Shopify theme (manual step)
```

---

## Troubleshooting

### Port 8080 already in use

If you see "EADDRINUSE: address already in use 0.0.0.0:8080":

```bash
# Kill any process on port 8080
lsof -ti:8080 | xargs kill -9

# Then try again
npm start
```

### Build fails

Make sure you ran `npm install` first.

### Git push fails

Make sure you're on the correct branch and have push access to the repository.

---

## What Happens After Push

Digital Ocean will:
1. See your push
2. Clone your repo
3. Run: `npm install`
4. Run: `npm run build`
5. Run: `npm start`
6. Server listens on port assigned by DO
7. Your app is live!

The widget will be available at:
- `https://your-app-name.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js`
- `https://your-app-name.ondigitalocean.app/widget/v2/style.css`

API endpoint will be at:
- `https://your-app-name.ondigitalocean.app/api/suggest-words`

---

## Need Help?

- **Full guide:** See `DEPLOYMENT-GUIDE.md`
- **Quick guide:** See `QUICK-DEPLOY.md`
- **Summary:** See `SETUP-SUMMARY.md`

---

**Total Time:** ~10-15 minutes (mostly waiting for Digital Ocean)

**Last Updated:** October 11, 2025

