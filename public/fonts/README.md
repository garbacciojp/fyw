# Find Your Word - Custom Fonts

## Fonts Used

### Bebas Neue (Headings)
- Used for: Main headings, titles, uppercase text
- Weight: Regular (400)
- Format: WOFF2 (primary), WOFF (fallback)

### Poppins (Body Text)
- Used for: Body text, paragraphs, UI elements
- Weights: Regular (400), Medium (500), SemiBold (600)
- Format: WOFF2 (primary), WOFF (fallback)

## Font Files Location

```
public/fonts/
  ├── bebas-neue/
  │   ├── BebasNeue-Regular.woff2
  │   └── BebasNeue-Regular.woff
  └── poppins/
      ├── Poppins-Regular.woff2
      ├── Poppins-Regular.woff
      ├── Poppins-Medium.woff2
      ├── Poppins-Medium.woff
      ├── Poppins-SemiBold.woff2
      └── Poppins-SemiBold.woff
```

## How to Add Fonts

1. Download font files in WOFF2 and WOFF formats
2. Place in the respective directories
3. Font-face declarations are in `src/styles/index.css`
4. Fonts are scoped to `.fyw-widget` to avoid conflicts with Shopify

## Font Sources

- **Bebas Neue**: https://fonts.google.com/specimen/Bebas+Neue
- **Poppins**: https://fonts.google.com/specimen/Poppins

## Usage

Fonts are automatically applied via Tailwind utility classes:
- `fyw-font-heading` - Bebas Neue (for headings)
- `fyw-font-sans` - Poppins (default body text)

