---
name: vlrc-fe-components
description: Guide and runbook for developing, extending, or utilizing components from @vlrc-fe/components (v3.0.0), built natively on Meta's Astryx Design System, Meta StyleX, and Radix UI. Enforces zero magic values, unified design tokens, Astryx MCP & CLI inspection, wrapper architecture, FormBase integrations, and native i18n/RTL.
---

# `@vlrc-fe/components` Development & Usage Runbook (Astryx-Powered)

This skill provides step-by-step procedures, specifications, and conventions for authoring, styling, and consuming components in `@vlrc-fe/components` (v3.0.0), built on Meta's **Astryx Design System** and **Meta StyleX**.

---

## 1. Official Astryx Documentation & MCP Tools

Before writing or editing components, leverage Astryx's official tooling:

- **Astryx Remote MCP**: Connect AI agents to `https://astryx.atmeta.com/mcp` (`search(query)`, `get(name)`).
- **CLI Component Inspection**:
  ```bash
  npx vlrc component <ComponentName> --json
  # or
  npx @astryxdesign/cli@0.7.16 component <ComponentName> --json
  ```
- **Official Documentation Cross-Links**:
  - [Working with AI](https://astryx.atmeta.com/docs/working-with-ai)
  - [Tokens Reference](https://astryx.atmeta.com/docs/tokens)
  - [Component Catalog](https://astryx.atmeta.com/components)
  - [Theming Guide](https://astryx.atmeta.com/docs/theme)
  - [Migration Runbook](http://astryx.atmeta.com/docs/migration)
  - [Component Authoring](https://astryx.atmeta.com/docs/authoring)
  - [GitHub Repository](https://github.com/meta/astryx)

---

## 2. Core Architectural Principles

1. **Astryx Foundation with Wrapper Extension**:
   - Primitive components build on Astryx foundations while retaining VLRC enterprise enhancements:
     - **Typography**: `<Text>`, `<Title>`, `<Paragraph>` provide `copyable` (one-click copy with tooltip), `editable` (inline click-to-edit), `ellipsis` (with automatic tooltip on overflow), `lines`/`rows` multi-line clamp, and margin shorthand props (`m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`).
     - **Layout**: Astryx `<Grid>`, `<Stack>`, `<HStack>`, `<VStack>`, `<Box>`, `<Container>`, `<Center>` for modern layout; preserved `<Row>` & `<Col>` for 24-column grid.
     - **Forms**: Form controls connect to `react-hook-form` via the `FormBase` wrapper.

2. **Zero Magic Values (Strict Token Contract)**:
   - Every color, space, radius, font size, and box shadow MUST come from design tokens:
     - **Colors**: `colors.*` or `--color-surface-*`, `--color-fg-*`, `--color-border-*`. **Zero raw `#hex` or `rgb()` strings**.
     - **Radius**: `radius.*` or `--radius-*` (`none`, `sm: 2px`, `default: 4px`, `md: 6px`, `lg: 8px`, `xl: 12px`, `2xl: 16px`, `full: 9999px`).
     - **Shadows**: `shadow.*` or `--shadow-*` (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`). **Zero hardcoded `box-shadow` strings**.
     - **Spacing**: `spacing.*` or `--spacing-*` (4px grid: `0` to `96` or 7-tier `xxs` through `xxl`).
     - **Motion**: `duration.*` and `easing.*`.

3. **Strict: Zero Raw `<div>` / `<span>`**:
   - Layouts must use `<Stack>`, `<HStack>`, `<VStack>`, `<Box>`, `<Grid>`, `<Row>`, `<Col>`, or `<Flex>`.
   - Text rendering must use `<Text>`, `<Title>`, `<Paragraph>`, `<Link>`, or `<Code>`.

4. **Meta StyleX Compile-Time Styling**:
   - All styling is statically compiled via `@astryxdesign/build/vite` with prefix splitting (`astryx` prefix for library styles in `@layer astryx-base`, `x` for product styles in `@layer product`).
   - Every component exposes `sx?: stylex.StyleXStyles` for clean, collision-free override styling.

5. **Internationalization (i18n) & Multi-Calendar**:
   - Root application wraps with `<InternationalizationProvider locale={...}>`.
   - DatePicker, Calendar, DataTable pagination, FileUpload automatically localize.
   - Built-in RTL text direction and multi-calendar support (Gregorian, Persian, Hebrew, Buddhist, Japanese, Chinese).
   - Coexists with `react-i18next`.

6. **Streamlined Testing Philosophy**:
   - Astryx components are thoroughly tested upstream by Meta.
   - Vitest tests (`*.test.tsx`) strictly target **VLRC-specific wrapper logic, interaction states, form bindings, and responsive math**.
   - Do NOT write duplicate baseline DOM tests.

7. **Zero Consumer UI Dependency Overhead & Subpath Architecture**:
   - All 30+ UI and headless dependencies (`@radix-ui/*`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `lodash-es`, `lucide-react`, `react-day-picker`, `react-number-format`, `react-resizable-panels`, `sonner`, `vaul`, `ahooks`) are packaged in `dependencies` of `@vlrc-fe/components`. Consumer apps do not need to install or manage any UI dependencies; they only install `react` and `react-dom`.
   - **Subpath Exports**: `@vlrc-fe/components` provides optimized enterprise wrappers (372 kB bundle). `@vlrc-fe/components/astryx` provides 100% of Astryx primitives (447+ components, layout, and hooks) on-demand without bloating the consumer's base bundle. Design tokens are at `@vlrc-fe/components/theme`.

---

## 3. Common Workflows

### 3.1 Inspecting Component Contract

```bash
# Get JSON schema for AI consumption
npx vlrc component Button --json

# Read props table
npx vlrc component Button --props
```

### 3.2 Authoring an Astryx-Powered UI Wrapper

1. Create `src/ui/<component-name>.tsx`.
2. Wrap Astryx base primitive (`import { Component as AstryxComponent } from '@astryxdesign/core/Component'`).
3. Define StyleX overrides using `stylex.create(...)` and tokens from `../theme/tokens.stylex`.
4. Layer VLRC features (`copyable`, `editable`, `tooltip`, `sx`, `className`).
5. Export from `src/ui/index.ts` and `src/index.ts`.
6. Add Storybook stories in `src/ui/<component-name>.stories.tsx`.
7. Add focused Vitest test in `src/ui/<component-name>.test.tsx` for VLRC-specific extensions.

### 3.3 Adding a Form Control

1. Implement in `src/Form/Form<Widget>/`.
2. Wrap with `FormBase` to provide labels, error messages, and `react-hook-form` controller bindings.
3. Export from `src/Form/index.ts` and `src/index.ts`.

---

## 4. Segmented Reference Guides

- **[StyleX & Astryx Tokens Reference](./references/stylex.md)**: Token mapping, CSS layers, keyframe animations, pseudo-classes, dynamic styles.
- **[Form Containers & FormBase Layouts](./references/forms.md)**: RHF integration, validation schemas.
- **[Custom Form Fields & Inputs API](./references/form-fields.md)**: Form controls specifications.
- **[DataTable Composition Guide](./references/datatable.md)**: TanStack Table v8 + Astryx virtualized table.
- **[Modals & Dialogs Specification](./references/modals.md)**: `Modal`, `ConfirmModal`, `useModalState`.
- **[Unified Icons Registry](./references/icons.md)**: Lucide icon registry and Astryx `IconProvider`.
- **[Internationalization (i18n) & Calendars](./references/i18n.md)**: `<InternationalizationProvider>`, RTL, calendars.
- **[Accessibility & Responsive Guidelines](./references/a11y-and-responsive.md)**: WCAG 2.1 AA checklist, touch targets, keyboard navigation.
- **[Astryx Architectural Migration Plan](./references/migration-plan.md)**: Target state, token mapping, component matrix, zero magic values audit, and execution log.
