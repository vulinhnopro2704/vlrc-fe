# Contributing to VLRC Frontend Libraries

Thank you for your interest in contributing to `@vlrc-fe/components` and `@vlrc-fe/hooks`! This document outlines the guidelines and workflow for contributing.

---

## Code of Conduct & Core Principles

- **Astryx Design System Foundation**: Components are built on Meta's Astryx design system primitives and Meta StyleX (`@stylexjs/stylex`).
- **Zero Raw `<div>` & `<span>`**: Layouts must use `<Stack>`, `<HStack>`, `<VStack>`, `<Grid>`, `<Row>`, `<Col>`, `<Box>`, `<Container>`, `<Center>`, or `<Flex>`. Typography must use `<Text>`, `<Title>`, `<Paragraph>`, `<Link>`, `<Code>`, `<CodeBlock>`, or `<Heading>`.
- **Zero Magic Values Contract**: No `#hex`, unparsed `px`, or raw `boxShadow: '...'` strings in component code. All visuals must derive from design tokens (`colors.*`, `spacing.*`, `radius.*`, `shadow.*`, `duration.*`, `easing.*`).
- **Deterministic Overrides**: Components must accept an `sx?: stylex.StyleXStyles` prop for style customization.
- **AI Tooling & Discovery**: Inspect component contracts before coding via `npx vlrc component <ComponentName> --json` or Astryx Remote MCP (`https://astryx.atmeta.com/mcp`).
- **Streamlined Tests**: Upstream Astryx components are thoroughly tested by Meta. Focus Vitest unit tests solely on VLRC-specific wrapper logic (`copyable`, `editable`, custom form binders, responsive math).
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

| Command                | Description                                                     |
| :--------------------- | :-------------------------------------------------------------- |
| `pnpm storybook`       | Start Storybook component playground at `http://localhost:6006` |
| `pnpm build-storybook` | Build static Storybook site for deployment                      |
| `pnpm docs:dev`        | Start the documentation playground at `http://localhost:3000`   |
| `pnpm build`           | Build all library packages and emit TypeScript declarations     |
| `pnpm test`            | Run Vitest unit tests                                           |
| `pnpm typecheck`       | Run TypeScript check across all packages without emitting files |
| `pnpm lint`            | Run Oxlint checks across the monorepo                           |
| `pnpm format`          | Run Oxfmt code formatter                                        |
| `pnpm changeset`       | Create a new changeset for your pull request                    |

> 🌐 **Live Storybook**: Deployed automatically to GitHub Pages at [https://vulinhnopro2704.github.io/vlrc-fe/](https://vulinhnopro2704.github.io/vlrc-fe/) on push to `main`.

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Making Changes

- Before writing or modifying components, inspect the schema with `npx vlrc component <ComponentName> --props`.
- If creating or updating a UI wrapper, add corresponding focused tests in `packages/components/src/ui/*.test.tsx`.
- Preview and verify your changes in Storybook with `pnpm storybook`.
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
