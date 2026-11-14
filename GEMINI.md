<!-- ASTRYX:START -->

@./AGENTS.md
<!-- ASTRYX:END -->

# Additional Context for Antigravity & Gemini CLI Agents

- **Component Library**: `@vlrc-fe/components` (v3.0.0), built on Meta's Astryx design system and Meta StyleX.
- **Subpath Exports**: `@vlrc-fe/components` for enterprise wrappers; `@vlrc-fe/components/astryx` for 100% of Meta's Astryx primitives (447+ components, layout, and hooks) without bundle penalty; `@vlrc-fe/components/theme` for tokens.
- **Zero UI Dependency Burden**: All UI dependencies are bundled internally; consumer apps only install `react` and `react-dom`.
- **Astryx MCP Server**: Remote endpoint at `https://astryx.atmeta.com/mcp` (query via MCP tools: `search(query)`, `get(name)`).
- **Astryx CLI**: Run `npx vlrc component <ComponentName> --json` or `npx @astryxdesign/cli@0.7.16 component <ComponentName> --json` using `run_command` to inspect exact props and variants before writing code.
- **Zero Raw Divs/Spans**: Never use `<div>` or `<span>` directly for layout or text. Always use layout primitives (`Stack`, `HStack`, `VStack`, `Grid`, `Row`, `Col`, `Box`, `Container`, `Center`, `Flex`) and typography primitives (`Text`, `Title`, `Paragraph`, `Link`, `Code`, `CodeBlock`, `Heading`).
- **Zero Magic Values**: All colors, spaces, radii, and shadows must strictly come from design tokens (`colors.*`, `spacing.*`, `radius.*`, `shadow.*`, `duration.*`, `easing.*`).
- **Internationalization**: Use `<InternationalizationProvider locale={locale}>`.
