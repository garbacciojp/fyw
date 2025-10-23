# Inline Mode - Quick Start

**5-Minute Setup Guide**

---

## ⚡ Quick Copy-Paste

### Inline Mode (New)
```html
<!-- 1. Container with height -->
<div id="find-your-word-widget" style="height: 700px;"></div>

<!-- 2. Load CSS & JS -->
<link rel="stylesheet" href="https://fyw-lrqe8.ondigitalocean.app/widget/v2/style.css">
<script src="https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js"></script>

<!-- 3. Initialize -->
<script>
  new FindYourWordWidget({
    mode: 'inline',
    container: '#find-your-word-widget'
  });
</script>
```

### Overlay Mode (Existing)
```html
<!-- 1. Load CSS & JS -->
<link rel="stylesheet" href="https://fyw-lrqe8.ondigitalocean.app/widget/v2/style.css">
<script src="https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js"></script>

<!-- 2. Add button -->
<button onclick="FindYourWordWidget.open()">Find Your Word</button>
```

---

## 🎯 Key Differences

| Feature | Overlay Mode | Inline Mode |
|---------|-------------|-------------|
| **Position** | Full-screen fixed | In-page container |
| **Scroll** | Body locked | Page scrollable |
| **Height** | 100vh | Container height |
| **Close Button** | Yes (shown) | No (hidden) |
| **Use Case** | Dedicated pages | Mixed content |

---

## ⚠️ Critical: Container Must Have Height

```html
<!-- ✅ WORKS -->
<div id="widget" style="height: 700px;"></div>

<!-- ❌ DOESN'T WORK -->
<div id="widget"></div>
```

---

## 📱 Recommended Heights

- **Mobile:** 600px
- **Tablet:** 700px  
- **Desktop:** 800-900px
- **Responsive:** `80vh`

---

## 🛍️ Shopify Snippet

```liquid
<!-- Shopify Collection Page -->
<div style="height: 800px; margin: 60px auto; max-width: 1400px;">
  <div id="fyw-inline"></div>
</div>

<link rel="stylesheet" href="https://fyw-lrqe8.ondigitalocean.app/widget/v2/style.css">
<script src="https://fyw-lrqe8.ondigitalocean.app/widget/v2/find-your-word-v2.iife.js"></script>
<script>
  new FindYourWordWidget({
    mode: 'inline',
    container: '#fyw-inline'
  });
</script>
```

---

## 🐛 Troubleshooting

**Widget not showing?**
1. Check container has explicit height
2. Check container selector is correct
3. Open browser console for errors
4. Enable debug: `debug: true`

**Need Help?**
- Full docs: `INLINE-MODE-GUIDE.md`
- Test file: `inline-test.html`
- Changelog: `INLINE-MODE-CHANGELOG.md`

---

✅ **Ready to use! No build needed for existing deployments.**

