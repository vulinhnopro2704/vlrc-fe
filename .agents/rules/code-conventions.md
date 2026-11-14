# Code Conventions & Rules for `@vlrc-fe` Monorepo

## 1. Architecture & Packages

- `packages/components` (`@vlrc-fe/components` v3.0.0): Reusable UI primitives and composite widgets built natively on **Meta Astryx Design System**, **Meta StyleX**, and **Radix UI**.
- `packages/hooks` (`@vlrc-fe/hooks`): Reusable standalone React utility hooks.
- Bundler & Tooling: **Vite**, **TypeScript 7.x**, **React 19.x**, **@astryxdesign/build/vite** (StyleX prefix splitting), **Vitest**.
- AI Operating System: **Astryx Remote MCP** (`https://astryx.atmeta.com/mcp`) and **Astryx CLI** (`npx vlrc component <Name> --json`).

---

## 2. Styling Rules (Meta StyleX & Astryx Tokens)

1. **Zero Tailwind & Zero CSS-in-JS Runtime**:
   - Do NOT write Tailwind CSS utility class strings or runtime CSS-in-JS inside package source.
   - All styling must use `@stylexjs/stylex` with `stylex.create(...)` and `stylex.props(...)`.
   - The Vite bundler employs `@astryxdesign/build/vite` with prefix splitting (`astryx` prefix for library code into `@layer astryx-base`, `x` prefix for application code into `@layer product`).

2. **Unified Design Tokens (ZERO MAGIC VALUES)**:
   - Always import theme tokens from `../theme/tokens.stylex` (`colors`, `radius`, `spacing`, `shadow`, `textColors`, `duration`, `easing`).
   - Every color, margin, padding, border radius, and box shadow MUST reference a token or CSS custom property:
     - **Colors**: `colors.*` or `--color-surface-*`, `--color-fg-*`, `--color-border-*`. **Zero `#hex` or `rgb()` literals**.
     - **Radius**: `radius.*` or `--radius-*` (`none`, `sm: 2px`, `default: 4px`, `md: 6px`, `lg: 8px`, `xl: 12px`, `2xl: 16px`, `3xl: 24px`, `full`).
     - **Shadows**: `shadow.*` or `--shadow-*` (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`). **Zero hardcoded `box-shadow` strings**.
     - **Spacing**: `spacing.*` or `--spacing-*` (numeric 4px grid steps `0` through `96`, or 7-tier scale `xxs` through `xxl`).
     - **Motion**: `duration.*` (`fast`, `normal`, `slow`) and `easing.*`.

3. **Component Props & Overrides**:
   - Expose `sx?: stylex.StyleXStyles` for custom StyleX overrides.
   - Merge `className` cleanly:
     ```tsx
     const sxProps = stylex.props(styles.base, sx);
     const mergedClassName = className
       ? `${sxProps.className || ''} ${className}`.trim()
       : sxProps.className;
     ```
   - Do NOT override `style?: React.CSSProperties` with StyleX objects.

4. **Static Compilation Constraints & Inline Style Restrictions**:
   - Never pass inline dynamic objects directly into `stylex.props(...)`. All `stylex.create(...)` definitions must be statically evaluable at build time.
   - Restrict `style={{ ... }}` strictly to dynamic values (e.g. calculated SVG stroke dashoffset, percentage clip width, dynamic runtime positions).

---

## 3. Mandatory Layout & Typography Primitive Reuse (Strict: Zero Raw `<div>` / `<span>`)

1. **Layout Primitives**:
   - NEVER create manual `div` wrappers for layout, alignment, or spacing:
     - **Vertical Stacks**: `<VStack>` or `<Stack direction="vertical">`
     - **Horizontal Stacks**: `<HStack align="center" gap="md">`
     - **CSS Grid**: `<Grid columns={3} gap="md">` (Astryx CSS Grid engine)
     - **24-Column Responsive Grid**: `<Row gutter={[16, 16]}><Col span={12} xs={24}>...</Col></Row>`
     - **Generic Container**: `<Box as="section" padding="md">` (polymorphic container)
     - **Centered Container**: `<Container>` and `<Center>`
     - **Flex Layout**: `<Flex>`
   - Pass custom StyleX rules through the `sx` prop: `<VStack sx={[styles.root, sx]}>`.

2. **Typography Primitives**:
   - NEVER use raw `<span>`, `<p>`, or `<h1>`-`<h6>` tags.
   - ALWAYS use `<Text>`, `<Title>`, `<Paragraph>`, `<Link>`, and `<Code>` from `@vlrc-fe/components/Typography`.
   - Leverage built-in wrapper features:
     - `copyable`: Automatic one-click copy with tooltip feedback.
     - `editable`: Inline click-to-edit with validation.
     - `ellipsis`: Automatic text truncation with tooltip on overflow.
     - `lines` / `rows`: Multi-line clamp using tokens.
     - Margin shorthands: `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`.

---

## 4. Astryx MCP & CLI Inspection Protocol

Before writing or editing any component code:

1. **MCP Query**: Query `astryx.get("<ComponentName>")` via the remote MCP server (`https://astryx.atmeta.com/mcp`) to verify supported props, variants (`primary`, `subtle`, `outline`, `ghost`), and tones (`info`, `success`, `warning`, `danger`, `neutral`).
2. **CLI Inspection**:
   ```bash
   npx vlrc component <ComponentName> --json
   # or
   npx @astryxdesign/cli@0.7.16 component <ComponentName> --props
   ```
   Ensures 100% adherence to prop contracts without hallucinations.

---

## 5. TypeScript & React 19 Conventions

1. **Explicit Typing & Zero `any`**:
   - Strict TypeScript: **0% `any`**. Use `unknown` with type guards or generics if dynamic.
   - Re-export all Astryx base types from `@vlrc-fe/components`.
   - Explicitly omit conflicting native props when extending interfaces (e.g. `interface ButtonProps extends Omit<AstryxButtonProps, '...'>`).

2. **Declaration Files**:
   - All source type definitions must be placed in `.ts` files, NOT `.d.ts` files, so `tsc` emits corresponding declarations into `dist/`.

3. **CSS Cascade Layer Order**:
   - Entry CSS must strictly declare:
     ```css
     @layer reset, astryx-base, astryx-theme, product;
     ```

---

## 6. Testing & Storybook Quality Standards

1. **Vitest Unit & Integration Tests (`*.test.tsx`)**:
   - **Streamlined Tests**: Baseline component rendering, default CSS, and browser HTML behaviors are already comprehensively tested by Meta's Astryx test suites.
   - **DO NOT write redundant tests for basic Astryx behaviors**.
   - **ONLY test VLRC-specific wrapper logic**:
     - `copyable` clipboard actions and tooltips.
     - `editable` input transitions and save callbacks.
     - `ellipsis` overflow threshold triggers.
     - Form binders (`FormBase` integration with `react-hook-form`).
     - Gutter math and responsive breakpoint calculations in `<Row>` and `<Col>`.
   - Always name tests with `it("should ...")`.
   - Never use magic test values; extract constants at top of test files.

2. **Storybook Documentation (`*.stories.tsx`)**:
   - Every UI component must have a corresponding Storybook file.
   - Include `Default`, `Sizes` / `Variants`, `Controlled` vs `Uncontrolled`, and real-world composition stories.
   - Add `tags: ['autodocs']` and interactive `argTypes` controls.

---

## 7. Internationalization (i18n) & Accessibility (A11y)

1. **i18n & Multi-Calendar**:
   - Components wrap with `<InternationalizationProvider locale={...}>`.
   - Astryx components automatically resolve their internal UI strings.
   - Coexists with `react-i18next` for application strings.
   - Supports RTL text direction and multiple calendar systems (Gregorian, Persian, Hebrew, Buddhist, Japanese, Chinese).

2. **Accessibility (WCAG 2.1 AA)**:
   - Ground all interactive components on Astryx & Radix headless primitives.
   - Implement keyboard navigation (arrows, Enter, Space, Escape, Tab).
   - Ensure visible `:focus-visible` focus rings using design tokens (`colors.ring` / `--color-focus-ring`).
   - Mobile interactive touch targets must meet the minimum 44×44px standard.
