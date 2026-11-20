# Changelog

## [1.0.1] - 2026-11-20

### Patch Changes

- **Slash Menu Enhancements & Overflow Fixes**:
  - Migrated Slash Menu to `createPortal(..., document.body)` with anchored fixed coordinates, eliminating clipping by parent scroll containers.
  - Added auto-flip and collision detection against viewport boundaries with modern CSS Anchor Positioning (`positionArea`, `positionTryFallbacks`) and fallback rect calculation.
  - Implemented keyboard navigation auto-scroll (`scrollIntoView({ block: 'nearest' })`) when cycling options via ArrowDown and ArrowUp.
  - Grouped commands into "Basic blocks" and "Media & embeds" with cohesive Astryx surface and border tokens.
- **Enterprise Dialogs Integration**:
  - Integrated `InsertMediaDialog` for web images with captions, interactive YouTube video embeds, and Figma design embeds.
  - Integrated `InsertLinkDialog` for wrapping text selections in hyperlinks.
  - Consumes standard `@vlrc-fe/components` UI primitives (`Dialog`, `Button`, `Input`, `Label`, `Checkbox`, `Text`, `VStack`, `HStack`) ensuring zero UI divergence.

## [1.0.0] - 2026-11-19

### Initial Release

- **Notion-Style Block & Markdown Editor (`@vlrc-fe/editor`)**:
  - Built natively on Meta Lexical (`@lexical/react`), Meta StyleX, and Astryx tokens.
  - **Full Table Management Suite**:
    - `InsertTableDialog`: Accessible modal dialog for custom rows, columns, and header toggles.
    - `TableActionMenuPlugin`: Floating cell dropdown for row/column insertion, deletion, header toggles, cell unmerging, and cell background color palette.
    - `TableCellResizerPlugin`: Interactive drag handles for column width and row height resizing.
    - `TableHoverActionsPlugin`: Floating quick "+" buttons on table cell borders for fast single-click row and column addition.
  - **Notion-Style Slash Commands (`/`)**: 12+ block options (Headings, Lists, Quotes, Code Blocks, Callouts, Tables, Images, YouTube & Figma embeds).
  - **Floating Selection Bubble Toolbar**: Quick inline formatting for text selections.
  - **Draggable Blocks**: Left gutter drag handle for block reordering.
  - **Syntax Highlighting & AST TreeView**: Integrated Prism code highlighting and live AST inspector.
