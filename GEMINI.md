<!-- ASTRYX:START -->

@./AGENTS.md
<!-- ASTRYX:END -->

# Additional Context for Antigravity & Gemini CLI Agents

- **Component Library**: `@vlrc-fe/components` (v3.0.0), built on Meta's Astryx design system and Meta StyleX.
- **Subpath Exports**: `@vlrc-fe/components` for enterprise wrappers; `@vlrc-fe/components/astryx` for 100% of Meta's Astryx primitives (447+ components, layout, and hooks) without bundle penalty; `@vlrc-fe/components/theme` for tokens.
- **Zero UI Dependency Burden**: All UI dependencies are bundled internally; consumer apps only install `react` and `react-dom`.
- **Astryx MCP Server**: Remote endpoint at `https://astryx.atmeta.com/mcp` (query via MCP tools: `search(query)`, `get(name)`).
- **Astryx CLI**: Run `npx vlrc component <ComponentName> --json` or `npx @astryxdesign/cli@0.7.16 component <ComponentName> --json` using `run_command` to inspect exact props and variants before writing code.
- **Zero Raw Divs/Spans/Buttons**: Never use `<div>`, `<span>`, `<button>`, `<p>`, `<h1>`-`<h6>` directly. Always use layout primitives (`Stack`, `HStack`, `VStack`, `Grid`, `Row`, `Col`, `Box`, `Container`, `Center`, `Flex`), typography primitives (`Text`, `Title`, `Paragraph`, `Link`, `Code`, `CodeBlock`, `Heading`), and `<Button>` from `@vlrc-fe/components`.
- **Zero Redundant / Improper Polymorphic Overrides**: `<Text>` renders `<span>` by default (NEVER use `as="span"`). Never use `<Box as="span">` (use `<Text>`), never use `<Text as="p">` (use `<Paragraph>`), never use `<Text as="h1-6">` (use `<Title level={...}>`).
- **Zero DOM Nesting Violations**: Never nest `<button>` inside `<button>`. For composite triggers with action buttons (e.g. DatePicker), structure the wrapper as `<Flex>` with sibling `<Button>` elements.
- **Modern srOnly**: Always use `clipPath: 'inset(50%)'` for visually hidden styles; never use deprecated `clip: 'rect(0, 0, 0, 0)'`.
- **Zero Magic Values**: All colors, spaces, radii, and shadows must strictly come from design tokens (`colors.*`, `spacing.*`, `radius.*`, `shadow.*`, `duration.*`, `easing.*`).
- **Internationalization**: Use `<InternationalizationProvider locale={locale}>`.
