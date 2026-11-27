# @vlrc-fe/animated-component

## 0.2.0

### Minor Changes

- **FoxMascot**: Added interactive paper fox mascot component with touch feedback, keyboard accessibility (`Enter` / `Space`), speech balloon messages, and reduced-motion compliance.
- **TrailBanner**: Added mobile-first responsive illustrated chapter heading component with GSAP entrance timeline and optional companion slot.
- **Assets & Config**: Bundled paper fox SVG assets with LICENSE and integrated `vlrcStylexOptions` into Vite configuration.

### Patch Changes

- Updated dependencies
  - @vlrc-fe/components@3.3.0

## 0.1.1

### Patch Changes

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

- Updated dependencies
  - @vlrc-fe/components@3.2.0
