import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    paddingInline: '0.5rem',
    paddingBlock: '0.125rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    width: 'fit-content',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    gap: '0.25rem',
    transitionProperty: 'color, box-shadow, background-color',
    transitionDuration: '150ms',
    overflow: 'hidden',
    outline: 'none',
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
  },

  // 7-tier Sizes
  sizeXxs: {
    height: '1rem',
    fontSize: '0.625rem',
    paddingInline: '0.375rem',
    paddingBlock: 0,
    gap: '0.125rem',
  },
  sizeXs: {
    height: '1.25rem',
    fontSize: '0.6875rem',
    paddingInline: '0.4375rem',
    paddingBlock: '0.0625rem',
    gap: '0.1875rem',
  },
  sizeSm: {
    height: '1.375rem',
    fontSize: '0.75rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.0625rem',
    gap: '0.25rem',
  },
  sizeMd: {
    fontSize: '0.75rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.125rem',
    gap: '0.25rem',
  },
  sizeLg: {
    height: '1.75rem',
    fontSize: '0.8125rem',
    paddingInline: '0.625rem',
    paddingBlock: '0.125rem',
    gap: '0.3125rem',
  },
  sizeXl: {
    height: '2rem',
    fontSize: '0.875rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    gap: '0.375rem',
  },
  sizeXxl: {
    height: '2.25rem',
    fontSize: '1rem',
    paddingInline: '0.875rem',
    paddingBlock: '0.3125rem',
    gap: '0.5rem',
  },

  variantDefault: {
    borderColor: 'transparent',
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    ':hover': {
      opacity: 0.9,
    },
  },
  variantSecondary: {
    borderColor: 'transparent',
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
    ':hover': {
      opacity: 0.9,
    },
  },
  variantDestructive: {
    borderColor: 'transparent',
    backgroundColor: colors.destructive,
    color: '#ffffff',
    ':hover': {
      opacity: 0.9,
    },
    ':focus-visible': {
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--destructive) 40%, transparent)',
    },
  },
  variantOutline: {
    borderColor: colors.border,
    backgroundColor: 'transparent',
    color: colors.foreground,
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
});

const variantStyles: Record<BadgeVariant, stylex.StyleXStyles> = {
  default: styles.variantDefault,
  secondary: styles.variantSecondary,
  destructive: styles.variantDestructive,
  outline: styles.variantOutline,
};

const sizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

export interface BadgeProps extends React.ComponentProps<'span'> {
  variant?: BadgeVariant;
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function Badge({
  className,
  variant = 'default',
  size = 'md',
  asChild = false,
  sx,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span';
  const sizeStyle = size !== 'md' ? sizeStyles[size] : undefined;
  const sxProps = stylex.props(styles.base, variantStyles[variant], sizeStyle, sx);

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function badgeVariants(options?: {
  variant?: BadgeVariant;
  size?: ComponentSize;
  className?: string;
}) {
  const v = options?.variant || 'default';
  const s = options?.size || 'md';
  const sizeStyle = s !== 'md' ? sizeStyles[s] : undefined;
  return stylex.props(styles.base, variantStyles[v], sizeStyle).className || '';
}

export { Badge, badgeVariants };
