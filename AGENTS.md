# VLRC Frontend Monorepo Guidelines

This repository contains reusable frontend packages for the VLRC ecosystem, built natively on Meta's **Astryx Design System** and **Meta StyleX**:

- `@vlrc-fe/components` (v3.0.0): UI primitive and composite component library built on Astryx foundations, Meta StyleX, and Radix UI.
- `@vlrc-fe/hooks`: Shared React utility hooks.

---

<!-- ASTRYX-VLRC:START -->

## Astryx & VLRC AI Agent Operating Contract

Astryx v0.7.16 · @vlrc-fe/components v3.0.0 · 174+ Astryx primitives + VLRC enterprise composite extensions.

### 1. AI Tooling & Discovery (Always Inspect Before Coding)

Before generating or modifying component call sites, query component schemas dynamically to prevent hallucinations:

- **Astryx Remote MCP Server**: Connected to `https://astryx.atmeta.com/mcp` (Tools: `search(query)`, `get(name)`).
- **CLI Schema Inspection**:
  ```bash
  npx vlrc component <ComponentName> --json
  # or directly via Astryx CLI:
  npx @astryxdesign/cli@0.7.16 component <ComponentName> --json
  ```
- **CLI Prop Table**:
  ```bash
  npx vlrc component <ComponentName> --props
  ```
- **CLI Commands Reference**:
  ```bash
  npx vlrc search "<query>"       # Find any component, doc, or pattern
  npx vlrc docs <topic>           # layout, tokens, styling-overview, theme, principles
  npx vlrc doctor                 # Verify design system integrity and dependencies
  ```

### 2. Setup Requirement (App Entry) & Dependency Model

- **Zero Dependency Overhead for Consumer Apps**:
  All 30+ UI and headless dependencies (`@radix-ui/*`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `lodash-es`, `lucide-react`, `react-day-picker`, `react-number-format`, `react-resizable-panels`, `sonner`, `vaul`, `ahooks`) are packaged as internal `dependencies` of `@vlrc-fe/components`. Consumer apps do NOT need to install or manage any UI dependencies—they only install `react` and `react-dom` (and optionally `@stylexjs/stylex`).
- **Subpath Exports**:
  - `@vlrc-fe/components`: High-level enterprise wrapper components, layout primitives, typography, form base, and data table (372 kB bundle with tree-shaking).
  - `@vlrc-fe/components/astryx`: Direct access to 100% of Meta's Astryx primitives (447+ components, layout, and hooks) without bundle overhead.
  - `@vlrc-fe/components/theme`: Design tokens (`colors`, `radius`, `spacing`, `shadow`, `duration`, `easing`).
  - `@vlrc-fe/components/Icons`: Central Lucide icon registry.
  - `@vlrc-fe/components/theme.css`: Theme cascade layers.

Every application consuming `@vlrc-fe/components` must import the unified theme stylesheet once in its root entry (e.g. `main.tsx` or `App.tsx`):

```tsx
import '@vlrc-fe/components/theme.css';
```

This automatically establishes native CSS cascade layers in the correct order:

```css
@layer reset, astryx-base, astryx-theme, product;
```

### 3. Layout & Typography Rules (Strict: Zero Raw `<div>` / `<span>`)

- **NEVER use raw `<div>` for layout or spacing**:
  - Vertical stacks: `<VStack>` or `<Stack direction="vertical">` (token-spaced).
  - Horizontal stacks: `<HStack>` (align items, gap tokens).
  - Modern grid: `<Grid>` (CSS Grid tracks, responsive).
  - 24-Column grid: `<Row>` and `<Col>` (responsive column span 0-24, offset, gutters).
  - Generic styled container: `<Box>` (polymorphic `as`, padding/margin tokens).
  - Centered layouts: `<Container>` (max-width centered) and `<Center>`.
  - Flex layout: `<Flex>` (wrapping Astryx Flex with 7-tier gap resolution).
- **NEVER use raw `<span>`, `<p>`, or `<h1>`-`<h6>` for typography**:
  - Always use `<Text>`, `<Title>`, `<Paragraph>`, `<Link>`, `<Code>`, `<CodeBlock>`, and `<Heading>` from `@vlrc-fe/components`.

### 4. Zero Magic Values Contract (Zero Hardcoded CSS / Numbers / Colors)

Every visual style in this library MUST come from design tokens:

- **Colors & Surfaces**: Use `colors.*` or `--color-surface-*`, `--color-fg-*`, `--color-border-*`. **Never use `#hex`, `rgb()`, or named color strings**.
- **Spacing & Gaps**: Use `spacing.*` or `--spacing-*` (numeric 4px grid: `0` to `96` or 7-tier presets `xxs` through `xxl`).
- **Border Radius**: Use `radius.*` or `--radius-*` (`sm: 2px`, `default: 4px`, `md: 6px`, `lg: 8px`, `xl: 12px`, `2xl: 16px`, `full: 9999px`).
- **Elevation / Shadows**: Use `shadow.*` or `--shadow-*` (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`, `ring`, `ringFocus`, `ringDestructive`). **Never write raw `box-shadow` CSS strings**.
- **Motion & Transitions**: Use `duration.*` (`fast: 100ms`, `normal: 200ms`, `slow: 300ms`) and `easing.*`.

### 5. Wrapper Architecture & Feature Retention

VLRC components are **built on top of Astryx primitives**, extending them with enterprise features:

- **Typography Extensions**: `<Text>` and `<Title>` provide `copyable` (with clipboard tooltip), `editable` (inline editing), `ellipsis` (with automatic tooltip on text overflow), `lines`/`rows` multi-line clamp, and margin shorthand props (`m`, `mt`, `mb`, etc.).
- **Form Controls**: Form components integrate with `react-hook-form` and `FormBase` validation contexts.
- **Icon System**: Access icons via `<Icons.<IconName> />` (backed by the unified Lucide registry and Astryx `IconProvider`).
- **Rich Text Editing**: Integrated with `@astryxdesign/richtext` for Lexical rich text and Markdown serialization.

### 6. Internationalization (i18n) & RTL

- Wrap application subtrees in `<InternationalizationProvider locale={locale}>`.
- Astryx components automatically resolve their internal UI strings (search placeholders, clear buttons, date picker controls, pagination labels).
- Built-in multi-calendar support (Gregorian, Persian, Hebrew, Buddhist, Japanese, Chinese).
- Coexists seamlessly with `react-i18next` for application-level translations.
- RTL text direction is automatically tracked and applied via CSS logical properties.

### 7. Self-Check Workflow for AI Agents

Before completing any task:

1. Re-read generated files.
2. Replace any raw `<div>`, `<span>`, `<p>`, `<h1>`-`<h6>` with layout and typography primitives.
3. Replace any raw `#hex`, `rgb(...)`, unparsed `px`, or raw `boxShadow: '...'` with design tokens from `../theme/tokens.stylex`.
4. Ensure all StyleX styles use `@stylexjs/stylex` with statically evaluable `stylex.create(...)`.

<!-- ASTRYX-VLRC:END -->

---

## Detailed Monorepo Guidelines for Agents

- **Styling Engine**: All component styling uses **Meta StyleX** (`@stylexjs/stylex`) with `@astryxdesign/build/vite` prefix splitting (`astryx` for library, `x` for product). Do NOT introduce Tailwind classes or runtime CSS-in-JS libraries in package sources.
- **Theme Customization**: Custom branding and color changes belong in `@layer astryx-theme` (in `src/theme/vlrc-theme.css`), never in raw `:root` styles.
- **Overrides**: Components accept `sx?: stylex.StyleXStyles` for overrides and maintain clean `className` merging.
- **TypeScript**: TypeScript 7.x in strict mode with **0% `any`**. All type definition files must be `.ts` (not `.d.ts`) so declarations are emitted to `dist/`. Full Astryx types are re-exported.
- **Storybook & Vitest**:
  - Every new or updated component must include Storybook stories (`*.stories.tsx`) covering default, variants, and controlled/uncontrolled usage.
  - **Streamlined Tests**: Meta's Astryx design system is already thoroughly tested upstream. Do NOT write duplicate baseline DOM tests. Only write Vitest tests (`*.test.tsx`) for VLRC-specific wrapper logic (`copyable`, `editable`, custom form binders, gutter calculations).
- **Responsive & Mobile-First**:
  - Base styles target compact/mobile viewports; scale up progressively using StyleX media queries or `useBreakpoint` hooks (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`).
  - Mobile touch targets must meet the minimum 44×44px interactive requirement.
- **Accessibility (A11y)**: Full WCAG 2.1 AA compliance:
  - Accessible primitives grounded on Astryx & Radix headless primitives.
  - Visible `:focus-visible` focus rings using design tokens (`colors.ring` / `--color-focus-ring`).
  - Full ARIA semantics (`aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-controls`).
- **Builds**: Run `pnpm build` (`pnpm build:packages`) to verify bundling and declaration emissions.
- Detailed rules and references are located in [`.agents/rules/code-conventions.md`](file:///.agents/rules/code-conventions.md) and [`.agents/skills/vlrc-fe-components/`](file:///.agents/skills/vlrc-fe-components/).
