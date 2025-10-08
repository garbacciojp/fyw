# Custom Fonts Setup - Find Your Word Widget

## ✅ Setup Complete

Custom fonts have been configured for the Find Your Word widget to render independently of Shopify site CSS.

## 📁 Font Files Location

```
/Users/jp/Documents/3. Business/Clients/PRYA/fyw/public/fonts/
├── bebas-neue/
│   ├── BebasNeue-Regular.woff2  ← **YOU NEED TO ADD THIS**
│   └── BebasNeue-Regular.woff   ← **YOU NEED TO ADD THIS**
└── poppins/
    ├── Poppins-Regular.woff2     ← **YOU NEED TO ADD THIS**
    ├── Poppins-Regular.woff      ← **YOU NEED TO ADD THIS**
    ├── Poppins-Medium.woff2      ← **YOU NEED TO ADD THIS**
    ├── Poppins-Medium.woff       ← **YOU NEED TO ADD THIS**
    ├── Poppins-SemiBold.woff2    ← **YOU NEED TO ADD THIS**
    └── Poppins-SemiBold.woff     ← **YOU NEED TO ADD THIS**
```

## 📥 Where to Download Fonts

### Bebas Neue
1. Go to: https://fonts.google.com/specimen/Bebas+Neue
2. Download the font
3. Convert to WOFF2 and WOFF formats using: https://cloudconvert.com/ttf-to-woff2

### Poppins
1. Go to: https://fonts.google.com/specimen/Poppins
2. Download Regular (400), Medium (500), and SemiBold (600) weights
3. Convert to WOFF2 and WOFF formats

## 🎨 How to Use in Code

### For Headings (Bebas Neue)
```tsx
<h1 className="fyw-font-heading fyw-text-4xl fyw-uppercase">
  FIND YOUR WORD
</h1>
```

### For Body Text (Poppins - Default)
```tsx
<p className="fyw-text-base">
  This uses Poppins by default
</p>

// For different weights:
<p className="fyw-font-normal">Regular (400)</p>
<p className="fyw-font-medium">Medium (500)</p>
<p className="fyw-font-semibold">SemiBold (600)</p>
```

## 🔧 Configuration Files Updated

1. ✅ **`src/styles/index.css`** - Added @font-face declarations
2. ✅ **`tailwind.config.js`** - Added font families:
   - `fyw-font-heading` → Bebas Neue
   - `fyw-font-sans` → Poppins (default)

## 🛡️ Isolation from Shopify

- All fonts are scoped to `.fyw-widget` class
- Fonts load from `/fonts/` directory in your widget bundle
- Will NOT conflict with Shopify store fonts
- Falls back to system fonts if custom fonts don't load

## 🚀 Next Steps

1. **Download font files** from Google Fonts
2. **Convert to WOFF2/WOFF** formats
3. **Place in the directories** listed above
4. **Test the widget** to ensure fonts load correctly

## 💡 Usage Examples

### Current Components Using Fonts

**Headings** (will use Bebas Neue):
- "FIND YOUR WORD" 
- "LET'S START WITH THE BASICS"
- All question titles

**Body Text** (will use Poppins):
- Descriptions
- Input labels
- Buttons
- Progress indicators
- All body content

The fonts will apply automatically once you add the font files to the directories!

