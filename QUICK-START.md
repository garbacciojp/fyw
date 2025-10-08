# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+
- npm 8+
- OpenAI API key
- OpenAI Prompt ID (from your stored prompts)

---

## Setup (2 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:
```bash
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_OPENAI_PROMPT_ID=prompt_your-id-here
VITE_DEBUG_MODE=false
```

### 3. Start Development Server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Development Workflow

### Making Changes

**To add a question:**
1. Edit `src/config/questions.config.ts`
2. Add to QUESTIONS array
3. Done! (registry auto-maps it)

**To modify styling:**
1. Edit `tailwind.config.js` (design tokens)
2. Or edit `src/styles/index.css` (global styles)

**To change validation:**
1. Edit `src/config/validation.config.ts`

**To modify API logic:**
1. Edit `src/core/services/openai.service.ts`

### Building

```bash
npm run build
```

Output: `dist/find-your-word-v2.iife.js`

### Testing Build

```bash
npm run preview
```

---

## File Organization

```
src/
├── config/      → Pure data (questions, validation, constants)
├── types/       → TypeScript definitions
├── core/        → Framework (hooks, utils, security, services)
├── modules/     → Features (layout, ui, questions, screens)
├── styles/      → CSS (Tailwind + custom)
└── widgets/     → Entry point (global API)
```

---

## Integration Example

### Shopify Theme Integration

Add to `theme.liquid`:

```html
<script src="https://your-domain.com/widget/v2/find-your-word-v2.iife.js"></script>

<button onclick="FindYourWordWidget.open()">
  Find Your Word
</button>
```

---

## Troubleshooting

### Type Errors?

```bash
npm run typecheck
```

### Build Fails?

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Widget Won't Open?

Check browser console. Make sure:
1. Script loaded successfully
2. No JavaScript errors
3. `FindYourWordWidget` exists on `window`

---

## Architecture at a Glance

**Config-Driven**: Questions = data, not code  
**Modular**: Small files (<300 lines), focused components (<7 props)  
**Type-Safe**: 100% TypeScript, no `any`  
**Composable**: Build from small pieces  
**Secure**: DOMPurify + encrypted storage  

---

**Ready to build!** Start with `npm run dev` and open the widget. 🎯


