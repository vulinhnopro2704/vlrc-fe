# CLAUDE.md

Guidelines for Claude Code and Anthropic AI coding assistants working in the VLRC Frontend Monorepo.

## Build, Test & Lint Commands

- Build all packages: `pnpm build` (`pnpm build:packages`)
- Run all tests: `pnpm test` (or `pnpm test:watch` for watch mode)
- Single test file: `pnpm vitest run packages/components/src/layout/layout.test.tsx`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` (or `pnpm lint:fix`)
- Format: `pnpm format` (or `pnpm format:check`)
- Storybook: `pnpm storybook` (port 6006)

---

## Astryx & VLRC Component System Architecture

This repository contains `@vlrc-fe/components` (v3.0.0), built natively on Meta's **Astryx Design System** (`@astryxdesign/core`, `@astryxdesign/cli`, `@astryxdesign/richtext`) and **Meta StyleX**.

### 1. Always Query Astryx MCP / CLI Before Coding

Before generating component markup or props, query the Astryx schema to prevent hallucinations:

- **Astryx Remote MCP**: `https://astryx.atmeta.com/mcp` (Tool: `astryx.get("<ComponentName>")` or `astryx.search("<query>")`)
- **CLI Schema Inspection**:
  ```bash
  npx vlrc component <ComponentName> --json
  # or directly:
  npx @astryxdesign/cli@0.7.16 component <ComponentName> --json
  ```
- **CLI Prop Table**:
  ```bash
  npx vlrc component <ComponentName> --props
  ```
- **CLI Doc Topics**:
  ```bash
  npx vlrc docs layout
  npx vlrc docs tokens
  npx vlrc docs styling-overview
  ```

### 2. Dependency Model & Subpath Exports

- **Zero UI Dependency Burden**: Consumer apps only install `react` and `react-dom` (and optionally `@stylexjs/stylex`). All 30+ UI/headless libraries (`@radix-ui/*`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `lucide-react`, `sonner`, `vaul`, etc.) are packaged in `dependencies` of `@vlrc-fe/components`. Consumer apps do NOT install or manage separate UI libraries.
- **Subpath Exports**:
  - `@vlrc-fe/components`: Enterprise wrappers, layout, typography, forms, data table.
  - `@vlrc-fe/components/astryx`: 100% of Meta's Astryx primitives (447+ components, layout, and hooks) without root bundle penalty.
  - `@vlrc-fe/components/theme`: Design tokens (`colors`, `radius`, `spacing`, `shadow`, `duration`, `easing`).
  - `@vlrc-fe/components/Icons`: Lucide icon registry.
  - `@vlrc-fe/components/theme.css`: Cascaded stylesheet.

### 3. Layout Rules (STRICT: Never use raw `<div>`)

- **Vertical Stack**: `<VStack gap="md">` or `<Stack direction="vertical">`
- **Horizontal Stack**: `<HStack gap="md" align="center">`
- **CSS Grid**: `<Grid columns={3} gap="md">`
- **24-Column Responsive Grid**: `<Row gutter={[16, 16]}><Col span={12} xs={24}>...</Col></Row>`
- **Generic Container**: `<Box padding="md" as="section">`
- **Centered Layout**: `<Container>` or `<Center>`
- **Flex Layout**: `<Flex>`

### 4. Typography Rules (STRICT: Never use raw `<span>`, `<p>`, `<h1>`-`<h6>`)

- Text: `<Text size="md" type="secondary">`
- Title: `<Title level={2}>`
- Paragraph: `<Paragraph>`
- Inline Code: `<Code>`
- Block Code: `<CodeBlock language="typescript">`
- Heading: `<Heading level={1}>`

### 5. Zero Magic Values Contract

- **NO hardcoded hex colors (`#3b82f6`) or rgb()**: Use `colors.*` or `--color-surface-*`, `--color-fg-*`, `--color-border-*`.
- **NO hardcoded pixel spacing (`15px`, `22px`)**: Use `spacing.*` or `--spacing-*` (numeric 4px scale or 7-tier `xxs` through `xxl`).
- **NO hardcoded radii (`5px`)**: Use `radius.*` or `--radius-*` (Astryx scale: `sm: 2px`, `default: 4px`, `md: 6px`, `lg: 8px`, `xl: 12px`, `2xl: 16px`, `full: 9999px`).
- **NO hardcoded box-shadows (`box-shadow: 0 4px 6px ...`)**: Use `shadow.*` or `--shadow-*` (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`, `ring`, `ringFocus`, `ringDestructive`).
- **NO hardcoded motion timings**: Use `duration.*` and `easing.*`.

### 6. Styling Engine: Meta StyleX Only

- All styling uses `@stylexjs/stylex`.
- NEVER introduce Tailwind classes or runtime CSS-in-JS libraries inside `packages/components`.
- Style overrides accept `sx?: stylex.StyleXStyles`.

### 7. Internationalization (i18n)

- App entries wrap with `<InternationalizationProvider locale={locale}>`.
- Astryx components automatically localize date pickers, pagination, search boxes, and tables.
- Coexists with `react-i18next` for product translations.

### 8. Testing Philosophy

- Astryx baseline components are already thoroughly tested by Meta.
- Only write Vitest unit tests for VLRC-specific wrapper logic (`copyable`, `editable`, custom form binders, responsive gutter math). Do not write redundant baseline DOM tests.
