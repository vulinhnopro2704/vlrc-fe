# StyleX Theming & Styling Reference Guide

This guide specifies how to author and customize components using **Meta StyleX** within `@vlrc-fe/components` and its consumer applications.

---

## 1. CSS Cascade Layers Architecture

`@vlrc-fe/components/theme.css` automatically configures native CSS cascade layers in the required order:

```css
@layer reset, astryx-base, astryx-theme, product;
```

- `@layer reset`: Core reset styles (normalize, border-box).
- `@layer astryx-base`: Upstream Astryx baseline tokens and component styles.
- `@layer astryx-theme`: Brand theme variables, palettes, and VLRC token mappings.
- `@layer product`: Consumer application styles and StyleX atomic overrides.

---

## 2. Design Tokens (`tokens.stylex.ts`)

All visual styling MUST derive from design tokens. Never use raw hex colors, raw pixel spacings, or raw box-shadow strings.

```ts
import * as stylex from '@stylexjs/stylex';

// Colors bound to CSS custom properties
export const colors = stylex.defineVars({
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  primary: 'var(--primary)',
  primaryForeground: 'var(--primary-foreground)',
  secondary: 'var(--secondary)',
  secondaryForeground: 'var(--secondary-foreground)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  accentForeground: 'var(--accent-foreground)',
  destructive: 'var(--destructive)',
  destructiveForeground: 'var(--destructive-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  // Astryx semantic surfaces
  surfaceWash: 'var(--color-surface-wash)',
  surfaceElevated: 'var(--color-surface-elevated)',
  surfaceSunken: 'var(--color-surface-sunken)',
  surfaceField: 'var(--color-surface-field)',
  surfaceFieldHover: 'var(--color-surface-field-hover)',
  surfaceFieldDisabled: 'var(--color-surface-field-disabled)',
});

// Radius scale (Astryx 7-tier standard)
export const radius = stylex.defineVars({
  none: '0px',
  sm: 'var(--radius-sm, 2px)',
  default: 'var(--radius-default, 4px)',
  md: 'var(--radius-md, 6px)',
  lg: 'var(--radius-lg, 8px)',
  xl: 'var(--radius-xl, 12px)',
  '2xl': 'var(--radius-2xl, 16px)',
  '3xl': 'var(--radius-3xl, 24px)',
  full: '9999px',
});

// Shadows & Elevation (Zero raw box-shadow CSS strings)
export const shadow = stylex.defineVars({
  none: '0 0 #0000',
  xs: 'var(--shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
  sm: 'var(--shadow-sm, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))',
  md: 'var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))',
  lg: 'var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))',
  xl: 'var(--shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1))',
  '2xl': 'var(--shadow-2xl, 0 25px 50px -12px rgb(0 0 0 / 0.25))',
  inner: 'var(--shadow-inner, inset 0 2px 4px 0 rgb(0 0 0 / 0.05))',
  ring: '0 0 0 1px var(--ring)',
  ringFocus: '0 0 0 2px var(--background), 0 0 0 4px var(--ring)',
  ringDestructive: '0 0 0 2px var(--background), 0 0 0 4px var(--destructive)',
});

// Spacing (4px grid + 7-tier scale)
export const spacing = stylex.defineVars({
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  24: '96px',
  // Presets
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
});

// Motion & Timing
export const duration = stylex.defineVars({
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
});

export const easing = stylex.defineVars({
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
});
```

---

## 3. Style Definitions & Variant Maps

Variants are statically defined using typed StyleX style maps:

```tsx
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow, duration, easing } from '../theme/tokens.stylex';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    boxShadow: shadow.none,
    transitionProperty: 'background-color, color, border-color, box-shadow',
    transitionDuration: duration.normal,
    transitionTimingFunction: easing.default,
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
});

const variantStyles = stylex.create({
  default: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    ':hover': { opacity: 0.9 },
  },
  destructive: {
    backgroundColor: colors.destructive,
    color: colors.destructiveForeground,
    ':focus-visible': {
      boxShadow: shadow.ringDestructive,
    },
  },
  outline: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
  },
  ghost: {
    backgroundColor: 'transparent',
    ':hover': { backgroundColor: colors.accent },
  },
  link: {
    color: colors.primary,
    textDecoration: 'underline',
  },
});
```

---

## 4. Mobile-First Responsive Design with StyleX

In Meta StyleX, media queries are declared per property. Base styles represent mobile viewports:

```tsx
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';

const styles = stylex.create({
  container: {
    flexDirection: {
      default: 'column',
      '@media (min-width: 768px)': 'row',
    },
    width: '100%',
    padding: {
      default: spacing.sm,
      '@media (min-width: 768px)': spacing.md,
      '@media (min-width: 1200px)': spacing.lg,
    },
  },
});
```

---

## 5. Style Overrides via `sx` Prop

Every component accepts `sx?: stylex.StyleXStyles`:

```tsx
interface CardProps {
  children: React.ReactNode;
  sx?: stylex.StyleXStyles;
  className?: string;
}

export function Card({ children, sx, className }: CardProps) {
  const sxProps = stylex.props(styles.root, sx);
  return (
    <div
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      {children}
    </div>
  );
}
```
