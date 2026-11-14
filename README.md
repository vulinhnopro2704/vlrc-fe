# VLRC Frontend Libraries

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![Astryx](https://img.shields.io/badge/Astryx-0.7.16-blueviolet.svg?style=flat-square)](https://astryx.atmeta.com)
[![Meta StyleX](https://img.shields.io/badge/StyleX-0.19-purple.svg?style=flat-square)](https://stylexjs.com/)
[![Storybook](https://img.shields.io/badge/Storybook-Live%20Demo-ff4785.svg?style=flat-square&logo=storybook)](https://vulinhnopro2704.github.io/vlrc-fe/)
[![pnpm](https://img.shields.io/badge/pnpm-11-orange.svg?style=flat-square)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

Production-ready React UI components and hooks for building modern enterprise web applications. Built natively on Meta's **Astryx Design System**, **Meta StyleX** (compile-time atomic CSS), **Radix UI** primitives, and **React Hook Form** integration.

> 🎨 **Live Storybook Playground**: Explore and interactively test all components online at [https://vulinhnopro2704.github.io/vlrc-fe/](https://vulinhnopro2704.github.io/vlrc-fe/)

---

## Packages

| Package                                        |                                                               Version                                                               | Description                                                                    |
| :--------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------- |
| [`@vlrc-fe/components`](./packages/components) | [![npm](https://img.shields.io/npm/v/@vlrc-fe/components.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/components) | Astryx-powered UI component library with Meta StyleX, unified tokens, and i18n |
| [`@vlrc-fe/hooks`](./packages/hooks)           |      [![npm](https://img.shields.io/npm/v/@vlrc-fe/hooks.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/hooks)      | Reusable React hooks for modal state, animations, and UI coordination          |

---

## Tech Stack & Architecture

- **Meta Astryx Design System** — enterprise-grade UI foundation, CLI, rich text, and native i18n
- **Meta StyleX** — compile-time atomic CSS-in-JS, deterministic cascade, zero runtime CSS injection
- **Zero UI Dependency Friction** — all 30+ UI primitives and utilities are bundled internally in `@vlrc-fe/components`; consumer apps only need `react` and `react-dom`
- **Subpath Architecture** — `@vlrc-fe/components` for tree-shakeable enterprise wrappers, `@vlrc-fe/components/astryx` for 100% of Meta's Astryx primitives
- **React 19.3** with React Compiler support
- **TypeScript 7.0** in strict mode (0% `any`)
- **Radix UI** — accessible headless primitives
- **Vite 8** + Rolldown bundler with `@astryxdesign/build/vite` prefix splitting
- **pnpm 11** workspaces

---

## AI Operating System & Astryx CLI

This repository is fully optimized for AI coding assistants (Claude Code, Cursor, Codex, Gemini CLI, Antigravity) with official Astryx tool integration:

- **Astryx Remote MCP Server**: `https://astryx.atmeta.com/mcp` (`search(query)`, `get(name)`)
- **CLI Component Inspection**:
  ```bash
  # Machine-readable schema
  npx vlrc component <ComponentName> --json

  # Prop table
  npx vlrc component <ComponentName> --props

  # CLI search and docs
  npx vlrc search "<query>"
  npx vlrc docs layout
  npx vlrc doctor
  ```

---

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Install and Build

```bash
git clone https://github.com/vulinhnopro2704/vlrc-fe.git
cd vlrc-fe
pnpm install
pnpm build
```

### Interactive Storybook & Component Playground

Test each component directly in isolation with controls, variants, and theme switching:

- **Online Storybook**: [https://vulinhnopro2704.github.io/vlrc-fe/](https://vulinhnopro2704.github.io/vlrc-fe/)
- **Local Storybook**:
  ```bash
  pnpm storybook
  ```
  Opens at `http://localhost:6006`.

### Lint and Test

```bash
pnpm lint
pnpm test
```

---

## Core Contracts for Consumers & Agents

1. **Zero UI Dependency Burden**: Consumer apps only install `@vlrc-fe/components` with `react` and `react-dom`. All UI primitives (`@radix-ui/*`, `cmdk`, `date-fns`, `lucide-react`, `sonner`, `vaul`, etc.) are packaged in `dependencies` of `@vlrc-fe/components`.
2. **Subpath Imports**:
   - `import { Button, Stack, Text } from '@vlrc-fe/components';` — enterprise wrappers and essentials.
   - `import { AstryxComponent, astryx } from '@vlrc-fe/components/astryx';` — 100% of Meta's Astryx primitives.
   - `import { colors, radius, spacing } from '@vlrc-fe/components/theme';` — design tokens.
3. **Zero Raw `<div>` / `<span>`**: Layouts use `<Stack>`, `<HStack>`, `<VStack>`, `<Grid>`, `<Row>`, `<Col>`, `<Box>`, `<Container>`, `<Center>`, or `<Flex>`. Typography uses `<Text>`, `<Title>`, `<Paragraph>`, `<Link>`, `<Code>`, `<CodeBlock>`, `<Heading>`.
4. **Zero Magic Values**: All colors, spaces, radii, shadows, and transitions strictly come from design tokens (`colors.*`, `spacing.*`, `radius.*`, `shadow.*`, `duration.*`, `easing.*`).
5. **App Setup**: Applications import `@vlrc-fe/components/theme.css` once at entry to establish `@layer reset, astryx-base, astryx-theme, product;`.
6. **Internationalization**: Wrap subtrees in `<InternationalizationProvider locale={locale}>`. Astryx components localize automatically, coexisting with `react-i18next`.

---

## Documentation

- [Live Storybook](https://vulinhnopro2704.github.io/vlrc-fe/)
- [Components README](./packages/components/README.md)
- [Components Migration Guide](./packages/components/MIGRATION_GUIDE.md)
- [Astryx Migration Plan & Architecture](./docs/ASTRYX_MIGRATION_PLAN.md)
- [Hooks README](./packages/hooks/README.md)
- [Agent Operating Guidelines](./AGENTS.md)
- [Official Astryx Documentation](https://astryx.atmeta.com)

---

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
