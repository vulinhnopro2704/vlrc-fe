# VLRC FE — Codebase Review & Fix Plan

- **Date:** 2026-11-20
- **Reviewed at:** commit `6f6cb34e` (branch `main`) — packages `@vlrc-fe/components@3.0.6`, `@vlrc-fe/editor@1.0.1`, `@vlrc-fe/hooks`
- **Reviewer:** agent-assisted static review — 8 parallel review agents (one per area) + coordinator evidence spot-checks. No runtime/interactive testing was performed.
- **Scope:** `packages/components/src/**`, `packages/editor/src/**`, `packages/hooks/src/**`, `apps/docs/src/**`, all `*.stories.tsx` / `*.test.tsx` (secondary depth), root + per-package configs. ~40k LOC. Excluded: `node_modules`, `dist`, `storybook-static`.

---

## 1. Executive Summary

The library is structurally sound — consistent compound patterns, static StyleX, token-aware styling in most files, no TODO/HACK landmines, and clean type discipline except where noted. However, the review found **208 findings: 18 P0 (correctness/a11y bugs), 88 P1 (contract violations, non-modern patterns, and P1-level bugs), 102 P2 (dead/redundant code, debt)**.

**⚠️ Release-blocking (F-179):** the published `@vlrc-fe/components@3.0.6` dist is broken for consumers — 13 of 25 `@radix-ui/*` packages are missing from the Vite `external` list, so 253 dist files import `../node_modules/.pnpm/...` paths that do not exist in the published tarball. `dist/index.js` re-exports an affected module, so the package entry fails with `ERR_MODULE_NOT_FOUND`. Fix and republish a patch immediately (Phase 0).

### Findings by area

| Area (agent)                                                                |     P0 |     P1 |      P2 |   Total |
| --------------------------------------------------------------------------- | -----: | -----: | ------: | ------: |
| ui (a–c)                                                                    |      3 |      8 |      18 |      29 |
| ui (d–k)                                                                    |      1 |     13 |      12 |      26 |
| ui (l–r)                                                                    |      1 |      8 |      11 |      20 |
| ui (s–t)                                                                    |      5 |      7 |      11 |      23 |
| ui (u–z) + root files                                                       |      0 |      7 |      13 |      20 |
| Form + layout                                                               |      5 |     19 |       6 |      30 |
| Typography + Select/Dropdown/MultiSelect                                    |      1 |     13 |      16 |      30 |
| DataTable + theme + Icons + richtext + editor + hooks + apps/docs + configs |      2 |     13 |      15 |      30 |
| **Total**                                                                   | **18** | **88** | **102** | **208** |

### Top 10 issues

1. **F-179 [P0]** — Published dist broken: 13 of 25 `@radix-ui/*` packages not externalized; 253 dist files import nonexistent `.pnpm` paths → `ERR_MODULE_NOT_FOUND` for every consumer.
2. **F-149 [P0]** — `BaseSelect` dropdown is fully mouse-only: `<div onClick>` option rows, no listbox/option semantics, no keyboard path (WCAG 2.1.1 / 4.1.2).
3. **F-030 [P0]** — `FileUpload` store mutates the `files` `Map` in place; `useSyncExternalStore` bails out on the same reference → progress bars freeze at 0%, status/error never render.
4. **F-180 [P0]** — `DataTable` renders no `<th>` for `accessorKey`-only columns → `th`/`td` count mismatch, misaligned grid, broken screen-reader table semantics.
5. **F-119 [P0]** — `FormDatePicker`: Radix `Slot` merges `id`/`aria-invalid`/`aria-describedby` onto a Radix `Popover` root that drops them → every date field's label association and invalid state is silently lost.
6. **Systemic — invisible keyboard focus:** `outline: 'none'` with no `:focus-visible` replacement across ~20 controls in 5 areas (F-060, F-079, F-080, F-121, F-122, F-123, F-150, …) — a single tokenized sweep fixes them all (WCAG 2.4.7).
7. **F-099/F-100/F-105 [P1]** — Modal/ConfirmModal: `open ?? isOpen ?? true` (documented default is `false`), hardcoded duplicate DOM id `confirm-modal-title`, and two copy-pasted 7-tier size tables with an inconsistent `md` (500px vs 26rem).
8. **F-076–F-080 [P0]** — Keyboard/ARIA pattern failures: bare `<Slider />` renders a NaN second thumb; Segmented radiogroup has all options tabbable with arrows that don't move focus; Stepper tablist lacks `aria-controls`/`labelledby`/`hidden` panels; Sidebar and SignaturePad focusable areas have no focus indicator.
9. **Editor API fiction (F-181–F-183):** documented `value` prop destructured and silently ignored; `readOnly` only applied at mount (Lexical `initialConfig` consumed once); "Duplicate" drag action moves the block instead of cloning it.
10. **Systemic contract violations** (codemod targets): raw `<div>`/`<span>` layout, raw `rem`/`px`/`rgba`/`ms` magic values, ~120 duplicated className-merge ternaries bypassing the existing `cn` util, hardcoded English UI strings in ~20 components, no `prefers-reduced-motion` handling, legacy `clip: rect()` / `transition: all` / `keyCode === 229` / `matchMedia.addListener` patterns.

---

## 2. Methodology

**Severity:** **P0** = wrong behavior / a11y violation / crash risk · **P1** = repo-contract violation, non-modern pattern, or P1-level bug · **P2** = dead/redundant code, minor debt.
**Fix risk:** safe (mechanical, low regression chance) · medium (behavior or API touch) · high (architectural / breaking).

**Criteria (6):** (1) redundant/dead code · (2) bugs (logic, hook deps, cleanup, ARIA/keyboard, state, leaks) · (3) non-modern patterns vs modern-web Baseline + Web Interface Guidelines · (4) workarounds/tech debt (TODO/FIXME/HACK, defensive code hiding bugs, dead fallbacks) · (5) repo contract violations (zero raw `div`/`span`, zero magic values, static StyleX only, `sx` passthrough, WCAG 2.1 AA, i18n, 44×44px touch targets, 0% `any`) · (6) type safety (`any`, unsafe casts, non-null assertions).

**Tools & inputs:** `modern-web-guidance` legacy-scan (2026-11-10 build; 38 guides / 52 active rules ≈ 20% of the deterministic corpus; reported **0 findings** for `packages/` and `apps/` — note: the scan missed real `clip: rect()` and `transition: all` occurrences found manually, so treat it as a coarse net, not a pass); Web Interface Guidelines (`vercel-labs/web-interface-guidelines`, fetched 2026-11-20); the repo's own contracts (`AGENTS.md` + `.agents/skills/vlrc-fe-components/` runbook references).

**Agent split & results:**

| #   | Area                                                                                          | Files reviewed                | Findings |
| --- | --------------------------------------------------------------------------------------------- | ----------------------------- | -------: |
| 1   | `ui` a–c (accordion → copy-button)                                                            | 21 components + tests/stories |       29 |
| 2   | `ui` d–k (dialog → kbd)                                                                       | 18 components + tests/stories |       26 |
| 3   | `ui` l–r (label → row-col)                                                                    | 14 components + tests/stories |       20 |
| 4   | `ui` s–t (scroll-area → switch)                                                               | 15 components + tests/stories |       23 |
| 5   | `ui` u–z (table → tooltip) + root files (Modal, ConfirmModal, utils, astryx, lazyLoad, index) | 17 + 6 root                   |       20 |
| 6   | `Form/**` + `layout/**`                                                                       | 46 + 6 files                  |       30 |
| 7   | `Typography` + `Select` + `Dropdown` + `MultiSelect`                                          | 34 files                      |       30 |
| 8   | `DataTable` + `theme` + `Icons` + `richtext` + `editor` + `hooks` + `apps/docs` + configs     | ~70 files + 14 configs        |       30 |

**Verification:** every agent verified each cited `file:line` by reading the file (several cross-checked against installed dependency sources — Radix, vaul, Lexical, react-number-format, RHF). The coordinator additionally spot-checked the 8 highest-stakes claims directly (all confirmed), and independently reproduced F-179 by inspecting `vite.config.ts`, `package.json`, and 253 broken `dist/` files.

**Limitations:** static review only — no runtime/Storybook/interactive testing; stories reviewed at secondary depth; the deterministic legacy scan covers only ~20% of the guidance corpus; findings that depend on consumer-app context are marked as uncertainties in §5.

---

## 3. Findings

Global IDs `F-001…F-208`, grouped by area. Each entry: severity, category, fix risk, verified location, evidence, recommended fix.

### 3.1 ui (a–c)

### F-001 · **P0** · BUG · safe — Carousel ArrowRight is a no-op; capture handler swallows arrows from child inputs

- `packages/components/src/ui/carousel.tsx:155-162`
- **Evidence:** the `ArrowRight` branch calls `event.preventDefault()` but never `scrollNext()` (verified); handler is attached via `onKeyDownCapture` on the root, so arrows typed into any descendant input are swallowed.
- **Fix:** call `scrollNext()`; only act when the event target is the region itself (or not an editable element); add `ArrowUp`/`ArrowDown` for vertical orientation.

### F-002 · **P0** · BUG · safe — BadgeOverflow "+N" trigger is a non-focusable span

- `packages/components/src/ui/badge-overflow.tsx:81`
- **Evidence:** `PopoverTrigger asChild` onto `<Badge>` (a `<span>`, `badge.tsx:157`) — Radix merges props onto the child with no `tabIndex` (verified in Radix dist); hidden badges unreachable by keyboard (WCAG 2.1.1).
- **Fix:** render the trigger as a real focusable button (e.g. `Button size="icon-sm"`) or add `tabIndex` + Enter/Space handling.

### F-003 · **P0** · BUG · safe — AvatarGroup "+N" overflow trigger `<div>` not keyboard-accessible

- `packages/components/src/ui/avatar.tsx:251`
- **Evidence:** same root cause as F-002; plain `<div>` with only `onMouseEnter`/`onMouseLeave`.
- **Fix:** focusable button-like trigger; keep hover-to-open as an enhancement.

### F-004 · **P1** · BUG · safe — Checkbox coerces `checked="indeterminate"` to `true`

- `packages/components/src/ui/checkbox.tsx:158`
- **Evidence:** `const isChecked = checked !== undefined ? Boolean(checked) : internalChecked;` — `'indeterminate'` becomes `true`; `data-state="indeterminate"` styling never triggers (verified).
- **Fix:** pass `checked` through unchanged when controlled; fall back to internal boolean only in uncontrolled mode.

### F-005 · **P1** · BUG · safe — BreadcrumbPage puts `role="link"` on a non-interactive span

- `packages/components/src/ui/breadcrumb.tsx:228`
- **Evidence:** `role="link"` + `aria-disabled` on a non-focusable `<Text as="span">` — interactive roles are not allowed on non-operable elements (HTML-ARIA).
- **Fix:** keep `aria-current="page"`, drop `role="link"`/`aria-disabled` (APG breadcrumb pattern).

### F-006 · **P1** · BUG · safe — `sr-only` class used but defined nowhere

- `packages/components/src/ui/breadcrumb.tsx:290`
- **Evidence:** `<Text as="span" className="sr-only">More</Text>`; grep of package + `theme.css` + all `@astryxdesign` CSS: no `.sr-only` utility → text renders visibly in apps that don't define it. Same latent bug in `pagination.tsx` (see F-056).
- **Fix:** ship an `.sr-only` utility (or a shared StyleX `srOnly` style) in `theme.css`; see also §5 (consumers may define it themselves).

### F-007 · **P1** · CONTRACT · safe — AlertDialog overlay: raw `rgba()`, raw duration/easing

- `packages/components/src/ui/alert-dialog.tsx:33`
- **Evidence:** `backgroundColor: 'rgba(0, 0, 0, 0.5)'`, `animationDuration: '200ms'`, `animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'` (repeats at :56-58; same values in `theme.css:33,37` accordion keyframes).
- **Fix:** add a scrim/overlay token + use `duration.normal`/`easing.*` (see F-048 sweep).

### F-008 · **P1** · CONTRACT · medium — Raw rem/px/ms bypass token scales across the a–c set

- `packages/components/src/ui/alert.tsx:14` (+ ~30 files listed in source report)
- **Evidence:** e.g. `paddingInline: '1rem'`, `paddingBlock: '0.75rem'` though `spacing`/`typography`/`duration`/`easing` token ramps exist; off-scale values (`0.8rem`, `2.25rem`, `1.875rem`) need a scale decision.
- **Fix:** package-wide codemod (see F-008 sweep in §4.3b); many values map 1:1 to existing tokens.

### F-009 · **P1** · CONTRACT · medium — Raw `<div>`/`<span>` layout in ~16 a–c files

- `packages/components/src/ui/card.tsx:120` (+ alert, alert-dialog, action-bar, avatar, badge, badge-overflow, breadcrumb, calendar, carousel, circular-progress, compare-slider, context-menu, command)
- **Evidence:** raw elements where `Box`/`Stack`/`Flex` exist in-package (AGENTS.md: never raw `<div>`/`<span>`).
- **Fix:** mechanical `Box`/`Flex` replacement (polymorphic `as` where a specific tag is needed) — batch with F-008 codemod.

### F-010 · **P1** · NON-MODERN · safe — `transitionProperty: 'all'` on interactive components

- `packages/components/src/ui/accordion.tsx:42`; also `button.tsx:49`
- **Evidence:** Web Interface Guidelines: "Never `transition: all` — list properties explicitly"; these animate every animatable property.
- **Fix:** list intended properties (pattern already used in `checkbox.tsx:19`, `command.tsx:107`).

### F-011 · **P1** · CONTRACT · medium — Hardcoded English user-facing strings in library defaults

- `packages/components/src/ui/command.tsx:154` (+ carousel, copy-button, compare-slider, circular-progress, code-block, action-bar, breadcrumb)
- **Evidence:** `title = 'Command Palette'`, `'Search for a command to run...'`, `"Previous slide"`/`"Next slide"`, `"Before"`/`"After"`, etc.
- **Fix:** route defaults through the i18n layer or make them required/overridable (see i18n sweep §4.3b).

### F-012 · **P2** · REDUNDANT · safe — Dead exported variants helpers

- `packages/components/src/ui/alert.tsx:103`
- **Evidence:** `alertVariants`, `badgeVariants` (`badge.tsx:173`), `cardVariants` (`card.tsx:226`) have zero consumers (only `buttonVariants` is used).
- **Fix:** delete or document as public API.

### F-013 · **P2** · REDUNDANT · safe — ActionBar context null-check is an unreachable branch

- `packages/components/src/ui/action-bar.tsx:24`
- **Evidence:** context created with non-null default `{ open: false }` → `if (!context) throw` can never fire; `component` param only used in the dead branch.
- **Fix:** default the context to `null` (make the guard real) or delete guard + param.

### F-014 · **P2** · REDUNDANT · safe — Calendar `buttonVariant` prop accepted but never used

- `packages/components/src/ui/calendar.tsx:338`
- **Evidence:** underscore-renamed at destructure; `CalendarDayButton` hardcodes `variant="ghost"` (:496).
- **Fix:** wire it through or remove from `CalendarProps` (:328).

### F-015 · **P2** · BUG · safe — Calendar computes `new Date()` and month bounds on every render

- `packages/components/src/ui/calendar.tsx:351`
- **Evidence:** impure clock read in render; fresh `Date` identities passed to `DayPicker` force downstream re-computation on unrelated re-renders.
- **Fix:** `useMemo` both (deps: `startMonth`, `endMonth`).

### F-016 · **P2** · BUG · safe — Carousel `reInit` listener never removed

- `packages/components/src/ui/carousel.tsx:172`
- **Evidence:** effect registers `api.on('reInit', onSelect)` and `api.on('select', …)` but cleanup only does `api.off('select', …)` — asymmetric latent leak.
- **Fix:** add `api.off('reInit', onSelect)` to cleanup.

### F-017 · **P2** · REDUNDANT · safe — Carousel dead orientation fallback

- `packages/components/src/ui/carousel.tsx:191`
- **Evidence:** `orientation: orientation || (opts?.axis === 'y' ? …)` — `orientation` defaults to `'horizontal'` (:122), RHS unreachable.
- **Fix:** use `orientation` directly.

### F-018 · **P2** · NON-MODERN · safe — Duplicated `srOnly` block using deprecated `clip`

- `packages/components/src/ui/carousel.tsx:74` (identical block in `command.tsx:124`)
- **Evidence:** `clip: 'rect(0, 0, 0, 0)'` (obsolete) duplicated verbatim.
- **Fix:** extract one shared `srOnly` style; use `clipPath: 'inset(50%)'` (see shared-srOnly sweep §4.3b).

### F-019 · **P2** · WORKAROUND · medium — CodeBlock "highlighter" ignores `language` and mis-parses comments

- `packages/components/src/ui/code-block.tsx:292`
- **Evidence:** single language-agnostic regex; `language` prop only used for the header badge; unquoted `#`/`//` turn the rest of the line into "comment" color.
- **Fix:** gate the tokenizer on `language` (unsupported → plain), or adopt a real highlighter (decision item §5).

### F-020 · **P2** · BUG · safe — CodeBlock "Copied" timeout untracked

- `packages/components/src/ui/code-block.tsx:418`
- **Evidence:** `setTimeout(() => setIsCopied(false), 2000)` — no unmount cleanup, rapid copies race (a stale timer flips state back early).
- **Fix:** timer in a ref, cleared on new copy + unmount (pattern already correct in `copy-button.tsx:69-98`).

### F-021 · **P2** · TYPE-SAFETY · safe — CompareSlider ref merge via `as any`

- `packages/components/src/ui/compare-slider.tsx:235`
- **Evidence:** `else if (ref) (ref as any).current = node;` (repo contract: 0% `any`); plus unnecessary `(e.currentTarget as HTMLElement)` casts at :184/:196.
- **Fix:** type as `Ref<HTMLDivElement>` and cast to `RefObject<HTMLDivElement | null>` (or a typed `composeRefs` helper).

### F-022 · **P2** · BUG · safe — Breadcrumb declares `sx` but never applies it

- `packages/components/src/ui/breadcrumb.tsx:153`
- **Evidence:** `sx` destructured from props and dropped; `<nav>` gets no StyleX props → consumer `sx` silently ignored.
- **Fix:** `const sxProps = stylex.props(sx)` and spread onto the `<nav>`.

### F-023 · **P2** · CONTRACT · safe — Raw, dead z-index literals where `useZIndex` exists

- `packages/components/src/ui/alert-dialog.tsx:32` (+ `action-bar.tsx:36`, `context-menu.tsx:28`)
- **Evidence:** `zIndex: 50/51` in StyleX objects always overridden by inline `style={{ zIndex }}` from `useZIndex`; `action-bar` uses raw `zIndex: 50` with no `useZIndex` at all.
- **Fix:** delete dead literals; use the `useZIndex` system consistently (zIndex sweep §4.3b).

### F-024 · **P2** · NON-MODERN · safe — AvatarGroup physical `marginLeft` breaks RTL

- `packages/components/src/ui/avatar.tsx:98`
- **Evidence:** `marginLeft: '-0.5rem'` (magic value + physical property; AGENTS.md requires CSS logical properties).
- **Fix:** `marginInlineStart` with a token-sourced value.

### F-025 · **P2** · WORKAROUND · medium — CopyButton stops click propagation even when copy fails

- `packages/components/src/ui/copy-button.tsx:80`
- **Evidence:** `e.stopPropagation()` runs before the clipboard capability check → swallows the parent click even when nothing is copied.
- **Fix:** move `stopPropagation()` to after a successful `writeText` (or make it opt-in).

### F-026 · **P2** · CONTRACT · medium — Baseline DOM snapshot tests contradict the "streamlined tests" contract

- `packages/components/src/ui/button.test.tsx:15` (pattern across 12+ a–c test files; 100+ `toMatchSnapshot` calls repo-wide)
- **Evidence:** AGENTS.md: "Do NOT write duplicate baseline DOM tests" — whole-fragment snapshots pin StyleX class hashes and add no regression value.
- **Fix:** replace with behavior assertions (a11y roles, wrapper logic like `copyable`, size mapping) — see test-strategy workstream §4.3b.

### F-027 · **P2** · CONTRACT · safe — No `prefers-reduced-motion` handling anywhere in the package

- `packages/components/src/ui/alert-dialog.tsx:18` (also accordion, circular-progress, button/carousel spinners)
- **Evidence:** grep of the whole package: zero `prefers-reduced-motion` occurrences; animations run unconditionally (Web Interface Guidelines + WCAG 2.1 AA contract).
- **Fix:** shared `@media (prefers-reduced-motion: reduce)` block in `theme.css` zeroing entrance animations; disable indeterminate spins.

### F-028 · **P2** · REDUNDANT · medium — className merge template literal duplicated ~40×

- `packages/components/src/ui/button.tsx:437` (pattern across ~40 components in this area)
- **Evidence:** ``className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className`` copy-pasted while `cn()` exists in `src/utils.ts:6` (used by calendar/carousel/command).
- **Fix:** consolidate on `cn(sxProps.className, className)` — single codemod (cn sweep §4.3b).

### F-029 · **P2** · TYPE-SAFETY · safe — Unnecessary type assertion in Accordion

- `packages/components/src/ui/accordion.tsx:224`
- **Evidence:** `{...(props as ComponentProps<typeof AccordionPrimitiveRoot>)}` — `AccordionProps` already extends that type; dead `?? styles.xxxMd` fallbacks at :263-264/:300 (exhaustive records).
- **Fix:** spread `...props` directly; drop unreachable fallbacks.

### 3.2 ui (d–k)

### F-030 · **P0** · BUG · medium — FileUpload store mutates the `files` Map in place; items never re-render

- `packages/components/src/ui/file-upload.tsx:402-411` (mutation sites :371/:387/:393/:405/:416/:427/:443/:461; selector :507-518)
- **Evidence:** reducer does `files.set(…)` on the same `Map` instance then `return { …state, files }` — `useSyncExternalStore` sees an `Object.is`-equal snapshot and bails out; `FileUploadItem` never observes progress/status/error changes (progress bars frozen at 0%).
- **Fix:** produce a new `Map` for file-mutating actions (e.g. `new Map(files)` then mutate) so the snapshot reference changes; add a regression test dispatching `SET_PROGRESS` and asserting re-render.

### F-031 · **P1** · BUG · safe — `URL.createObjectURL` called during render — new leaked blob URL per re-render

- `packages/components/src/ui/file-upload.tsx:1426` (same pattern :1566)
- **Evidence:** render-prop `const url = URL.createObjectURL(file)` on every render (incl. every progress tick); the existing `urlCache` + revoke machinery (:1101-1105, :436-442) is bypassed.
- **Fix:** move object-URL creation into the `useEffect`/`urlCache` path (memoized per `File`), revoke on unmount.

### F-032 · **P1** · BUG · medium — Store captures the initial `onValueChange` forever (stale closure)

- `packages/components/src/ui/file-upload.tsx:624`
- **Evidence:** `useMemo(() => createStore(…, onValueChange), [])` closes over the first render's callback; the reducer calls that original callback for the component's whole lifetime.
- **Fix:** route callbacks through a ref updated each render (`onValueChangeRef.current`).

### F-033 · **P1** · BUG · safe — `SET_FILES` drops files without revoking cached object URLs

- `packages/components/src/ui/file-upload.tsx:383`
- **Evidence:** `REMOVE_FILE` (:436-442) and `CLEAR` (:456-465) revoke `urlCache` entries; `SET_FILES` (the controlled-`value`-shrinks path, :629-633) does not → blob leak.
- **Fix:** factor the revoke loop into a helper and call it for each dropped file.

### F-034 · **P1** · BUG · medium — `createApiUploadHandler` async Promise executor: rejections hang the upload forever

- `packages/components/src/ui/file-upload-adapters.ts:114`
- **Evidence:** `new Promise(async (resolve, reject) => { … await endpoint(file) … })` — if `endpoint`/`headers`/`extraBody` resolvers reject, the error never reaches `reject`; the file stays `uploading` forever, `isUploading` sticks `true`. (Same pattern in `@vlrc-fe/hooks` — see F-185.)
- **Fix:** await resolvers _before_ constructing the Promise (async IIFE wrapped by a plain executor, or `.then(resolve).catch(reject)`).

### F-035 · **P1** · BUG · safe — Drawer CSS keyframes fight vaul's own rAF transform animation

- `packages/components/src/ui/drawer.tsx:12`
- **Evidence:** vaul 1.1.1 (verified in dist) animates via `requestAnimationFrame` writing `style.transform` every frame; the local `slideUp`/`fadeIn` CSS animations (250ms) override vaul's inline transform during open, ignoring its spring/height math.
- **Fix:** delete `slideUp`/`fadeIn` from `content`/`overlay`; rely on vaul's built-in animation.

### F-036 · **P1** · BUG · medium — Editable: `submitOnBlur={false}` + clicking Submit cancels instead of submitting

- `packages/components/src/ui/editable.tsx:363`
- **Evidence:** mousedown on the Submit button moves focus → `focusout` → `handleBlur` → `cancel()` unmounts the toolbar before the `click` is dispatched → click lands on nothing.
- **Fix:** `onMouseDown={e => e.preventDefault()}` on toolbar buttons (and/or check `e.relatedTarget` / defer the blur decision to a microtask).

### F-037 · **P1** · CONTRACT · safe — Progressbar without accessible name; `statusId` wired but never consumed

- `packages/components/src/ui/file-upload.tsx:1247`
- **Evidence:** `role="progressbar"` with no `aria-label`/`labelledby` (WCAG 4.1.2); the item context generates `statusId` (:1044, provided :1052) but nothing consumes it (grep: 4 occurrences, all in the provider).
- **Fix:** wire `aria-labelledby={itemContext.statusId}` or add a per-status `aria-label`.

### F-038 · **P1** · CONTRACT · medium — Hardcoded user-facing strings across d–k components

- `packages/components/src/ui/file-upload.tsx:794` (+ dialog.tsx:193, editable.tsx:137, gauge.tsx:92, many file-upload dropzone texts)
- **Evidence:** `'File upload'`, `` `File "${file.name}" is not an accepted format` ``, `'Browse'`, `'Drag & drop files here, or click to browse'`, sr-only `'Close'` in dialog, gauge `aria-label`, etc.
- **Fix:** i18n sweep (§4.3b) — make defaults translator-backed or required props.

### F-039 · **P1** · CONTRACT · medium — Raw `<div>`/`<span>` layout in ~12 d–k files

- `packages/components/src/ui/dialog.tsx:208` (+ dialog, drawer, editable, field, empty, input, input-group, input-otp, item, form)
- **Evidence:** compound-part shells are raw elements despite in-package `Box`/`Flex`/`VStack` that accept `sx`/`data-*`.
- **Fix:** mechanical migration to `Box`/`Flex` (keep `data-slot`) — raw-div sweep (§4.3b).

### F-040 · **P1** · CONTRACT · medium — Magic values: raw rgba scrims, raw durations/easings, raw rem

- `packages/components/src/ui/dialog.tsx:32` (+ drawer, file-upload, field, dropdown-menu, gauge)
- **Evidence:** `rgba(0,0,0,0.5)`/`0.45` scrims; `200ms`/`250ms`/`500ms` + `cubic-bezier(0.16,1,0.3,1)` (easeOutExpo, used in 3+ files, has no token); rem paddings where `spacing`/`typography` ramps exist.
- **Fix:** token sweep (§4.3b); add a `scrim` color token and the easeOutExpo easing to the ramps.

### F-041 · **P1** · CONTRACT · safe — FileUploader compact variant: fully inline-styled raw button

- `packages/components/src/ui/file-upload.tsx:1486` (+ raw inline `<div>`s :1439-1451, :1474)
- **Evidence:** runtime `style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', … }}` — violates static-StyleX-only and zero-magic-values contracts.
- **Fix:** move into `stylex.create` entries with tokens; reuse the existing `Button` for the trigger.

### F-042 · **P1** · NON-MODERN · safe — Dialog manual 50%/translate(-50%,-50%) centering, duplicated inside keyframes

- `packages/components/src/ui/dialog.tsx:38`
- **Evidence:** centering transform re-declared in `scaleIn` keyframes, coupling transform and centering.
- **Fix:** modern Baseline centering — `position: fixed; inset: 0; margin: auto` (with existing `maxWidth`); keyframe then animates pure `scale()`.

### F-043 · **P1** · CONTRACT · medium — EditablePreview is mouse-only

- `packages/components/src/ui/editable.tsx:275`
- **Evidence:** clickable `<Text as="span">` with no `role`/`tabIndex`/key handling when composed without `EditableTrigger` (as in its own test/story) — no keyboard path to edit mode (WCAG 2.1.1).
- **Fix:** `role="button"` + `tabIndex={0}` + Enter/Space activation (when not editing/disabled), or document `EditableTrigger` as required and assert it in stories.

### F-044 · **P2** · TYPE-SAFETY · safe — Unsafe casts: `ref as any`, `GridRoot as GridComponent`, props casts

- `packages/components/src/ui/flex.tsx:306` (+ grid.tsx:286/:404/:416, input-otp.tsx:167, file-upload-adapters.ts:325)
- **Evidence:** polymorphic-ref `as any` ×3; namespace-cast Grid with static props assigned after; UploadThing adapter dereferences `item.key` without an object check.
- **Fix:** typed `Ref<HTMLElement>` patterns for polymorphic refs; real compound component for Grid; validate `item` before dereferencing (see `as any` workstream §4.3b).

### F-045 · **P2** · NON-MODERN · safe — IE11-era `MediaQueryList.addListener` fallback

- `packages/components/src/ui/useBreakpoint.ts:31` (same file also flagged by F-112 — one fix)
- **Evidence:** `LegacyMediaQueryList` type + `addListener`/`removeListener` branches; `MediaQueryList.addEventListener` is universal Baseline.
- **Fix:** delete the shim and legacy branches.

### F-046 · **P2** · REDUNDANT · safe — className merge re-implemented ~40× while `cn` exists

- `packages/components/src/ui/dialog.tsx:156` (~55 sites across dialog, drawer, dropdown-menu, editable, field, file-upload, input, input-group, input-otp, kbd)
- **Evidence:** same ternary pattern; `form.tsx`/`hover-card.tsx`/`item.tsx` in the same area already use `cn(styleProps.className, className)`.
- **Fix:** replace all with `cn(sxProps.className, className)` — cn sweep (§4.3b).

### F-047 · **P2** · REDUNDANT · safe — Dead hardcoded `zIndex` always overridden by `useZIndex`

- `packages/components/src/ui/dialog.tsx:31` (+ drawer :21/:32, dropdown-menu :27, hover-card :15)
- **Evidence:** inline `style={{ zIndex }}` from context (500/600 tiers) always wins over the compiled `50/51/100` literals — dead and misleading.
- **Fix:** delete the static literals (zIndex sweep §4.3b).

### F-048 · **P2** · REDUNDANT · safe — Editable's 3 inline SVG icons duplicate the Icons registry

- `packages/components/src/ui/editable.tsx:450`
- **Evidence:** hand-written pencil/check/cross SVGs while `Icons.Pencil`/`Check`/`X` exist (registry :122/:47/:41); `file-upload.tsx:1299` already uses `<Icons.X/>`.
- **Fix:** use the registry icons (icons sweep §4.3b).

### F-049 · **P2** · NON-MODERN · safe — Legacy `clip: rect(0,0,0,0)` sr-only (×2)

- `packages/components/src/ui/dialog.tsx:122` (also file-upload.tsx:311)
- **Evidence:** obsolete `clip` property; two identical copies.
- **Fix:** shared `srOnly` style with `clipPath: 'inset(50%)'` (shared-srOnly sweep §4.3b).

### F-050 · **P2** · BUG · safe — KbdGroup drops the `style` portion of `stylex.props`

- `packages/components/src/ui/kbd.tsx:125`
- **Evidence:** only `sxProps.className` forwarded; dynamic `sx` values (in `sxProps.style`) silently lost.
- **Fix:** `Flex` natively accepts `sx` — pass `sx={[styles.group, sx]}` and drop the manual `stylex.props` (style-clobber pattern §4.3b).

### F-051 · **P2** · BUG · safe — `form.tsx` contexts default to `{} as FormFieldContextValue` — guard is dead

- `packages/components/src/ui/form.tsx:50`
- **Evidence:** truthy cast default → `useFormField` outside a `FormField` never throws; silently builds `"undefined-form-item"` ids.
- **Fix:** default both contexts to `null`; throw with the real component name when absent.

### F-052 · **P2** · REDUNDANT · safe — FileUpload unreachable `? 1 :` branch in multiple-file slice

- `packages/components/src/ui/file-upload.tsx:691`
- **Evidence:** in the `multiple` path, `availableSlots <= 0` is impossible at that point (early-return above) → `availableSlots <= 0 ? 1` dead.
- **Fix:** simplify to `rawFiles.slice(0, availableSlots)`.

### F-053 · **P2** · CONTRACT · medium — Interactive elements below the 44×44px touch minimum

- `packages/components/src/ui/dialog.tsx:61` (+ file-upload delete :206-211, dropdown-menu item :40-53)
- **Evidence:** dialog close ≈28px hit area; file-delete 28px; menu item ≈26px — AGENTS.md requires 44×44px on touch devices.
- **Fix:** enlarge hit areas without visual change (pseudo-element padding / `min-height`) — touch-target workstream (§4.3b, severity policy in §5).

### F-054 · **P2** · NON-MODERN · safe — Legacy `event.keyCode === 229` alongside `isComposing`

- `packages/components/src/ui/editable.tsx:352` (same pattern in Typography — see F-170)
- **Evidence:** `keyCode` is deprecated; `e.nativeEvent.isComposing` covers IME on all Baseline browsers.
- **Fix:** drop the `keyCode` check.

### F-055 · **P2** · BUG · safe — `useUploadFile` keys progress by `file.name` — duplicate names collide, never cleared

- `packages/components/src/ui/file-upload-adapters.ts:497`
- **Evidence:** two files named `Screenshot.png` share one progress entry; entries only cleared by `reset()`.
- **Fix:** key by a stable per-file identity (index map or `crypto.randomUUID()` per batch); delete the key when the file settles.

### 3.3 ui (l–r)

### F-056 · **P0** · BUG · safe — PaginationEllipsis: sr-only label both visually broken and never announced

- `packages/components/src/ui/pagination.tsx:331` (label at :339-341)
- **Evidence:** (verified) "More pages" sits inside `aria-hidden="true"` so it is never announced, **and** `.sr-only` is undefined in the package and all imported Astryx CSS, so it renders visibly next to the icon. The identical pattern is in `breadcrumb.tsx:286-296` (F-006).
- **Fix:** drop `aria-hidden` and define a real `sr-only` utility in the theme's product layer — or delete the sr-only `Text` if the ellipsis should be silent; fix both files together.

### F-057 · **P1** · BUG · medium — ResponsiveDialog loses open state / flickers when crossing the breakpoint

- `packages/components/src/ui/responsive-dialog.tsx:74-94`
- **Evidence:** `isDesktop` from live `useBreakpoint()` unmounts the Dialog tree and mounts the Drawer tree (or vice versa): uncontrolled open state is lost (open dialog silently closes on rotate/resize); controlled mode flashes and re-hands-off focus/scroll-lock.
- **Fix:** lift a single `open` state into `ResponsiveDialog` and always pass _controlled_ `open`/`onOpenChange` to whichever primitive is mounted (architectural — Phase 4).

### F-058 · **P1** · BUG · safe — Progress drops dynamic `sx` styles: `style={style}` clobbers `sxProps.style`

- `packages/components/src/ui/progress.tsx:41`
- **Evidence:** `{...sxProps}` spread then `style={style}` (raw prop) overwrites the dynamic StyleX style → consumer dynamic `sx` silently lost.
- **Fix:** merge like the rest of the library: `style={{ ...sxProps.style, ...style }}` (style-clobber workstream §4.3b; same footgun in 7+ files per F-095).

### F-059 · **P1** · BUG · safe — QuestionnaireProgress: ARIA value attributes on a div without `role="progressbar"`

- `packages/components/src/ui/questionnaire.tsx:505`
- **Evidence:** `aria-valuenow/-min/-max/-valuetext` on a bare `Box` — ignored by AT; `aria-valuemax={0}` before any item registers is outright invalid.
- **Fix:** add `role="progressbar"` (and valid min/max) or move value semantics to the visible `Text`.

### F-060 · **P1** · CONTRACT · safe — Menubar & NavigationMenu: `outline: 'none'` with a ~1.1:1 focus indicator

- `packages/components/src/ui/menubar.tsx:49` (also :104/:112/:141/:147; navigation-menu.tsx :50/:59/:118/:126)
- **Evidence:** only focus indication is a `colors.accent` background (`--accent: #f1f5f9` on white ≈ 1.1:1) — fails WCAG 1.4.11 and the repo's focus-ring contract.
- **Fix:** `':focus-visible': { boxShadow: shadow.ringFocus }` on trigger/item/subTrigger/link (tokenized pattern exists in `radio-group.tsx:34-37`) — focus-ring sweep (§4.3b).

### F-061 · **P1** · CONTRACT · safe — Rating: five raw `<span>`s, three of them interactive hit areas

- `packages/components/src/ui/rating.tsx:250` (+ :206/:216/:234/:241)
- **Evidence:** half-star hit areas are clickable regions styled/wired like buttons but rendered as unsemantic spans.
- **Fix:** `Box as="span"` (or `Flex`/`Box`) with the existing style objects — raw-div sweep.

### F-062 · **P1** · CONTRACT · safe — Progress: root and indicator are raw `<div>`s

- `packages/components/src/ui/progress.tsx:34` (indicator :45)
- **Evidence:** the canonical "generic styled container" case for `Box`.
- **Fix:** replace with `Box` (keep `role="progressbar"` + ARIA attrs).

### F-063 · **P1** · CONTRACT · medium — Hardcoded English strings in pagination, rating, questionnaire

- `packages/components/src/ui/pagination.tsx:187` (+ :285/:304/:311/:340, rating.tsx:134, questionnaire.tsx :494/:602/:619-620/:670)
- **Evidence:** `aria-label="pagination"`, `'Previous'`/`'Next'` fallbacks, `'More pages'`, `'Rating'`, `Question N of M`, `'Back'`/`'Submit'`/`'Skip'` — no override path for two of the aria-labels.
- **Fix:** i18n sweep (§4.3b); defaults through the translator, remaining labels required/overridable.

### F-064 · **P1** · TYPE-SAFETY · medium — `ref={ref as any}` ×6 in questionnaire and row-col

- `packages/components/src/ui/questionnaire.tsx:331` (+ :378/:413/:444, row-col.tsx :433/:547; more in flex/grid/compare-slider/signature-pad)
- **Evidence:** casts silence polymorphic `Box`/`Comp` ref typing (0% `any` contract).
- **Fix:** type exposed refs as `Ref<HTMLElement>` (matching `as="form"` etc.) or make `Box`'s `as` drive the ref type generically (`as any` workstream §4.3b).

### F-065 · **P2** · REDUNDANT · safe — className ternary duplicating `cn` — 11 sites across 6 files

- `packages/components/src/ui/label.tsx:33` (+ pagination ×5, popover, progress, radio-group ×2, row-col ×4)
- **Fix:** `cn(sxProps.className, className)` — cn sweep (§4.3b).

### F-066 · **P2** · REDUNDANT · safe — Dead static `zIndex: 100` always overridden by `useZIndex`

- `packages/components/src/ui/menubar.tsx:65` (+ :79, popover.tsx:22)
- **Fix:** remove the static values — zIndex sweep (§4.3b).

### F-067 · **P2** · WORKAROUND · safe — Dead exported `navigationMenuTriggerStyle` returning `''`

- `packages/components/src/ui/navigation-menu.tsx:216`
- **Evidence:** shadcn leftover; zero call sites.
- **Fix:** delete the function and its export.

### F-068 · **P2** · WORKAROUND · safe — Masonry test: meaningless `screen.getAllByTestId ?` ternary

- `packages/components/src/ui/masonry.test.tsx:53`
- **Evidence:** `screen.getAllByTestId` is always truthy → the `: []` branch is dead and the guard hides the real query.
- **Fix:** use `document.querySelectorAll(...)` directly.

### F-069 · **P2** · BUG · safe — Masonry `useMemo` keyed on a fresh array every render (never caches)

- `packages/components/src/ui/masonry.tsx:55`
- **Evidence:** `Children.toArray(children)` allocates a new array each render; the memo's deps look load-bearing but aren't.
- **Fix:** drop the `useMemo` (compute inline) or memoize `childArray` with a stable dep.

### F-070 · **P2** · BUG · medium — Questionnaire `isComplete` goes stale: `goToStep` never resets it

- `packages/components/src/ui/questionnaire.tsx:253`
- **Evidence:** `prevStep` clears it (:263) but programmatic `goToStep(0)` (the "restart flow" path) leaves `isComplete === true` in context and `onStatusChange` until the user presses Back.
- **Fix:** reset `isComplete` inside `goToStep` when leaving the last step (or derive from `isLast && submitted`).

### F-071 · **P2** · REDUNDANT · safe — QuestionnaireSkip: `?? currentItem?.required` unreachable

- `packages/components/src/ui/questionnaire.tsx:680`
- **Evidence:** the component returns `null` whenever `currentItem?.required` is truthy, so the fallback can never be `true` at render.
- **Fix:** simplify to `buttonDisabled ?? false` (makes "never render, never disable" explicit).

### F-072 · **P2** · CONTRACT · safe — Hardcoded motion values despite `duration`/`easing` tokens

- `packages/components/src/ui/rating.tsx:32` (+ menubar ×2, navigation-menu ×3, pagination, progress ×2, popover, radio-group, questionnaire ×2)
- **Evidence:** `'150ms'` ×5 components (matches no duration token — see §5), `'300ms'`/`'ease-in-out'` where `duration.slow`/`easing.*` exist.
- **Fix:** token sweep (§4.3b); decide on a 150ms token (§5).

### F-073 · **P2** · CONTRACT · safe — Raw `<div>`/`<span>` layout nodes in menubar, navigation-menu, resizable, radio-group

- `packages/components/src/ui/radio-group.tsx:188` (+ menubar :326/:349, navigation-menu :267/:311, resizable :79)
- **Fix:** `Box` swaps keeping the same `stylex.props(...)` spread — raw-div sweep.

### F-074 · **P2** · WORKAROUND · safe — Label: `:disabled` CSS on a `<label>` can never match

- `packages/components/src/ui/label.tsx:16`
- **Evidence:** `:disabled` applies to form controls, not `<label>` — dead CSS copied from shadcn mixes.
- **Fix:** delete, or drive disabled styling off a `disabled` prop / `data-disabled`.

### F-075 · **P2** · CONTRACT · safe — Layout docs story uses raw `<div>/<h3>/<p>` and raw px

- `packages/components/src/ui/layout.stories.tsx:18` (+ popover/pagination/radio-group stories)
- **Evidence:** the story demonstrating `Flex`/`Row`/`Col`/`Grid` builds its scaffolding from raw divs and magic px.
- **Fix:** rebuild scaffolding with `Box`/`VStack`/`HStack`/`Text`/`Title` + tokens (stories workstream §4.3b).

### 3.4 ui (s–t)

### F-076 · **P0** · BUG · safe — Bare `<Slider />` renders an extra (NaN) thumb

- `packages/components/src/ui/slider.tsx:62-63`
- **Evidence:** (verified) fallback is `[min, max]` (two thumbs) but Radix's uncontrolled default is `[min]` (one thumb, verified in `@radix-ui/react-slider` dist) → the second thumb reads an undefined value: NaN percent, broken `aria-valuenow`.
- **Fix:** change the fallback to `[min]` (or derive thumb count from the same source Radix uses); add a story/test for the no-value case.

### F-077 · **P0** · BUG (a11y) · medium — Segmented radiogroup: every option tabbable; arrows don't move focus

- `packages/components/src/ui/segmented.tsx:167`
- **Evidence:** WAI-ARIA radiogroup requires a single tab stop (roving `tabIndex` on the selected radio) and arrow keys must move _focus_; here container + every option button are tab stops and arrows only flip state.
- **Fix:** roving tabindex (selected = 0, others = -1, container not focusable); move focus on Arrow/Home/End.

### F-078 · **P0** · BUG (a11y) · medium — Stepper tablist/tab/tabpanel ARIA wiring incomplete

- `packages/components/src/ui/stepper.tsx:443`
- **Evidence:** tabs have no `aria-controls`; panels no `aria-labelledby`; `forceMount` renders all panels with no `hidden`; no roving tabindex; `handleKeyDown` (:415-435) changes step without moving DOM focus (APG tab pattern).
- **Fix:** `useId` per item + id pairs, roving tabindex, focus move on arrows, `hidden` on inactive force-mounted panels.

### F-079 · **P0** · BUG (a11y) · safe — Sidebar: focusable menu controls with `outline: 'none'` and no `:focus-visible`

- `packages/components/src/ui/sidebar.tsx:223`
- **Evidence:** `menuButtonBase`, `groupAction` (:192), `menuAction` (:278), `menuSubButton` (:347) on focusable `<button>`/`<a>` — no visible keyboard focus (WCAG 2.4.7; listed anti-pattern).
- **Fix:** `':focus-visible': { boxShadow: shadow.ringFocus }` on each (tokens already imported) — focus-ring sweep.

### F-080 · **P0** · BUG (a11y) · safe — SignaturePad drawing area focusable with no focus indicator

- `packages/components/src/ui/signature-pad.tsx:596`
- **Evidence:** `tabIndex={0}` but `styles.areaFocused` (:118-122, border + `shadow.ring`) is defined and never referenced (grep: single occurrence) — dead style.
- **Fix:** apply it via `:focus-visible` (or `data-focus-visible` state), or remove `tabIndex` if the area is intentionally mouse/touch-only.

### F-081 · **P1** · CONTRACT · medium — Raw `<div>`/`<span>` across the shadcn-ported files

- `packages/components/src/ui/sidebar.tsx:477` (+ sidebar ×13, sheet ×3, stepper ×7, select, segmented, skeleton)
- **Evidence:** provider/shell/layout wrappers are raw elements; semantic elements (`<ul>`, `<li>`, `<a>`, `<button>`) are fine.
- **Fix:** `Box`/`VStack`/`Text` replacements — raw-div sweep (§4.3b).

### F-082 · **P1** · CONTRACT · safe — Hardcoded colors: rgba overlay in Sheet; `color-mix` with stray #hex in Stat

- `packages/components/src/ui/sheet.tsx:49`
- **Evidence:** `backgroundColor: 'rgba(0, 0, 0, 0.5)'`; `stat.tsx:39` `'color-mix(in srgb, var(--color-success, #22c55e) 12%, transparent)'` — the fallback hex doesn't even match the real success token (`#16a34a`); :43/:47 use raw `var(--destructive)`/`var(--muted-foreground)` instead of token refs.
- **Fix:** scrim token + token-backed `color-mix` (no literal fallback) — token sweep (§4.3b).

### F-083 · **P1** · CONTRACT · medium — Systemic raw rem/px sizes and durations

- `packages/components/src/ui/signature-pad.tsx:106` (+ stepper, scroll-area, slider, select, sheet, sidebar, segmented)
- **Evidence:** raw `160px`/`200px`, `marginLeft: 19` (off the 4px grid — needs a deliberate token decision), `'150ms'`, rem paddings mapping 1:1 to `spacing.*`.
- **Fix:** token sweep (§4.3b).

### F-084 · **P1** · CONTRACT · medium — Hardcoded user-facing strings in six components

- `packages/components/src/ui/signature-pad.tsx:658` (+ stepper, sheet, sidebar, spinner, segmented)
- **Evidence:** `'Sign here'`, `'Undo stroke'`/`'Redo stroke'`/`'Clear signature'`, `'Next'`/`'Previous'`, `aria-label="Close"`, `'Toggle Sidebar'`, `aria-label="Loading"`, `'Segmented options'` defaults.
- **Fix:** i18n sweep (§4.3b) via `useTranslator()` per the i18n reference.

### F-085 · **P1** · NON-MODERN · safe — `transitionProperty: 'all'` on SidebarRail

- `packages/components/src/ui/sidebar.tsx:113`
- **Evidence:** rail only animates `transform` (same pattern in accordion/button — F-010).
- **Fix:** `transitionProperty: 'transform'`.

### F-086 · **P1** · NON-MODERN · safe — Legacy `clip: rect(0,0,0,0)` sr-only (Sheet, Sidebar)

- `packages/components/src/ui/sheet.tsx:180` (also sidebar.tsx:378)
- **Fix:** shared `srOnly` style with `clipPath: 'inset(50%)'` (shared-srOnly sweep §4.3b).

### F-087 · **P1** · CONTRACT · medium — Compact control sizes far below the 44×44px touch contract

- `packages/components/src/ui/switch.tsx:38` (+ segmented sm 28px, select trigger 36px, sidebar actions 20px, sheet close ≈24px)
- **Evidence:** Switch xxs–md 16–22px tall, etc. — AGENTS.md 44×44px requirement.
- **Fix:** extend hit areas without visual change, or document as desktop-only (policy in §5) — touch-target workstream.

### F-088 · **P2** · REDUNDANT · safe — Dead hardcoded z-index values shadowed by ZIndexProvider

- `packages/components/src/ui/select.tsx:73` (`zIndex: 9999`; also sheet :48/:57)
- **Fix:** remove the dead values — zIndex sweep (§4.3b).

### F-089 · **P2** · REDUNDANT · safe — Sidebar dead code: no-op `sidebarMenuButtonVariants`, unused `showOnHover`, unused `--skeleton-width`, cookie written but never read

- `packages/components/src/ui/sidebar.tsx:848`
- **Evidence:** `sidebarMenuButtonVariants` exported but returns `''` (cva leftover); `showOnHover` destructured never used; `--skeleton-width` (:991) consumed by no CSS; `setOpen` writes the `sidebar_state` cookie (:436) but initial state is just `defaultOpen` — fake persistence.
- **Fix:** delete the dead exports/props/var; either read the cookie in the state initializer or delete the write.

### F-090 · **P2** · REDUNDANT · safe — SignaturePad `smoothing` prop is a no-op

- `packages/components/src/ui/signature-pad.tsx:248`
- **Evidence:** declared (:226), defaulted, exposed on context (:66/:497), never read — quadratic smoothing applied unconditionally.
- **Fix:** implement (Catmull-Rom/quadratic tension factor) or remove the prop + context entry.

### F-091 · **P2** · TYPE-SAFETY · safe — `as any` casts in SignaturePad

- `packages/components/src/ui/signature-pad.tsx:483`
- **Evidence:** `useImperativeHandle(apiRef as any, …)`; `<HStack ref={ref as any}>` (:703) — 0% `any` contract.
- **Fix:** type `apiRef` as `Ref<SignaturePadAPI>`; align `SignaturePadControlsProps['ref']` with HStack's ref type (`as any` workstream §4.3b).

### F-092 · **P2** · BUG · medium — SignaturePad canvas never re-syncs on container resize

- `packages/components/src/ui/signature-pad.tsx:395`
- **Evidence:** backing store resized only inside the stroke effect; responsive resizes stretch the stored bitmap (warped signature, stale `toDataURL()` export) until the next stroke; history is unbounded (full snapshot per commit, :280-284).
- **Fix:** `ResizeObserver` on the canvas (with cleanup) triggering resize+redraw; cap history length.

### F-093 · **P2** · BUG · safe — SignaturePad accepts secondary pointers — multi-touch strokes interleave

- `packages/components/src/ui/signature-pad.tsx:555`
- **Evidence:** single shared `currentPoints` buffer; no `e.isPrimary` guard / active-`pointerId` tracking — a second finger replaces the in-progress stroke and both `pointerup`s call `endStroke()`.
- **Fix:** guard with `e.isPrimary` (and/or store the active pointerId, ignore others until release).

### F-094 · **P2** · BUG · safe — Hidden input `required` has no effect; `toSVG()` runs on every render

- `packages/components/src/ui/signature-pad.tsx:526`
- **Evidence:** hidden controls are excluded from constraint validation (HTML spec) — the `required` prop misleads consumers; `toSVG()` rebuilds the full SVG string every render just to feed the hidden value.
- **Fix:** enforce "signature required" in form logic/API (or document); memoize the SVG on `strokes`.

### F-095 · **P2** · BUG · medium — Consumer `style` prop clobbers StyleX styles (spread-after-style footgun)

- `packages/components/src/ui/signature-pad.tsx:522`
- **Evidence:** `style={sxProps.style}` then `{...props}` — a consumer `style` replaces the whole StyleX style (drops `touchAction: 'none'` on the area → breaks touch drawing). Same order in switch, slider, scroll-area, skeleton, separator, all stepper subcomponents; related: F-058 (progress), F-050 (kbd).
- **Fix:** the codebase's own pattern: destructure `style` out of props and use `style={{ ...sxProps.style, ...style }}` — apply across the listed files.

### F-096 · **P2** · WORKAROUND · safe — Sonner Toaster keeps a Tailwind `group` class + runtime custom-property object

- `packages/components/src/ui/sonner.tsx:33`
- **Evidence:** `className="toaster group"` — Tailwind is forbidden in package sources and absent here (shadcn leftover, does nothing); `--normal-*` custom properties are static strings that belong in `stylex.create`; `React.CSSProperties` UMD-global reference unimported.
- **Fix:** drop `group`; move the custom properties into `stylex.create`; `import type { CSSProperties }`.

### F-097 · **P2** · WORKAROUND · safe — Spinner doc comment claims default `'md'`, code defaults to `'sm'`

- `packages/components/src/ui/spinner.tsx:60`
- **Fix:** make doc + code + fallback agree (`sm` looks intended for inline use).

### F-098 · **P2** · BUG · medium — Stepper auto-selection can produce unhandled promise rejections

- `packages/components/src/ui/stepper.tsx:268`
- **Evidence:** initial auto-select calls `setValue` → `await onValidateStep('', firstStep)` (validator typed `Promise<boolean>`); the same awaits in `handleClick`/`handleKeyDown` (:409-435) and StepperNext/Prev (:638-645/:675-682) reject unhandled with a throwing validator.
- **Fix:** skip validation when `currentValue` is empty; try/catch (or `.catch`) with a defined failure behavior (stay on current step + optional `onError`).

### 3.5 ui (u–z) + root files (Modal, ConfirmModal, utils, astryx, lazyLoad, index)

### F-099 · **P1** · BUG · medium — `open`/`isOpen` default to `true` when omitted (documented default is `false`)

- `packages/components/src/Modal.tsx:144` (same at `ConfirmModal.tsx:288`)
- **Evidence:** (verified) `const isVisible = open ?? isOpen ?? true;` — `references/modals.md:46` documents `open | boolean | false`.
- **Fix:** default to `false` (or make `open` required); if "mount = open" is the intended pattern, document it explicitly; add a test for the omitted-prop case (intention behind the default in §5).

### F-100 · **P1** · BUG · safe — Hardcoded `id="confirm-modal-title"` — duplicate DOM ids across instances

- `packages/components/src/ConfirmModal.tsx:337`
- **Evidence:** (verified) with two mounted instances every dialog's `aria-labelledby` resolves to the first instance's title — a real a11y mislabeling.
- **Fix:** `React.useId()` (or drop the static id and let Radix `DialogTitle` generate one).

### F-101 · **P1** · BUG · safe — `TagsInput` root `delimiters` prop accepted but silently ignored

- `packages/components/src/ui/tags-input.tsx:206` (live logic in `TagsInputInput` :419/:439)
- **Evidence:** destructured at the root and never used; only the inner input's own `delimiters` is checked — `<TagsInput delimiters={[';']}>` has no effect.
- **Fix:** pass root `delimiters` through `TagsInputContext` (input-level as override) or remove the prop so the API cannot lie.

### F-102 · **P1** · CONTRACT · safe — Raw `<div>` layout in Modal/ConfirmModal

- `packages/components/src/Modal.tsx:171` (+ :176; ConfirmModal :331/:332/:335/:353)
- **Evidence:** the Nov 20 rewrite of these flagship files introduced fresh violations while `Dropdown` shows the intended pattern.
- **Fix:** `Box` (body) + `HStack`/`Flex` (actions) + `VStack` in ConfirmModal — raw-div sweep.

### F-103 · **P1** · CONTRACT · safe — Timeline active-dot: runtime inline `style` with magic values

- `packages/components/src/ui/timeline.tsx:329`
- **Evidence:** `style={{ width: size === 'sm' ? 4 : 6, …, borderRadius: '9999px' }}` — runtime style object + raw px.
- **Fix:** precompute `dotActiveSm`/`dotActiveLg` in `stylex.create` with tokens (`radius.full`) and select statically by `size`.

### F-104 · **P1** · CONTRACT · safe — Magic values throughout Modal/ConfirmModal

- `packages/components/src/Modal.tsx:18` (+ :25-:31/:35-:52/:61; ConfirmModal :171/:159-:173/:21-:28)
- **Evidence:** raw px size scale (`320…960`), `calc(100vh - 120px)`, `rgba(255,255,255,0.4)` (the only raw color string in the area), spinner `animationDuration: '1s'`, raw rem paddings.
- **Fix:** shared token-backed size scale (see F-105), scrim/border tokens, `spacing.*`/`typography.*`; consider `100dvh` for mobile-safe `maxHeight` — token sweep.

### F-105 · **P1** · REDUNDANT · safe — Copy-pasted 7-tier `sizeStyles` in Modal and ConfirmModal with inconsistent `md`

- `packages/components/src/ConfirmModal.tsx:34` vs `Modal.tsx:28`
- **Evidence:** `sizeMd: { maxWidth: '26rem' }` (416px) vs `{ maxWidth: 500 }` — all seven tiers duplicated with this one divergence.
- **Fix:** extract one shared `modalSizeStyles` (token-backed) and align the scale so `size="md"` renders identically in both.

### F-106 · **P2** · REDUNDANT · safe — className ternary duplicated ~28×

- `packages/components/src/ui/table.tsx:73` (×8 in table; also tabs ×4, tags-input ×6, timeline ×8, textarea, toggle, toggle-group ×2, tooltip)
- **Fix:** `cn(sxProps.className, className)` — cn sweep (§4.3b).

### F-107 · **P2** · CONTRACT · safe — Raw `rem`/`px` and raw `var()`/`color-mix` strings across ui/

- `packages/components/src/ui/table.tsx:24` (+ tabs, textarea, toggle, timeline)
- **Evidence:** `color-mix(in srgb, var(--muted) 50%, transparent)`, `outline: '2px solid var(--ring)'` (vars exist in `vlrc-theme.css` — token-bypass, not broken), dozens of raw rem mapping 1:1 to tokens.
- **Fix:** token sweep (§4.3b); keep `color-mix` only over token-backed vars.

### F-108 · **P2** · CONTRACT · medium — Hardcoded English strings (regression from localized defaults)

- `packages/components/src/ConfirmModal.tsx:273` (+ Modal :132-133, tags-input :384/:493)
- **Evidence:** `confirmText = 'Confirm'`, `cancelText = 'Cancel'`, `'Processing...'`; the reference doc shows localized defaults (`'Xác nhận'`/`'Hủy'`) — the rewrite regressed the i18n contract; `aria-label="Remove tag"` is repeated identically on every chip (ambiguous name).
- **Fix:** translator-backed defaults; make the chip delete label include the tag value — i18n sweep.

### F-109 · **P2** · REDUNDANT · safe — Hand-rolled inline SVGs duplicate the Icons registry

- `packages/components/src/ui/tags-input.tsx:393` (+ :502, timeline.tsx:311)
- **Evidence:** X and check glyphs already registered (`Icons.tsx:177/:183`) and used by ConfirmModal/dialog.
- **Fix:** use `<Icons.X />` / `<Icons.Check />` — icons sweep (§4.3b).

### F-110 · **P2** · NON-MODERN · safe — Deprecated `addListener`/`removeListener` fallback (duplicate of F-045, same file)

- `packages/components/src/ui/useBreakpoint.ts:72` (+ :31-34/:83)
- **Fix:** one fix covers both citations — see F-045.

### F-111 · **P2** · CONTRACT · safe — No `prefers-reduced-motion` for the infinite spinner and entrance animations

- `packages/components/src/ConfirmModal.tsx:164` (also tooltip.tsx:30)
- **Fix:** reduced-motion override (static spinner state / opacity-only) — reduced-motion workstream (§4.3b, with F-027).

### F-112 · **P2** · REDUNDANT · safe — Dead static `zIndex: 110` in tooltip

- `packages/components/src/ui/tooltip.tsx:23`
- **Evidence:** `Z_INDEX_LAYERS.tooltip` = 800 is always written inline (:78/:87) → `110` dead and misleading (same pattern in dialog — F-047).
- **Fix:** remove — zIndex sweep (§4.3b).

### F-113 · **P2** · TYPE-SAFETY · safe — Unsafe casts: `props as …Root`, `ComponentType<any>`, `e.target as HTMLElement`

- `packages/components/src/ui/toggle-group.tsx:91` (+ lazyLoad.tsx:4, tags-input.tsx:261)
- **Fix:** type union-member common props explicitly; constrain `lazyLoad`'s `T extends ComponentType<Record<string, unknown>>`; `e.target instanceof HTMLElement` guard (`as any` workstream §4.3b).

### F-114 · **P2** · REDUNDANT · safe — Dead defensive `?? 'md'` / `?? styles.*` fallbacks against non-nullable types

- `packages/components/src/ui/tabs.tsx:202` (+ :224, toggle-group :120-121, Modal :155, ConfirmModal :305, textarea :110, toggle :145-146)
- **Evidence:** context typed `{ size: ComponentSize }` with a default, records exhaustive → both `??` branches unreachable; they paper over a genuinely missing key as a runtime value instead of a compile error.
- **Fix:** drop the unreachable fallbacks.

### F-115 · **P2** · REDUNDANT · medium — `TagsInputItem` requires an `index` prop it never uses

- `packages/components/src/ui/tags-input.tsx:308`
- **Fix:** remove `index` (minor breaking change — batch with the next minor, §5) or consume it (`data-index`).

### F-116 · **P2** · CONTRACT · safe — ConfirmModal close button touch target ≈28×28px

- `packages/components/src/ConfirmModal.tsx:175`
- **Fix:** grow the hit target (pseudo-element / `min-width`/`min-height: 44px` via tokens), keep the 20px glyph — touch-target workstream.

### F-117 · **P2** · REDUNDANT · safe — `Modal` has no test file while `ConfirmModal` (same logic) is covered

- `packages/components/src/Modal.test.tsx` (missing) — cf. `ConfirmModal.test.tsx:67`
- **Fix:** add `Modal.test.tsx` mirroring the ConfirmModal behavior tests (confirm/cancel fire, pending guard, alias resolution, loading label swap) — also the place to lock in the F-099 default decision.

### F-118 · **P2** · CONTRACT · safe — Flagship stories use raw `<div>`/`<p>` + inline magic styles

- `packages/components/src/Modal.stories.tsx:73` (+ ConfirmModal.stories, table/textarea/toggle/tags-input stories)
- **Evidence:** the `Feedback/*` stories are consumed as copy-paste templates and model exactly the patterns the contract forbids.
- **Fix:** rebuild with `VStack`/`HStack`/`Box` + token-based styles (stories workstream §4.3b).

### 3.6 Form + layout

### F-119 · **P0** · BUG · medium — FormDatePicker label and ARIA association silently dropped by Radix

- `packages/components/src/Form/FormDatePicker/FormDatePicker.tsx:130`
- **Evidence:** `FormControl` (`ui/form.tsx:148-154`) is a Radix `Slot` merging `id`/`aria-describedby`/`aria-invalid` onto the child — but the child root is a Radix `Popover`, which destructures only `open/defaultOpen/onOpenChange/modal/__scopePopover/children` and drops the rest (verified in dist). `FormLabel`'s `htmlFor` points at an id that never reaches the DOM; the trigger gets no `aria-invalid`/`aria-describedby`.
- **Fix:** thread `id`/`aria-invalid`/`aria-describedby` (from `useFormField`) as explicit props into `SingleDatePicker`/`RangeDatePicker` and apply them to the trigger `<Button>`; point the label association at that id. (Architectural alternative: re-home on FormBase — F-146.)

### F-120 · **P0** · BUG · safe — Date picker clear affordance is a clickable span

- `packages/components/src/Form/FormDatePicker/SingleDatePicker.tsx:290` (identical copy in `RangeDatePicker.tsx:190`)
- **Evidence:** `<Text as="span" onClick={handleClear}>×</Text>` — not focusable, no role, no accessible name; keyboard users cannot clear a date (anti-pattern "div/span with click handlers").
- **Fix:** library `Button` (ghost, translated `aria-label`, 44×44 target) or icon button.

### F-121 · **P0** · BUG · safe — FormNumberInput removes the focus outline with no replacement

- `packages/components/src/Form/FormNumberInput/FormNumberInput.tsx:32`
- **Evidence:** raw `<input>` via `NumericFormat` (:104), not the `ui/input` wrapper; `outline: 'none'` with no `:focus-visible` → invisible keyboard focus (WCAG 2.4.7).
- **Fix:** add `:focus-visible` using `colors.ring`/`shadow.ring` (mirror `ui/input.tsx:34-37`) — focus-ring sweep.

### F-122 · **P0** · BUG · safe — TimePicker column buttons: `outline: 'none'` with no focus-visible replacement

- `packages/components/src/Form/FormDatePicker/TimePicker.tsx:43`
- **Evidence:** hour/minute/second `<button>`s (:138) are the primary interaction and have no visible keyboard focus.
- **Fix:** `':focus-visible': { boxShadow: shadow.ringFocus }` — focus-ring sweep.

### F-123 · **P0** · BUG · safe — FormInput password visibility toggle: `tabIndex={-1}` and no accessible name

- `packages/components/src/Form/Form.tsx:258`
- **Evidence:** icon-only `<Button tabIndex={-1}>` with no `aria-label` — both nameless (WCAG 4.1.2) and unreachable by keyboard (WCAG 2.1.1).
- **Fix:** remove `tabIndex={-1}`, add a translated `aria-label` (show/hide password).

### F-124 · **P1** · CONTRACT · medium — FormBase never wires `aria-describedby` for description/error

- `packages/components/src/Form/Form.tsx:191`
- **Evidence:** the form-fields reference promises `aria-describedby` + `aria-invalid` association; only `id`/`aria-invalid` are injected — `FieldDescription`/`FieldError` get no ids, the control no `aria-describedby`; errors announced only via `role="alert"` on insertion.
- **Fix:** generate stable ids in `FormBase` (or `Field`) and pass `aria-describedby` to the control.

### F-125 · **P1** · CONTRACT · medium — Default required/error messages hardcoded in English, duplicated in 5 places

- `packages/components/src/Form/Form.tsx:145` (+ useFormDatePicker :168/:172, useFormNumberInput :73/:77, useFormRadio :60/:64, useFormSelect :91/:95)
- **Evidence:** `'Invalid email address'`, `'Invalid phone number'`, `'This field is required'` copy-pasted across 5 rule-enhancing helpers.
- **Fix:** resolve once through `useTranslator()`/i18n catalog; factor the required-default into a single shared helper — i18n sweep.

### F-126 · **P1** · CONTRACT · medium — Hardcoded English UI strings across the DatePicker/Select family

- `packages/components/src/Form/FormDatePicker/SingleDatePicker.tsx:103` (+ RangeDatePicker, TimePicker column headers, Month/YearPickerPanel aria-labels, useFormSelect `'Select...'`)
- **Fix:** i18n catalog; `placeholder` already overridable — i18n sweep.

### F-127 · **P1** · CONTRACT · medium — FormFileUpload hardcodes most of its visible copy

- `packages/components/src/Form/FormFileUpload/FileUpload.tsx:812` (+ :825/:833/:542/:517/:586/:601/:592/:610/:801/:809)
- **Fix:** route through the i18n catalog; keep `dropzoneTitle`/`dropzoneSubtitle` overrides — i18n sweep.

### F-128 · **P1** · BUG · medium — Vietnam-specific phone regex auto-enforced on every `tel` input

- `packages/components/src/Form/Form.tsx:25`
- **Evidence:** `htmlType="tel"` silently gets VN-only validation (`0`/`+84` prefixes, 8 digits) + English error; non-VN numbers can never validate.
- **Fix:** make the auto pattern locale-aware (drive from active locale) or drop the auto-`pattern` and let consumers pass `rules.pattern`.

### F-129 · **P1** · BUG · medium — `TimeConfig.showHour/showMinute/showSecond` ignored; `buildTimeConfig` dead

- `packages/components/src/Form/FormDatePicker/TimePicker.tsx:95`
- **Evidence:** column visibility derived only from the `format` string (same in `TimeInput.tsx:33-35`); `showTime={{ showHour: true, showMinute: true }}` still renders seconds; `buildTimeConfig`'s output (useFormDatePicker :85-93) is never consumed.
- **Fix:** derive visibility from the explicit booleans when present (format parsing as fallback); delete `buildTimeConfig` or wire it through.

### F-130 · **P1** · BUG · medium — TimeInput commits against stale `value` prop — edits to other fields are lost

- `packages/components/src/Form/FormDatePicker/TimeInput.tsx:49`
- **Evidence:** in-progress edits live in local state; on blur the commit rebuilds the date from the `value` prop, so typing hours then minutes commits `value` + minutes only; the sync effect (`if (value)`) leaves stale digits after clearing.
- **Fix:** commit from the latest local state of all three fields (single draft Date); clear local inputs when `value` becomes empty.

### F-131 · **P1** · BUG · safe — TimeInput's three number inputs have no accessible name

- `packages/components/src/Form/FormDatePicker/TimeInput.tsx:63`
- **Evidence:** no `aria-label`/`labelledby` on hours/minutes/seconds; the TimePicker "Hour/Minute/Second" text is not associated → three anonymous number boxes read to screen readers.
- **Fix:** translated `aria-label` (or labelledby) on each field.

### F-132 · **P1** · BUG · safe — FormCheckbox/FormSwitch fall into uncontrolled mode when form value is undefined

- `packages/components/src/Form/Form.tsx:389` (FormSwitch :425)
- **Evidence:** Radix treats `checked={undefined}` as _uncontrolled_; for fields without `defaultValue`, RHF's `field.value` is `undefined` → the control detaches from form state (`reset()`/`setValue()` no longer update the display).
- **Fix:** `checked={value ?? false}` (keep `indeterminate` as a distinct explicit value).

### F-133 · **P1** · BUG · medium — FormFileUpload creates blob URLs during render and never revokes them

- `packages/components/src/Form/FormFileUpload/FileUpload.tsx:504` (also :581)
- **Evidence:** `URL.createObjectURL` inside render props — a new unreleased URL on every re-render of the file list; `revokeObjectURL` never called (related: F-031/F-033 in ui/file-upload).
- **Fix:** memoize object URLs per File; revoke on unmount and on removal.

### F-134 · **P1** · WORKAROUND · safe — MonthPickerPanel special-cases Vietnamese with a hardcoded string

- `packages/components/src/Form/FormDatePicker/MonthPickerPanel.tsx:152`
- **Evidence:** `locale?.code?.startsWith('vi') ? `Năm ${viewYear}` : String(viewYear)` — locale-sniffing hack, un-localizable for every other locale.
- **Fix:** `Intl.DateTimeFormat(locale, { year: 'numeric' })` or the date-fns locale's long format.

### F-135 · **P1** · BUG · medium — FormNumberInput `min`/`max` (default '0'/'100') are inert; dual min/max API

- `packages/components/src/Form/FormNumberInput/FormNumberInput.tsx:50`
- **Evidence:** (verified against `react-number-format@5.4.5`) `NumericFormatProps` has no `min`/`max` semantics — they land as inert attributes on a `type="text"` input; actual clamping uses a _second_ API (`minValue`/`maxValue`, ±Infinity defaults) applied only on blur.
- **Fix:** remove `min`/`max` or make them the single source of truth consumed by the hook's clamp logic; document one bounded API.

### F-136 · **P1** · BUG · safe — `getAutoComplete`: username branch unreachable

- `packages/components/src/Form/Form.tsx:46`
- **Evidence:** `normalizedName.includes('name')` is checked first — any `username` field also contains `name`, so `autocomplete="username"` is never emitted (dead branch); autofill behavior degraded.
- **Fix:** check `username` (and other specific substrings) before `name`.

### F-137 · **P1** · BUG · medium — FormRadio: external `value` prop shadows form state; `String(null)` → `"null"`

- `packages/components/src/Form/FormRadioGroup/FormRadio.tsx:68`
- **Evidence:** `parseValue` (`useFormRadio.ts:24-28`) does `String(value)` for any non-undefined — `value={null}` displays the literal `"null"`; a stale non-form `value` diverges display from form state permanently.
- **Fix:** drop the `value` prop (or document as `defaultValue`-only); map `null`/`undefined` to `''` in `parseValue`.

### F-138 · **P1** · CONTRACT · medium — Sub-44px interactive targets in pickers, stepper, file list

- `packages/components/src/Form/FormDatePicker/MonthPickerPanel.tsx:44` (+ YearPickerPanel :29-30, StepperControls :13-32, FileUpload :195-196/:540-543)
- **Evidence:** 28×28 nav buttons, 18px stepper buttons inside a 36px input, 32px delete, ~26px "Clear all".
- **Fix:** expand hit areas (inset regions) or size to token-based 44px on coarse pointers — touch-target workstream.

### F-139 · **P1** · CONTRACT · medium — Magic values across all Form files

- `packages/components/src/Form/Form.tsx:60` (+ Single/RangeDatePicker, TimePicker, Month/YearPickerPanel, FileUpload ×15, FormNumberInput, StepperControls, FormRadio, `layout/Container.tsx:14-19` un-tokened maxWidth scale)
- **Fix:** introduce missing tokens (maxWidth scale, border widths, icon sizes, opacity steps) in `tokens.stylex` and replace literals — token sweep.

### F-140 · **P1** · TYPE-SAFETY · safe — `Box` dynamic style lookup via `as any`

- `packages/components/src/layout/Box.tsx:66`
- **Evidence:** `(styles as any)[`p_${p}`]` with oxlint-disable comments (0% `any` contract).
- **Fix:** `const pStyles: Record<BoxSpacingTier, stylex.StyleXStyles> = { '0': styles.p_0, … }` and index it — no cast (`as any` workstream §4.3b).

### F-141 · **P1** · CONTRACT · medium — Raw `<div>`/`<span>` layout throughout the in-scope components

- `packages/components/src/Form/FormDatePicker/FormDatePicker.tsx:127` (+ 25 more sites across the picker panels, FileUpload, FormNumberInput, FormRadio, StepperControls)
- **Fix:** `VStack`/`HStack`/`Box` + `Text as="span"`; a shared panel primitive would cover most date-panel sites at once — raw-div sweep.

### F-142 · **P1** · WORKAROUND · safe — StepperControls: unregistered i18next keys render as the raw aria-label

- `packages/components/src/Form/FormNumberInput/StepperControls.tsx:53`
- **Evidence:** `t('form_increase_value')` — the key exists nowhere else in the package and no default resource is bundled → the aria-label is the literal key string; also bypasses the documented Astryx `useTranslator` path.
- **Fix:** bundle a default translation for these keys (or use `useTranslator()` with Astryx catalog entries) — i18n sweep.

### F-143 · **P2** · TYPE-SAFETY · safe — Type holes: `Record<string, unknown>` union, value casts, `locale?: any`

- `packages/components/src/Form/FormMultiSelect/FormMultiSelect.tsx:6` (+ FormSelect :33/:40, FormNumberInput :91, FormDatePicker/types.ts:71, MonthPickerPanel :114, FormFileUpload/index.tsx:141)
- **Evidence:** `& Record<string, unknown>` disables excess-property checking on the public API; `field.value as T` with unrelated `T`; `locale?: any` instead of date-fns `Locale` (SingleDatePicker :95 does it right).
- **Fix:** type extra props concretely; derive `T` from `FieldPathValue`; use `Locale`.

### F-144 · **P2** · REDUNDANT · safe — Dead code and props that are accepted but ignored

- `packages/components/src/Form/FormDatePicker/useFormDatePicker.ts:119` (+ useFormNumberInput :12, useFormRadio :44-48, FormRadio :38/:44-45/:48, useFormSelect :82-99, Container :69-70)
- **Evidence:** `getSizeClassName`/`getStatusClassName` return `''`; `numericInputBaseClass = []`; `radioSizeClasses` all empty + public `size`/`optionType`/`buttonStyle`/`hideErrorMessage` props destructured as `_` and ignored; `useFormSelect` computes `enhancedRules`/`isRequired` that `FormSelect` never passes; unreachable `?? styles.sizeXl`/`?? styles.gutterMd`.
- **Fix:** delete dead helpers; implement or remove the advertised props; drop or wire `enhancedRules`.

### F-145 · **P2** · REDUNDANT · medium — Copy-paste style blocks and header JSX across picker components

- `packages/components/src/Form/FormDatePicker/RangeDatePicker.tsx:20`
- **Evidence:** `triggerButton/statusError/statusWarning/fullWidth/rightControls/clearButton/icon/popoverContent` byte-identical to SingleDatePicker :26-60; `typographySize` mapping ×2; trigger Button + right-controls block ×2; Month vs Year panel/header/nav structure duplicated.
- **Fix:** extract a shared `PickerTrigger` (with the F-120 clear-button fix) and `PanelHeader`/`panelStyles` used by all four panels.

### F-146 · **P2** · CONTRACT · high — FormDatePicker uses a second, parallel form-field system and lacks `sx`

- `packages/components/src/Form/FormDatePicker/FormDatePicker.tsx:5`
- **Evidence:** every other Form wrapper builds on `FormBase` + `ui/field` (Astryx Field); FormDatePicker alone uses the shadcn-style `ui/form` system — two label/error/required-asterisk implementations with different a11y behavior (see F-119); no `sx` passthrough.
- **Fix:** re-home the date picker on `FormBase` (passing `id`/`aria-invalid`/`aria-describedby` to the trigger) and add `sx` — Phase 4 (architectural).

### F-147 · **P2** · BUG · safe — `closeOnSelect` silently ignored for single picker; `currentMonth` doesn't follow value changes

- `packages/components/src/Form/FormDatePicker/FormDatePicker.tsx:84`
- **Evidence:** `closeOnSelect` passed only to `RangeDatePicker`; `StandaloneDatePickerProps` has no such prop → base-level `closeOnSelect` is a no-op for single/date-time pickers. `SingleDatePicker.tsx:124` initializes `currentMonth` once from `value` and never resyncs → after `reset()`/`setValue()` the calendar shows the wrong month.
- **Fix:** implement `closeOnSelect` in `SingleDatePicker` or remove it from shared base props; sync `currentMonth` to `value` (effect or derived state).

### F-148 · **P2** · CONTRACT · safe — Form stories ship raw `<div>`/`<span>`, inline raw-px styles, a raw hex

- `packages/components/src/Form/Form.stories.tsx:64` (+ DatePicker.stories :21/:38/:58/…/:175 `#eab308`)
- **Fix:** rebuild scaffolding on `VStack`/`Box` with tokens; `colors.warning` for the warning label (stories workstream §4.3b).

## 3.7 Typography + Selects (Typography, Select, Dropdown, MultiSelect)

### F-149 · **P0** · BUG · high — BaseSelect dropdown list is mouse-only: no listbox semantics, no keyboard access

- `packages/components/src/Select/BaseSelect.tsx:417`
- **Evidence:** options are un-focusable `<div onClick>` rows inside a Radix popover — no `role="listbox"`/`role="option"`, no arrow-key/Enter/Escape handling, no roving focus; the entire list is unreachable by keyboard (WCAG 2.1.1 / 4.1.2).
- **Fix:** rebuild on a listbox/combobox pattern (Radix `Select`, Astryx Select, or APG listbox with `aria-activedescendant`) rather than patching; this subsumes F-150 (trigger focus) and F-153 (clear icon). The a11y cluster (F-149/F-150/F-153) argues for rebuilding on an existing listbox primitive — see §5 (Q5); scheduled as a dedicated Phase 1 PR (§4.2).

### F-150 · **P1** · BUG · safe — `outline: none` without any `:focus-visible` replacement on interactive controls

- `packages/components/src/Typography/Text.tsx:121`; also `Title.tsx:97` (edit/copy buttons), `Code.tsx:66` (copy button), `Select/BaseSelect.tsx:35` (trigger) and `:102` (search input), `MultiSelect/renderers.tsx:88` (badge remove) and `:150` (clear-all)
- **Evidence:** verified against `@astryxdesign/core` reset.css and theme.css: no global `:focus-visible` rule exists, so these raw elements keep no visible focus indicator (WCAG 2.4.7).
- **Fix:** add a shared `:focus-visible` style using `colors.focusRing`/`shadow.ringFocus` tokens — `focus-ring sweep` (§4.3b).

### F-151 · **P1** · BUG · safe — BaseSelect search filter is never cleared when the popover closes

- `packages/components/src/Select/BaseSelect.tsx:236`
- **Evidence:** `const [open, setOpen] = useState(false); const [search, setSearch] = useState('');` — no effect resets `search` on close, so reopening shows a stale filter and a hidden subset of options. (`MultiSelect` does this correctly in `useMultiSelect.ts:258-262`.)
- **Fix:** `useEffect(() => { if (!open) { setSearch(''); onSearchTextChange?.(''); } }, [open])`.

### F-152 · **P1** · BUG · safe — BaseSelect "Select all" clobbers selection outside the active search filter

- `packages/components/src/Select/BaseSelect.tsx:322`
- **Evidence:** both branches operate on `filteredOptions` only while `selectedValues` holds the full selection — with a search active, "Deselect all" wipes options that don't match the filter, and "Select all" replaces the whole selection with just the filtered subset.
- **Fix:** "select all" should union with existing values; "deselect all" should filter out only the filtered set.

### F-153 · **P1** · BUG · safe — Icon-only actions are not keyboard operable (lucide svg/span with onClick)

- `packages/components/src/Select/BaseSelect.tsx:377`; also `Select/MultiSelectTags.tsx:139-148`, `MultiSelect/renderers.tsx:368-378`, `MultiSelect/MultiSelect.tsx:276-279`
- **Evidence:** `<Icons.XIcon {...stylex.props(styles.clearIcon)} onClick={handleClear} />` — `Icons.*` are lucide SVGs rendered `aria-hidden` and un-focusable, so these actions exist only for pointer users (clear icon; tag-remove `<span onClick>`; "+N more" `XCircle onClick`; `WandSparkles` animation toggle).
- **Fix:** wrap each in `<button type="button">` with an `aria-label`; subsumed by the F-149 rebuild.

### F-154 · **P1** · BUG · medium — MultiSelect controlled `value` is honored only at mount

- `packages/components/src/MultiSelect/MultiSelect.tsx:120`
- **Evidence:** `useMultiSelect({ ..., defaultValue: value || defaultValue })` — state is seeded once (`useMultiSelect.ts:109`); later `value` changes only flow through the `resetOnDefaultValueChange` side channel (`useMultiSelect.ts:247-256`). With `resetOnDefaultValueChange={false}` the documented "controlled" contract (`type.ts:90-92`) silently stops working; a lagging parent echo lets internal state diverge from `value`, and a stale `value` update clobbers fresh user selections.
- **Fix:** implement real controlled mode: when `value !== undefined`, render from it and route all mutations through `onValueChange`.

### F-155 · **P1** · BUG · safe — `MultiSelect.focus()` flashes an invalid CSS outline (`hsl(var(--ring))`)

- `packages/components/src/MultiSelect/useMultiSelect.ts:363`
- **Evidence:** `buttonRef.current.style.outline = '2px solid hsl(var(--ring))'` — `--ring` is a hex value (`#3b82f6` in `vlrc-theme.css:24`), so `hsl(#3b82f6)` is invalid CSS and is dropped; the programmatic focus flash never renders. The imperative style mutation + 1s restore also races with real focus.
- **Fix:** use a StyleX class toggled via `classList` (e.g. `shadow.ringFocus`) or rely on the native `:focus-visible` ring.

### F-156 · **P1** · CONTRACT · medium — Hardcoded user-facing strings (i18n contract)

- `packages/components/src/Select/BaseSelect.tsx:215`
- **Evidence:** `BaseSelect` ships `'Select...'` (:215), `'Search...'` (:389), `'Loading...'` (:409), `'No data'` (:411), `'Select all'`/`'Deselect all'` (:400), `'Loading more...'` (:450). `MultiSelect` ships `'Select options'` (`MultiSelect.tsx:94`), `'Search options...'`, `'No results found.'`, `'Clear'`, `'Close'`, `'(Select All'`, `'Remove X from selection'`, `'Clear all N selected options'`, `'+N more'`, English aria/live-region sentences (`renderers.tsx:343-478`) and the sr-only key hint (`MultiSelect.tsx:174`).
- **Fix:** the contract routes component strings through Astryx `InternationalizationProvider`; move these to translator-backed defaults — `i18n sweep` (§4.3b).

### F-157 · **P1** · CONTRACT · safe — Raw `rgba()`/named color in MultiSelect badge styles

- `packages/components/src/MultiSelect/renderers.tsx:90`
- **Evidence:** `':hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }` plus `color: 'white'` at :300 — hardcodes a white overlay, violating zero-magic-values and breaking dark themes.
- **Fix:** use tokens, e.g. `color-mix(in srgb, <token> 20%, transparent)` from `tokens.stylex.ts` — `token sweep` (§4.3b).

### F-158 · **P1** · WORKAROUND · medium — MultiSelect `animationConfig` produces undefined/Tailwind classes — dead feature

- `packages/components/src/MultiSelect/utils.ts:108`
- **Evidence:** `case 'bounce': return isAnimating ? 'animate-bounce' : 'hover:-translate-y-1 hover:scale-110';` — the package has no Tailwind (AGENTS.md forbids Tailwind classes in sources) and no `@keyframes` for `animate-scaleIn`/`animate-slideInDown`/`animate-fadeIn`/`animate-flipIn`/`animate-wiggle` (:131-137) — every `badgeAnimation`/`popoverAnimation` option is a silent no-op applied via `cn(...)` in `renderers.tsx:310` / `MultiSelect.tsx:247`.
- **Fix:** implement with StyleX keyframes + `duration`/`easing` tokens, or remove the dead API (also drops the duplicated `animationDuration` at `renderers.tsx:294` vs `:313`). Related: the `'inverted'` `MultiSelectVariant` silently maps to Badge `secondary` (`renderers.tsx:304`) — dead variant, mention when touching this (see §5).

### F-159 · **P1** · NON-MODERN · medium — MultiSelectTags responsive fit: one-shot manual `offsetWidth` loop, no ResizeObserver

- `packages/components/src/Select/MultiSelectTags.tsx:76`
- **Evidence:** the effect runs only on `[selectedOptions, maxTagCount]` reading `container.offsetWidth - 60` — no `ResizeObserver`, so `visibleCount` goes stale whenever the container resizes (window resize, panel collapse, flex reflow). Also magic numbers 60/4 and the `select-tag` marker class juggled via `classList.contains` (:86, :123, :130).
- **Fix:** use a `ResizeObserver` (cleaned up in the effect) to recompute, and a token for the gap.

### F-160 · **P1** · CONTRACT · safe — Title gradient variant uses raw CSS vars without fallbacks — invisible-text risk

- `packages/components/src/Typography/Title.tsx:56`
- **Evidence:** `backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, var(--chart-4) 50%, var(--chart-5) 100%)'` + `WebkitTextFillColor: 'transparent'` — bypasses the `colors.primary`/`chart4`/`chart5` tokens, which ship hex fallbacks (`tokens.stylex.ts:16,63-64`); if a consumer's theme omits those vars, the heading renders fully invisible.
- **Fix:** use the token (var-with-fallback) values.

### F-161 · **P1** · BUG · safe — `allowClear` is a dead prop: declared, passed through FormSelect, ignored by BaseSelect

- `packages/components/src/Select/type.ts:37`
- **Evidence:** `BaseSelect` only reads `isClearable` (`BaseSelect.tsx:216`), but `useFormSelect.ts:55,78` destructures and forwards `allowClear` into `BaseSelectPassThroughProps` where it is dropped — a `FormSelect` consumer passing `allowClear` (the idiom established by `FormDatePicker`) silently gets no clear icon.
- **Fix:** honor it as an alias of `isClearable` or remove it from the type and pass-through list; likely affects `FormSelect` consumers migrating from DatePicker (§5).

### F-162 · **P1** · CONTRACT · safe — Raw rem spacing/duration values instead of spacing/duration tokens

- `packages/components/src/Typography/Text.tsx:114`
- **Evidence:** `padding: '0.125rem 0.25rem'`, `marginLeft: '0.25rem'`, `transitionDuration: '150ms'` — systematic across the area: `Title.tsx:19,92`, `Code.tsx:17-18,30,61,68`, `Select/BaseSelect.tsx:29-31,38`, `MultiSelectTags.tsx:22-23`, `Blockquote.tsx:10-11`. The tokens exist (`spacing.0.5`/`spacing.1`/…, `duration.fast/normal`, `tokens.stylex.ts:122-188`); 150ms matches no duration token (§5: 150ms token decision).
- **Fix:** replace with `spacing.*`/`duration.*` — `token sweep` (§4.3b).

### F-163 · **P2** · REDUNDANT · safe — `MultiSelectRef` declares `selectAll`/`clearAll` that are never implemented

- `packages/components/src/MultiSelect/type.ts:266`
- **Evidence:** `useImperativeHandle` (`useMultiSelect.ts:340-375`) only returns `reset`/`getSelectedValues`/`setSelectedValues`/`clear`/`focus` — the declared `selectAll`/`clearAll` members are fiction.
- **Fix:** implement them (logic already exists: `toggleAll`, `handleClear`) or delete the interface members.

### F-164 · **P2** · REDUNDANT · safe — MultiSelect support types are not exported from the package root

- `packages/components/src/index.ts:29`
- **Evidence:** `MultiSelectProps.options` references `MultiSelectOption`/`MultiSelectGroup` and its `ref` is `MultiSelectRef` — none of these (nor `AnimationConfig`) are exported, so consumers cannot type an options array or a ref without deep imports or `any`.
- **Fix:** export them alongside `MultiSelectProps`.

### F-165 · **P2** · CONTRACT · safe — BaseSelect and MultiSelect do not expose `sx`

- `packages/components/src/Select/type.ts:21`
- **Evidence:** the contract requires every wrapper to expose `sx?: stylex.StyleXStyles` and merge `className`; `BaseSelectCommonProps` and `MultiSelectProps` have `className` but no `sx`.
- **Fix:** add `sx` and merge it into the trigger (and popover content where applicable).

### F-166 · **P2** · REDUNDANT · medium — 7-tier size styles and ellipsis resolution copy-pasted across 5 typography components

- `packages/components/src/Typography/Text.tsx:18`
- **Evidence:** near-identical size blocks in `Text.tsx:18-45`, `Title.tsx:23-51`, `Paragraph.tsx:23-50`, `Link.tsx:28-48`; `resolvedRows`/`isSingleEllipsis` duplicated at `Text.tsx:220-223`, `Title.tsx:217-220`, `Paragraph.tsx:216-219`, `Link.tsx:136-139` and a third copy in `Typography/utils.ts:49`; semantic type-style maps duplicated in `Text.tsx:153-162` and `Paragraph.tsx:162-171`.
- **Fix:** extract shared builders in `Typography/utils.ts`.

### F-167 · **P2** · REDUNDANT · safe — Font-weight and tracking values duplicated across maps

- `packages/components/src/Typography/weightStyles.ts:4`
- **Evidence:** numeric weights duplicate `TypographyWeightMap` (`types.ts:70-84`); tracking values `-0.035em`/`0.05em` appear in both `Title.tsx:68,74` and `Typography/utils.ts:7,9`.
- **Fix:** derive one from the other to prevent drift.

### F-168 · **P2** · REDUNDANT · medium — MultiSelect re-implements breakpoint detection with different thresholds than `useBreakpoint`

- `packages/components/src/MultiSelect/useMultiSelect.ts:312`
- **Evidence:** `if (width < 640) … < 1024 …` — the library already ships `useBreakpoint` (`ui/useBreakpoint.ts`, 576/768/992/1200/1600); the same "mobile/tablet" concept resolves differently in MultiSelect (640/1024), so responsive behavior is inconsistent across the package.
- **Fix:** reuse `useBreakpoint` or align thresholds in one place. (Perf note: `useBreakpoint` itself is 6 matchMedia listeners per Row/Col/Masonry item — tracked in §5, not a finding.)

### F-169 · **P2** · TYPE-SAFETY · safe — Defensive cast on `import.meta` for isDev

- `packages/components/src/MultiSelect/useMultiSelect.ts:84`
- **Evidence:** `Boolean((import.meta as { env?: { DEV?: boolean; NODE_ENV?: string } }).env?.DEV) || …` — the package builds with Vite (`vite.config.ts`), where `import.meta.env` is typed; the double cast papers over a missing `vite/client` type reference.
- **Fix:** use `import.meta.env.DEV` directly.

### F-170 · **P2** · NON-MODERN · safe — Deprecated `keyCode === 229` checks alongside `isComposing`

- `packages/components/src/Typography/Title.tsx:300`; also `MultiSelect/useMultiSelect.ts:175`
- **Evidence:** `if (e.nativeEvent.isComposing || e.keyCode === 229) return;` — `keyCode` is deprecated; `isComposing` covers IME composition on all current browsers.
- **Fix:** drop the `keyCode` check (keep `isComposing`, optionally `e.key === 'Process'`).

### F-171 · **P2** · NON-MODERN · safe — Duplicated legacy sr-only style blocks (`clip: rect(...)`)

- `packages/components/src/MultiSelect/renderers.tsx:33`; identical block in `MultiSelect/MultiSelect.tsx:75-85`
- **Evidence:** `srOnly: { position: 'absolute', width: 1, height: 1, margin: -1, clip: 'rect(0, 0, 0, 0)' }` — `clip` is legacy (Baseline replacement: `clip-path: inset(50%)`).
- **Fix:** extract one shared sr-only StyleX block using `clip-path` — `shared-srOnly sweep` (§4.3b); decision on shipping `.sr-only` in the package is open (§5).

### F-172 · **P2** · NON-MODERN · safe — `div[role="button"]` instead of `<button>` for the clear-all action

- `packages/components/src/MultiSelect/renderers.tsx:383`
- **Evidence:** `<div role="button" tabIndex={0} onClick={…handleClear()}>` — a native `<button>` gives focus, keyboard activation and semantics for free (the sibling badge-remove control at :330 already uses `<button>`).
- **Fix:** replace the div.

### F-173 · **P2** · BUG · safe — Copy/announce `setTimeout`s without cleanup; stacked timers reset "Copied" early

- `packages/components/src/Typography/Text.tsx:262`; also `Title.tsx:257`, `Code.tsx:135`, and the 100ms live-region clears in `useMultiSelect.ts:132,135`
- **Evidence:** `await navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 2000);` — timers are never cleared on unmount, and a second click before the first timer fires leaves a pending `setCopied(false)` that flips the icon back early.
- **Fix:** store the timer in a ref; clear/reset it on new clicks and unmount.

### F-174 · **P2** · REDUNDANT · safe — BaseSelect `inputRef` is declared and attached but never read

- `packages/components/src/Select/BaseSelect.tsx:237`
- **Evidence:** `const inputRef = useRef<HTMLInputElement>(null);` — attached at :387 and never used (Radix popover + `autoFocus` already manage the search input's focus).
- **Fix:** remove it, or use it deliberately when reopening.

### F-175 · **P2** · BUG · safe — Title editable: Escape keeps discarded text; `textValue` never resyncs with children

- `packages/components/src/Typography/Title.tsx:212`
- **Evidence:** `const [textValue, setTextValue] = useState(typeof children === 'string' ? children : '');` and `if (e.key === 'Escape') setIsEditing(false);` — Escape "cancels" the edit but leaves `textValue` mutated, so the next edit session starts from the discarded text; if `children` changes externally (e.g. after a rejected `onEdit`), `textValue` stays stale.
- **Fix:** reset `textValue` from `children` on Escape and when not editing.

### F-176 · **P2** · CONTRACT · safe — Story demos use raw `<div>`/`<p>` with inline styles

- `packages/components/src/Select/BaseSelect.stories.tsx:126`; also `Typography/Typography.stories.tsx:295-317`, `MultiSelect/MultiSelect.stories.tsx:43`, a raw `<b>` in `Dropdown/Dropdown.stories.tsx:122`
- **Evidence:** `<div style={{ display: 'flex', … gap: '1.5rem', width: 280 }}>` + raw `<p style={{ … color: 'var(--muted-foreground)' }}>` — demo code should model the no-raw-element/token contract it demonstrates.
- **Fix:** swap to `Flex`/`Box` + `Text` with tokens — `raw-div sweep` / `stories workstream` (§4.3b).

### F-177 · **P2** · BUG · medium — Dropdown hover trigger closes the instant the pointer crosses the 4px gap

- `packages/components/src/Dropdown/Dropdown.tsx:292`
- **Evidence:** `onMouseLeave: () => handleOpenChange(false)` — no grace period; moving the pointer from trigger to content crosses the `sideOffset` (default 4px) gap, so the menu dismisses before the user reaches an item.
- **Fix:** add a ~150–300ms close timeout cancelled on re-entry (standard hoverable-dropdown pattern).

### F-178 · **P2** · REDUNDANT · safe — BaseSelect/MultiSelect trigger `onClick` duplicates the Radix PopoverTrigger's built-in toggle

- `packages/components/src/Select/BaseSelect.tsx:358`; also `MultiSelect.tsx:193` (`handleTogglePopover`)
- **Evidence:** `onClick={() => !disabled && setOpen((v) => !v)}` — verified against `@radix-ui/react-dialog` 1.1.23: `DialogTrigger` (used by `PopoverTrigger`) already injects `onClick: composeEventHandlers(props.onClick, context.onOpenToggle)`, so both handlers toggle the same state — it works only because they derive from identical state.
- **Fix:** drop the custom `onClick` and let the Popover trigger drive `open`.

---

## 3.8 DataTable, Theme, Icons, Richtext, Editor, Hooks, Apps & Config

### F-179 — Published `@vlrc-fe/components@3.0.6` dist is broken: 13 `@radix-ui/*` packages missing from Vite `external` — **P0**

- File(s): `packages/components/vite.config.ts:46-75`
- Severity: **P0** · Fix risk: **low** (external-list change, rebuild, republish patch)
- Description: `rollupOptions.external` (l.46-75) lists only 12 of the 25 `@radix-ui/*` packages imported by `src` — missing `alert-dialog`, `aspect-ratio`, `avatar`, `collapsible`, `context-menu`, `hover-card`, `menubar`, `navigation-menu`, `slider`, `switch`, `tabs`, `toggle`, `toggle-group`. **Verified against the published npm tarball `@vlrc-fe/components@3.0.6`**: 253 dist files import `../node_modules/.pnpm/@radix-ui_react-*@.../dist/index.js` paths that do not exist in the published package, and `dist/index.js` re-exports `./ui/tabs.js`, which carries one of those imports — so **any consumer fails at load with `ERR_MODULE_NOT_FOUND`**. This is the release blocker.
- Evidence:

```ts
// vite.config.ts:46-75 — external lists only 12/25 radix packages
external: [
  'react',
  'react-dom',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu' /* … 12 total */,
  /* missing: alert-dialog, aspect-ratio, avatar, collapsible, context-menu,
     hover-card, menubar, navigation-menu, slider, switch, tabs, toggle, toggle-group */
];
```

```text
# from the published 3.0.6 tarball (verified)
dist/ui/tabs.js: import … from '../node_modules/.pnpm/@radix-ui_react-tabs@…/dist/index.js'
→ path absent from the published package → ERR_MODULE_NOT_FOUND at consumer load
```

- Suggested fix: Add `/^@radix-ui\//` (plus any radix transitive utils that get inlined) to `external`, rebuild, verify zero `.pnpm` references in `dist` (add a CI check), and republish as a patch (3.0.7). See Phase 0.

### F-180 — `DataTable` drops `<th>` for columns defined only by `accessorKey`, misaligning the grid — **P0**

- File(s): `packages/components/src/DataTable/components/DataTableTable.tsx:55-61`
- Severity: **P0** · Fix risk: **low**
- Description: `DataTableTable.tsx:55-61` returns `null` when `header.column.columnDef.header === undefined`, so any `{accessorKey}`-only column renders no `<th>` while its `<td>`s render (`ui/table.tsx:151` renders `<th>`). Result: fewer `th` than `td` — **columns misalign visually and the table is structurally invalid for screen readers** (no header association for that column).
- Evidence:

```tsx
// DataTableTable.tsx:55-61
const headerLabel = header.column.columnDef.header;
if (!headerLabel) return null; // <th> dropped, <td> still rendered
return <TableHead>{headerLabel}</TableHead>;
```

- Suggested fix: Render a `<TableHead>` with a fallback label (humanized `accessorKey`) instead of `null`.

### F-181 — Editor `value` prop documented as controlled markdown but silently ignored — **P1**

- File(s): `packages/editor/src/Editor.tsx:104`; `packages/editor/src/types.ts:8`
- Severity: **P1** · Fix risk: **low** (implement or remove)
- Description: `Editor.tsx:104` destructures `value: _value` and it is never read anywhere in the component; `types.ts:8` documents it as the controlled markdown value. A consumer passing `value` sees their content never applied, with no warning — a documented API that is fiction.
- Evidence:

```ts
// Editor.tsx:104
const { value: _value, onChange, ...rest } = props;   // _value never used
// types.ts:8
value?: string;  // "Controlled markdown value" (doc comment)
```

- Suggested fix: Either implement controlled updates (patch editor state when `value` changes) or remove the prop from public `types.ts` until supported; at minimum, document it as uncontrolled-only.

### F-182 — Editor `readOnly` only applied at mount — post-mount toggles are no-ops — **P1**

- File(s): `packages/editor/src/Editor.tsx:127-143`
- Severity: **P1** · Fix risk: **low–medium**
- Description: `readOnly` flows into `initialConfig` of `LexicalComposer` (`Editor.tsx:127-143`). Verified in `@lexical/react`'s `LexicalComposer.dev.js`: `initialConfig` is consumed only inside `useMemo(..., [])` + `useLayoutEffect(..., [])`, so changing `readOnly` after mount never calls `editor.setEditable()`. A "view mode" toggle done after first render does nothing.
- Evidence:

```tsx
// Editor.tsx:127-143
<LexicalComposer initialConfig={{ editable: !readOnly, ... }}>
// readOnly changes after mount → no effect (initialConfig is frozen)
```

- Suggested fix: Add `useEffect(() => { editor.setEditable(!readOnly); }, [readOnly])` via a small inner plugin or `useLexicalEditable`-style effect.

### F-183 — Drag-handle "Duplicate" action moves the block instead of cloning it — **P1**

- File(s): `packages/editor/src/plugins/DraggableBlockPlugin.tsx:139-150`
- Severity: **P1** · Fix risk: **low**
- Description: The "Duplicate" handler calls `top.insertAfter(node)` — `insertAfter` **relocates** `node` after `top` and removes it from its original position, so the action is effectively "move down" and the user's content is not duplicated.
- Evidence:

```ts
// DraggableBlockPlugin.tsx:139-150 (abridged)
case 'duplicate':
  top.insertAfter(node);   // moves node; original position emptied
```

- Suggested fix: `top.insertAfter(node.clone(true))` — clone first, then insert the clone.

### F-184 — Row resize never commits the new height on pointer-up — **P1**

- File(s): `packages/editor/src/plugins/TableCellResizerPlugin.tsx:169-174`
- Severity: **P1** · Fix risk: **low**
- Description: The column-resize path commits on pointer-up via `editor.update` with the new width (l.121-135); the row-resize pointer-up handler (l.169-174) only detaches listeners and **never writes the dragged height back**, so any row-height change reverts on the next render.
- Evidence:

```ts
// TableCellResizerPlugin.tsx:169-174
const onRowPointerUp = () => {
  removeEventListener('pointermove', onRowMove);
  removeEventListener('pointerup', onRowPointerUp);
  // ← no editor.update with the new row height (contrast l.121-135)
};
```

- Suggested fix: Mirror the column path: on row pointer-up compute the new height and update the row/table node inside `editor.update`.

### F-185 — `useUploadFile` wraps async config callbacks in an async promise executor — **P1**

- File(s): `packages/hooks/src/useUploadFile.ts:59`
- Severity: **P1** · Fix risk: **low–medium** (behavioral: errors now surface)
- Description: `new Promise(async (resolve, reject) => ...)` at l.59. If `endpoint(file)` (l.72), `headersConfig(file)` (l.83) or `extraBody(file)` (l.190) rejects, the rejection escapes the executor as an **unhandled rejection** while the outer promise never settles (hangs) — `reject` is never called.
- Evidence:

```ts
// useUploadFile.ts:59
const result = await new Promise(async (resolve, reject) => {
  const url = await endpoint(file);   // rejection here = unhandled, promise hangs
  ...
});
```

- Suggested fix: Use an async IIFE inside a plain executor — `new Promise((resolve, reject) => { (async () => { ... })().then(resolve).catch(reject); })` — or make the whole wrapper an `async` function.

### F-186 — Faceted filter renders two overlapping "selected count" badges — **P1**

- File(s): `packages/components/src/DataTable/components/DataTableFacetedFilter.tsx:172-193`
- Severity: **P1** · Fix risk: **low**
- Description: The trigger always renders a bare `{selectedSet.size}` badge (l.175-177), and when `selectedSet.size > 2` it **additionally** renders a second `{size} selected` badge (l.172-193) — for 3+ selections the user sees "3" and "3 selected" side by side.
- Evidence:

```tsx
// DataTableFacetedFilter.tsx:172-193 (abridged)
{
  selectedSet.size > 2 && <Badge>{selectedSet.size} selected</Badge>;
}
<Badge>{selectedSet.size}</Badge>; // always rendered → duplicate for 3+
```

- Suggested fix: Render exactly one badge: bare count for ≤ 2, "N selected" for > 2 (or pick a single style).

### F-187 — `DataTable` server-mode query debounce restarts on every render — **P1**

- File(s): `packages/components/src/DataTable/DataTable.tsx:170-175, 215-223`
- Severity: **P1** · Fix risk: **low**
- Description: `query` is a fresh object literal (built at l.170-175) used as a dependency of the `useUpdateEffect` at l.215-223, so the effect fires on **every** render in server mode; each firing cancels and reschedules the debounce. Any unrelated render (e.g. a loading-state flip) resets the debounce window and can indefinitely starve the fetch.
- Evidence:

```ts
// DataTable.tsx:170-175
const query = { pageIndex, pageSize, ...filters }; // new identity each render
// DataTable.tsx:215-223
useUpdateEffect(() => {
  debouncedFetch(query);
}, [query]); // fires every render
```

- Suggested fix: Depend on a stable key instead of object identity — `JSON.stringify(query)` or the individual query values.

### F-188 — `window.prompt` used for link/media input although tested dialogs exist and are exported — **P1**

- File(s): `packages/editor/src/plugins/ToolbarPlugin.tsx:294, 691-694, 736-739, 755-758`; `packages/editor/src/plugins/FloatingToolbarPlugin.tsx:94`
- Severity: **P1** · Fix risk: **medium** (behavior change)
- Description: `window.prompt` is used for the link URL (ToolbarPlugin l.294), image URL (l.691-694) and media (l.736-739, l.755-758), plus FloatingToolbarPlugin l.94 — while `InsertLinkDialog.tsx` and `InsertMediaDialog.tsx` **exist, have unit tests, and are exported** from `packages/editor/src/index.ts:14-15`, yet are never used inside the package. Dead tested code + blocked UX (prompt is unthemed, un-i18n'd, easily dismissed).
- Evidence:

```ts
// ToolbarPlugin.tsx:294
const url = window.prompt('Link URL:'); // while InsertLinkDialog is exported & tested
```

- Suggested fix: Wire the existing dialogs into the toolbar/floating-toolbar actions (open state + controlled inputs), or remove the dialogs if `prompt` is the intended UX.

### F-189 — Raw hex colors in editor components (zero-magic-value contract) — **P1**

- File(s): `packages/editor/src/plugins/ToolbarPlugin.tsx:104-121, 564, 596-598`; `packages/editor/src/plugins/TableActionMenuPlugin.tsx:93-102`; `packages/editor/src/nodes/EmbedNodes.tsx:166`
- Severity: **P1** · Fix risk: **low**
- Description: `ToolbarPlugin.tsx:104-121` `TEXT_COLORS`/`BG_COLORS` are hex literals; `:564` `'#000'`; `:596-598` `'#fff'` + `border: '1px solid #cbd5e1'`; `TableActionMenuPlugin.tsx:93-102` `CELL_BG_COLORS` hex; `EmbedNodes.tsx:166` `border: '1px solid #e2e8f0'`. The published editor paints raw hex everywhere.
- Evidence:

```ts
// ToolbarPlugin.tsx:596-598
background: '#fff',
border: '1px solid #cbd5e1',
```

- Suggested fix: Source the palettes from theme tokens / CSS variables (`colors.*` in `packages/components/src/theme/tokens.stylex.ts`, `--color-*` vars); the color-swatch palettes themselves may stay as data, but chrome (borders, backgrounds) must be tokens.

### F-190 — Legacy `clip: rect(0, 0, 0, 0)` sr-only pattern duplicated — **P1**

- File(s): `packages/components/src/DataTable/createColumns.tsx:19`; `packages/components/src/DataTable/components/DataTableRowActions.tsx:29`
- Severity: **P1** · Fix risk: **low**
- Description: Both files define a screen-reader-only style using the **deprecated** `clip: 'rect(0, 0, 0, 0)'` property plus the 1px width/height pattern — duplicated verbatim in two places. (Note: the pre-fetched legacy scan reported 0 findings and **missed these** — see Appendix B.)
- Evidence:

```ts
// createColumns.tsx:19 / DataTableRowActions.tsx:29 (verbatim duplicate)
clip: 'rect(0, 0, 0, 0)',
width: '1px', height: '1px', overflow: 'hidden',
```

- Suggested fix: Extract one shared sr-only style using `clipPath: 'inset(50%)'` with `overflow: 'hidden'` and `whitespace: 'nowrap'` (the `shared-srOnly sweep`, §4.3b) — and decide whether `.sr-only` ships in the package (open question §5).

### F-191 — Slash menu has roving keyboard nav but no listbox ARIA — invisible to screen readers — **P1**

- File(s): `packages/editor/src/plugins/SlashMenuPlugin.tsx:573-655`
- Severity: **P1** · Fix risk: **medium**
- Description: The custom slash menu (l.573-655) implements `selectedIndex` roving + arrow-key navigation, but renders a plain portal menu with **no `role="listbox"`/`role="option"`, no `aria-activedescendant`**, and focus never leaves the editor — screen-reader users get no option announcements and cannot operate the menu.
- Evidence:

```tsx
// SlashMenuPlugin.tsx:573-655 (abridged)
<div style={menuStyle}>              {/* no role="listbox" */}
  {filteredOptions.map((o, i) => (
    <div key={o.id}>{o.label}</div>  {/* no role="option", no aria-selected */}
  ))}
</div>
```

- Suggested fix: Add `role="listbox"` + `role="option"` (with `aria-selected`), point `aria-activedescendant` at the selected option on the editable anchor, or move focus into the menu with roving `tabindex`.

### F-192 — `DataTable` magic spacing/sizes instead of design tokens — **P1**

- File(s): `packages/components/src/DataTable/DataTable.tsx:26`; `.../components/DataTablePagination.tsx:20-21,31,36`; `.../components/DataTableToolbar.tsx:11-15`; `.../components/DataTableColumnHeader.tsx:18-29`; `.../components/DataTableTable.tsx:24`; `.../createColumns.tsx:24-25`; `.../defaults.tsx:16-18`; `.../components/DataTableViewOptions.tsx:18-20`
- Severity: **P1** · Fix risk: **low**
- Description: Raw rem/px values throughout the data table: `DataTable.tsx:26` gap `'0.5rem'`; `DataTableColumnHeader.tsx:18-29` padding + negative `marginLeft: '-0.5rem'`; `DataTableTable.tsx:24` `'6rem'` max-width; `createColumns.tsx:24-25` 16px; `DataTableViewOptions.tsx:18-20` 16/16/4px; plus `DataTablePagination.tsx:20-21,31,36`, `DataTableToolbar.tsx:11-15`, `defaults.tsx:16-18`. The flagship data component systematically bypasses the token system.
- Evidence:

```ts
// DataTableColumnHeader.tsx:18-29 (representative)
paddingLeft: '2rem', marginLeft: '-0.5rem',
```

- Suggested fix: Replace with `spacing.*` tokens (4px grid) and `radius.*` where applicable — part of the `token sweep` (§4.3b), DataTable batch.

### F-193 — Editor: raw px runtime inline styles, sub-44px touch targets, hardcoded fallback colors — **P1**

- File(s): `packages/editor/src/Editor.tsx:173`; `.../plugins/SlashMenuPlugin.tsx:550-556, 598, 614, 644`; `.../plugins/EmojisPlugin.tsx:91, 102-115`; `.../nodes/EmbedNodes.tsx:73, 82, 157, 164-169`; `.../plugins/TableActionMenuPlugin.tsx:59-61`; `.../plugins/TableHoverActionsPlugin.tsx:19-21`
- Severity: **P1** · Fix risk: **low**
- Description: Runtime inline style objects with raw px values (`Editor.tsx:173`); `EmojisPlugin.tsx:91,102-115` **36×36 emoji targets — below the 44px touch minimum** — with `background: 'var(--color-surface-subtle, #f1f5f9)'` (hex fallback); `TableActionMenuPlugin.tsx:59-61` 20px trigger; `TableHoverActionsPlugin.tsx:19-21` 18px handles. Also `editor.css` uses `transition: all` at lines 208, 513, 586, 694 (Web Interface Guidelines anti-pattern; the legacy scan missed it — Appendix B).
- Evidence:

```tsx
// EmojisPlugin.tsx:102-115 (representative)
width: 36, height: 36,                       // < 44px touch target
background: 'var(--color-surface-subtle, #f1f5f9)',
```

- Suggested fix: Move static styles into `stylex.create` with tokens, bump interactive targets to ≥ 44×44px (`touch-target workstream`), drop hex fallbacks from `var()` expressions, and replace `transition: all` with named properties.

### F-194 — `className` juggling bypasses the `cn()` utility — **P2**

- File(s): `packages/components/src/DataTable/DataTable.tsx:262, 279-282`; `packages/editor/src/Editor.tsx:155-157, 179`
- Severity: **P2** · Fix risk: **low**
- Description: `DataTable.tsx:262,279-282` hand-rolls `className === undefined ? '' : className` although the clsx-based `cn()` (in `utils.ts`) already handles undefined/empty; `Editor.tsx:155-157` filters/joins class strings manually and `:179` uses a `... || ''` template.
- Evidence:

```ts
// DataTable.tsx:279-282
const cls = className === undefined ? '' : className;
```

- Suggested fix: Use `cn(...)` for all className merges — part of the `cn sweep` (§4.3b).

### F-195 — Redundant debounce wiring (immediate overwrite + duplicate unmount cleanup) — **P2**

- File(s): `packages/components/src/DataTable/DataTable.tsx:200-213`; `.../components/DataTableToolbar.tsx:33-46, 48-52`
- Severity: **P2** · Fix risk: **low**
- Description: `DataTable.tsx:200-213`: a `useRef` initialized with a debounced function is immediately overwritten by an effect on first run; `DataTableToolbar.tsx:33-46` does the same, plus a second unmount-only effect (l.48-52) whose cancellation the first effect's cleanup already performs.
- Evidence:

```ts
// DataTable.tsx:200-213 (abridged)
const debouncedRef = useRef(debounce(fn, 300));   // created, then overwritten
useEffect(() => { debouncedRef.current = debounce(fn, 300); return () => { ...cancel }; }, [/* deps */]);
```

- Suggested fix: Create the debounce once in `useMemo` and cancel it in a single unmount effect (or extract a `useDebouncedCallback` hook — a `@vlrc-fe/hooks` candidate, §5).

### F-196 — `expandedState` prop accepted by `DataTableTable` but never used — **P2**

- File(s): `packages/components/src/DataTable/components/DataTableTable.tsx:48`
- Severity: **P2** · Fix risk: **low**
- Description: `DataTableTable.tsx:48` contains `void expandedState;` — the prop is declared in the type, passed at `DataTable.tsx:287`, and never read. Dead API surface masked with `void`.
- Evidence:

```ts
// DataTableTable.tsx:48
void expandedState; // declared, passed, never used
```

- Suggested fix: Remove the prop from the type, the component signature and the call site — or wire up real expanded-row rendering if intended.

### F-197 — No-op `isEmpty(value)` branch in `DataTableToolbar` search — **P2**

- File(s): `packages/components/src/DataTable/components/DataTableToolbar.tsx:59-66`
- Severity: **P2** · Fix risk: **low**
- Description: Both branches of the `isEmpty(value)` conditional call `debouncedSetRef.current` with the same value — the branch changes nothing.
- Evidence:

```ts
// DataTableToolbar.tsx:59-66
if (isEmpty(value)) debouncedSetRef.current('');
else debouncedSetRef.current(value); // '' and value — identical in effect
```

- Suggested fix: Delete the conditional and call `debouncedSetRef.current(value ?? '')` unconditionally.

### F-198 — Faceted filter uses inline raw `<svg>` icons instead of the Icons registry — **P2**

- File(s): `packages/components/src/DataTable/components/DataTableFacetedFilter.tsx:156-170, 211-223`
- Severity: **P2** · Fix risk: **low**
- Description: Inline raw `<svg>` plus-circle and check icons with raw px dimensions, bypassing the central registry — `Icons.PlusCircle` and `Icons.Check` both exist in `packages/components/src/Icons/Icons.tsx` and are used elsewhere.
- Evidence:

```tsx
// DataTableFacetedFilter.tsx:156-170
<svg width="14" height="14" viewBox="0 0 24 24">
  …
</svg> // instead of <Icons.PlusCircle />
```

- Suggested fix: Replace the inline SVGs with `<Icons.PlusCircle />` / `<Icons.Check />` — part of the `icons sweep` (§4.3b).

### F-199 — `DataTable` hardcodes user-facing strings (i18n contract) — **P2**

- File(s): `packages/components/src/DataTable/defaults.tsx:23, 32`; `createColumns.tsx:38, 45, 64`; `components/DataTablePagination.tsx:63, 70, 92, 105`; `components/DataTableViewOptions.tsx:42`; `components/DataTableFacetedFilter.tsx:181, 201, 248`; `components/DataTableColumnHeader.tsx:96, 100, 110`
- Severity: **P2** · Fix risk: **medium** (i18n key/API surface)
- Description: `'Search...'` (defaults.tsx:23), `'No results.'` (:32), `'Select all'`/`'Select row'`/`'Toggle'` (createColumns.tsx:38,45,64), row/page labels (DataTablePagination.tsx:63,70,92,105), `'Columns'` (DataTableViewOptions.tsx:42), facet labels (l.181,201,248), `'Asc'`/`'Desc'`/`'Hide'` (DataTableColumnHeader.tsx:96,100,110) — all English literals. Contrast: `DataTableRowActions.tsx` correctly uses `useTranslation`.
- Evidence:

```ts
// DataTableColumnHeader.tsx:96,100,110
title="Asc" ... "Desc" ... "Hide"
```

- Suggested fix: Route all strings through `react-i18next` with English defaults (or accept a `labels` prop) — part of the `i18n sweep` (§4.3b).

### F-200 — Editor hardcodes user-facing strings throughout (i18n contract) — **P2**

- File(s): `packages/editor/src/Editor.tsx:106`; `.../plugins/ToolbarPlugin.tsx:348-388, 629-661, 683-783`; `.../plugins/SlashMenuPlugin.tsx:134-321, 561, 570, 616`; `.../dialogs/InsertTableDialog.tsx:53-56, 109, 112`; `.../dialogs/InsertLinkDialog.tsx:53-56, 78`; `.../dialogs/InsertMediaDialog.tsx:34-55`; `.../plugins/DraggableBlockPlugin.tsx:181, 201, 213`
- Severity: **P2** · Fix risk: **medium**
- Description: Placeholder default (Editor.tsx:106), all toolbar label groups, every `SLASH_OPTIONS` label, dialog labels/defaults, and drag-menu labels are English string literals with no translation hook — the editor is the least internationalized surface in the monorepo.
- Evidence:

```ts
// ToolbarPlugin.tsx:348-388 (representative)
{ label: 'Bold' }, { label: 'Italic' }, { label: 'Strikethrough' }, ...
```

- Suggested fix: Introduce `t`/`i18n` injection (or `react-i18next` with defaults) for all UI strings — part of the `i18n sweep` (§4.3b); open question §5 on the i18n path for the editor.

### F-201 — Slash menu sets invalid "CSS Anchor Positioning" style keys — **P2**

- File(s): `packages/editor/src/plugins/SlashMenuPlugin.tsx:550-556`
- Severity: **P2** · Fix risk: **low**
- Description: The menu style object includes `positionArea` and `positionTryFallbacks` — **not valid or operational CSS properties** (no anchor is ever defined; `top`/`left` are already set) — under a comment "Modern CSS Anchor Positioning (Baseline 2026)" that implies they do something. Dead keys + misleading comment.
- Evidence:

```ts
// SlashMenuPlugin.tsx:550-556
// Modern CSS Anchor Positioning (Baseline 2026)
positionArea: 'bottom', positionTryFallbacks: 'bottom-left',
```

- Suggested fix: Remove the dead keys and the misleading comment (real anchor positioning can be adopted later, deliberately).

### F-202 — Slash menu keyboard navigation computes NaN/−1 when the filter result is empty — **P2**

- File(s): `packages/editor/src/plugins/SlashMenuPlugin.tsx:494, 499, 509`
- Severity: **P2** · Fix risk: **low**
- Description: With the menu still open and a query matching nothing, `selectedIndex = (prev + 1) % filteredOptions.length` (l.494) and `(prev - 1 + len) % len` (l.499) evaluate to `NaN` (modulo by 0), and l.509 computes `length - 1` = `-1`.
- Evidence:

```ts
// SlashMenuPlugin.tsx:494,499,509
setSelectedIndex((prev) => (prev + 1) % filteredOptions.length); // NaN when 0
```

- Suggested fix: Guard `filteredOptions.length === 0` before navigating (and optionally auto-close the menu on empty results).

### F-203 — `MentionsPlugin` ships a personal username in a published package and is non-configurable — **P2**

- File(s): `packages/editor/src/plugins/MentionsPlugin.tsx:22-30`
- Severity: **P2** · Fix risk: **low**
- Description: `DEFAULT_MENTIONS` (l.22-30) ships the personal username `'lvtruong'` plus fictional names into the **published** package, and the plugin accepts no props to supply a real mention list.
- Evidence:

```ts
// MentionsPlugin.tsx:22-30
const DEFAULT_MENTIONS = [{ name: 'lvtruong', ... }, ...];
```

- Suggested fix: Accept a `mentions` prop; make the default neutral (empty list) so nothing personal leaks to consumers.

### F-204 — Icons registry contains 13 duplicate alias pairs — **P2**

- File(s): `packages/components/src/Icons/Icons.tsx`
- Severity: **P2** · Fix risk: **low** (API-compat aliases may be needed)
- Description: 13 alias pairs resolve to the same lucide export (identity verified in `node_modules/lucide-react`): `Moon`/`MoonIcon`, `Sun`/`SunIcon`, `X`/`XIcon`, `Check`/`CheckIcon`, `Search`/`SearchIcon`, `ChevronDown`/`ChevronDownIcon`, `FileText`/`FileTextIcon`, `Home`/`HomeIcon`, `Calendar`/`CalendarIcon`, `Image`/`ImageIcon`, `WandSparkles`/`WandSparklesIcon`, `UploadCloud`/`CloudUpload`, `Loader2`/`LoaderCircleIcon`.
- Evidence:

```ts
// Icons.tsx (representative)
Moon: MoonIcon, MoonIcon: MoonIcon,
Loader2: LoaderCircle, LoaderCircleIcon: LoaderCircle,
```

- Suggested fix: Standardize on one name per icon; keep the other as an explicit deprecated alias only if it is already in a published API. Batch with the breaking-prop workstream (Phase 4, §5 on alias policy).

### F-205 — `Collapsible` export serializes `open="false"` — closed collapsible re-imports as open — **P2**

- File(s): `packages/editor/src/nodes/CollapsibleNodes.tsx:71`
- Severity: **P2** · Fix risk: **low**
- Description: `element.setAttribute('open', this.__open.toString())` (l.71) always writes the attribute, including the string `"false"` when closed; boolean attributes are true when **present**, so a serialized closed collapsible re-imports as open.
- Evidence:

```ts
// CollapsibleNodes.tsx:71
element.setAttribute('open', this.__open.toString()); // writes "false" → present → open
```

- Suggested fix: Only `element.setAttribute('open', '')` when `this.__open` is `true` (or remove the attribute when closed).

### F-206 — "should trigger onChange callback" test never asserts `onChange` fired — **P2**

- File(s): `packages/editor/src/Editor.test.tsx:76-82`
- Severity: **P2** · Fix risk: **low**
- Description: The test (l.76-82) renders and types but contains **no `expect(onChange).toHaveBeenCalled(...)`** — it passes regardless of whether `onChange` ever fires, so the documented callback is untested.
- Evidence:

```tsx
// Editor.test.tsx:76-82
it('should trigger onChange callback', () => {
  render(<Editor onChange={onChange} />);
  // … types … — but never asserts onChange was called
});
```

- Suggested fix: Assert `onChange` was called and with the expected markdown payload — part of the `test-strategy workstream` (§4.3b).

### F-207 — `apps/docs` imports the wrong stylesheet, duplicates all theme vars, and uses raw layout elements — **P2**

- File(s): `apps/docs/src/main.tsx:3`; `apps/docs/src/styles.css:1-59`; `apps/docs/src/App.tsx`
- Severity: **P2** · Fix risk: **low**
- Description: `main.tsx:3` imports `@vlrc-fe/components/stylex.css` instead of the documented `@vlrc-fe/components/theme.css`; `styles.css:1-59` re-declares every `:root` theme var from `vlrc-theme.css`, including a **divergent** `--radius: 0.75rem`; `App.tsx` uses raw `<div>`/`<h1>`/`<h2>`/`<p>` for layout and typography despite the component library being the point of the docs.
- Evidence:

```tsx
// apps/docs/src/main.tsx:3
import '@vlrc-fe/components/stylex.css'; // documented entry is theme.css
```

```css
/* apps/docs/src/styles.css — re-declares :root vars, divergent */
--radius: 0.75rem;
```

- Suggested fix: Import `theme.css`, delete the duplicated vars, and build the docs shell with VLRC primitives (`VStack`, `Text`, `Title`).

### F-208 — Root `package.json` duplicates UI deps at divergent versions, dual TypeScript, unused `prismjs` — **P2**

- File(s): `package.json:46-70, 82-83, 108`; `packages/editor/package.json:64-68`
- Severity: **P2** · Fix risk: **low**
- Description: Root devDeps re-declare `@radix-ui/*` at versions different from `packages/components` (e.g. `react-alert-dialog` ^1.1.23 vs ^1.1.2, `react-slider` ^1.4.7 vs ^1.2.1, `embla` ^8.6.0 vs ^8.5.1, `vaul` ^1.1.2 vs ^1.1.1) plus duplicate runtime UI deps (astryx/stylex/tanstack/lucide) at l.46-70; **dual TypeScript**: `typescript: npm:@typescript/typescript6@^6.0.2` and `@typescript/native: npm:typescript@^7.0.2` (l.82-83, 108) while every package devDeps `^7.0.2`; `packages/editor/package.json:64-68` declares `prismjs` + `@types/prismjs` in `dependencies` although editor `src` never imports `prismjs` directly (only via `@lexical/code-prism`).
- Evidence:

```json
// package.json:82-83 (dual TypeScript)
"typescript": "npm:@typescript/typescript6@^6.0.2",
"@typescript/native": "npm:typescript@^7.0.2"
```

- Suggested fix: Prune the root duplicate UI deps (or align them to the components package versions), unify on one TypeScript version, and drop `prismjs` from the editor package unless it is a real peer.

---

## 4. Consolidated Fix Plan

**Ordering principle.** (1) Unblock the release (Phase 0). (2) All P0s (Phase 1) — correctness and a11y, verified against the §3 evidence. (3) Safe, mechanical cleanups including the codemod sweeps (Phase 2) — no behavior change. (4) P1 behavior bugs, then remaining P1 contract/modernization work (Phase 3). (5) Architectural and breaking items (Phase 4) — each is gated on a §5 decision. Each phase is a batch of reviewable PRs; every PR must pass `pnpm build`, the package tests, and the relevant Storybook shots before merge.

### 4.1 Phase 0 — release blocker (immediate)

**F-179** (the only finding that breaks consumers today):

1. Add `/^@radix-ui\//` to `rollupOptions.external` in `packages/components/vite.config.ts` (plus any radix transitive utils that get inlined).
2. Rebuild and verify `! grep -r 'node_modules/.pnpm' dist/`; add that check as a CI gate so a regression fails the build.
3. Republish as `3.0.7` (patch); verify with a clean consumer install — `npm i @vlrc-fe/components@3.0.7`, import the package entry, confirm no `ERR_MODULE_NOT_FOUND`.
4. Until then, consider deprecating `3.0.6` on npm (`npm deprecate @vlrc-fe/components@3.0.6 "broken dist — use 3.0.7"`).

### 4.2 Phase 1 — P0 correctness & a11y (17 fixes)

| ID    | Fix (from §3)                                                                                                                                          | Risk   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| F-001 | Carousel: call `scrollNext()` on ArrowRight; guard editable targets                                                                                    | safe   |
| F-002 | BadgeOverflow "+N": focusable button trigger                                                                                                           | safe   |
| F-003 | AvatarGroup "+N": focusable trigger                                                                                                                    | safe   |
| F-030 | FileUpload: return a **new** `Map` instance per change (never mutate in place)                                                                         | medium |
| F-056 | PaginationEllipsis: real sr-only label via shared `srOnly` style                                                                                       | safe   |
| F-076 | Slider: guard the NaN second thumb                                                                                                                     | safe   |
| F-077 | Segmented radiogroup: roving `tabindex`, arrows move focus                                                                                             | medium |
| F-078 | Stepper: complete tablist/tab/tabpanel ARIA wiring                                                                                                     | medium |
| F-079 | Sidebar: tokenized `:focus-visible` on menu controls                                                                                                   | safe   |
| F-080 | SignaturePad: focus indicator on the drawing area                                                                                                      | safe   |
| F-119 | FormDatePicker: pass `id`/`aria-invalid`/`aria-describedby` through to the trigger (full re-home is Phase 4)                                           | medium |
| F-120 | Date picker clear "×": real button                                                                                                                     | safe   |
| F-121 | FormNumberInput: `:focus-visible` ring token replaces removed outline                                                                                  | safe   |
| F-122 | TimePicker column buttons: `:focus-visible` ring token                                                                                                 | safe   |
| F-123 | FormInput password toggle: `type="button"`, drop `tabIndex={-1}`, add accessible name                                                                  | safe   |
| F-149 | BaseSelect: rebuild on a listbox pattern (Radix `Select` / Astryx / APG `aria-activedescendant`) — **dedicated PR**, subsumes F-150/F-153; decision Q5 | high   |
| F-180 | DataTable: render `<TableHead>` with humanized `accessorKey` fallback                                                                                  | safe   |

**Verification per fix:** a Storybook story or unit test that would have caught the bug, an axe pass on the affected stories, and a consumer smoke test for F-030 / F-056 / F-180.

### 4.3 Phase 2 — safe P2 cleanups & codemod sweeps

#### 4.3a Individual safe P2 fixes

Apply each **Fix** line for the `safe`-risk P2 findings (ID ranges: F-012–F-029, F-044–F-055, F-065–F-075, F-088–F-098, F-106–F-118, F-143–F-148, F-163–F-178, F-194–F-208, skipping those absorbed by a sweep below), as one PR per §3 subsection. Dead-code deletions (unused props/refs/dead branches) may batch across subsections.

#### 4.3b Sweeps & workstreams

Mechanical, codemod- or pattern-driven batches. Each sweep: one PR (or a small set), build + tests + Storybook visual diff; the off-scale/mapping decisions are listed in §5.

| Sweep                                       | Scope (anchor IDs)                                                       | Method                                                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **F-008 sweep** (raw rem/px/ms → tokens)    | F-008, F-040, F-083, F-139, F-162, F-192, F-193 + all raw-value mentions | 1:1 mapping table to `spacing`/`duration`/`easing` ramps; codemod + manual pass; off-scale values to §5-Q1                  |
| **token sweep** (raw rgba/hex/named colors) | F-007, F-082, F-104, F-157, F-160, F-189                                 | Replace with `colors.*`/`--color-*`; add `scrim` + easeOutExpo tokens to the ramps; `color-mix` only over token-backed vars |
| **cn sweep** (className juggling)           | F-065, F-106, F-194 (~120 sites)                                         | Single codemod to `cn(sxProps.className, className)`                                                                        |
| **zIndex sweep**                            | F-028, F-066, F-112                                                      | Delete static `zIndex` literals always overridden by `useZIndex`; keep the scale as single source                           |
| **focus-ring sweep**                        | F-060, F-150 (+ non-P0 residue of F-079/F-080/F-121–F-123)               | Shared `:focus-visible` via `shadow.ringFocus`/`colors.focusRing`                                                           |
| **raw-div sweep**                           | F-009, F-039, F-061, F-062, F-081, F-102, F-141, F-207                   | Mechanical `Box`/`Flex`/`Stack` replacement (polymorphic `as` where a tag is needed)                                        |
| **i18n sweep**                              | F-011, F-038, F-063, F-084, F-125–F-127, F-156, F-199, F-200             | Translator-backed defaults (Astryx `InternationalizationProvider` / `react-i18next` per §5-Q8)                              |
| **shared-srOnly sweep**                     | F-006, F-049, F-056, F-086, F-171, F-190                                 | One shared `srOnly` style, `clipPath: 'inset(50%)'`; ship decision Q4                                                       |
| **reduced-motion workstream**               | F-027, F-111                                                             | `prefers-reduced-motion` overrides (static spinner / opacity-only)                                                          |
| **touch-target workstream**                 | F-087, F-116, F-138, F-193                                               | Enlarge hit areas without visual change (pseudo-element padding / `min-height`); policy Q2                                  |
| **icons sweep**                             | F-109, F-198                                                             | Inline `<svg>` → `Icons` registry                                                                                           |
| **as any workstream**                       | F-044, F-064, F-091, F-113, F-140, F-143, F-169                          | Type fixes per finding; enable `no-explicit-any` (error) when the count hits zero                                           |
| **style-clobber workstream**                | F-058, F-095 (+ 7+ files)                                                | `style={{ ...sxProps.style, ...style }}` merge order everywhere                                                             |
| **stories workstream**                      | F-075, F-148, F-176, F-207                                               | Rebuild story scaffolding on `VStack`/`Box`/`Text` + tokens                                                                 |
| **test-strategy workstream**                | F-117, F-206 (small fixes)                                               | Add the missing test file / the missing assertions; the repo-wide snapshot overhaul is Phase 4 (F-026)                      |

### 4.4 Phase 3 — P1 behavior bugs & remaining contract work

#### 4.4a Behavior / a11y bugs

Apply each **Fix** line (one PR per component cluster): F-004, F-005, F-031–F-036, F-058, F-059, F-099, F-100, F-101, F-128, F-130–F-133, F-135, F-136, F-137, F-151, F-152, F-154, F-155, F-159, F-161, F-181–F-188. Notes: F-099 lands with the Q3 decision (and `references/modals.md` regeneration); F-154 (MultiSelect real controlled mode) and F-181–F-188 (editor) get dedicated PRs with regression tests.

#### 4.4b Remaining P1 contract / modernization

P1 findings tagged with a §4.3b sweep land with that sweep (Phase 2) — no double work. The rest, from their **Fix** lines: F-010, F-037, F-041, F-042, F-043, F-085, F-103, F-105, F-124, F-134, F-138 (via touch-target workstream), F-140 (via as any workstream), F-142, F-150–F-153 (via the F-149 rebuild), F-191.

### 4.5 Phase 4 — architectural & breaking changes

Each item is gated on its §5 decision and ships with migration notes.

1. **F-146 + F-119** — re-home `FormDatePicker` on `FormBase` (drop the parallel form-field system, add `sx`, fix the Radix `Slot` id/aria drop). Decision Q7.
2. **F-057** — `ResponsiveDialog`: lift a single `open` state, always drive the mounted primitive with controlled `open`/`onOpenChange`.
3. **F-019** — CodeBlock "highlighter": gate the tokenizer on `language` (unsupported → plain) or adopt a real highlighter. Decision Q9.
4. **Breaking-prop batch** (versioning per Q6) — remove or honor: F-014 (Calendar `buttonVariant`), F-090 (SignaturePad `smoothing`), F-115 (TagsInputItem `index`), F-129 (`TimeConfig.showHour/showMinute/showSecond`), F-135 (FormNumberInput inert `min`/`max` + dual API), F-161 (`allowClear`), F-204 (Icons 13 alias pairs — alias policy Q6).
5. **F-158** — MultiSelect `animationConfig`: implement with StyleX keyframes + tokens, or remove the dead API (including the `inverted` variant). Decision Q10.
6. **F-026 + snapshot overhaul** — replace baseline DOM snapshot tests with behavior assertions per the repo test contract (a11y roles, wrapper logic); 100+ snapshots across 12+ test files.
7. **F-207** — `apps/docs`: import `theme.css`, delete the duplicated `:root` vars, rebuild the shell on VLRC primitives.
8. **F-208** — root `package.json`: prune duplicated UI deps, unify on one TypeScript version, drop `prismjs` from the editor package.

---

## 5. Open Questions

Items the review cannot decide unilaterally — each names the findings it gates.

1. **Duration ramp:** add a `150ms` duration token or map the ~150ms usages to `duration.fast`? (F-008 sweep, F-162, F-192 — `'150ms'` appears in 5+ components and matches no token.)
2. **44px touch-target policy:** which sub-44px controls get enlarged (pseudo-element hit area) and which are documented desktop-only? (F-087, F-116, F-138, F-193.)
3. **Modal `open` default:** is `open ?? isOpen ?? true` an accident (docs say `false`) or a "mount = open" pattern? Fix F-099 accordingly and regenerate `references/modals.md`. (F-099, F-100.)
4. **`.sr-only` shipping:** does the package ship a `.sr-only` utility in `theme.css`, or only a shared StyleX `srOnly` style? (F-006, F-056, F-086, F-171, F-190.)
5. **BaseSelect rebuild:** rebuild on an existing listbox primitive (Radix `Select` / Astryx) vs patch with APG `aria-activedescendant`? Scope includes `Select`, `MultiSelectTags`, `FormSelect`, and the `allowClear` dead prop. (F-149, F-150, F-153, F-161.)
6. **Breaking-change versioning:** next minor vs next major for the dead-prop batch, and the Icons alias policy (keep deprecated aliases for published APIs?). (F-014, F-090, F-115, F-129, F-135, F-144, F-161, F-204.)
7. **FormDatePicker re-home:** accept the architectural change to `FormBase` (dropping the parallel form-field system) — what's the consumer-impact window? (F-119, F-146.)
8. **Editor i18n path:** Astryx `InternationalizationProvider` (the library contract) vs `react-i18next` (what DataTable already uses) for the editor's strings? (F-200; informs the i18n sweep.)
9. **CodeBlock highlighter:** gate the hand-rolled tokenizer on `language` or adopt a real highlighter dependency? (F-019.)
10. **MultiSelect `animationConfig`:** implement (StyleX keyframes) or remove the dead API (and the `inverted` variant)? (F-158.)
11. **Perf watch-items (no fix in this plan):** `useBreakpoint` = 6 `matchMedia` listeners per Row/Col/Masonry item (noted at F-168); DataTable infinite-scroll manual scroll math vs `IntersectionObserver` (Appendix B).
12. **Build hygiene:** TypeScript unification (F-208); editor Vite `useCSSLayers: true` vs the explicit layer list in the components build; stale `vitest.config.ts` include — confirm intent during Phase 4.
13. **Hook-extraction candidates** for `@vlrc-fe/hooks`: `useDebouncedCallback` (F-195) and `useCopyToClipboard` (F-173) — package them or keep them local?

---

## Appendix A — Cross-part systemic rollups

Themes that recur across multiple review areas (one fix resolves a cluster):

| Theme                                                             | Findings (anchors)                                                                                                                                                                                                    | Resolution                                      |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Invisible keyboard focus (`outline: 'none'`, no `:focus-visible`) | F-060, F-079, F-080, F-121, F-122, F-123, F-150 (+ F-155 invalid flash)                                                                                                                                               | focus-ring sweep §4.3b (P0s in Phase 1)         |
| Broken/missing sr-only (`clip: rect()`, undefined `.sr-only`)     | F-006, F-049, F-056, F-086, F-171, F-190                                                                                                                                                                              | shared-srOnly sweep §4.3b + Q4                  |
| Zero-magic-value violations (raw rem/px/rgba/hex/ms)              | F-007, F-008, F-040, F-082, F-083, F-104, F-139, F-157, F-160, F-162, F-189, F-192, F-193                                                                                                                             | F-008 sweep + token sweep §4.3b                 |
| Raw `<div>`/`<span>` layout                                       | F-009, F-039, F-061, F-062, F-081, F-102, F-141, F-176, F-207                                                                                                                                                         | raw-div sweep + stories workstream              |
| Hardcoded English UI strings                                      | F-011, F-038, F-063, F-084, F-125, F-126, F-127, F-142, F-156, F-199, F-200                                                                                                                                           | i18n sweep + Q8                                 |
| `cn()` bypassed by hand-rolled className merges                   | F-065, F-106, F-194 (~120 sites)                                                                                                                                                                                      | cn sweep §4.3b                                  |
| Dead static `zIndex` (always overridden by `useZIndex`)           | F-028, F-066, F-112                                                                                                                                                                                                   | zIndex sweep §4.3b                              |
| Legacy web patterns                                               | `transition: all` (F-010, F-085, editor.css:208/513/586/694) · `keyCode === 229` (F-170) · `matchMedia.addListener` fallback (F-110) · async-promise-executor anti-pattern (F-034, F-185 — two independent instances) | per-finding fixes in Phases 2–3                 |
| Stale-closure / state-sync bugs                                   | F-032, F-130, F-137, F-154, F-175                                                                                                                                                                                     | Phase 3a                                        |
| Blob-URL leak anti-pattern (created in render, never revoked)     | F-031, F-133                                                                                                                                                                                                          | Phase 3a (same fix shape)                       |
| Fictional API surface (props/types that don't work)               | F-014, F-090, F-115, F-144, F-158, F-161, F-163, F-181, F-204                                                                                                                                                         | Phase 2 (delete) / Phase 4 (breaking batch, Q6) |
| Test-contract violations (snapshots, missing assertions/files)    | F-026, F-117, F-206                                                                                                                                                                                                   | test-strategy workstream + Phase 4 overhaul     |

---

## Appendix B — Coverage, verification & limitations

**Coverage.** Each area agent read every in-scope file in full: part 1–5 all `ui/**` components + tests/stories (21/18/14/15/17 files + 6 root files); part 6 all 46 `Form/**` + 6 `layout/**` files; part 7 all 34 Typography/Select/Dropdown/MultiSelect files + supporting theme/Radix/astryx sources; part 8 all 12 DataTable sources, all theme files, `Icons.tsx`, `richtext/index.ts`, all 24 editor sources (incl. 3 dialog test files, `Editor.test.tsx`, `Editor.stories.tsx`, `editorTheme.ts`, `editor.css`), all 7 hooks sources, all 4 `apps/docs` files, and all 14 config files. Thin re-exports were skipped per instructions (e.g. `richtext/index.ts` body, `Icons/index.ts`); part 8 sampled (not fully read) two low-value story files, both `__snapshots__`, and `vite-env.d.ts`.

**Independent verifications (coordinator).** The 8 highest-stakes claims were spot-checked by re-reading the cited files (all confirmed). F-179 was reproduced independently: `vite.config.ts:46-75` externalizes 12/25 radix packages, and the published `@vlrc-fe/components@3.0.6` npm tarball contains 253 `dist` files importing nonexistent `../node_modules/.pnpm/...` paths, including the module re-exported by `dist/index.js`. Part 8 additionally verified F-182 against `@lexical/react`'s `LexicalComposer` source and F-178's redundancy against the Radix `DialogTrigger` dist.

**Verified non-issues (investigated, deliberately not flagged).** Lexical 0.52.0 `TextFormatType` includes `'highlight'` (the highlight button is valid). `@lexical/table` 0.52.0 `InsertTableCommandPayload` is `{ rows: string; columns: string; includeHeaders? }` (the dialog's string payload is correct). TanStack v8 `useReactTable` table identity is stable (`useState` initializer), so the DataTable clamp effect cannot loop. `build.minify: false` in `packages/components/vite.config.ts` is intentional per the README. Suspected Title double-`onEdit` (Enter → submit → blur) — React's synthetic `onBlur` does not fire for a detached input; no double call.

**Tooling caveat — legacy scan unreliable.** `modern-web-guidance` legacy-scan (2026-11-10 build; 38 guides / 52 active rules) reported **0 findings** for `packages/` and `apps/`, but verified real legacy patterns exist in scope: `clip: rect(0,0,0,0)` (F-049, F-086, F-171, F-190) and `transition: all` (F-010, F-085, `packages/editor/src/editor.css:208,513,586,694`). The scan covers only ~20% of the deterministic guidance corpus — treat its zero result as a coarse net, not a pass.

**Minor items not promoted to findings.** `ToolbarPlugin` `isLink`/`blockType` state is stale (selection listener never derives them). DataTable clamp effect lacks a `data` dependency → stale `pageIndex` when rows shrink. `TableActionMenuPlugin`/`TableHoverActionsPlugin` call `getBoundingClientRect()` during render and `setState` per mousemove. `useUploadFile` abort listener is never removed and progress is keyed by `file.name`. Test-only `as any` (`spacing.test.ts:34,87`), `Promise<any>` (`useUploadFile.test.ts:33`). `zIndex.tsx` assigns drawer = overlay = modal = 500 (equal z tiers). `vitest.config.ts:50` stale `src/**` include. Components `tsconfig` lib `ES2023` vs `ES2022` elsewhere. Editor Vite `useCSSLayers: true` vs the explicit layer list in the components build. `DataTableViewOptions.tsx:52` labels columns with raw `col.id`. `Link.tsx:22` `outline: '2px solid var(--ring)'` works but `--ring` lacks a fallback (worth folding into the focus-ring sweep). `Code.tsx:147` raw `<div>` inside a typography implementation (judged acceptable by semantics).

**Limitations.** Static review only — no runtime, Storybook, or interactive testing; stories reviewed at secondary depth; findings that depend on consumer-app context are the §5 open questions. All `file:line` citations were verified by the authoring agents at review time (commit `6f6cb34e`); line numbers may shift as fixes land — the finding IDs are the stable cross-reference.
