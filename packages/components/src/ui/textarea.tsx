import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { resolveWidth, type ComponentWidth, type ComponentSize } from '../theme';

const styles = stylex.create({
  base: {
    display: 'flex',
    width: '100%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    color: colors.foreground,
    boxShadow: shadow.xs,
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: shadow.ring,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },

  // 7-tier Sizes
  sizeXxs: {
    minHeight: '2.5rem',
    borderRadius: radius.sm,
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    fontSize: '0.6875rem',
  },
  sizeXs: {
    minHeight: '3rem',
    borderRadius: radius.sm,
    paddingInline: '0.625rem',
    paddingBlock: '0.375rem',
    fontSize: '0.75rem',
  },
  sizeSm: {
    minHeight: '3.5rem',
    borderRadius: radius.md,
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    fontSize: '0.8125rem',
  },
  sizeMd: {
    minHeight: '4rem',
    borderRadius: radius.md,
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
  },
  sizeLg: {
    minHeight: '5rem',
    borderRadius: radius.md,
    paddingInline: '1rem',
    paddingBlock: '0.625rem',
    fontSize: '0.9375rem',
  },
  sizeXl: {
    minHeight: '6rem',
    borderRadius: radius.xl,
    paddingInline: '1.125rem',
    paddingBlock: '0.75rem',
    fontSize: '1rem',
  },
  sizeXxl: {
    minHeight: '8rem',
    borderRadius: radius.xl,
    paddingInline: '1.25rem',
    paddingBlock: '1rem',
    fontSize: '1.125rem',
  },

  invalid: {
    borderColor: colors.destructive,
    boxShadow: shadow.ringDestructive,
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

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
  /** Configurable component width (presets: 'full', 'auto', 'md', px number, or custom CSS string) */
  width?: ComponentWidth;
}

function Textarea({ className, size = 'md', width, style, sx, ...props }: TextareaProps) {
  const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true';
  const sizeStyle = sizeStyles[size] ?? styles.sizeMd;
  const sxProps = stylex.props(styles.base, sizeStyle, isInvalid && styles.invalid, sx);
  const resolvedWidth = resolveWidth(width);

  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      data-width={width}
      {...sxProps}
      style={{ ...sxProps.style, ...style, ...(resolvedWidth ? { width: resolvedWidth } : {}) }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Textarea };
