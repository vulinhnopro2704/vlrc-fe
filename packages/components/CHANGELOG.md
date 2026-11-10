# Changelog

## [2.8.0] - 2026-11-10

### Minor Changes

- **ConfirmModal Polish & A11y**:
  - Balanced modal layout and eliminated excessive vertical whitespace in footer and content container.
  - Aligned title and status icon with body typography.
  - Added explicit `:focus-visible` ring token on close button and WCAG 2.1 AA keyboard navigation.
  - Added dedicated Vitest test suite and snapshot for `ConfirmModal`.
- **DateRangePicker & Calendar Refinements**:
  - Dual calendar view: `DateRangePicker` now renders two sequential months (`numberOfMonths={2}`) for seamless multi-month and cross-year range selection.
  - Fixed 3rd-click range reset: configured `mode="range"` with `min={1}` and `resetOnSelect`, cleanly restarting range selection on subsequent clicks without UI distortion.
  - Controlled popover behavior: Popover remains open across first and second selections and closes cleanly on click outside (or when configured).
  - Extended calendar year bounds: Default `startMonth` (-100 years) and `endMonth` (+50 years) allow selecting future dates well beyond the current year.
  - Default international localization: Changed calendar weekday and month labels to international English defaults, dynamically configurable via `locale` prop.
  - Cleaned hardcoded Vietnamese labels in `MonthPickerPanel` and Storybook stories.
- **Typography Primitives Expansion**:
  - Extended `Title`, `Paragraph`, and `Text` with spacing props (`marginTop`, `marginBottom`, `marginLeft`, `marginRight`, `margin`, `marginInline`, `marginBlock`) and shorthand aliases (`mt`, `mb`, `ml`, `mr`, `m`, `mx`, `my`) mapped to the 7-tier token scale (`xxs`-`xxl`).
  - Added typography fine-tuning props: `letterSpacing` (`tighter` through `widest`) and `lineHeight` (`none` through `loose`).
  - Audited and refactored native HTML tags (`<span>`, `<p>`, `<a>`) across composite components to official Typography primitives.
- **AvatarGroup Overflow Popover**:
  - Hovering the `+X` overflow counter now triggers a responsive `Popover` previewing all truncated avatars in a flex-wrap container.
- **Command Palette Spacing**:
  - Restored proper padding, min-height, and separator vertical margins for items and section headings in `Command`.

## [2.7.0] - 2026-11-09

### Minor Changes

- **Dynamic Stacking Context & Semantic z-index Scale**:
  - Introduced `Z_INDEX_LAYERS` semantic scale (`deep`, `base`, `docked`, `sticky`, `banner`, `drawer/overlay/modal: 500`, `popover: 600`, `toast: 700`, `tooltip: 800`, `max: 9999`) and `ZIndexProvider` / `useZIndex()`.
  - Fully resolved overlay layering issues: nested floating elements (such as `Popover`, `FormSelect`, `SingleDatePicker`, `DropdownMenu`, `Tooltip`) inside `Dialog`, `Sheet`, `Drawer`, and `AlertDialog` dynamically increment z-index to always render above container overlays according to W3C specifications without arbitrary hardcoded values.
- **Dropdown / PopupMenu Composite Component**:
  - Added declarative `<Dropdown>` and `<PopupMenu>` components supporting both `items` array and `menu={{ items, onClick }}` configuration.
  - Full support for action items, dividers, group labels, checkbox options, shortcuts, danger variants, recursive submenus, and 3 sizing tiers (`sm`, `md`, `lg`) using Meta StyleX tokens and Typography primitives.
- **Stepper & Timeline UI Alignment**:
  - Fixed horizontal Stepper title and description collision by enforcing block display and introducing `<StepperText>` wrapper.
  - Fixed vertical Stepper and Timeline connector alignment and continuity by eliminating unnatural vertical gap offsets, centering separator lines pixel-perfectly with indicators, and stretching connectors seamlessly between steps without floating gaps.
- **DatePicker Enhancements (Range, Month & Year Pickers)**:
  - Fixed `DateRangePicker` selection workflow to strictly require 2 clicks (start date, then end date) before completing the range and closing the popover, preventing premature auto-closing on the first click.
  - Replaced day grid in `MonthPicker` with dedicated 12-month grid (`MonthPickerPanel`) supporting year navigation.
  - Replaced day grid in `YearPicker` with dedicated decade grid (`YearPickerPanel`) supporting 10-year decade navigation.
- **Tests & Storybook Suites**:
  - Added comprehensive Vitest test suites and snapshots for `zIndex`, `dialog`, `popover`, and `Dropdown`.
  - Added `CompleteFormAndUIModal` Storybook story showcasing complex modal interactions with Stepper, Tabs, Timeline, FileDropzone, Tooltips, and all form inputs.

## [2.6.0] - 2026-11-09

### Minor Changes

- **Theme & Design Tokens (Zero-config Default Fallbacks)**:
  - Added robust default fallbacks for all color and text tokens (`colors`, `textColors`, charts 1-5, and sidebar) in `tokens.stylex.ts`.
  - Guaranteed zero-config UI: consumer applications no longer break or render transparent backgrounds if CSS variables are undefined.
  - Exported `@vlrc-fe/components/theme.css` containing predefined `:root`, `.dark`, `[data-theme='pink']`, `[data-theme='lavender']` palettes and Radix interaction data-state rules.
- **Storybook Optimization**:
  - Removed over 700 lines of redundant CSS overrides, orphan Tailwind utility classes, and forced `!important` declarations from `.storybook/preview.css`, relying directly on StyleX tokens and `@vlrc-fe/components/theme.css`.
- **UI Components & Testing**:
  - Added `DataTableColumnHeader` and `DataTableFacetedFilter` for enhanced `DataTable` workflows.
  - Added UI primitives & composite components: `ActionBar`, `BadgeOverflow`, `CircularProgress`, `CompareSlider`, `CopyButton`, `Editable`, `Empty`, `Gauge`, `InputGroup`, `Kbd`, `Masonry`, `Rating`, `ResponsiveDialog`, `Segmented`, `Stat`, `Stepper`, `TagsInput`, and `Timeline`.
  - Added comprehensive Vitest tests and Storybook stories with 100% pass rate.

## [2.5.0] - 2026-11-09

### Minor Changes

- **Layout Primitives**:
  - Added `<Flex>` (`ui/flex.tsx`) with strongly-typed props: `vertical`, `direction` (`row`, `row-reverse`, `column`, `column-reverse`), `align` (`start`, `center`, `end`, `baseline`, `stretch`), `justify` (`start`, `center`, `end`, `space-between`, `space-around`, `space-evenly`, `stretch`), `wrap` (boolean or `wrap`, `nowrap`, `wrap-reverse`), `gap` (7-tier tokens `xxs`-`xxl`, numeric px, CSS unit, or `[rowGap, colGap]`), `inline`, `grow`, `shrink`, `basis`, `width`, `height`, `asChild` (Radix Slot), and Meta StyleX override `sx`.
  - Added `<Grid>` (`ui/grid.tsx`) with responsive columns, auto-fill/auto-fit templates, rows, gap, and flow controls.
  - Added `<Row>` & `<Col>` (`ui/row-col.tsx`) for 24-column responsive grid layout with breakpoints (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) and gutter spacing.
  - Added `useBreakpoint` (`ui/useBreakpoint.ts`) hook for responsive media query subscriptions.
  - Added `spacing` tokens (`theme/tokens.stylex.ts`) and spacing resolver utilities (`theme/spacing.ts`).
- **Typography Suite Enhancements**:
  - Added `tooltip` support on `Text`, `Title`, `Paragraph`, and `Link` (`TypographyTooltip`: `boolean`, `ReactNode`, or `{ title: ReactNode }`).
  - Added `ellipsis` with auto/custom tooltip: hovering over truncated text reveals the full text in a Radix Tooltip.
  - Added `minWidth: 0` to single-line ellipsis styles to prevent flex layout overflow.
  - Wrapped all Typography components with `React.forwardRef` for seamless integration with Radix `asChild` and DOM access.
- **Select & MultiSelect Suite**:
  - `BaseSelect`: Single-select trigger and dropdown option rows now render via `Typography.Text ellipsis tooltip`, preventing text overflow, container blow-out, and UI breakage on ultra-long labels.
  - `MultiSelectTags`: Tags truncate long labels with ellipsis and reveal full label on hover via tooltip.
  - `MultiSelect`: Option rows and tags integrated with `Typography.Text ellipsis tooltip`.
- **Testing & Documentation**:
  - Added comprehensive Vitest unit tests for `BaseSelect` (`BaseSelect.test.tsx`), `Flex` (`flex.test.tsx`), `Grid` (`grid.test.tsx`), `Row`/`Col` (`row-col.test.tsx`), and `Typography` tooltips (`Typography.test.tsx`).
  - Added Storybook interactive stories for layout primitives (`layout.stories.tsx`), Typography ellipsis tooltips (`Typography.stories.tsx`), and Select long text handling (`BaseSelect.stories.tsx`).

## [2.4.0] - 2026-11-08

### Minor Changes

- **Calendar Enhancements**:
  - Added comprehensive size variants (`xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`) via `CalendarContext` and atomic StyleX rules.
  - Replaced inline Lucide icons with unified `@vlrc-fe/components/Icons` registry (`Icons.ChevronLeft`, `Icons.ChevronRight`, `Icons.ChevronDown`).
  - Rendered calendar day numbers with semantic `Text` typography with weight styling (`weight="medium"` for today/selected, `normal` otherwise).
- **FormDatePicker**:
  - Normalized default size token to `md`.
  - Polished range and single picker integrations and styling.
  - Exported `FormDatePicker` directly from `@vlrc-fe/components/Form` and library root.
- **Testing & Documentation**:
  - Added full test suites for `Calendar` (`calendar.test.tsx`) and `FormDatePicker` (`FormDatePicker.test.tsx`).
  - Added Storybook interactive stories (`calendar.stories.tsx` and `DatePicker.stories.tsx`).

## [2.3.0] - 2026-11-08

### Changed

- **100% Meta StyleX Migration**: Completed full migration to compile-time Meta StyleX, eliminating 100% of residual Tailwind CSS classes and runtime styling across all remaining components:
  - `Sidebar` (`SidebarProvider`, `Sidebar`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarInput`, `SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`).
  - `Calendar` & `CalendarDayButton` (`DayPicker` styles compiled directly with Meta StyleX tokens and variables).
  - `ContextMenu` & `Menubar` (all menu triggers, contents, items, checkbox/radio items, sub-menus, separators, shortcuts styled with StyleX).
  - `NavigationMenu` (full StyleX tokens for menu triggers, viewport, indicators, links, and content).
  - `Carousel` (`CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`).
  - `ScrollArea` (`ScrollArea`, `ScrollBar`, `ScrollAreaThumb`).
  - `Resizable` (`ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`).
  - `Item` (`Item`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`, `ItemGroup`).
  - `HoverCard` (`HoverCard`, `HoverCardTrigger`, `HoverCardContent`).
  - `Sonner` (`Toaster` with StyleX keyframe spinner and size styles).
  - `Form` UI Primitives (`FormItem`, `FormLabel`, `FormDescription`, `FormMessage`).
  - `MultiSelect` & `SelectedValuesContent`, `PlaceholderContent`, `OptionsContent` (complete StyleX styling with zero Tailwind CSS).
  - `FormDatePicker` (`RangeDatePicker`, `SingleDatePicker`, `TimeInput`, `TimePicker`).
  - `FormNumberInput` (`FormNumberInput`, `StepperControls`).
  - `DataTable` & `DataTableTable` (StyleX toolbar, container, empty and expanded cells).
- **StyleX Overrides (`sx` prop)**: Added strongly-typed `sx?: stylex.StyleXStyles` override prop to all migrated primitives for type-safe compile-time design customization.

### Fixed

- Fixed `FormCheckbox` vertical alignment when rendered with descriptions or helper text.
- Replaced all legacy string class concatenations with pure Meta StyleX atomic CSS.

## 2.2.0

### Minor Changes

- 2b75d53: - Added `weight` prop with strongly-typed font weights (`thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`, etc.) across all Typography components (`Text`, `Title`, `Paragraph`, `Link`, `Blockquote`, `Code`).
  - Added configurable `width` prop across `Button`, `Input`, `Select`, `Textarea`, `Field`, `FormItem`, `FormBase`, `MultiSelect`, `FormNumberInput`, and `FormDatePicker` with semantic preset autocomplete (`xs`, `sm`, `md`, `lg`, `xl`, `full`, `auto`, etc.) while supporting numbers (px) and arbitrary CSS strings.

All notable changes to `@vlrc-fe/components` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [2.1.4] - 2026-11-08

### Added

- **Form Controls Full HTML Props**: `FormInput`, `FormTextarea`, `FormCheckbox`, and `FormSwitch` now inherit and forward all native HTML and component props directly without requiring manual `FormField` boilerplate.
- **FormSwitch**: exported `FormSwitch` form control component integrated with React Hook Form.
- **HTML Collision Aliasing**: added `htmlSize` on `Input` / `FormInput` for conflicting native HTML `<input size={number}>` attribute, and `htmlType` on `Button` / `Input` for button and input types.
- **Wrapper and Element ClassNames**: added `wrapperClassName`, `inputClassName`, `textareaClassName`, `checkboxClassName`, and `switchClassName` to form controls for clear styling separation.

## [2.1.3] - 2026-11-08

### Fixed

- **FormTextarea Type Definition**: updated `FormTextarea` to accept `TextareaProps` (`placeholder`, `rows`, `cols`, etc.) and loosened `FormControlFunc` generic constraint.

## [2.1.2] - 2026-11-08

### Added

- **Typography Component Suite**: introduced comprehensive typographic primitives (`Title`, `Text`, `Paragraph`, `Blockquote`, `Link`, `Code`, `Kbd`) with full Meta StyleX semantic styling, color variants, weights, sizes, and truncation support.
- **Enhanced FileUpload Ecosystem**:
  - Pre-built layout variants (`avatar`, `compact`, `card`, `dropzone`) in `FileUpload` and `FormFileUpload`.
  - Custom upload adapters (`createApiUploadHandler`, `createS3UploadHandler`, `createCloudinaryUploadHandler`) for seamless direct storage integration.
  - Primitive composable components: `FileUploadDropzone`, `FileUploadList`, `FileUploadItem`, `FileUploadItemPreview`, `FileUploadItemMetadata`, `FileUploadItemProgress`, `FileUploadItemDelete`, `FileUploadClear`.
  - Automatic and manual upload workflows with progress tracking, cancellation, and validation.
- **Storybook Component Stories**: added interactive Storybook stories (`*.stories.tsx`) across UI primitives and form controls.
- **Unit and Snapshot Test Coverage**: added test suites for `Typography`, `Accordion`, `Command`, `DropdownMenu`, `Tabs`, `Toggle`, `FileUpload`, and upload adapters.

### Changed

- **UI Component Refinements**: enhanced `ConfirmModal`, `DataTable`, `Button`, `Input`, `Textarea`, `Checkbox`, `Switch`, `DropdownMenu`, `Sheet`, `Drawer`, `Tabs`, `Toggle`, `ToggleGroup`, `Command`, `Breadcrumb`, `Accordion`, and `InputOTP` with atomic StyleX tokens and theme variables.

## [2.0.2] - 2026-11-06

### Changed

- **Optional Peer Dependencies**: configured `peerDependenciesMeta` with optional flags for `recharts`, `vaul`, `embla-carousel-react`, `react-day-picker`, `date-fns`, `react-i18next`, `react-resizable-panels`, `sonner`, `input-otp`, `next-themes`, `react-number-format`, `class-variance-authority`, `clsx`, and `tailwind-merge`, eliminating unnecessary peer warnings for consumer apps.
- **Modern Tooling & Formatting**: migrated to `oxlint` and `oxfmt` across the monorepo, standardizing code quality, type annotations, and code formatting.
- **Vite 8 & Vitest 5 Toolchain**: updated build and test configurations to Vite 8.3 and Vitest 5.0 with full snapshot test coverage across UI primitives.
- **Package Metadata**: added complete public npm package metadata, repository references, and keywords.

## [2.0.1] - 2025-01-15

### Changed

- **Replaced Tailwind CSS with Meta StyleX**: migrated from runtime utility class concatenation (`tailwind-merge`, `clsx`, `class-variance-authority`) to compile-time atomic CSS-in-JS.
- **Zero runtime style injections**: all styles are parsed at build time using `@stylexjs/unplugin` and emitted into `dist/assets/stylex.css` with CSS `@layer` priorities.
- **Deterministic specificity**: eliminated CSS precedence issues and class collision bugs — the last style in `stylex.props(...)` deterministically wins without `!important`.
- **Theme tokens**: created `theme/tokens.stylex.ts` using `stylex.defineVars()`, binding to CSS custom properties (`--background`, `--primary`, `--card`, etc.). All dynamic themes remain compatible.

### Breaking Changes

- **`sx` prop introduced**: components now accept `sx?: stylex.StyleXStyles` for type-safe styling overrides.
- **`className` deprecated**: still accepted for backwards compatibility but will be removed in a future major version.
- **CSS import required**: consumers must import `@vlrc-fe/components/stylex.css` or configure `@stylexjs/unplugin`.
- **CVA removed**: `class-variance-authority` is no longer used — variants are now statically typed StyleX records.

### Component Upgrades

- `Button`: all variants and sizes ported to StyleX.
- `Input`, `Textarea`: full pseudo-class and invalid state styling.
- `Badge`: variant styles (`default`, `secondary`, `destructive`, `outline`).
- `Card`: variants (`default`, `glass`, `glass-strong`, `elevated`, `elevated-glass`, `auth`).
- `Dialog`, `AlertDialog`: keyframe animations (`fadeIn`, `scaleIn`).
- `Popover`, `Tooltip`: keyframe scale animations.
- `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `Progress`: atomic StyleX styles.
- `Separator`, `Label`, `Skeleton`, `Spinner`: `stylex.keyframes` pulse and spin.
- `Table`: clean StyleX table layout.
- `DataTable`: toolbar, pagination, view options, row actions, column creators all ported.
- `FormBase`, `Form`: layout, icon adornments, and validation indicators.
- `Modal`, `ConfirmModal`: fully rewritten with glassmorphic and themed containers.
- `Select`, `MultiSelect`: tags, popover menus, and option selectors.
