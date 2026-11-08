import * as React from 'react';
import type { ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { resolveWidth, type ComponentWidth, type ComponentSize } from '../theme';

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
  | ComponentSize
  | 'default'
  | '2xl'
  | 'icon'
  | 'icon-xxs'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-md'
  | 'icon-lg'
  | 'icon-xl'
  | 'icon-xxl';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

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

  // 7-tier Component Sizes
  sizeXxs: {
    height: '1.5rem',
    borderRadius: radii.sm,
    gap: '0.25rem',
    paddingInline: '0.5rem',
    fontSize: '0.6875rem',
  },
  sizeXs: {
    height: '1.75rem',
    borderRadius: radii.sm,
    gap: '0.3125rem',
    paddingInline: '0.625rem',
    fontSize: '0.75rem',
  },
  sizeSm: {
    height: '2rem',
    borderRadius: radii.md,
    gap: '0.375rem',
    paddingInline: '0.75rem',
    fontSize: '0.8125rem',
  },
  sizeMd: {
    height: '2.25rem',
    borderRadius: radii.md,
    gap: '0.5rem',
    paddingInline: '1rem',
    fontSize: '0.875rem',
  },
  sizeLg: {
    height: '2.5rem',
    borderRadius: radii.md,
    gap: '0.5rem',
    paddingInline: '1.25rem',
    fontSize: '0.9375rem',
  },
  sizeXl: {
    height: '2.75rem',
    borderRadius: radii.xl,
    gap: '0.625rem',
    paddingInline: '1.5rem',
    fontSize: '1rem',
  },
  sizeXxl: {
    height: '3.25rem',
    borderRadius: radii.xl,
    gap: '0.75rem',
    paddingInline: '1.75rem',
    fontSize: '1.125rem',
  },

  // Icon Button Sizes
  sizeIconXxs: {
    height: '1.5rem',
    width: '1.5rem',
    padding: 0,
    borderRadius: radii.sm,
  },
  sizeIconXs: {
    height: '1.75rem',
    width: '1.75rem',
    padding: 0,
    borderRadius: radii.sm,
  },
  sizeIconSm: {
    height: '2rem',
    width: '2rem',
    padding: 0,
  },
  sizeIconMd: {
    height: '2.25rem',
    width: '2.25rem',
    padding: 0,
  },
  sizeIconLg: {
    height: '2.5rem',
    width: '2.5rem',
    padding: 0,
  },
  sizeIconXl: {
    height: '2.75rem',
    width: '2.75rem',
    padding: 0,
  },
  sizeIconXxl: {
    height: '3.25rem',
    width: '3.25rem',
    padding: 0,
  },

  // Prefix / Suffix wrappers & icon sizes
  addonWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconGlyphXxs: {
    width: '0.75rem',
    height: '0.75rem',
  },
  iconGlyphXs: {
    width: '0.875rem',
    height: '0.875rem',
  },
  iconGlyphSm: {
    width: '1rem',
    height: '1rem',
  },
  iconGlyphMd: {
    width: '1.125rem',
    height: '1.125rem',
  },
  iconGlyphLg: {
    width: '1.25rem',
    height: '1.25rem',
  },
  iconGlyphXl: {
    width: '1.375rem',
    height: '1.375rem',
  },
  iconGlyphXxl: {
    width: '1.5rem',
    height: '1.5rem',
  },

  // Built-in spinner
  spinner: {
    animationName: spin,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    borderRadius: radii.full,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderTopColor: 'transparent',
    flexShrink: 0,
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
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
  // Backward compatibility aliases
  default: styles.sizeMd,
  '2xl': styles.sizeXxl,
  // Icon button sizes
  icon: styles.sizeIconMd,
  'icon-xxs': styles.sizeIconXxs,
  'icon-xs': styles.sizeIconXs,
  'icon-sm': styles.sizeIconSm,
  'icon-md': styles.sizeIconMd,
  'icon-lg': styles.sizeIconLg,
  'icon-xl': styles.sizeIconXl,
  'icon-xxl': styles.sizeIconXxl,
};

const iconGlyphStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.iconGlyphXxs,
  xs: styles.iconGlyphXs,
  sm: styles.iconGlyphSm,
  md: styles.iconGlyphMd,
  lg: styles.iconGlyphLg,
  xl: styles.iconGlyphXl,
  xxl: styles.iconGlyphXxl,
};

const defaultIconSizeForButton: Record<string, ComponentSize> = {
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  default: 'sm',
  lg: 'md',
  xl: 'lg',
  xxl: 'xl',
  '2xl': 'xl',
  icon: 'md',
  'icon-xxs': 'xxs',
  'icon-xs': 'xs',
  'icon-sm': 'sm',
  'icon-md': 'md',
  'icon-lg': 'lg',
  'icon-xl': 'xl',
  'icon-xxl': 'xxl',
};

export interface ButtonProps extends Omit<React.ComponentProps<'button'>, 'prefix'> {
  variant?: ButtonVariant;
  /** Size tier across 7-tier scale ('xxs' to 'xxl') or icon sizing */
  size?: ButtonSize;
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
  /** Prefix icon or ReactNode content placed before button text */
  prefix?: ReactNode;
  /** Alias for `prefix` */
  prefixIcon?: ReactNode;
  /** Suffix icon or ReactNode content placed after button text */
  suffix?: ReactNode;
  /** Alias for `suffix` */
  suffixIcon?: ReactNode;
  /** Override size of prefix/suffix icon independently of button size across 7 tiers */
  iconSize?: ComponentSize;
  /** Override prefix size specifically */
  prefixSize?: ComponentSize;
  /** Override suffix size specifically */
  suffixSize?: ComponentSize;
  /** Displays a loading spinner and disables interaction */
  isLoading?: boolean;
  /** Alias for `isLoading` */
  loading?: boolean;
  /** HTML button type attribute alias */
  htmlType?: 'button' | 'submit' | 'reset';
  /** Configurable button width (presets: 'full', 'fit', 'md', px number, or custom CSS string) */
  width?: ComponentWidth;
}

function Button({
  className,
  type,
  variant = 'default',
  size = 'md',
  asChild = false,
  width,
  style,
  prefix,
  prefixIcon,
  suffix,
  suffixIcon,
  iconSize,
  prefixSize,
  suffixSize,
  isLoading,
  loading,
  disabled,
  htmlType,
  children,
  sx,
  ...props
}: ButtonProps) {
  const isPending = isLoading ?? loading ?? false;
  const isDisabled = disabled ?? isPending;
  const resolvedType = htmlType ?? type ?? 'button';
  const Comp = asChild ? Slot : 'button';
  const resolvedWidth = resolveWidth(width);

  const resolvedSize = size === 'default' ? 'md' : size;
  const currentSizeStyle = sizeStyles[resolvedSize] ?? styles.sizeMd;

  const defaultIconTier = defaultIconSizeForButton[resolvedSize] ?? 'sm';
  const resolvedPrefixSize = prefixSize ?? iconSize ?? defaultIconTier;
  const resolvedSuffixSize = suffixSize ?? iconSize ?? defaultIconTier;

  const resolvedPrefix = prefix ?? prefixIcon;
  const resolvedSuffix = suffix ?? suffixIcon;

  const sxProps = stylex.props(
    styles.base,
    variantStyles[variant] ?? styles.variantDefault,
    currentSizeStyle,
    sx,
  );

  const mergedClassName = className
    ? `${sxProps.className || ''} ${className}`.trim()
    : sxProps.className;

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={resolvedSize}
        data-width={width}
        disabled={isDisabled}
        {...sxProps}
        style={{ ...sxProps.style, ...style, ...(resolvedWidth ? { width: resolvedWidth } : {}) }}
        className={mergedClassName}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <button
      type={resolvedType}
      data-slot="button"
      data-variant={variant}
      data-size={resolvedSize}
      data-width={width}
      disabled={isDisabled}
      {...sxProps}
      style={{ ...sxProps.style, ...style, ...(resolvedWidth ? { width: resolvedWidth } : {}) }}
      className={mergedClassName}
      {...props}
    >
      {isPending ? (
        <span
          {...stylex.props(
            styles.addonWrapper,
            styles.spinner,
            iconGlyphStyles[resolvedPrefixSize],
          )}
          aria-hidden="true"
        />
      ) : resolvedPrefix ? (
        <span
          {...stylex.props(styles.addonWrapper, iconGlyphStyles[resolvedPrefixSize])}
          data-slot="button-prefix"
        >
          {resolvedPrefix}
        </span>
      ) : null}

      {children}

      {resolvedSuffix && !isPending ? (
        <span
          {...stylex.props(styles.addonWrapper, iconGlyphStyles[resolvedSuffixSize])}
          data-slot="button-suffix"
        >
          {resolvedSuffix}
        </span>
      ) : null}
    </button>
  );
}

function buttonVariants(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const v = options?.variant || 'default';
  const s = options?.size || 'md';
  const resolvedSize = s === 'default' ? 'md' : s;
  return (
    stylex.props(
      styles.base,
      variantStyles[v] ?? styles.variantDefault,
      sizeStyles[resolvedSize] ?? styles.sizeMd,
    ).className || ''
  );
}

export { Button, buttonVariants };
