import * as React from 'react';
import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { resolveWidth, type ComponentWidth, type ComponentSize } from '../theme';

const styles = stylex.create({
  base: {
    width: '100%',
    minWidth: 0,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    color: colors.foreground,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    '::file-selector-button': {
      display: 'inline-flex',
      height: '1.75rem',
      borderWidth: 0,
      backgroundColor: 'transparent',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: colors.foreground,
      cursor: 'pointer',
    },
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  // 7-tier Sizes for standalone input
  sizeXxs: {
    height: '1.5rem',
    borderRadius: radii.sm,
    fontSize: '0.6875rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.125rem',
  },
  sizeXs: {
    height: '1.75rem',
    borderRadius: radii.sm,
    fontSize: '0.75rem',
    paddingInline: '0.625rem',
    paddingBlock: '0.1875rem',
  },
  sizeSm: {
    height: '2rem',
    borderRadius: radii.md,
    fontSize: '0.8125rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
  },
  sizeMd: {
    height: '2.25rem',
    borderRadius: radii.md,
    fontSize: '0.875rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
  },
  sizeLg: {
    height: '2.5rem',
    borderRadius: radii.md,
    fontSize: '0.9375rem',
    paddingInline: '1rem',
    paddingBlock: '0.375rem',
  },
  sizeXl: {
    height: '2.75rem',
    borderRadius: radii.xl,
    fontSize: '1rem',
    paddingInline: '1.125rem',
    paddingBlock: '0.5rem',
  },
  sizeXxl: {
    height: '3.25rem',
    borderRadius: radii.xl,
    fontSize: '1.125rem',
    paddingInline: '1.25rem',
    paddingBlock: '0.625rem',
  },

  invalid: {
    borderColor: colors.destructive,
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--destructive) 20%, transparent)',
  },

  // Input Wrapper for Prefix / Suffix / Button addons
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    ':focus-within': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
  },
  wrapperInvalid: {
    borderColor: colors.destructive,
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--destructive) 20%, transparent)',
  },
  wrapperDisabled: {
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  // Inner raw input inside wrapper
  innerInput: {
    flex: '1 1 auto',
    minWidth: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.foreground,
    outline: 'none',
    padding: 0,
    fontSize: 'inherit',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'not-allowed',
    },
  },

  addonContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: colors.mutedForeground,
  },

  // 7-tier Icon Glyph Sizing
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

  // 7-tier Button Slot Sizing overrides
  buttonSlotXxs: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  buttonSlotXs: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  buttonSlotSm: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  buttonSlotMd: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  buttonSlotLg: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  buttonSlotXl: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  buttonSlotXxl: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.625rem',
  },

  // Spacing presets for addons inside wrapper
  paddingXxs: {
    paddingInline: '0.375rem',
    gap: '0.25rem',
  },
  paddingXs: {
    paddingInline: '0.5rem',
    gap: '0.3125rem',
  },
  paddingSm: {
    paddingInline: '0.625rem',
    gap: '0.375rem',
  },
  paddingMd: {
    paddingInline: '0.75rem',
    gap: '0.5rem',
  },
  paddingLg: {
    paddingInline: '0.875rem',
    gap: '0.5rem',
  },
  paddingXl: {
    paddingInline: '1rem',
    gap: '0.625rem',
  },
  paddingXxl: {
    paddingInline: '1.25rem',
    gap: '0.75rem',
  },
});

const sizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

const paddingStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.paddingXxs,
  xs: styles.paddingXs,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
  xl: styles.paddingXl,
  xxl: styles.paddingXxl,
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

const buttonSlotStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.buttonSlotXxs,
  xs: styles.buttonSlotXs,
  sm: styles.buttonSlotSm,
  md: styles.buttonSlotMd,
  lg: styles.buttonSlotLg,
  xl: styles.buttonSlotXl,
  xxl: styles.buttonSlotXxl,
};

const defaultIconSizeForInput: Record<ComponentSize, ComponentSize> = {
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
  xxl: 'xl',
};

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'prefix' | 'size'> {
  /** 7-tier sizing scale for the input component ('xxs' to 'xxl', defaults to 'md') */
  size?: ComponentSize;
  /** Custom StyleX style overrides for the input element */
  sx?: stylex.StyleXStyles;
  /** Prefix ReactNode content placed before the input text */
  prefix?: ReactNode;
  /** Prefix icon element placed inside the left area */
  prefixIcon?: ReactNode;
  /** Prefix button or interactive ReactNode (overrides prefix button) */
  prefixButton?: ReactNode;
  /** Suffix ReactNode content placed after the input text */
  suffix?: ReactNode;
  /** Suffix icon element placed inside the right area */
  suffixIcon?: ReactNode;
  /** Suffix button or interactive ReactNode (overrides suffix button) */
  suffixButton?: ReactNode;
  /**
   * Overrides the size of the inner button independently of input size
   * across the 7 tiers ('xxs' - 'xxl')
   */
  buttonSize?: ComponentSize;
  /**
   * Overrides the size of prefix/suffix icon independently of input size
   * across the 7 tiers ('xxs' - 'xxl')
   */
  iconSize?: ComponentSize;
  /** Custom StyleX styles applied to outer wrapper when prefix/suffix is present */
  wrapperSx?: stylex.StyleXStyles;
  /** Custom class name applied to outer wrapper when prefix/suffix is present */
  wrapperClassName?: string;
  /** HTML input type attribute alias */
  htmlType?: string;
  /** HTML input size attribute (number of characters) */
  htmlSize?: number;
  /** Configurable component width (presets: 'full', 'auto', 'md', px number, or custom CSS string) */
  width?: ComponentWidth;
}

function Input({
  className,
  type,
  size = 'md',
  width,
  style,
  prefix,
  prefixIcon,
  prefixButton,
  suffix,
  suffixIcon,
  suffixButton,
  buttonSize,
  iconSize,
  wrapperSx,
  wrapperClassName,
  disabled,
  sx,
  htmlType,
  htmlSize,
  ...props
}: InputProps) {
  const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true';
  const resolvedSize = size;
  const currentSizeStyle = sizeStyles[resolvedSize] ?? styles.sizeMd;
  const resolvedWidth = resolveWidth(width);

  const resolvedType = htmlType ?? type;

  const resolvedPrefixIcon = prefixIcon ?? prefix;
  const resolvedSuffixIcon = suffixIcon ?? suffix;

  const hasAddon = Boolean(
    prefixButton || resolvedPrefixIcon || suffixButton || resolvedSuffixIcon,
  );

  const defaultIconTier = defaultIconSizeForInput[resolvedSize] ?? 'sm';
  const resolvedIconSize = iconSize ?? defaultIconTier;
  const resolvedButtonSize = buttonSize ?? resolvedSize;

  // When no prefix or suffix addon is supplied, render raw input directly
  if (!hasAddon) {
    const sxProps = stylex.props(styles.base, currentSizeStyle, isInvalid && styles.invalid, sx);

    return (
      <input
        type={resolvedType}
        data-slot="input"
        data-size={resolvedSize}
        data-width={width}
        disabled={disabled}
        size={htmlSize}
        {...sxProps}
        style={{ ...sxProps.style, ...style, ...(resolvedWidth ? { width: resolvedWidth } : {}) }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    );
  }

  // When addons exist, wrap inside composite container
  const wrapperSxProps = stylex.props(
    styles.wrapper,
    currentSizeStyle,
    paddingStyles[resolvedSize] ?? styles.paddingMd,
    isInvalid && styles.wrapperInvalid,
    disabled && styles.wrapperDisabled,
    wrapperSx,
  );

  const mergedWrapperClass = wrapperClassName
    ? `${wrapperSxProps.className || ''} ${wrapperClassName}`.trim()
    : wrapperSxProps.className;

  const inputSxProps = stylex.props(styles.innerInput, sx);
  const mergedInputClass = className
    ? `${inputSxProps.className || ''} ${className}`.trim()
    : inputSxProps.className;

  return (
    <div
      data-slot="input-wrapper"
      data-size={resolvedSize}
      data-width={width}
      {...wrapperSxProps}
      style={{ ...wrapperSxProps.style, ...(resolvedWidth ? { width: resolvedWidth } : {}) }}
      className={mergedWrapperClass}
    >
      {prefixButton ? (
        <div
          data-slot="input-prefix-button"
          {...stylex.props(buttonSlotStyles[resolvedButtonSize])}
        >
          {prefixButton}
        </div>
      ) : resolvedPrefixIcon ? (
        <span
          data-slot="input-prefix-icon"
          {...stylex.props(styles.addonContainer, iconGlyphStyles[resolvedIconSize])}
        >
          {resolvedPrefixIcon}
        </span>
      ) : null}

      <input
        type={resolvedType}
        data-slot="input"
        data-size={resolvedSize}
        disabled={disabled}
        size={htmlSize}
        {...inputSxProps}
        style={{ ...inputSxProps.style, ...style }}
        className={mergedInputClass}
        {...props}
      />

      {suffixButton ? (
        <div
          data-slot="input-suffix-button"
          {...stylex.props(buttonSlotStyles[resolvedButtonSize])}
        >
          {suffixButton}
        </div>
      ) : resolvedSuffixIcon ? (
        <span
          data-slot="input-suffix-icon"
          {...stylex.props(styles.addonContainer, iconGlyphStyles[resolvedIconSize])}
        >
          {resolvedSuffixIcon}
        </span>
      ) : null}
    </div>
  );
}

export { Input };
