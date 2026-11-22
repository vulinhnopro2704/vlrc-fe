# Changelog

## 1.1.0

### Minor Changes

- # Release 2026-11 Suite

  ### @vlrc-fe/components (3.1.0)
  - **Tag**: Added `<Tag>` primitive with color token mapping, closable actions, prefix icons, and interactive support.
  - **JiraIcons**: Added Jira work types (`IssueIcon`, `JiraWorkType`) and priority levels (`PriorityIcon`, `JiraPriority`).
  - **Input & Select**: Added `allowClear` prop with accessible clear trigger button and automatic focus restore.
  - **Tabs**: Added Ant Design compatible `items` configuration array (`{ key, label, children, icon, disabled, closable }[]`).
  - **Empty / EmptyState**: Added `EmptyState` and `EmptyStateProps` aliases for compatibility with ProjectHub.
  - **Tokens**: Added `colorSuccess`, `colorWarning`, and `colorSurfaceHover` aliases to `tokens`.
  - **Bug Fixes**: Resolved button nesting in DatePicker triggers, improved typography semantics, and fixed contrast in Tabs.

  ### @vlrc-fe/editor (1.1.0)
  - **Notion Toggle Headings**: Added Notion-style collapsible toggle heading suite (`CollapsibleContainerNode`, `CollapsibleTitleNode`, `CollapsibleContentNode`, `CollapsiblePlugin`) with keyboard navigation and boundary management.
  - **Slash Menu**: Fixed keyboard navigation order and focus management on insertion.
  - **Markdown**: Improved table markdown serialization and block handling.

  ### @vlrc-fe/hooks (1.3.0)
  - **ahooks Re-exports**: Re-exported standardized React utility hooks from `ahooks` (`useToggle`, `useBoolean`, `useDebounce`, `useClickAway`, `useClickOutside`, `usePrevious`, `useMount`, `useUnmount`, `useUpdateEffect`, `useSetState`).

  ### @vlrc-fe/http (1.0.1)
  - **Publish Metadata**: Added complete package metadata, npm publish config, and comprehensive documentation for Ky-based typed HTTP client.

  ### @vlrc-fe/i18n (1.0.1)
  - **Publish Metadata**: Added complete package metadata, npm publish config, and documentation for standardized i18n instance factory and React hooks.

  ### @vlrc-fe/store (1.0.1)
  - **Publish Metadata**: Added complete package metadata, npm publish config, and documentation for Zustand v5 store wrapper with auto-selectors and persistence.

  ### @vlrc-fe/types (1.0.1)
  - **Publish Metadata**: Added complete package metadata, npm publish config, and documentation for common base entities, pagination models, and enums.

### Patch Changes

- Updated dependencies
  - @vlrc-fe/components@3.1.0

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
