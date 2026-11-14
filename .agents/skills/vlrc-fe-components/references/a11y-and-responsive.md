# Accessibility (A11y) & Responsive Architecture Guidelines

This document outlines the strict engineering specifications for **Mobile-First Responsive Design** and **WCAG 2.1 AA Accessibility** across `@vlrc-fe/components`.

---

## 1. Responsive & Mobile-First Principles

All components must be designed and styled **mobile-first**:

### 1.1 Breakpoint Scale

| Breakpoint | Threshold  | Typical Target Devices              | StyleX Media Query              |
| :--------- | :--------- | :---------------------------------- | :------------------------------ |
| `xs`       | `< 576px`  | Mobile phones (portrait)            | _Base default (no media query)_ |
| `sm`       | `≥ 576px`  | Large phones / phablets (landscape) | `@media (min-width: 576px)`     |
| `md`       | `≥ 768px`  | Tablets / iPad (portrait)           | `@media (min-width: 768px)`     |
| `lg`       | `≥ 992px`  | Small laptops / Tablets (landscape) | `@media (min-width: 992px)`     |
| `xl`       | `≥ 1200px` | Standard Desktop monitors           | `@media (min-width: 1200px)`    |
| `xxl`      | `≥ 1600px` | Large / Ultrawide Desktop monitors  | `@media (min-width: 1600px)`    |

### 1.2 Writing Mobile-First Media Queries in StyleX

In Meta StyleX, media queries are declared per property. Base styles represent mobile viewports:

```tsx
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';

const styles = stylex.create({
  container: {
    // Mobile first: column layout on mobile, row on tablet/desktop
    flexDirection: {
      default: 'column',
      '@media (min-width: 768px)': 'row',
    },
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    padding: {
      default: spacing.sm,
      '@media (min-width: 768px)': spacing.md,
      '@media (min-width: 1200px)': spacing.lg,
    },
  },
});
```

### 1.3 Mobile Usability & Touch Targets

1. **Touch Target Size**:
   - All interactive touch targets (buttons, icon buttons, checkboxes, radio buttons, select triggers, pagination items) must have a hit area of at least **44×44px** on touch devices.
   - For small icons (e.g. 16px or 20px), use padding or transparent pseudo-elements to expand the clickable boundary to 44px.
2. **Preventing Viewport Overflow**:
   - Never set fixed wide widths (e.g. `width: 600px`) without `maxWidth: '100%'`.
   - Modals and dialogs must fit inside the mobile viewport (`maxWidth: 'calc(100vw - 32px)'` or adapt to bottom-sheet style via `Drawer` / `Sheet`).
   - Tables (`DataTable`) must include an overflow wrapper (`overflowX: 'auto'`) so they scroll horizontally without breaking the page layout.
3. **Form Inputs on Mobile**:
   - Minimum font size on mobile inputs should be at least `16px` (or `1rem`) to prevent iOS Safari auto-zoom on focus.

---

## 2. Accessibility (A11y) Standards (WCAG 2.1 Level AA)

### 2.1 Headless Foundations (Radix UI)

Always base interactive composites (Dialogs, Dropdowns, Tooltips, Tabs, Accordions, Popovers, Sliders) on **Radix UI** headless primitives. Radix provides:

- Automatic ARIA attributes (`aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-selected`).
- Focus trapping inside modals.
- Automatic restoration of focus to trigger elements upon dismissal.
- Standard roving tabindex for lists, menus, and tab lists.

### 2.2 Keyboard Navigation Contracts

Every interactive component must be fully functional using only the keyboard:

| Component Type               | Expected Keyboard Behavior                                                                                                         |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Buttons / Links**          | `Enter` and `Space` activate the button. `Tab` moves focus.                                                                        |
| **Dialog / Modal / Sheet**   | `Esc` closes the overlay. Focus is trapped inside while open. `Tab` cycles through modal focusables.                               |
| **Dropdown / Menu / Select** | `Enter` / `Space` / `ArrowDown` opens. `ArrowUp` / `ArrowDown` navigates items. `Enter` / `Space` selects item. `Esc` closes menu. |
| **Tabs**                     | `ArrowLeft` / `ArrowRight` (or `ArrowUp` / `ArrowDown` for vertical) moves active tab.                                             |
| **Accordion**                | `Enter` / `Space` toggles section. `ArrowDown` / `ArrowUp` navigates between accordion triggers.                                   |
| **Checkboxes / Switches**    | `Space` toggles checked state.                                                                                                     |

### 2.3 Focus Visible Indicator (`:focus-visible`)

- **Never remove focus outlines** without replacing them with an accessible ring:

```tsx
import { shadow } from '../theme/tokens.stylex';

const styles = stylex.create({
  interactive: {
    outline: 'none',
    ':focus-visible': {
      outline: 'none',
      boxShadow: shadow.ringFocus,
    },
  },
});
```

### 2.4 Semantic Labels & Screen Readers

1. **Icon-only Elements**:
   - Any button or control without visible text (e.g., search icon button, modal close button, pagination arrow) **must** provide `aria-label`:
   ```tsx
   <button type="button" aria-label="Close dialog" {...stylex.props(styles.closeBtn)}>
     <Icons.X size={18} aria-hidden="true" />
   </button>
   ```
2. **Decorative vs Semantic Icons**:
   - Purely decorative icons must have `aria-hidden="true"` so screen readers do not announce redundant symbols.
3. **Form Association**:
   - Form controls must be programmatically associated with their labels via `htmlFor`/`id` or `aria-labelledby`.
   - Error messages and helper descriptions must be connected to inputs via `aria-describedby` and reflect `aria-invalid={!!error}`.
4. **Dynamic Announcements**:
   - Use `role="alert"` or `aria-live="polite"` for toast notifications, banners, and dynamically updated feedback.

### 2.5 Motion & Color Contrast

1. **Reduced Motion**:
   - Wrap non-essential animations with `prefers-reduced-motion`:
   ```tsx
   const styles = stylex.create({
     animated: {
       transition: {
         default: 'transform 200ms ease, opacity 200ms ease',
         '@media (prefers-reduced-motion: reduce)': 'none',
       },
     },
   });
   ```
2. **Color Contrast**:
   - Normal text (`< 18pt` or `< 14pt bold`): Minimum contrast ratio **4.5:1** against the background.
   - Large text (`≥ 18pt` or `≥ 14pt bold`) and UI controls/borders: Minimum contrast ratio **3:1**.

---

## 3. Testing & Verification Checklist

When building or updating any component:

- [ ] **Mobile-First CSS**: Are base styles crafted for mobile viewports, scaling up via `min-width` queries?
- [ ] **Touch Target**: Are touchable areas at least 44×44px on mobile?
- [ ] **Viewport Fit**: Does the component render cleanly on small screens (320px–375px) without horizontal scrolling or clipping?
- [ ] **Keyboard Navigation**: Can all actions be performed using `Tab`, `Enter`, `Space`, `Arrows`, and `Esc`?
- [ ] **Focus Visible**: Is there a clear, high-contrast `:focus-visible` ring on keyboard focus?
- [ ] **ARIA & Labels**: Do icon buttons have `aria-label`? Do form inputs have associated labels and `aria-describedby` for errors?
- [ ] **Reduced Motion**: Are animations disabled or minimized under `@media (prefers-reduced-motion: reduce)`?
- [ ] **Vitest Coverage**: Does the Vitest suite include keyboard navigation and ARIA tests in `describe('Behavior')`?
