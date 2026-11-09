# Code Conventions & Rules for `@vlrc-fe` Monorepo

## 1. Architecture & Packages

- `packages/components` (`@vlrc-fe/components`): Reusable UI primitives and composite widgets powered by **Meta StyleX** and **Radix UI**.
- `packages/hooks` (`@vlrc-fe/hooks`): Reusable standalone React hooks.
- Bundler & Tooling: **Vite**, **TypeScript 7.x**, **React 19.x**, **Rolldown/Babel** (React Compiler), **Vitest**.

---

## 2. Styling Rules (Meta StyleX)

1. **Zero Tailwind in Packages**:
   - Do NOT write Tailwind CSS utility class strings inside package components.
   - All styling must use `@stylexjs/stylex` with `stylex.create(...)` and `stylex.props(...)`.

2. **Design Tokens**:
   - Always import theme tokens from `../theme/tokens.stylex` (`colors`, `radii`, `spacing`, `textColors`).
   - All tokens map directly to CSS custom properties (`var(--primary)`, `var(--background)`, `var(--radius)`, `var(--spacing-md)`, etc.) to preserve multi-theme capability (`light`, `dark`, `pink`, `lavender`).

3. **Component Props & Overrides**:
   - Expose `sx?: stylex.StyleXStyles` for custom StyleX overrides.
   - Merge `className` for transition compatibility using:
     ```tsx
     const sxProps = stylex.props(styles.base, sx);
     const mergedClassName = className
       ? `${sxProps.className || ''} ${className}`.trim()
       : sxProps.className;
     ```
   - Do NOT override `style?: React.CSSProperties` with StyleX styles to avoid TS2430 type collision with standard HTML attributes.

4. **Static Compilation Constraints & Inline Style Restrictions**:
   - Never pass inline dynamic objects directly into `stylex.props(...)`. All `stylex.create(...)` style maps must be statically evaluable at build time.
   - Restrict `style={{ ... }}` strictly to unavoidable dynamic values (e.g. calculated SVG stroke dashoffset, percentage clip width, dynamic CSS variables). Never use `style={{ ... }}` for static layout or static color properties.

---

## 3. Mandatory Layout & Typography Primitive Reuse

To eliminate duplicate styling code and maintain design consistency across the repository:

1. **Layout Primitives**:
   - ALWAYS use `Flex`, `Grid`, `Row`, `Col` from `@vlrc-fe/components/layout` (or `../ui/flex`, `../ui/grid`, `../ui/row-col`) instead of crafting manual `div` flex/grid wrappers.
   - Use the 7-tier gap token scale (`xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`) via the `gap` prop on `Flex` and `Grid`.
   - Pass custom StyleX rules to `Flex` / `Grid` through their `sx` prop: `<Flex vertical align="center" sx={[styles.root, sx]}>`.

2. **Typography Primitives**:
   - ALWAYS use `Text`, `Title`, `Paragraph` from `@vlrc-fe/components/Typography` (or `../Typography`) for all text rendering.
   - Do NOT use raw `<span>`, `<p>`, `<h1>`-`<h6>` tags for content text or labels.
   - Leverage semantic props:
     - `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'`
     - `weight`: `'normal' | 'medium' | 'semibold' | 'bold'`
     - `type`: `'secondary' | 'success' | 'warning' | 'danger'`

---

## 4. TypeScript & React 19 Conventions

1. **Explicit Typing & Zero `any`**:
   - Strict TypeScript: **0% `any`**. Use `unknown` with type guards or generics if dynamic.
   - When extending HTML attributes or other component props that collide with custom callbacks or types, explicitly omit the colliding property:
     - E.g., `interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'onCopy'>`
     - E.g., `interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>`

2. **Declaration Files**:
   - All source type definitions must be placed in `.ts` files (e.g., `types.ts`, `type.ts`), NOT `.d.ts` files, so `tsc` emits corresponding declarations into `dist/`.

3. **Import Hygiene in Packages**:
   - Use explicit relative imports (`import ... from '../ui/button'`) within package source.
   - Packages are compiled independently via `tsc -p tsconfig.json`.
   - Re-export all public components and types in `src/ui/index.ts` and `src/index.ts`.

---

## 5. Testing & Storybook Quality Standards

1. **Vitest Unit & Integration Tests (`*.test.tsx`)**:
   - Strict test separation:
     - `describe('UI')`: Snapshot tests covering default states, disabled/readonly states, and visual variants.
     - `describe('Behavior')`: User interactions, clicks, keyboard navigation, and callback triggers.
   - Test naming: Always use `it("should ...")`.
   - Eliminate magic numbers and strings: Extract test values into properly scoped constants at the top of the test file.
   - In dev/test mode, `@stylexjs/unplugin` embeds source line numbers into DOM attributes (`data-style-src`). If source file lines change, update snapshots using `pnpm vitest run <file> -u`.

2. **Storybook Documentation (`*.stories.tsx`)**:
   - Every UI component must have a corresponding Storybook file.
   - Include `Default`, `Sizes` / `Variants`, `Controlled` vs `Uncontrolled`, and real-world composition stories.
   - Add `tags: ['autodocs']` and interactive `argTypes` controls.

---

## 6. Component Authoring Standards

1. **Accessibility**:
   - Maintain full ARIA accessibility by extending Radix UI headless primitives whenever possible.
   - Implement keyboard navigation for interactive widgets (arrows, Home, End, Enter, Escape).
2. **Form Integration**:
   - Form controls must integrate through `FormBase` and accept `control`, `name`, `rules`, and optional `label`/`description`.
3. **Icons**:
   - Consumer applications must use `Icons.<Name>` from `@vlrc-fe/components/Icons`.
   - Direct `lucide-react` imports are reserved for package internal primitives.
