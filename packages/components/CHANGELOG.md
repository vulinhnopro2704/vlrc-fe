# Changelog

All notable changes to `@vlrc-fe/components` will be documented in this file.

## [2.0.1] - StyleX Engine Migration (Meta StyleX & CSS-in-JS)

### 🚀 Major Highlights
- **Replaced Tailwind CSS with Meta StyleX**: Transitioned from runtime utility class string concatenation (`tailwind-merge`, `clsx`, `class-variance-authority`) to compile-time atomic CSS-in-JS powered by Meta StyleX.
- **Zero Runtime Style Injections**: All styles are parsed at build-time using `@stylexjs/unplugin` and emitted into `dist/assets/stylex.css` using CSS `@layer` priorities.
- **Deterministic Specificity**: Eliminated CSS precedence issues and class collision bugs. The last style passed in `stylex.props(...)` deterministically wins without needing `!important`.
- **Theme Preservation**: Created `theme/tokens.stylex.ts` using `stylex.defineVars()`, binding directly to existing CSS custom properties (`--background`, `--primary`, `--card`, etc.). All dynamic themes (`light`, `dark`, `pink`, `lavender`) in the consumer project (`vlrc`) remain 100% compatible.
- **Modern UI Primitive Foundation**: Aligned with the [shadcn-cssinjs](https://www.shadcn-cssinjs.com/) ecosystem, maintaining full Radix UI headless accessibility while replacing Tailwind class strings with StyleX style definitions.

### ⚠️ Breaking Changes & API Updates
- **`sx` Prop Introduced**: Components now accept `sx?: stylex.StyleXStyles` for deterministic type-safe styling.
- **Backward Compatibility**: `className` is still accepted and merged with StyleX atomic classes during the transition, but is deprecated in favor of `sx`.
- **CSS Import Required in Consumer App**: Consumers must import `@vlrc-fe/components/stylex.css` or configure `@stylexjs/unplugin` in their bundler.
- **Removal of CVA**: `class-variance-authority` is deprecated; component variants are now statically typed StyleX records.

### 📦 Component Upgrades
- `Button`: Ported with all variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `accent`, `accent-cta`, `gradient`, `gradient-success`) and sizes (`default`, `sm`, `lg`, `xl`, `2xl`, `icon`, `icon-sm`, `icon-lg`).
- `Input` & `Textarea`: Ported with full pseudo-class and invalid state styling.
- `Badge`: Ported with variant styles (`default`, `secondary`, `destructive`, `outline`).
- `Card`: Ported with variants (`default`, `glass`, `glass-strong`, `elevated`, `elevated-glass`, `auth`).
- `Dialog` & `AlertDialog`: Ported with smooth keyframe animations (`fadeIn`, `scaleIn`) and modal layouts.
- `Popover` & `Tooltip`: Ported with keyframe scale animations.
- `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `Progress`: Ported to atomic StyleX styles.
- `Separator`, `Label`, `Skeleton`, `Spinner`: Ported with `stylex.keyframes` pulse and spin.
- `Table`: Ported to clean StyleX table layout.
- `DataTable`: Upgraded `DataTableToolbar`, `DataTablePagination`, `DataTableViewOptions`, `DataTableRowActions`, `createColumns`, and `defaults` to StyleX.
- `FormBase` & `Form`: Upgraded layout, icon adornments, and validation indicators to StyleX.
- `Modal` & `ConfirmModal`: Fully rewritten in StyleX with glassmorphic and themed alert containers.
- `Select` & `MultiSelect`: Ported tags, popover menus, and option selectors to StyleX.
