import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'accent'
  | 'accent-cta'
  | 'gradient'
  | 'gradient-success';

export type ButtonSize =
  | 'default'
  | 'sm'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'icon'
  | 'icon-sm'
  | 'icon-lg';

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
    borderRadius: radii.md,
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    borderWidth: 0,
    borderStyle: 'solid',
    flexShrink: 0,
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    ':focus-visible': {
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
  },

  // Variants
  variantDefault: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    ':hover': {
      opacity: 0.9,
    },
  },
  variantDestructive: {
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
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  variantSecondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
    ':hover': {
      opacity: 0.8,
    },
  },
  variantGhost: {
    backgroundColor: 'transparent',
    color: 'inherit',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  variantLink: {
    backgroundColor: 'transparent',
    color: colors.primary,
    textUnderlineOffset: '4px',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  variantAccent: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    ':hover': {
      opacity: 0.9,
    },
  },
  variantAccentCta: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--accent) 25%, transparent)',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 20px 25px -5px color-mix(in srgb, var(--accent) 30%, transparent)',
    },
  },
  variantGradient: {
    backgroundImage: 'linear-gradient(to right, var(--primary), var(--accent))',
    color: colors.primaryForeground,
    boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--primary) 25%, transparent)',
    ':hover': {
      opacity: 0.95,
      boxShadow: '0 20px 25px -5px color-mix(in srgb, var(--primary) 30%, transparent)',
    },
  },
  variantGradientSuccess: {
    backgroundImage: 'linear-gradient(to right, #10b981, #16a34a)',
    color: '#ffffff',
    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
    ':hover': {
      opacity: 0.95,
      boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.4)',
    },
  },

  // Sizes
  sizeDefault: {
    height: '2.25rem',
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
  },
  sizeSm: {
    height: '2rem',
    borderRadius: radii.md,
    gap: '0.375rem',
    paddingInline: '0.75rem',
    fontSize: '0.8125rem',
  },
  sizeLg: {
    height: '2.5rem',
    borderRadius: radii.md,
    paddingInline: '1.5rem',
  },
  sizeXl: {
    height: '2.75rem',
    borderRadius: radii.xl,
    paddingInline: '1.5rem',
  },
  size2xl: {
    height: '3.5rem',
    borderRadius: radii.xl,
    paddingInline: '2rem',
    fontSize: '1.125rem',
  },
  sizeIcon: {
    height: '2.25rem',
    width: '2.25rem',
    padding: 0,
  },
  sizeIconSm: {
    height: '2rem',
    width: '2rem',
    padding: 0,
  },
  sizeIconLg: {
    height: '2.5rem',
    width: '2.5rem',
    padding: 0,
  },
});

const variantStyles: Record<ButtonVariant, stylex.StyleXStyles> = {
  default: styles.variantDefault,
  destructive: styles.variantDestructive,
  outline: styles.variantOutline,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
  link: styles.variantLink,
  accent: styles.variantAccent,
  'accent-cta': styles.variantAccentCta,
  gradient: styles.variantGradient,
  'gradient-success': styles.variantGradientSuccess,
};

const sizeStyles: Record<ButtonSize, stylex.StyleXStyles> = {
  default: styles.sizeDefault,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  '2xl': styles.size2xl,
  icon: styles.sizeIcon,
  'icon-sm': styles.sizeIconSm,
  'icon-lg': styles.sizeIconLg,
};

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  sx,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const sxProps = stylex.props(
    styles.base,
    variantStyles[variant],
    sizeStyles[size],
    sx
  );

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

// Transitional variant helper
function buttonVariants(options?: { variant?: ButtonVariant; size?: ButtonSize; className?: string }) {
  const v = options?.variant || 'default';
  const s = options?.size || 'default';
  return stylex.props(styles.base, variantStyles[v], sizeStyles[s]).className || '';
}

export { Button, buttonVariants };
