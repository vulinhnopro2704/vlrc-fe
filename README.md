# VLRC Frontend Monorepo (`vlrc-fe`)

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![Meta StyleX](https://img.shields.io/badge/StyleX-0.19-purple.svg?style=flat-square)](https://stylexjs.com/)
[![pnpm](https://img.shields.io/badge/pnpm-11-orange.svg?style=flat-square)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

Standalone monorepo housing the core UI component systems, utility libraries, and hooks for the **VLRC** English Learning platform and related frontend applications.

---

## 📦 Packages

| Package | Version | Description | Path |
| :--- | :---: | :--- | :--- |
| **[`@vlrc-fe/components`](./packages/components)** | `2.0.1` | Accessible, tree-shakable React UI library built with **Meta StyleX** and **Radix UI**. | [`packages/components`](./packages/components) |
| **[`@vlrc-fe/hooks`](./packages/hooks)** | `1.0.9` | Reusable React hooks for state, gestures, debounce, and query coordination. | [`packages/hooks`](./packages/hooks) |

---

## 🛠 Tech Stack & Architecture

- **Runtime**: React 19.3 (Compiler ready via `@vitejs/plugin-react`)
- **Language**: TypeScript 7.0 (strict type checking & declaration maps)
- **Styling**: Meta StyleX (Compile-time atomic CSS-in-JS, zero runtime style injection)
- **Package Manager**: pnpm 11 with Workspaces
- **Bundler**: Vite 8 & Rolldown
- **Code Quality**: ESLint 10 & Prettier 3

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 22`
- pnpm `>= 10`

### 1. Installation

Clone the repository and install all workspace dependencies:

```bash
git clone https://github.com/vulinhnopro2704/vlrc-fe.git
cd vlrc-fe
pnpm install
```

### 2. Building Packages

Build all packages (`@vlrc-fe/components` and `@vlrc-fe/hooks`):

```bash
pnpm build
```

This runs:
1. Vite library bundling into both ESM (`index.js`) and CJS (`index.cjs`).
2. StyleX atomic stylesheet extraction into `dist/assets/stylex.css`.
3. TypeScript compiler (`tsc -p tsconfig.json`) declaration file generation into `dist/`.

### 3. Linting & Type Checking

```bash
pnpm lint
```

---

## 🤖 AI Agent Guidelines & Coding Standards

This repository maintains standardized guidelines for AI pair-programming agents:
- **Agent Rules**: [`.agents/rules/code-conventions.md`](./.agents/rules/code-conventions.md)
- **Top-Level Directives**: [`AGENTS.md`](./AGENTS.md)
- **Component Skill & References**: [`.agents/skills/vlrc-fe-components/`](./.agents/skills/vlrc-fe-components/)

---

## 📄 Documentation

- [Components Package README](./packages/components/README.md)
- [Changelog & Breaking Changes](./packages/components/CHANGELOG.md)
- [Tailwind to StyleX Migration Guide](./packages/components/MIGRATION_GUIDE.md)

---

## 📄 License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
