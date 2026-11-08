# Changelog

## 2.2.0

### Minor Changes

- 2b75d53: - Added `weight` prop with strongly-typed font weights (`thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`, etc.) across all Typography components (`Text`, `Title`, `Paragraph`, `Link`, `Blockquote`, `Code`).
  - Added configurable `width` prop across `Button`, `Input`, `Select`, `Textarea`, `Field`, `FormItem`, `FormBase`, `MultiSelect`, `FormNumberInput`, and `FormDatePicker` with semantic preset autocomplete (`xs`, `sm`, `md`, `lg`, `xl`, `full`, `auto`, etc.) while supporting numbers (px) and arbitrary CSS strings.

All notable changes to `@vlrc-fe/components` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [2.1.4] - 2026-11-08

### Added

- **Form Controls Full HTML Props**: `FormInput`, `FormTextarea`, `FormCheckbox`, and `FormSwitch` now inherit and forward all native HTML and component props directly without requiring manual `FormField` boilerplate.
- **FormSwitch**: exported `FormSwitch` form control component integrated with React Hook Form.
- **HTML Collision Aliasing**: added `htmlSize` on `Input` / `FormInput` for conflicting native HTML `<input size={number}>` attribute, and `htmlType` on `Button` / `Input` for button and input types.
- **Wrapper and Element ClassNames**: added `wrapperClassName`, `inputClassName`, `textareaClassName`, `checkboxClassName`, and `switchClassName` to form controls for clear styling separation.

## [2.1.3] - 2026-11-08

### Fixed

- **FormTextarea Type Definition**: updated `FormTextarea` to accept `TextareaProps` (`placeholder`, `rows`, `cols`, etc.) and loosened `FormControlFunc` generic constraint.

## [2.1.2] - 2026-11-08

### Added

- **Typography Component Suite**: introduced comprehensive typographic primitives (`Title`, `Text`, `Paragraph`, `Blockquote`, `Link`, `Code`, `Kbd`) with full Meta StyleX semantic styling, color variants, weights, sizes, and truncation support.
- **Enhanced FileUpload Ecosystem**:
  - Pre-built layout variants (`avatar`, `compact`, `card`, `dropzone`) in `FileUpload` and `FormFileUpload`.
  - Custom upload adapters (`createApiUploadHandler`, `createS3UploadHandler`, `createCloudinaryUploadHandler`) for seamless direct storage integration.
  - Primitive composable components: `FileUploadDropzone`, `FileUploadList`, `FileUploadItem`, `FileUploadItemPreview`, `FileUploadItemMetadata`, `FileUploadItemProgress`, `FileUploadItemDelete`, `FileUploadClear`.
  - Automatic and manual upload workflows with progress tracking, cancellation, and validation.
- **Storybook Component Stories**: added interactive Storybook stories (`*.stories.tsx`) across UI primitives and form controls.
- **Unit and Snapshot Test Coverage**: added test suites for `Typography`, `Accordion`, `Command`, `DropdownMenu`, `Tabs`, `Toggle`, `FileUpload`, and upload adapters.

### Changed

- **UI Component Refinements**: enhanced `ConfirmModal`, `DataTable`, `Button`, `Input`, `Textarea`, `Checkbox`, `Switch`, `DropdownMenu`, `Sheet`, `Drawer`, `Tabs`, `Toggle`, `ToggleGroup`, `Command`, `Breadcrumb`, `Accordion`, and `InputOTP` with atomic StyleX tokens and theme variables.

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
