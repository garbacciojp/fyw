# Find Your Word Widget v2.0

A personalized jewelry word recommendation widget for Shopify stores.

## 🏗️ Architecture

```
config/     → Pure data, zero imports except types
  ↓
core/       → Framework, imports only from core/
  ↓
modules/    → Features, imports from core/ and config/
  ↓
widgets/    → Entry points, imports from everything
```

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev        # Start development server
npm run build      # Build production bundle
npm run preview    # Preview production build
npm run typecheck  # Type check without building
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_OPENAI_API_KEY=your_key_here
VITE_OPENAI_PROMPT_ID=your_prompt_id_here
```

## 📦 Build Output

- **Single IIFE Bundle**: `dist/find-your-word-v2.iife.js`
- **Format**: Immediately Invoked Function Expression
- **Size**: ~200KB (~60KB gzipped)
- **Zero External Dependencies**

## 🎯 Integration

### Add to Shopify Theme

```html
<!-- Add script tag -->
<script src="https://your-domain.com/find-your-word-v2.iife.js"></script>

<!-- Add trigger button -->
<button onclick="FindYourWordWidget.open()">Find Your Word</button>
```

### Auto-Open on Page Load

```html
<script 
  src="https://your-domain.com/find-your-word-v2.iife.js"
  data-auto-open="true"
></script>
```

## 🏛️ Code Principles

1. **Config-Driven**: Questions defined as data, not code
2. **Modular**: Files <300 lines, components <7 props
3. **Type-Safe**: Full TypeScript, no `any`
4. **Composable**: Small pieces composed together
5. **Refactor at 2**: Extract patterns immediately

## 📚 Documentation

- **Architecture**: See `claude.md` for complete rules
- **Questions**: Edit `src/config/questions.config.ts`
- **Types**: See `src/types/`
- **Components**: See `src/modules/`

## ✅ Success Criteria

- Adding new question type = edit exactly 2 files
- No file over 300 lines
- No component with 7+ props
- Questions as pure configuration data


