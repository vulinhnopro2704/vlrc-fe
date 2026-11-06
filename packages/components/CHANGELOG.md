# Changelog

All notable changes to `@vlrc-fe/components` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [2.0.2] - 2026-11-06

### Changed

- **Optional Peer Dependencies**: configured `peerDependenciesMeta` with optional flags for `recharts`, `vaul`, `embla-carousel-react`, `react-day-picker`, `date-fns`, `react-i18next`, `react-resizable-panels`, `sonner`, `input-otp`, `next-themes`, `react-number-format`, `class-variance-authority`, `clsx`, and `tailwind-merge`, eliminating unnecessary peer warnings for consumer apps.
- **Modern Tooling & Formatting**: migrated to `oxlint` and `oxfmt` across the monorepo, standardizing code quality, type annotations, and code formatting.
- **Vite 8 & Vitest 5 Toolchain**: updated build and test configurations to Vite 8.3 and Vitest 5.0 with full snapshot test coverage across UI primitives.
- **Package Metadata**: added complete public npm package metadata, repository references, and keywords.

## [2.0.1] - 2025-01-15

### Changed

- **Replaced Tailwind CSS with Meta StyleX**: migrated from runtime utility class concatenation (`tailwind-merge`, `clsx`, `class-variance-authority`) to compile-time atomic CSS-in-JS.
- **Zero runtime style injections**: all styles are parsed at build time using `@stylexjs/unplugin` and emitted into `dist/assets/stylex.css` with CSS `@layer` priorities.
- **Deterministic specificity**: eliminated CSS precedence issues and class collision bugs — the last style in `stylex.props(...)` deterministically wins without `!important`.
- **Theme tokens**: created `theme/tokens.stylex.ts` using `stylex.defineVars()`, binding to CSS custom properties (`--background`, `--primary`, `--card`, etc.). All dynamic themes remain compatible.

### Breaking Changes

- **`sx` prop introduced**: components now accept `sx?: stylex.StyleXStyles` for type-safe styling overrides.
- **`className` deprecated**: still accepted for backwards compatibility but will be removed in a future major version.
- **CSS import required**: consumers must import `@vlrc-fe/components/stylex.css` or configure `@stylexjs/unplugin`.
- **CVA removed**: `class-variance-authority` is no longer used — variants are now statically typed StyleX records.

### Component Upgrades

- `Button`: all variants and sizes ported to StyleX.
- `Input`, `Textarea`: full pseudo-class and invalid state styling.
- `Badge`: variant styles (`default`, `secondary`, `destructive`, `outline`).
- `Card`: variants (`default`, `glass`, `glass-strong`, `elevated`, `elevated-glass`, `auth`).
- `Dialog`, `AlertDialog`: keyframe animations (`fadeIn`, `scaleIn`).
- `Popover`, `Tooltip`: keyframe scale animations.
- `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `Progress`: atomic StyleX styles.
- `Separator`, `Label`, `Skeleton`, `Spinner`: `stylex.keyframes` pulse and spin.
- `Table`: clean StyleX table layout.
- `DataTable`: toolbar, pagination, view options, row actions, column creators all ported.
- `FormBase`, `Form`: layout, icon adornments, and validation indicators.
- `Modal`, `ConfirmModal`: fully rewritten with glassmorphic and themed containers.
- `Select`, `MultiSelect`: tags, popover menus, and option selectors.
