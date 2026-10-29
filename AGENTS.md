# VLRC Frontend Monorepo Guidelines

This repository contains reusable frontend packages for the VLRC ecosystem:
- `@vlrc-fe/components`: UI primitive and composite component library built with Meta StyleX and Radix UI.
- `@vlrc-fe/hooks`: Shared React utility hooks.

## Guidelines for Agents

- **Styling**: All component styling uses **Meta StyleX** (`@stylexjs/stylex`). Do not introduce Tailwind classes or runtime CSS-in-JS libraries inside `packages/components`.
- **Theme Tokens**: Use `colors`, `radii`, and `textColors` from `@vlrc-fe/components/theme` (or `../theme/tokens.stylex`).
- **Overrides**: Components accept `sx?: stylex.StyleXStyles` for overrides and maintain backwards-compatible `className` concatenation.
- **TypeScript**: TypeScript 7.x in strict mode. All type definition files must be `.ts` (not `.d.ts`) so declarations are emitted to `dist/`.
- **Builds**: Run `pnpm build` (`pnpm build:packages`) to verify both Vite bundling and `tsc` declaration emissions.
- Detailed rules and references are located in [`.agents/rules/code-conventions.md`](file:///.agents/rules/code-conventions.md) and [`.agents/skills/vlrc-fe-components/`](file:///.agents/skills/vlrc-fe-components/).
