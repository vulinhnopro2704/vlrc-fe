# @vlrc-fe/http

## 1.1.0

### Minor Changes

- ### @vlrc-fe/http
  - **App API Client (`createAppApiClient`)**: Added standardized cookie-auth HTTP client factory with single-flight refresh token queue, per-request retry options preservation, automatic `FormData` `Content-Type` handling, and `auth:unauthorized` event dispatch.
  - **Error Normalization**: Added `AppApiError`, `normalizeApiErrorResponse`, `isApiErrorResponse`, `getDefaultErrorMessageByStatus`, and `DEFAULT_ERROR_CODE_BY_STATUS`.
  - **Auth Route Utilities**: Added `DEFAULT_AUTH_ROUTE_PATHS`, `DEFAULT_AUTH_API_PATHS`, `isAuthRoutePath`, `shouldRedirectToLogin`, and `subscribeUnauthorized` to prevent login redirect loops.

  ### @vlrc-fe/components
  - **FilterPopup**: Added new `FilterPopup` component.
  - **DataTable, Form, Select, UI & Theme**: Updated `DataTable`, `Form`, `BaseSelect`, `Icons`, `Button`, `Checkbox`, `Popover`, `ScrollArea`, and `theme.css` / `tokens.stylex.ts`.

  ### @vlrc-fe/editor
  - **SlashMenu**: Updated `SlashMenuPlugin`, `slashMenuOptions`, `slashMenu.stylex.ts`, and `editor.css`.

  ### @vlrc-fe/types
  - **Enums**: Updated `enums.ts` and package documentation.

  ### @vlrc-fe/animated-component
  - **Initial Release**: Added optional GSAP motion and StyleX surfaces package.

## 1.0.1

### Patch Changes

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
