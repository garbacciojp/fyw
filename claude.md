# Rules for Claude: Find Your Word v2.0 Project

**Last Updated:** October 2025  
**Project:** Find Your Word Widget Rebuild  
**Purpose:** Comprehensive development guidelines for building a modular, maintainable, config-driven React/TypeScript widget

---

## 🎯 Prime Directive

**Before making ANY suggestion, ask yourself:**
1. "Does this build a **system** or just solve a **one-off problem**?"
2. "Will this make **future changes easier** or harder?"
3. "Does this follow **WHAT → HOW → WHERE** separation?"
4. "Have I seen this pattern **twice already**?" (If yes, extract it NOW)

**Never suggest solutions that:**
- Add hardcoded values when config should be used
- Create components with >7 props
- Mix presentation logic with business logic
- Defer refactoring ("we can fix it later")
- Add "just one more feature" to an existing component

---

## I. 🏗️ Architecture & Module System

### A. Strict Dependency Hierarchy

**ABSOLUTE RULE:** Dependencies flow in one direction only:

```
config/ (pure data, zero imports except types)
   ↓
core/ (framework, imports only from core/)
   ↓
modules/ (features, imports from core/ and config/)
   ↓
widgets/ (entry points, imports from modules/)
```

**Enforcement Rules:**
- `core/` **NEVER** imports from `modules/`
- `config/` **NEVER** imports anything except TypeScript types
- `modules/` **CAN** import from `core/` and `config/`
- `widgets/` **CAN** import from everything

**How to Check:** Before adding any import statement, trace the dependency path. If it creates a cycle or violates the hierarchy, **stop immediately** and refactor.

### B. File Placement Decision Tree

Use this exact decision tree for every new file:

```
Is it pure data/configuration with no logic?
  → config/
  
Is it reusable across ALL modules?
  → core/
  
Is it specific to ONE feature/domain?
  → modules/[domain-name]/
  
Is it an integration/entry point?
  → widgets/
  
Still unsure?
  → STOP. Ask for clarification before proceeding.
```

### C. Module Boundaries

**Each module MUST:**
- Have a single, clear responsibility (e.g., "question rendering", "results display")
- Contain ALL code related to that responsibility
- Expose a clean, minimal public API
- Not directly reference internals of other modules

**File size limits:**
- Max 300 lines per file (including imports/blank lines)
- At 280 lines, start planning the split
- At 300 lines, **immediately split** before any new features

---

## II. ⚛️ React Component Patterns

### A. Composition Over Props (The Golden Rule)

**ALWAYS prefer composition:**

```tsx
// ✅ GOOD: Composable, flexible, single responsibility
<QuestionLayout>
  <QuestionHeader title={title} />
  <QuestionContent>
    <TextInput value={value} onChange={onChange} />
  </QuestionContent>
  <QuestionFooter>
    <NavigationButtons onNext={handleNext} onBack={handleBack} />
  </QuestionFooter>
</QuestionLayout>
```

```tsx
// ❌ BAD: God component with too many props
<Question 
  title={title}
  showHeader={true}
  showFooter={true}
  inputType="text"
  inputValue={value}
  onInputChange={onChange}
  navigationEnabled={true}
  onNext={handleNext}
  onBack={handleBack}
  // ...15 more props
/>
```

**Prop Limit:** **Maximum 7 props per component**
- At 6 props, evaluate if you're building a God component
- At 7 props, **stop and refactor** using composition

### B. Component Size Guidelines

**Keep components focused and small:**
- Ideal: Single screen of code (no scrolling needed)
- Maximum: 300 lines including imports
- If scrolling required to read component → **too big, split it**

**How to split:**
1. Extract presentational pieces (Header, Footer, Content)
2. Extract stateful logic into custom hooks
3. Move data transformations to utility functions
4. Create sub-components for repeated patterns

### C. Container/Presentation Pattern

**For every feature, separate concerns:**

```tsx
// Container: Handles logic, state, side effects
function QuestionContainer() {
  const { question, answer, handleSubmit } = useQuestion();
  
  return (
    <QuestionPresentation 
      question={question}
      answer={answer}
      onSubmit={handleSubmit}
    />
  );
}

// Presentation: Pure, stateless, focused on UI
function QuestionPresentation({ question, answer, onSubmit }) {
  return (
    <div>
      {/* Pure UI rendering */}
    </div>
  );
}
```

**Benefits:**
- Easy to test (presentation is just props → UI)
- Reusable (presentation can be used in stories, tests, different contexts)
- Maintainable (logic changes don't affect UI structure)

---

## III. 📘 TypeScript & Type Safety

### A. Type-First Development

**Order of operations for new features:**
1. Define TypeScript interfaces/types FIRST
2. Define data structures and validation schemas
3. Create hooks that use these types
4. Build UI components last

```typescript
// Step 1: Define types
interface QuestionConfig {
  id: string;
  type: QuestionType;
  prompt: string;
  validation: ValidationRules;
}

// Step 2: Define validation
const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'choice', 'scale']),
  prompt: z.string().min(1),
  validation: validationRulesSchema,
});

// Step 3: Create hook
function useQuestion(config: QuestionConfig) {
  // Logic here
}

// Step 4: Build UI
function QuestionComponent() {
  const question = useQuestion(questionConfig);
  // Render here
}
```

### B. Config Type Safety

**All config files MUST:**
- Have explicit TypeScript interfaces
- Use `as const` for literal values
- Export types alongside data
- Validate at runtime using Zod or similar

```typescript
// config/questions.config.ts
export interface QuestionConfig {
  id: string;
  type: 'text' | 'choice' | 'scale';
  prompt: string;
  options?: string[];
}

export const QUESTION_TYPES = {
  TEXT: 'text',
  CHOICE: 'choice',
  SCALE: 'scale',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

export const questions: QuestionConfig[] = [
  {
    id: 'name',
    type: QUESTION_TYPES.TEXT,
    prompt: 'What is your name?',
  },
  // ...
];
```

### C. No `any` Policy

**NEVER use `any` type:**
- Use `unknown` when type is truly unknown
- Use generics for flexible but type-safe code
- Use `as const` for literal types
- Create proper interfaces even for complex objects

**Exception:** Only when interfacing with untyped third-party libraries, and ONLY after documenting why.

---

## IV. 🎣 Custom Hooks & State Management

### A. The "Refactor at 2" Law (CRITICAL)

**This is non-negotiable:**

When you see the EXACT same pattern **twice**, immediately:
1. Stop writing new code
2. Extract the pattern into a custom hook or utility
3. Replace both instances with the extracted version
4. THEN continue with new features

```tsx
// ❌ VIOLATION: Seen this twice = must extract
function ComponentA() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const validate = () => { /* validation logic */ };
  // ...
}

function ComponentB() {
  const [value, setValue] = useState('');  // ← Same pattern!
  const [error, setError] = useState(null); // ← Same pattern!
  const validate = () => { /* validation logic */ }; // ← Same pattern!
  // ...
}

// ✅ CORRECT: Extract immediately at second occurrence
function useValidatedInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);
  
  const validate = () => {
    // Shared validation logic
  };
  
  return { value, setValue, error, validate };
}

// Now use in both components
function ComponentA() {
  const nameInput = useValidatedInput();
  // ...
}

function ComponentB() {
  const emailInput = useValidatedInput();
  // ...
}
```

### B. Hook Design Principles

**Every custom hook MUST:**
- Start with `use` prefix (e.g., `useQuestion`, `useValidation`)
- Have a single, clear responsibility
- Return a consistent interface (object with named properties)
- Handle its own side effects and cleanup
- Be pure and predictable (same inputs → same outputs)

**Hook file organization:**
```
core/hooks/
  ├── useQuestion.ts        # Single responsibility
  ├── useNavigation.ts      # Single responsibility
  ├── useValidation.ts      # Single responsibility
  └── index.ts              # Barrel export
```

### C. State Management Strategy

**For this project:**
- **Local state** (useState): Component-specific UI state
- **Custom hooks**: Shared stateful logic (forms, validation, API calls)
- **Context**: ONLY for truly global data (theme, user preferences) - use sparingly
- **NO Redux or Zustand**: Not needed for this project size

**Decision tree:**
```
Is state used by ONE component only?
  → useState

Is state logic reused across multiple components?
  → Custom hook

Is state needed by many distant components?
  → Context (but question if architecture could be better)
  
Is state truly global?
  → Context at app root
```

---

## V. ⚙️ Configuration System

### A. Config-Driven Architecture

**The Holy Trinity: WHAT → HOW → WHERE**

```
WHAT  = config/questions.config.ts   (data, structure)
  ↓
HOW   = core/hooks/useQuestion.ts     (logic, behavior)
  ↓
WHERE = modules/questions/QuestionRenderer.tsx (UI, presentation)
```

**Rule:** If you're about to hardcode something, ask: "Should this be in config?"

**Always use config for:**
- Question types and their properties
- Validation rules
- Flow sequences
- UI text and labels
- Theme values (colors, spacing, etc.)
- API endpoints
- Feature flags

### B. Adding New Question Types

**Process** (must follow this order):

1. **Define in config** (`config/questions.config.ts`):
```typescript
export const QUESTION_TYPES = {
  // ...existing types
  NEW_TYPE: 'newType',
} as const;
```

2. **Add to type registry** (`modules/questions/questionRegistry.ts`):
```typescript
import { NewTypeQuestion } from './types/NewTypeQuestion';

export const questionRegistry = {
  // ...existing types
  [QUESTION_TYPES.NEW_TYPE]: NewTypeQuestion,
};
```

3. **Create component** (`modules/questions/types/NewTypeQuestion.tsx`):
```typescript
export function NewTypeQuestion({ config }: QuestionProps) {
  // Implementation
}
```

**That's it.** No other files should need changes. If they do, your architecture is wrong.

### C. Config Validation

**All config MUST be validated at load time:**

```typescript
import { z } from 'zod';

const QuestionConfigSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'choice', 'scale']),
  prompt: z.string().min(1),
  // ...
});

// Validate on import
export const questions = QuestionConfigSchema.array().parse(rawQuestions);
```

**Why:** Catch config errors immediately, not at runtime when a user triggers the bug.

---

## VI. 🔒 Security & Data Protection

### A. Input Sanitization (CRITICAL)

**NEVER trust user input. Period.**

**Required sanitization for ALL user inputs:**

```typescript
import DOMPurify from 'dompurify';

// Before storing or displaying user input
function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip ALL HTML
    ALLOWED_ATTR: [],
  });
}

// Usage
const userInput = sanitizeInput(rawInput);
```

**XSS Prevention Checklist:**
- ✅ Sanitize ALL user inputs before storing
- ✅ Sanitize ALL data before rendering (even from your own database)
- ✅ Use React's default escaping (avoid `dangerouslySetInnerHTML`)
- ✅ Validate input types and formats
- ✅ Use Content Security Policy headers

### B. Storage Security

**NEVER use localStorage or sessionStorage in artifacts** - they don't work in Claude.ai environment.

**For this project:**
- Use in-memory state (React useState) for sensitive data
- Encrypt any data sent to APIs
- Never store sensitive data client-side
- Use secure, httpOnly cookies for authentication (if needed)

**Encryption example:**
```typescript
import CryptoJS from 'crypto-js';

function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

function decryptData(encrypted: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
```

### C. API Security

**When calling OpenAI API:**
- ✅ NEVER expose API keys in client code
- ✅ Use server-side proxy for API calls
- ✅ Validate and sanitize all inputs before sending
- ✅ Implement rate limiting
- ✅ Handle errors without exposing system details

```typescript
// ❌ NEVER do this
const apiKey = 'sk-...'; // Exposed in client!

// ✅ Always do this
const response = await fetch('/api/openai', {
  method: 'POST',
  body: JSON.stringify({ prompt: sanitizedInput }),
  // API key stays on server
});
```

---

## VII. 🎨 Styling & Design System

### A. Tailwind + Design Tokens Strategy

**Core principle:** Use Tailwind's utility classes, but define ALL values as design tokens.

**Design token structure:**
```
styles/tokens/
  ├── colors.ts       # Brand colors, semantic colors
  ├── typography.ts   # Font families, sizes, weights
  ├── spacing.ts      # Spacing scale (4, 8, 12, 16...)
  └── breakpoints.ts  # Responsive breakpoints
```

**Example token file:**
```typescript
// styles/tokens/colors.ts
export const colors = {
  brand: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
  },
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    // ...
  },
} as const;
```

**Tailwind config integration:**
```javascript
// tailwind.config.js
import { colors } from './styles/tokens/colors';

export default {
  theme: {
    extend: {
      colors: colors,
    },
  },
};
```

### B. Styling Rules

**ALWAYS:**
- Use Tailwind core utility classes only (no arbitrary values like `w-[347px]`)
- Define custom values in design tokens, then add to Tailwind config
- Keep styling close to components (co-located)
- Use CSS modules for truly custom styling needs

**NEVER:**
- Use inline styles (except for dynamic values)
- Mix Tailwind with other CSS approaches in same file
- Create global CSS except for true global concerns (resets, fonts)

### C. Responsive Design

**Mobile-first approach:**

```tsx
// ✅ Mobile-first (correct)
<div className="p-4 md:p-6 lg:p-8">
  {/* Padding increases on larger screens */}
</div>

// ❌ Desktop-first (incorrect for this project)
<div className="p-8 md:p-6 sm:p-4">
  {/* Don't do this */}
</div>
```

**Breakpoint usage:**
- `sm`: 640px - Small tablets
- `md`: 768px - Tablets
- `lg`: 1024px - Laptops
- `xl`: 1280px - Desktops

---

## VIII. 🏗️ Build & Deployment

### A. Single-File IIFE Bundle Requirements

**Target output:** One JavaScript file that can be embedded via `<script>` tag.

**Build configuration requirements:**
- **Format:** IIFE (Immediately Invoked Function Expression)
- **Output:** Single file (no code splitting)
- **Dependencies:** All bundled inline
- **Browser compatibility:** ES2020+
- **No external dependencies** at runtime

**Rollup configuration example:**
```javascript
// rollup.config.js
export default {
  input: 'src/widgets/findYourWord.ts',
  output: {
    file: 'dist/find-your-word.js',
    format: 'iife',
    name: 'FindYourWord',
    sourcemap: false, // Disable for production
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    terser(), // Minification
  ],
};
```

### B. Zero Shopify Dependencies

**Critical requirement:** Widget must work on ANY website, not just Shopify.

**Forbidden dependencies:**
- Shopify-specific APIs or globals
- Shopify themes or theme APIs
- Shop-specific data assumptions

**Allowed:**
- Standard web APIs (fetch, DOM, etc.)
- Self-contained npm packages
- Your own API endpoints

### C. Versioning Strategy

**File structure for multiple versions:**
```
/widget/
  ├── v1/
  │   └── find-your-word.js
  ├── v2/
  │   └── find-your-word.js  ← Current build
  └── v3/
      └── find-your-word.js  ← Future versions
```

**Integration code:**
```html
<!-- Embed in any website -->
<div id="find-your-word-widget"></div>
<script src="https://your-domain.com/widget/v2/find-your-word.js"></script>
<script>
  FindYourWord.mount('#find-your-word-widget');
</script>
```

---

## IX. 🧪 Code Quality & Refactoring

### A. Refactoring Triggers (When to Refactor)

**Refactor immediately when you see:**
- Same code pattern appearing twice ("Refactor at 2")
- File approaching 280 lines
- Component with 6+ props
- Deeply nested conditionals (>3 levels)
- Method/function doing multiple things
- Unclear variable or function names

**Refactoring workflow:**
1. Tests passing? ✅ (Run tests before refactoring)
2. Save checkpoint (git commit)
3. Make ONE refactoring change
4. Tests still passing? ✅
5. Commit refactoring
6. Repeat

**Never:**
- Refactor and add features at the same time
- Refactor and fix bugs at the same time
- Make multiple refactorings simultaneously
- Refactor without tests

### B. Code Review Checklist

**Before committing, verify:**

**Architecture:**
- [ ] Dependencies flow downward (config → core → modules → widgets)
- [ ] No circular dependencies
- [ ] Files in correct directories
- [ ] No God components (>7 props)
- [ ] No files >300 lines

**TypeScript:**
- [ ] No `any` types (except documented exceptions)
- [ ] All public APIs have explicit types
- [ ] Config has type definitions
- [ ] Proper use of `unknown` instead of `any`

**React:**
- [ ] Components use composition over props
- [ ] Hooks follow rules (top-level only, consistent order)
- [ ] No missing dependencies in useEffect
- [ ] Proper cleanup in effects

**Security:**
- [ ] All user inputs sanitized
- [ ] No XSS vulnerabilities
- [ ] No exposed API keys
- [ ] Proper error handling

**Performance:**
- [ ] No unnecessary re-renders
- [ ] Large lists use virtualization
- [ ] Images optimized
- [ ] Code splitting where appropriate

### C. Refactoring Patterns Library

**Extract Method:**
```typescript
// Before: Long method doing multiple things
function processOrder(order) {
  // validation logic (10 lines)
  // calculation logic (15 lines)
  // formatting logic (8 lines)
  // database logic (12 lines)
}

// After: Each responsibility extracted
function processOrder(order) {
  const validated = validateOrder(order);
  const calculated = calculateTotal(validated);
  const formatted = formatForDisplay(calculated);
  return saveToDatabase(formatted);
}

function validateOrder(order) { /* ... */ }
function calculateTotal(order) { /* ... */ }
function formatForDisplay(order) { /* ... */ }
function saveToDatabase(order) { /* ... */ }
```

**Extract Component:**
```tsx
// Before: Monolithic component
function UserProfile() {
  return (
    <div>
      {/* Header code (30 lines) */}
      {/* Stats code (40 lines) */}
      {/* Activity code (50 lines) */}
      {/* Settings code (35 lines) */}
    </div>
  );
}

// After: Composed from smaller pieces
function UserProfile() {
  return (
    <div>
      <ProfileHeader />
      <ProfileStats />
      <ProfileActivity />
      <ProfileSettings />
    </div>
  );
}
```

**Extract Hook:**
```tsx
// Before: Logic duplicated across components
function ComponentA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  // ...
}

// After: Logic extracted to reusable hook
function useApiData(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { loading, error, data };
}

function ComponentA() {
  const { loading, error, data } = useApiData('/api/data');
  // ...
}
```

---

## X. 🚨 Red Flags & Code Smells

### A. Immediate Stop Signals

**If Claude suggests any of these, STOP and question the approach:**

🚩 "Let's just hardcode this for now"
🚩 "We can refactor later"
🚩 "Add one more prop to handle this case"
🚩 "Copy this code and modify it"
🚩 "This component can handle both cases"
🚩 "Let's use `any` type here"
🚩 "We don't need tests for this"
🚩 "LocalStorage will work fine"
🚩 "The user won't enter malicious code"

### B. Smell Detection

**Code smells to watch for:**

**Large Classes/Components:**
- File >300 lines → Split immediately
- Component with >7 props → Use composition
- Hook with >1 responsibility → Split into multiple hooks

**Duplicated Code:**
- Exact same logic in 2+ places → Extract to function/hook
- Similar but not identical → Consider abstraction
- Repeated patterns → Create utility or component

**Long Parameter Lists:**
- Function with >5 parameters → Pass object instead
- Multiple boolean flags → Use discriminated union or enum

**Feature Envy:**
- Component accessing lots of props from parent → Consider passing children
- Hook accessing lots of external state → Reconsider boundaries

**Primitive Obsession:**
- Using strings/numbers where types needed → Create TypeScript interface
- Magic strings → Create constants or enums

### C. Quality Metrics

**Track these numbers (aim for targets):**
- Open issues: **Target 0**
- TODO/FIXME comments: **Target 0**
- Files >300 lines: **Target 0**
- Components >7 props: **Target 0**
- Functions >50 lines: **Target < 5**
- Test coverage: **Target >80%**

---

## XI. 💬 Communication Protocol

### A. Claude's Response Format

When suggesting code changes, Claude MUST:

1. **Explain the "why" first:**
   - What problem does this solve?
   - Why this approach over alternatives?
   - How does it align with project principles?

2. **Show the pattern:**
   - Provide complete, working examples
   - Include relevant imports
   - Show file structure context

3. **Flag trade-offs:**
   - Mention any compromises
   - Explain complexity added/removed
   - Note performance implications

4. **Provide next steps:**
   - What to do with this code
   - What to test
   - What might need adjustment

### B. When to Push Back

**Claude should challenge you if:**
- You request a feature that violates architecture principles
- You want to skip refactoring
- You propose hardcoding something that should be configurable
- You suggest using `any` type
- You want to defer quality for speed

**Example pushback:**
> "I notice you're asking to add another prop to this component, which already has 6 props. This would exceed our 7-prop limit and suggests we should refactor using composition instead. Would you like me to show how to split this component into composable pieces?"

### C. Clarification Protocol

**If unclear, Claude should:**
1. State what's unclear
2. Propose 2-3 specific interpretations
3. Ask which is correct
4. NOT proceed with assumptions

**Example:**
> "I see you want to add a new input type. I'm unclear on one detail: Should this be a completely new question type (requiring updates to config/questions.config.ts and the question registry), or a variant of the existing text input type (requiring just a new prop)? The first approach follows our pattern better but involves more files."

---

## XII. 📚 Required Reading & References

### External Resources

**React Patterns:**
- [React Composition Pattern](https://www.patterns.dev/react/compound-pattern/)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)

**TypeScript:**
- [TypeScript Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [Clean Architecture with TypeScript](https://medium.com/@deivisonisidoro_94304/revolutionizing-software-development-unveiling-the-power-of-clean-architecture-with-typescript-5ee968357d35)

**Security:**
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React XSS Guide](https://www.stackhawk.com/blog/react-xss-guide-examples-and-prevention/)

**Build Tools:**
- [Rollup IIFE Format](https://rollupjs.org/configuration-options/)
- [esbuild API](https://esbuild.github.io/api/)

**Refactoring:**
- [Refactoring Patterns](https://refactoring.guru/)
- [Code Refactoring Best Practices 2025](https://marutitech.com/code-refactoring-best-practices/)

### Internal Documents

**Project documentation to reference:**
- `find-your-word-rebuild-overhaul-plan.md` (this document's source)
- `Building Principles – Lessons Learned.md` (behavioral framework)
- `Project Overview & Architecture.md` (system blueprint)

---

## XIII. 🎓 Learning & Adaptation

### A. Pattern Recognition

**Claude should build a mental model of:**
- Repeated user requests → Suggest extracting patterns
- Common mistakes → Proactively warn about them
- Successful patterns → Recommend similar approaches

### B. Progressive Guidance

**For new developers:**
- Explain "why" extensively
- Provide more complete examples
- Reference learning resources
- Suggest incremental improvements

**For experienced developers:**
- Focus on trade-offs
- Provide concise examples
- Assume understanding of basics
- Challenge architectural decisions productively

### C. Continuous Improvement

**After every major feature:**
1. Review if it followed all rules
2. Identify any new patterns that emerged
3. Consider if rules need updating
4. Document lessons learned

---

## XIV. ⚡ Quick Reference Card

### Daily Development Checklist

**Before starting work:**
- [ ] Latest code pulled from repo
- [ ] Tests passing
- [ ] Clear understanding of task

**During development:**
- [ ] Following WHAT → HOW → WHERE separation
- [ ] Refactoring at pattern #2
- [ ] Files staying under 300 lines
- [ ] Components under 7 props
- [ ] All inputs sanitized

**Before committing:**
- [ ] Run full code review checklist (Section IX.B)
- [ ] Tests still passing
- [ ] No console.logs or debugger statements
- [ ] Meaningful commit message

### Emergency Decision Matrix

**When uncertain, use this:**

| Situation | Action |
|-----------|--------|
| Don't know where file belongs | Use Section I.B decision tree |
| Component getting complex | Use Section II.A composition pattern |
| Seeing duplicate logic | Apply "Refactor at 2" law immediately |
| Need to add prop to component | Check prop count → use composition if at 6 |
| File approaching 280 lines | Stop and split before continuing |
| Security concern | Sanitize input, validate, check Section VI |
| Build question | Check Section VIII for bundle requirements |

### One-Sentence Reminders

- **Architecture:** Config → Core → Modules → Widgets. Never reverse.
- **Components:** Compose small pieces, not giant monoliths.
- **Props:** 7 is the max. 6 is the warning. Compose at 6.
- **Refactoring:** Extract at 2, not at 10.
- **Types:** Explicit and strict. No `any`.
- **Security:** Sanitize everything. Trust nothing.
- **Files:** 300 lines max. Split at 280.
- **Hooks:** One responsibility each.
- **Build:** Single IIFE file. Zero Shopify deps.
- **Quality:** Refactor as you go, never defer.

---

## XV. 🏆 Success Criteria

**The project follows these rules well when:**

✅ Any developer can find any piece of code in <30 seconds  
✅ Adding a new question type requires editing exactly 2 files  
✅ No component has more than 7 props  
✅ No file is longer than 300 lines  
✅ The same pattern never appears 3 times unrefactored  
✅ All user inputs are sanitized before use  
✅ The widget bundle is a single IIFE file  
✅ No Shopify-specific code exists  
✅ Tests pass on every commit  
✅ Code reviews take <15 minutes  

**You know rules are being violated when:**

❌ "Where is the validation logic for X?" takes >2 minutes to answer  
❌ Adding a feature requires touching >5 files  
❌ Components become "prop tunnels"  
❌ Files require scrolling to read  
❌ Duplicate code appears everywhere  
❌ XSS vulnerabilities found in testing  
❌ Build produces multiple files  
❌ Widget breaks on non-Shopify sites  
❌ Tests are skipped "temporarily"  
❌ Code reviews trigger major rewrites  

---

**END OF RULES**

*Version: 1.0*  
*Last Updated: October 2025*  
*Maintained by: Project Team*

**Remember: These rules exist to make your life easier, not harder. Follow them consistently, and building becomes a joy instead of a struggle.**