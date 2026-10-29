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

3. **Wrapper-First Form Architecture**:
   - All form controls (`FormInput`, `FormSelect`, `FormMultiSelect`, `FormDatePicker`, `FormNumberInput`, `FormFileUpload`) connect to `react-hook-form` via the `FormBase` wrapper.
   - Forms use RHF's native `rules` prop for validation rules.

4. **Unified Icons Registry**:
   - Icons are accessed via `Icons.<IconName>` (exported from `@vlrc-fe/components/Icons`).
   - Do not import directly from `lucide-react` across consumer applications.

---

## 2. Common Workflows

### 2.1 Adding a New UI Primitive
1. Create `src/ui/<component-name>.tsx`.
2. Define static styles with `stylex.create(...)` using `colors` and `radii` from `../theme/tokens.stylex`.
3. Support `sx?: stylex.StyleXStyles` and optional `className?: string`.
4. Export the component in `src/ui/index.ts` and `src/index.ts`.
5. Run `pnpm build` to verify both JS/CJS output and `.d.ts` generation.

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
