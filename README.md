# VLRC Frontend Libraries

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![Meta StyleX](https://img.shields.io/badge/StyleX-0.19-purple.svg?style=flat-square)](https://stylexjs.com/)
[![Storybook](https://img.shields.io/badge/Storybook-Live%20Demo-ff4785.svg?style=flat-square&logo=storybook)](https://vulinhnopro2704.github.io/vlrc-fe/)
[![pnpm](https://img.shields.io/badge/pnpm-11-orange.svg?style=flat-square)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

Production-ready React UI components and hooks for building modern web applications. Built with **Meta StyleX** (compile-time atomic CSS), **Radix UI** primitives, and **React Hook Form** integration.

> 🎨 **Live Storybook Playground**: Explore and interactively test all components online at [https://vulinhnopro2704.github.io/vlrc-fe/](https://vulinhnopro2704.github.io/vlrc-fe/)

## Packages

| Package                                        |                                                               Version                                                               | Description                                                           |
| :--------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------- |
| [`@vlrc-fe/components`](./packages/components) | [![npm](https://img.shields.io/npm/v/@vlrc-fe/components.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/components) | Accessible React UI components with theming, forms, and data tables   |
| [`@vlrc-fe/hooks`](./packages/hooks)           |      [![npm](https://img.shields.io/npm/v/@vlrc-fe/hooks.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/hooks)      | Reusable React hooks for modal state, animations, and UI coordination |

## Tech Stack

- **React** 19.3 with Compiler support
- **TypeScript** 7.0 in strict mode
- **Meta StyleX** — compile-time atomic CSS-in-JS, zero runtime
- **Radix UI** — accessible headless primitives
- **Vite** 8 + Rolldown bundler
- **pnpm** 11 workspaces

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

- **Documentation App**:
  ```bash
  pnpm docs:dev
  ```

### Lint and Test

```bash
pnpm lint
pnpm test
```

## Documentation

- [Live Storybook](https://vulinhnopro2704.github.io/vlrc-fe/)
- [Components README](./packages/components/README.md)
- [Hooks README](./packages/hooks/README.md)
- [Changelog](./packages/components/CHANGELOG.md)

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
