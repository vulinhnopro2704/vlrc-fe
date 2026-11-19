# Changelog

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
