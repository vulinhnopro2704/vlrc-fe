import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

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

export interface BadgeProps extends React.ComponentProps<'span'> {
  variant?: BadgeVariant;
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function Badge({
  className,
  variant = 'default',
  asChild = false,
  sx,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span';
  const sxProps = stylex.props(
    styles.base,
    variantStyles[variant],
    sx
  );

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function badgeVariants(options?: { variant?: BadgeVariant; className?: string }) {
  const v = options?.variant || 'default';
  return stylex.props(styles.base, variantStyles[v]).className || '';
}

export { Badge, badgeVariants };
