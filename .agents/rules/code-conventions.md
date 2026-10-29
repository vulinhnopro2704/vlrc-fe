# Code Conventions & Rules for `@vlrc-fe` Monorepo

## 1. Architecture & Packages

- `packages/components` (`@vlrc-fe/components`): Reusable UI primitives and composite widgets powered by **Meta StyleX** and **Radix UI**.
- `packages/hooks` (`@vlrc-fe/hooks`): Reusable standalone React hooks.
- Bundler & Tooling: **Vite**, **TypeScript 7.x**, **React 19.x**, **Rolldown/Babel** (React Compiler).

---

## 2. Styling Rules (Meta StyleX)

1. **Zero Tailwind in Packages**:
   - Do NOT write Tailwind CSS utility class strings inside package components.
   - All styling must use `@stylexjs/stylex` with `stylex.create(...)` and `stylex.props(...)`.

2. **Design Tokens**:
   - Always import theme tokens from `../theme/tokens.stylex` (`colors`, `radii`, `textColors`).
   - All tokens map directly to CSS custom properties (`var(--primary)`, `var(--background)`, `var(--radius)`, etc.) to preserve multi-theme capability (`light`, `dark`, `pink`, `lavender`).

3. **Component Props & Overrides**:
   - Expose `sx?: stylex.StyleXStyles` for custom StyleX overrides.
   - Merge `className` for transition compatibility using:
     ```tsx
     const sxProps = stylex.props(styles.base, sx);
     const mergedClassName = className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className;
     ```
   - Do NOT override `style?: React.CSSProperties` with StyleX styles to avoid TS2430 type collision with standard HTML attributes.

4. **Static Compilation Constraints**:
   - Never pass inline dynamic objects directly into `stylex.props(...)`. All `stylex.create(...)` style maps must be statically evaluable at build time.
   - Dynamic values (e.g. custom hex colors or calculated dimensions) must be passed via native `style={{ ... }}`.

---

## 3. TypeScript & React 19 Conventions

1. **Explicit Typing**:
   - Component props must be typed explicitly with interfaces or types.
   - Generic form field components (e.g., `FormSelect`) must provide sensible defaults (e.g. `TFieldValues extends FieldValues = FieldValues`).

2. **Declaration Files**:
   - All source type definitions must be placed in `.ts` files (e.g., `types.ts`, `type.ts`), NOT `.d.ts` files, so `tsc` emits corresponding declarations into `dist/`.

3. **Import Hygiene in Packages**:
   - Never rely on auto-imports inside `packages/components` or `packages/hooks`. Always use explicit relative imports (`import ... from '../ui/button'`).
   - Packages are compiled independently via `tsc -p tsconfig.json`.

---

## 4. Component Authoring Standards

1. **Accessibility**:
   - Maintain full ARIA accessibility by extending Radix UI headless primitives whenever possible.
2. **Form Integration**:
   - Form controls must integrate through `FormBase` and accept `control`, `name`, `rules`, and optional `label`/`description`.
3. **Icons**:
   - Do not import directly from `lucide-react` across consumer apps; use `Icons.<Name>` from `@vlrc-fe/components/Icons`.
