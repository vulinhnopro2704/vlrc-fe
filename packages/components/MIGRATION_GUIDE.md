# Migration Guide: @vlrc-fe/components

This document guides engineers through major version migrations of `@vlrc-fe/components`.

---

# Migration: v2.8.x to v3.0.0 (Meta's Astryx Design System)

**Release Date:** November 2026  
**Scope:** Replatforming `@vlrc-fe/components` onto Meta's **Astryx Design System** (`@astryxdesign/core`, `@astryxdesign/cli`, `@astryxdesign/richtext`) and **Meta StyleX**.

---

## 1. Overview of Changes in v3.0.0

- **Astryx Primitive Foundation**: All primitive and composite UI widgets are now built on or aligned with Meta's Astryx design system foundation.
- **Zero UI Dependency Friction**: Moved all 30+ UI/headless libraries (`@radix-ui/*`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `lodash-es`, `lucide-react`, `react-day-picker`, `react-number-format`, `react-resizable-panels`, `sonner`, `vaul`, `ahooks`) into `dependencies`. Consumer apps no longer install or manage separate UI packages!
- **Astryx Subpath Export (`@vlrc-fe/components/astryx`)**: Direct, tree-shakeable access to 100% of Meta's Astryx primitives (447+ components, layout, and hooks) without bundle penalty.
- **Unified Theme & CSS Layers**: Replaced manual stylesheet stacking with a single `@vlrc-fe/components/theme.css` establishing `@layer reset, astryx-base, astryx-theme, product;`.
- **Zero Raw `<div>` & `<span>` Invariant**: Strict layout and typography primitives must be used instead of raw HTML elements.
- **Zero Magic Values Invariant**: Every color, space, radius, shadow, and transition MUST derive from design tokens.
- **Token Modernization**: `radii` is standardized to `radius` with Astryx standard tiers (`sm: 2px`, `default: 4px`, `md: 6px`, `lg: 8px`, `xl: 12px`, `2xl: 16px`, `full`). A backwards-compatible `radii` export is preserved.
- **Astryx CLI & MCP Integration**: Consumer apps can run `npx vlrc component <Name> --props` / `--json` and connect AI coding assistants to `https://astryx.atmeta.com/mcp`.
- **Native i18n & Multi-Calendar**: First-class `<InternationalizationProvider>` supporting RTL and multiple calendar systems, coexisting with `react-i18next`.

---

## 2. Step-by-Step Upgrade Guide

### Step 2.1: Update Dependencies & Clean Up Old Peer Dependencies

In your consumer application, you can **remove** all previous UI peer dependencies (`@radix-ui/*`, `lucide-react`, `cmdk`, `date-fns`, `embla-carousel-react`, etc.) from your `package.json`. `@vlrc-fe/components` manages them directly:

```bash
# In consumer applications:
pnpm add @vlrc-fe/components@^3.0.0 @stylexjs/stylex@^0.19.1
pnpm add -D @astryxdesign/build@^0.7.16
```

### Step 2.2: Update Vite Bundler Config

Replace `@stylexjs/unplugin` with `@astryxdesign/build/vite`:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { stylex } from '@astryxdesign/build/vite';

export default defineConfig({
  plugins: [
    stylex({
      useCSSLayers: true,
      dev: process.env.NODE_ENV === 'development',
    }),
    react(),
  ],
});
```

### Step 2.3: Single App Entry Stylesheet Import

In your application entry point (`main.tsx` or `App.tsx`):

```tsx
// REMOVE old stylesheet imports:
// import '@vlrc-fe/components/stylex.css';

// ADD single unified theme import:
import '@vlrc-fe/components/theme.css';
```

This sets up native CSS cascade layers in the correct order:

```css
@layer reset, astryx-base, astryx-theme, product;
```

### Step 2.4: Layout Primitives (Replace Raw `<div>`)

| Old (Raw HTML)                                       | New (Astryx + VLRC Layout Primitives)                 |
| :--------------------------------------------------- | :---------------------------------------------------- |
| `<div className="flex flex-col gap-4">`              | `<VStack gap="md">` or `<Stack direction="vertical">` |
| `<div className="flex items-center gap-2">`          | `<HStack gap="sm" align="center">`                    |
| `<div className="grid grid-cols-3 gap-4">`           | `<Grid columns={3} gap="md">`                         |
| `<div className="p-4 rounded-lg bg-card">`           | `<Box padding="md" sx={styles.card}>`                 |
| `<div className="mx-auto max-w-7xl">`                | `<Container size="xl">`                               |
| `<div className="flex items-center justify-center">` | `<Center>`                                            |

### Step 2.5: Typography Primitives (Replace Raw `<span>`, `<p>`, `<h1>`-`<h6>`)

| Old (Raw HTML)                             | New (VLRC Typography Primitives)                   |
| :----------------------------------------- | :------------------------------------------------- |
| `<h1>Page Title</h1>`                      | `<Title level={1}>Page Title</Title>`              |
| `<h2>Section Title</h2>`                   | `<Title level={2}>Section Title</Title>`           |
| `<p>Body paragraph text...</p>`            | `<Paragraph>Body paragraph text...</Paragraph>`    |
| `<span className="text-muted">Text</span>` | `<Text type="secondary">Text</Text>`               |
| `<code>const x = 1;</code>`                | `<Code>const x = 1;</Code>`                        |
| `<pre><code>...</code></pre>`              | `<CodeBlock language="typescript">...</CodeBlock>` |

### Step 2.6: Design Token Renames & Shadow Standardization

- **Radius**: Update `radii.md` -> `radius.md`.
- **Shadows**: Replace any hardcoded `boxShadow: '0 4px 6px ...'` with `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.ringFocus`, etc.
- **Colors**: Replace any raw `#hex` or `rgb()` with `colors.*` or semantic surface variables (`colors.surfaceWash`, `colors.surfaceElevated`).

### Step 2.7: AI Coding Assistant Configuration

Enable Astryx CLI and Remote MCP for your team:

- Inspect schemas: `npx vlrc component <ComponentName> --props`
- Connect MCP: Add `https://astryx.atmeta.com/mcp` to `.cursor/mcp.json` or `.mcp.json`.

---

# Historical Migration: v1.x to v2.0.0 (Tailwind CSS to Meta StyleX)

For archival purposes, the v1 to v2 migration from Tailwind CSS to compile-time Meta StyleX is documented below:

1. Replaced Tailwind CSS classes with `@stylexjs/stylex`.
2. Created typed `sx?: stylex.StyleXStyles` override pattern.
3. Introduced design token variables (`colors`, `spacing`, `radii`).
