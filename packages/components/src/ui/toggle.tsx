import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

export type ToggleVariant = 'default' | 'outline';

export const toggleStyles = stylex.create({
  base: {
    appearance: 'none',
    WebkitAppearance: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    fontWeight: 500,
    cursor: 'pointer',
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: colors.foreground,
    transitionProperty: 'background-color, color, box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: colors.muted,
      color: colors.mutedForeground,
    },
    ':focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '2px',
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },

  // Variants
  defaultVariant: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  outlineVariant: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: 'transparent',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },

  // 7-tier Sizing
  sizeXxs: {
    height: '1.5rem',
    paddingInline: '0.375rem',
    minWidth: '1.5rem',
    fontSize: '0.6875rem',
    borderRadius: radii.sm,
    gap: '0.25rem',
  },
  sizeXs: {
    height: '1.75rem',
    paddingInline: '0.5rem',
    minWidth: '1.75rem',
    fontSize: '0.75rem',
    borderRadius: radii.sm,
    gap: '0.25rem',
  },
  sizeSm: {
    height: '2rem',
    paddingInline: '0.625rem',
    minWidth: '2rem',
    fontSize: '0.8125rem',
    borderRadius: radii.md,
    gap: '0.375rem',
  },
  sizeMd: {
    height: '2.25rem',
    paddingInline: '0.75rem',
    minWidth: '2.25rem',
    fontSize: '0.875rem',
    borderRadius: radii.md,
    gap: '0.5rem',
  },
  sizeLg: {
    height: '2.625rem',
    paddingInline: '1rem',
    minWidth: '2.625rem',
    fontSize: '1rem',
    borderRadius: radii.md,
    gap: '0.625rem',
  },
  sizeXl: {
    height: '3rem',
    paddingInline: '1.25rem',
    minWidth: '3rem',
    fontSize: '1.125rem',
    borderRadius: radii.lg,
    gap: '0.75rem',
  },
  sizeXxl: {
    height: '3.5rem',
    paddingInline: '1.5rem',
    minWidth: '3.5rem',
    fontSize: '1.25rem',
    borderRadius: radii.lg,
    gap: '0.875rem',
  },
});

export const toggleVariantStyles: Record<ToggleVariant, stylex.StyleXStyles> = {
  default: toggleStyles.defaultVariant,
  outline: toggleStyles.outlineVariant,
};

export const toggleSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: toggleStyles.sizeXxs,
  xs: toggleStyles.sizeXs,
  sm: toggleStyles.sizeSm,
  md: toggleStyles.sizeMd,
  lg: toggleStyles.sizeLg,
  xl: toggleStyles.sizeXl,
  xxl: toggleStyles.sizeXxl,
};

export interface ToggleProps extends Omit<
  React.ComponentProps<typeof TogglePrimitive.Root>,
  'size'
> {
  /** 7-tier sizing scale ('xxs' to 'xxl', defaults to 'md') */
  size?: ComponentSize;
  /** Visual variant ('default' or 'outline') */
  variant?: ToggleVariant;
  /** Custom StyleX style overrides */
  sx?: any;
}

function Toggle({ className, variant = 'default', size = 'md', sx, ...props }: ToggleProps) {
  const currentVariant = toggleVariantStyles[variant] ?? toggleStyles.defaultVariant;
  const currentSize = toggleSizeStyles[size] ?? toggleStyles.sizeMd;
  const sxProps = stylex.props(toggleStyles.base, currentVariant, currentSize, sx);

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Toggle };
