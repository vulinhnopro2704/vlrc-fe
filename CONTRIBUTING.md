# Contributing to VLRC Frontend Libraries

Thank you for your interest in contributing to `@vlrc-fe/components` and `@vlrc-fe/hooks`! This document outlines the guidelines and workflow for contributing.

---

## Code of Conduct & Core Principles

- **Zero Tailwind in `@vlrc-fe/components`**: All components must be styled using **Meta StyleX** (`@stylexjs/stylex`).
- **Deterministic Overrides**: Components must accept an `sx?: stylex.StyleXStyles` prop for style customization.
- **Theme Tokens**: Colors and sizing must reference tokens from `@vlrc-fe/components/theme` (`tokens.stylex.ts`) to ensure multi-theme support (`light`, `dark`, `pink`, `lavender`).
- **Semantic Versioning & Changesets**: Every user-facing change requires an associated changeset.

---

## Development Setup

### Prerequisites

- **Node.js**: `>= 22`
- **pnpm**: `>= 10`

### 1. Clone & Install

```bash
git clone https://github.com/vulinhnopro2704/vlrc-fe.git
cd vlrc-fe
pnpm install
```

### 2. Available Scripts

| Command           | Description                                                           |
| :---------------- | :-------------------------------------------------------------------- |
| `pnpm docs:dev`   | Start the interactive component playground at `http://localhost:3000` |
| `pnpm build`      | Build all library packages and emit TypeScript declarations           |
| `pnpm docs:build` | Build the playground documentation app                                |
| `pnpm test`       | Run Vitest unit tests                                                 |
| `pnpm typecheck`  | Run TypeScript check across all packages without emitting files       |
| `pnpm lint`       | Run ESLint checks across the monorepo                                 |
| `pnpm changeset`  | Create a new changeset for your pull request                          |

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Making Changes

- If creating or updating a UI primitive, add corresponding tests in `packages/components/src/ui/*.test.tsx`.
- Preview and verify your changes in the playground with `pnpm docs:dev`.
- Verify your code meets all quality gates before committing:
  ```bash
  pnpm lint
  pnpm typecheck
  pnpm test
  pnpm build
  ```

### 3. Adding a Changeset

If your PR introduces bug fixes, new features, or breaking changes, run:

```bash
pnpm changeset
```

1. Select the packages affected (`@vlrc-fe/components`, `@vlrc-fe/hooks`).
2. Choose the semver bump level:
   - `patch`: Bug fixes and minor internal improvements.
   - `minor`: New backwards-compatible features or components.
   - `major`: Breaking changes.
3. Write a clear, concise summary of the changes.

Commit the generated `.changeset/*.md` file along with your PR.

---

## Pull Request Guidelines

1. Ensure all CI checks (Lint, Typecheck, Test, Build) pass cleanly.
2. Fill out the Pull Request template completely.
3. Keep pull requests focused on a single feature or bug fix.
