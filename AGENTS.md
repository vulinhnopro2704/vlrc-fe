# VLRC Frontend Monorepo Guidelines

This repository contains reusable frontend packages for the VLRC ecosystem:

- `@vlrc-fe/components`: UI primitive and composite component library built with Meta StyleX and Radix UI.
- `@vlrc-fe/hooks`: Shared React utility hooks.

## Guidelines for Agents

- **Styling**: All component styling uses **Meta StyleX** (`@stylexjs/stylex`). Do not introduce Tailwind classes or runtime CSS-in-JS libraries inside `packages/components`.
- **Theme Tokens**: Use `colors`, `radii`, `spacing`, and `textColors` from `@vlrc-fe/components/theme` (or `../theme/tokens.stylex`). Avoid inline styles (`style={{ ... }}`) for static layout/colors to ensure overrideability via `sx`.
- **Layout & Typography Primitives**: ALWAYS reuse existing primitives to prevent code/style duplication:
  - Layout: `Flex`, `Grid`, `Row`, `Col` from `@vlrc-fe/components/layout` (or `../ui/flex`, `../ui/grid`, `../ui/row-col`) with 7-tier spacing tokens (`xxs` through `xxl`). Avoid ad-hoc manual flex/grid `div`s.
  - Typography: `Text`, `Title`, `Paragraph` from `@vlrc-fe/components/Typography` (or `../Typography`) with semantic props (`size`, `weight`, `type="secondary"`). Avoid raw `<span>`, `<p>`, `<h1>`-`<h6>`.
- **Overrides**: Components accept `sx?: stylex.StyleXStyles` for overrides and maintain backwards-compatible `className` concatenation.
- **TypeScript**: TypeScript 7.x in strict mode with **0% `any`**. Omit conflicting native HTML attributes when defining props (e.g. `Omit<ButtonProps, 'onCopy'>`). All type definition files must be `.ts` (not `.d.ts`) so declarations are emitted to `dist/`.
- **Storybook & Vitest**: Every new or updated component must include:
  - Storybook stories (`*.stories.tsx`) covering default, variants, controlled/uncontrolled usage.
  - Vitest suite (`*.test.tsx`) with strict separation of `describe('UI')` (snapshots) and `describe('Behavior')` (interactions), `it("should ...")` naming, and no magic values.
  - Note: StyleX injects line numbers into `data-style-src` in test snapshots; update snapshots via `-u` after source line changes.
- **Responsive & Mobile-First**: Every component must be built mobile-first:
  - Base styles target compact/mobile viewports; scale up progressively using StyleX media queries or breakpoint hooks (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`).
  - Mobile touch targets must meet the minimum 44×44px interactive requirement.
  - Floating panels, modals, drawers, and data tables must prevent horizontal viewport overflow and gracefully adapt to small screens.
- **Accessibility (A11y)**: Full WCAG 2.1 AA compliance:
  - Ground all complex interactive components on accessible primitives (Radix UI headless primitives).
  - Explicit keyboard navigation (Tab, Enter/Space, Esc, Arrows) and visible `:focus-visible` focus rings using design tokens (`colors.ring`).
  - Full ARIA semantics (`aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-controls`, `aria-invalid`).
  - Support `prefers-reduced-motion` for animations and transitions, and respect minimum 4.5:1 text color contrast.
- **Builds**: Run `pnpm build` (`pnpm build:packages`) to verify both Vite bundling and `tsc` declaration emissions.
- Detailed rules and references are located in [`.agents/rules/code-conventions.md`](file:///.agents/rules/code-conventions.md) and [`.agents/skills/vlrc-fe-components/`](file:///.agents/skills/vlrc-fe-components/).
