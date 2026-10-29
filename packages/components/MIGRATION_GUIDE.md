# Migration Guide: Moving from Tailwind CSS to StyleX
**Consumer Project:** `vlrc`  
**Package:** `@vlrc-fe/components` (v2.0.0)

---

## Overview

`@vlrc-fe/components` has replaced **Tailwind CSS** with **Meta StyleX**. This guide walks through updating the consumer application `vlrc` to support the new StyleX architecture.

---

## 1. Install StyleX Bundler Plugin in `vlrc`

In the root of the `vlrc` consumer project:

```bash
pnpm add @stylexjs/stylex
pnpm add -D @stylexjs/unplugin
pnpm remove @tailwindcss/vite tailwindcss
```

---

## 2. Update `vite.config.ts` in `vlrc`

Replace the Tailwind Vite plugin with `@stylexjs/unplugin`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      dev: process.env.NODE_ENV === 'development',
      runtimeInjection: false,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: __dirname,
      },
    }),
    react(),
    // ...other plugins (tanstackRouter, AutoImport, etc.)
  ],
});
```

---

## 3. Global CSS Setup in `vlrc`

### Step 3.1: Clean up `src/index.css`
Remove the Tailwind CSS imports at the top of `src/index.css`:

```css
/* REMOVE THESE LINES */
@import 'tailwindcss';
@import 'tw-animate-css';
```

### Step 3.2: Import `@vlrc-fe/components/stylex.css`
In your application entry point (`src/main.tsx` or `src/index.css`), import the compiled StyleX CSS:

```typescript
// src/main.tsx
import '@vlrc-fe/components/stylex.css';
```

### Step 3.3: Theme Variables Remain Intact
All your existing CSS variables in `src/index.css`:
- `:root` (default light theme)
- `[data-theme='pink']` (Sakura Pink theme)
- `[data-theme='lavender']` (Lavender Lilac theme)
- `.dark` (Dark theme)

These work seamlessly without modification, because StyleX tokens map directly to `var(--background)`, `var(--primary)`, `var(--card)`, etc.

---

## 4. Component Usage & Overrides

### 4.1 Using the new `sx` Prop for Overrides
In `@vlrc-fe/components`, components now accept `sx?: stylex.StyleXStyles`:

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button } from '@vlrc-fe/components';
import { colors } from '@vlrc-fe/components/theme';

const styles = stylex.create({
  fullWidthEmerald: {
    width: '100%',
    backgroundColor: '#10b981',
    ':hover': {
      backgroundColor: '#059669',
    },
  },
});

export function SaveButton() {
  return (
    <Button sx={styles.fullWidthEmerald}>
      Save Changes
    </Button>
  );
}
```

### 4.2 Transitional `className` Support
For existing code in `vlrc`, `className` will still be passed through and merged with StyleX generated atomic classes, allowing you to migrate your screens progressively without breaking production.

---

## 5. Summary of Key Benefits in `vlrc`
1. **Faster Build Times & Smaller Bundle**: Zero runtime CSS generation; unused CSS is completely pruned at compile-time.
2. **No CSS Clashes**: StyleX deterministically orders atomic rules, so you never have to fight CSS cascade order or `!important`.
3. **Type-Safe Theming**: Full TypeScript autocompletion on design tokens via `@vlrc-fe/components/theme`.
