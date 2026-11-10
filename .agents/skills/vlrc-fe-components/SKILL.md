---
name: vlrc-fe-components
description: Guide and runbook for developing, extending, or utilizing components from @vlrc-fe/components in the VLRC frontend ecosystem. Enforces Meta StyleX conventions, FormBase integrations, DataTable compositions, modal handling, and unified icon registry usage.
---

# `@vlrc-fe/components` Development & Usage Skill

This skill provides step-by-step procedures and specifications for authoring, styling, and consuming components from the `@vlrc-fe/components` package.

---

## 1. Core Principles

1. **Meta StyleX Compile-Time Styling**:
   - All styling is statically extracted at build time by `@stylexjs/unplugin`.
   - Styles are defined with `stylex.create({ ... })` and applied via `{...stylex.props(...)}`.
   - Theme variables are consumed from `tokens.stylex.ts` (`colors`, `radii`, `textColors`).

2. **Component Customization via `sx`**:
   - Every UI component accepts an `sx?: stylex.StyleXStyles` prop for clean, collision-free override styling.
   - For legacy or external class names, components merge `className` onto the compiled StyleX class list.

3. **Mandatory Primitive Reuse**:
   - Always reuse existing layout primitives (`Flex`, `Grid`, `Row`, `Col`) from `src/layout` or `src/ui/flex` with 7-tier spacing tokens (`spacing.xxs` through `spacing.xxl`).
   - Always use `Typography` (`Text`, `Title`, `Paragraph`) with semantic props (`size`, `weight`, `type`) instead of raw `<span>`, `<p>`, `<h1>`-`<h6>`.
   - Never use inline `style={{ ... }}` for static layout or static color properties.

4. **Wrapper-First Form Architecture**:
   - All form controls (`FormInput`, `FormSelect`, `FormMultiSelect`, `FormDatePicker`, `FormNumberInput`, `FormFileUpload`) connect to `react-hook-form` via the `FormBase` wrapper.
   - Forms use RHF's native `rules` prop for validation rules.

5. **Unified Icons Registry**:
   - Icons are accessed via `Icons.<IconName>` (exported from `@vlrc-fe/components/Icons`).
   - Do not import directly from `lucide-react` across consumer applications.

6. **Mobile-First & Responsive Architecture**:
   - Base styles target compact/mobile screens (`min-width: 0`); scale up progressively via StyleX media queries or `useBreakpoint`.
   - Ensure minimum 44×44px touch targets on mobile viewports.
   - Guard against viewport horizontal overflow (`maxWidth: '100%'`, flexible wraps).

7. **Accessibility (WCAG 2.1 AA) by Default**:
   - Built upon Radix UI headless primitives for robust ARIA compliance and keyboard traps/focus management.
   - High-contrast `:focus-visible` rings on all interactive elements using `colors.ring`.
   - Comprehensive keyboard navigation (Tab, Arrow keys, Enter/Space, Esc).
   - Screen reader friendly (aria labels on icon-only buttons, form label association, `role="alert"` for notices).

---

## 2. Common Workflows

### 2.1 Adding a New UI Primitive

1. Create `src/ui/<component-name>.tsx`.
2. Define static styles with `stylex.create(...)` using `colors`, `radii`, and `spacing` from `../theme/tokens.stylex`. Ensure mobile-first style definitions and minimum 44px touch targets.
3. Reuse layout (`Flex`, `Grid`) and `Typography` (`Text`, `Title`) primitives internally.
4. Support `sx?: stylex.StyleXStyles` and optional `className?: string`.
5. Enforce A11y: Include visible `:focus-visible` ring, appropriate ARIA roles/labels, and full keyboard interaction support.
6. Strict TypeScript: **0% `any`**, omit conflicting HTML attributes when extending props.
7. Create Storybook stories in `src/ui/<component-name>.stories.tsx` (including responsive viewport tests).
8. Create Vitest suite in `src/ui/<component-name>.test.tsx` with separate `describe('UI')` and `describe('Behavior')`, `it("should ...")` naming, keyboard interaction tests, and no magic values.
9. Export the component and its prop types in `src/ui/index.ts` and `src/index.ts`.
10. Run `pnpm vitest run src/ui/<component-name>.test.tsx -u` and `pnpm build` to verify tests and `.d.ts` declaration generation.

### 2.2 Adding a New Form Control

1. Implement the field component inside `src/Form/Form<Widget>/`.
2. Wrap the core input widget with `FormBase` to supply label, required indicators, description, and automatic error handling.
3. Export from `src/Form/index.ts` and `src/index.ts`.

---

## 3. Segmented Reference Documentation

For detailed patterns, APIs, and copy-paste examples, refer to:

- **[StyleX Theming & Styling Guide](./references/stylex.md)**: Design tokens, keyframe animations, pseudo-classes, dynamic styles, and variant maps.
- **[Form Containers & FormBase Layouts](./references/forms.md)**: Form context, vertical vs horizontal layouts, and RHF integration.
- **[Custom Form Fields & Inputs API](./references/form-fields.md)**: `FormSelect`, `FormMultiSelect`, `FormDatePicker`, `FormNumberInput`, `FormFileUpload`.
- **[DataTable Composition Guide](./references/datatable.md)**: TanStack Table v8, column creators (`createSelectionColumn`, `createExpanderColumn`, `createRowActionsColumn`).
- **[Modals & Dialogs Specification](./references/modals.md)**: `Modal`, `ConfirmModal`, and `useModalState` patterns.
- **[Unified Icons Registry](./references/icons.md)**: Icons naming, usage, and adding new glyphs.
- **[Accessibility & Responsive Guidelines](./references/a11y-and-responsive.md)**: WCAG 2.1 AA checklist, touch targets, keyboard navigation patterns, and StyleX mobile-first media queries.
