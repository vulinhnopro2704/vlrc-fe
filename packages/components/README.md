# @vlrc-fe/components

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/components.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/components)
[![React 19](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Astryx](https://img.shields.io/badge/Astryx-0.7.16-blueviolet.svg?style=flat-square)](https://astryx.atmeta.com)
[![StyleX](https://img.shields.io/badge/Styling-Meta%20StyleX-purple.svg?style=flat-square)](https://stylexjs.com/)
[![Storybook](https://img.shields.io/badge/Storybook-Live%20Demo-ff4785.svg?style=flat-square&logo=storybook)](https://vulinhnopro2704.github.io/vlrc-fe/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../../LICENSE)

Accessible, enterprise-grade React UI component library built natively on Meta's **Astryx Design System**, **Meta StyleX**, **Radix UI**, and **React Hook Form**. Ships compile-time atomic CSS with zero runtime style injection and full CLI / MCP support.

- **npm**: [npmjs.com/package/@vlrc-fe/components](https://www.npmjs.com/package/@vlrc-fe/components)
- **Live Storybook**: [vulinhnopro2704.github.io/vlrc-fe](https://vulinhnopro2704.github.io/vlrc-fe/)
- **Astryx Official Docs**: [astryx.atmeta.com](https://astryx.atmeta.com)
- **Astryx Remote MCP**: `https://astryx.atmeta.com/mcp`

---

## Features

- **Astryx Design System Core** — 174+ upstream primitives, unified design tokens, rich text editor (`@astryxdesign/richtext`), and native internationalization.
- **Zero UI Dependency Burden** — all 30+ UI primitives and headless libraries (`@radix-ui/*`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `lucide-react`, `sonner`, `vaul`, etc.) are packaged directly in `dependencies`. Consumer applications only need to install `react` and `react-dom`.
- **Subpath Architecture & Tree-Shaking** — lightweight main entry (372 kB bundle) for enterprise wrappers, plus a dedicated `@vlrc-fe/components/astryx` subpath for 100% of Meta's Astryx primitives.
- **Meta StyleX Styling** — compile-time atomic CSS-in-JS with deterministic specificity and zero runtime overhead.
- **CLI Bridge & Schema Inspection** — run `npx vlrc component <ComponentName> --json` or `--props` to inspect schemas directly from Astryx.
- **Enterprise Wrapper Extensions**:
  - **Typography**: `<Text>` and `<Title>` provide `copyable` (with clipboard tooltip), `editable` (inline editing), `ellipsis` (with automatic tooltip on text overflow), `lines`/`rows` multi-line clamp, and margin shorthand props (`m`, `mt`, `mb`, etc.).
  - **Layout Primitives**: `<Box>`, `<Stack>`, `<HStack>`, `<VStack>`, `<Grid>`, `<Row>`, `<Col>`, `<Container>`, `<Center>`, and `<Flex>`. Never use raw `<div>` for layout!
  - **Form Controls**: Full suite of accessible form controls integrated with `react-hook-form` and `FormBase`.
  - **Unified Icons**: `<Icons.<Name> />` backed by Lucide and Astryx `IconProvider`.
- **Zero Magic Values Contract** — all colors, spaces, radii, shadows, and transitions strictly come from design tokens (`colors.*`, `spacing.*`, `radius.*`, `shadow.*`).
- **Native i18n & Multi-Calendar** — `<InternationalizationProvider>` with automatic string localization, RTL layout tracking, and multiple calendars (Gregorian, Persian, Hebrew, Buddhist, Japanese, Chinese), coexisting with `react-i18next`.

---

## Installation

```bash
# In consumer applications:
pnpm add @vlrc-fe/components @stylexjs/stylex
pnpm add -D @astryxdesign/build
```

> [!NOTE]
> **No Peer Dependency Management Required**: Unlike typical UI libraries that require installing 20+ Radix primitives and utility packages into your app's `package.json`, `@vlrc-fe/components` bundles and resolves all UI dependencies internally.

---

## Subpath Exports

| Import Path                      | Contents                                                                           |
| :------------------------------- | :--------------------------------------------------------------------------------- |
| `@vlrc-fe/components`            | Tree-shakeable enterprise components, layout primitives, typography, forms         |
| `@vlrc-fe/components/astryx`     | 100% of Meta's Astryx primitives (447+ components, layout, and hooks)              |
| `@vlrc-fe/components/theme`      | Design tokens: `colors`, `radius`, `spacing`, `shadow`, `duration`, `easing`       |
| `@vlrc-fe/components/DataTable`  | Virtualized enterprise DataTable powered by TanStack Table & Astryx styles         |
| `@vlrc-fe/components/Dropdown`   | Accessible dropdown and action menus                                               |
| `@vlrc-fe/components/Icons`      | Central Lucide icon registry                                                       |
| `@vlrc-fe/components/Typography` | Extended `<Text>`, `<Title>`, `<Paragraph>`, `<Link>`, `<Code>`                    |
| `@vlrc-fe/components/richtext`   | Lexical-based rich text editor & headless Markdown serializers                     |
| `@vlrc-fe/components/theme.css`  | Unified CSS layer declarations (`reset`, `astryx-base`, `astryx-theme`, `product`) |

### Direct Astryx Access (`@vlrc-fe/components/astryx`)

When you need an upstream Astryx primitive not yet customized in the root entry, import it via the `./astryx` subpath:

```tsx
// Direct named imports or whole namespace
import { AstryxComponent, astryx } from '@vlrc-fe/components/astryx';
```

---

## Setup

### 1. Configure Bundler Plugin (Vite)

In your application's `vite.config.ts`, configure prefix splitting using `@astryxdesign/build/vite`:

```ts
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

### 2. Import Stylesheet Once in App Entry

Import `@vlrc-fe/components/theme.css` once at your root entry (e.g. `main.tsx` or `App.tsx`):

```tsx
import '@vlrc-fe/components/theme.css';
```

This automatically declares native CSS cascade layers in the required order:

```css
@layer reset, astryx-base, astryx-theme, product;
```

---

## Layout & Typography Primitives

### Layout (Strict: Zero Raw `<div>`)

```tsx
import { Box, Stack, HStack, VStack, Grid, Row, Col, Container, Center } from '@vlrc-fe/components';

// Vertical stack
<VStack gap="md">
  <Box padding="sm">Item 1</Box>
  <Box padding="sm">Item 2</Box>
</VStack>

// Horizontal stack
<HStack gap="sm" align="center">
  <Button>Action</Button>
  <Text type="secondary">Helper text</Text>
</HStack>

// Responsive 24-column grid
<Row gutter={[16, 16]}>
  <Col span={12} xs={24}>Left Column</Col>
  <Col span={12} xs={24}>Right Column</Col>
</Row>
```

### Typography (Strict: Zero Raw `<span>`, `<p>`, `<h1>`-`<h6>`)

```tsx
import { Title, Text, Paragraph, Link, Code, CodeBlock } from '@vlrc-fe/components';

<Title level={1}>Dashboard</Title>
<Text type="secondary" ellipsis copyable>
  Token: 0x1234abcd5678ef90
</Text>
<Paragraph>
  Enterprise paragraph text with automatic line-height tokens.
</Paragraph>
```

---

## Design Tokens

Tokens are imported from `@vlrc-fe/components/theme`:

```ts
import { colors, radius, spacing, shadow, duration, easing } from '@vlrc-fe/components/theme';
```

| Token Category | Examples                                                                            | Description                     |
| :------------- | :---------------------------------------------------------------------------------- | :------------------------------ |
| **Colors**     | `colors.primary`, `colors.surfaceWash`, `colors.destructive`                        | Semantic theme surfaces & fg    |
| **Radius**     | `radius.sm`, `radius.default`, `radius.md`, `radius.lg`, `radius.xl`, `radius.full` | 2px to 9999px scale             |
| **Spacing**    | `spacing.0` through `spacing.24`, `spacing.xxs` through `spacing.xxl`               | 4px numeric grid & 7-tier scale |
| **Shadow**     | `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.ringFocus`                           | Design-token elevations & rings |
| **Motion**     | `duration.fast`, `duration.normal`, `easing.default`                                | Transition durations & curves   |

---

## Internationalization (i18n)

Wrap your application tree in `<InternationalizationProvider>`:

```tsx
import { InternationalizationProvider, useLocale, useDirection } from '@vlrc-fe/components';

export function Root() {
  return (
    <InternationalizationProvider locale="vi">
      <App />
    </InternationalizationProvider>
  );
}
```

Astryx date pickers, calendars, table pagination controls, and file uploads localize automatically.

---

## CLI & AI Inspection

Product developers and AI coding agents can inspect component props and schemas anytime:

```bash
# JSON schema for AI agents
npx vlrc component Button --json

# Human-readable prop table
npx vlrc component Button --props

# Search documentation and components
npx vlrc search "data table"
npx vlrc docs tokens
```

---

## Testing

Meta's upstream Astryx primitives are comprehensively tested. When testing consumer apps or custom wrappers, focus on business logic and interaction:

```bash
pnpm test
```

---

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
