# StyleX Theming & Styling Reference Guide

This guide specifies how to author and customize components using **Meta StyleX** within `@vlrc-fe/components` and its consumers.

---

## 1. Design Tokens (`tokens.stylex.ts`)

Tokens are declared using `stylex.defineVars()` and bind directly to CSS custom properties:

```ts
import * as stylex from '@stylexjs/stylex';

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
});

export const radii = stylex.defineVars({
  radius: 'var(--radius, 0.75rem)',
  sm: 'calc(var(--radius, 0.75rem) - 4px)',
  md: 'calc(var(--radius, 0.75rem) - 2px)',
  lg: 'var(--radius, 0.75rem)',
  xl: 'calc(var(--radius, 0.75rem) + 4px)',
  full: '9999px',
});
```

---

## 2. Style Definitions & Variant Maps

Instead of string-based `class-variance-authority`, variants are typed StyleX style maps:

```tsx
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
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

const sizeStyles = stylex.create({
  default: { height: '2.5rem', paddingInline: '1rem' },
  sm: { height: '2rem', paddingInline: '0.75rem', fontSize: '0.75rem' },
  lg: { height: '2.75rem', paddingInline: '2rem' },
  icon: { height: '2.5rem', width: '2.5rem' },
});
```

---

## 3. Applying Styles (`stylex.props`)

Pass styles to elements using JSX spread:

```tsx
export function Button({
  variant = 'default',
  size = 'default',
  sx,
  className,
  ...props
}: ButtonProps) {
  const sxProps = stylex.props(
    styles.base,
    variantStyles[variant],
    sizeStyles[size],
    sx
  );

  return (
    <button
      {...props}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    />
  );
}
```

---

## 4. Keyframe Animations

Keyframes are defined via `stylex.keyframes`:

```tsx
const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});
```

---

## 5. Consumer Overrides via `sx`

In consumer applications (like `vlrc`), import `stylex` and pass type-safe overrides:

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button } from '@vlrc-fe/components';

const customStyles = stylex.create({
  cta: {
    width: '100%',
    boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
  },
});

<Button sx={customStyles.cta}>Get Started</Button>
```
