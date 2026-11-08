import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import Icons from '../Icons';
import type { TextProps, TextType } from './types';
import { resolveCustomTypographyStyle } from './utils';
import { typographyWeightStyles } from './weightStyles';

const styles = stylex.create({
  base: {
    color: colors.foreground,
    lineHeight: 1.5,
  },

  // 7-tier Text Sizing (8, 10, 12, 14, 16, 20, 24px)
  sizeXxs: {
    fontSize: '0.5rem', // 8px
    lineHeight: 1.35,
  },
  sizeXs: {
    fontSize: '0.625rem', // 10px
    lineHeight: 1.4,
  },
  sizeSm: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.45,
  },
  sizeMd: {
    fontSize: '0.875rem', // 14px (default)
    lineHeight: 1.5,
  },
  sizeLg: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
  },
  sizeXl: {
    fontSize: '1.25rem', // 20px
    lineHeight: 1.45,
  },
  sizeXxl: {
    fontSize: '1.5rem', // 24px
    lineHeight: 1.4,
  },

  // Semantic types
  typeDefault: {
    color: colors.foreground,
  },
  typeSecondary: {
    color: colors.mutedForeground,
  },
  typeMuted: {
    color: colors.mutedForeground,
  },
  typeSuccess: {
    color: '#16a34a',
  },
  typeWarning: {
    color: '#ca8a04',
  },
  typeDanger: {
    color: colors.destructive,
  },
  typeInfo: {
    color: '#2563eb',
  },

  // Text decorations
  strong: {
    fontWeight: 700,
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecoration: 'underline',
  },
  delete: {
    textDecoration: 'line-through',
  },
  keyboard: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '0.8125rem',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.muted,
    paddingInline: '0.375rem',
    paddingBlock: '0.125rem',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
  },
  ellipsisSingle: {
    display: 'inline-block',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'bottom',
  },

  copyBtn: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    cursor: 'pointer',
    padding: '0.125rem 0.25rem',
    marginLeft: '0.25rem',
    borderRadius: radii.sm,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    outline: 'none',
    transitionProperty: 'color, background-color',
    transitionDuration: '150ms',
    ':hover': {
      color: colors.foreground,
      backgroundColor: colors.accent,
    },
  },
  copyIcon: {
    width: '0.875rem',
    height: '0.875rem',
  },
  requiredAsterisk: {
    color: colors.destructive,
    marginLeft: '0.25rem',
    display: 'inline-block',
    lineHeight: 1,
    fontWeight: 600,
    userSelect: 'none',
  },
});

const textSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

const typeStyles: Record<TextType, stylex.StyleXStyles> = {
  default: styles.typeDefault,
  secondary: styles.typeSecondary,
  muted: styles.typeMuted,
  success: styles.typeSuccess,
  warning: styles.typeWarning,
  danger: styles.typeDanger,
  info: styles.typeInfo,
};

export function Text({
  type = 'default',
  size = 'md',
  weight = 'regular',
  required,
  strong,
  italic,
  underline,
  delete: isDelete,
  keyboard,
  customSize,
  lines,
  rows,
  lineHeight,
  ellipsis,
  textDecoration,
  textDecorationLine,
  textDecorationStyle,
  textDecorationColor,
  textDecorationThickness,
  textUnderlineOffset,
  copyable,
  as,
  className,
  children,
  sx,
  ...props
}: TextProps) {
  const [copied, setCopied] = useState(false);

  let defaultComponent = 'span';
  if (keyboard) defaultComponent = 'kbd';
  else if (strong) defaultComponent = 'strong';
  else if (italic) defaultComponent = 'em';
  else if (isDelete) defaultComponent = 'del';

  const Component = (as || defaultComponent) as React.ElementType;

  const resolvedRows = lines ?? rows ?? (typeof ellipsis === 'object' ? ellipsis.rows : undefined);
  const isSingleEllipsis = ellipsis === true && !resolvedRows;

  const currentSizeStyle = textSizeStyles[size] ?? styles.sizeMd;

  const customStyle = resolveCustomTypographyStyle({
    customSize,
    lines,
    rows,
    lineHeight,
    ellipsis,
    textDecoration,
    textDecorationLine,
    textDecorationStyle,
    textDecorationColor,
    textDecorationThickness,
    textUnderlineOffset,
  });

  const handleCopy = async () => {
    if (typeof children === 'string') {
      try {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore clipboard errors
      }
    }
  };

  const sxProps = stylex.props(
    styles.base,
    currentSizeStyle,
    typeStyles[type],
    weight && typographyWeightStyles[weight],
    strong && styles.strong,
    italic && styles.italic,
    underline && !textDecoration && !textDecorationLine && styles.underline,
    isDelete && !textDecoration && !textDecorationLine && styles.delete,
    keyboard && styles.keyboard,
    isSingleEllipsis && styles.ellipsisSingle,
    sx,
  );

  return (
    <Component
      data-slot="typography-text"
      data-type={type}
      data-size={size}
      data-weight={weight}
      {...sxProps}
      style={{ ...sxProps.style, ...customStyle }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" {...stylex.props(styles.requiredAsterisk)}>
          *
        </span>
      )}
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          {...stylex.props(styles.copyBtn)}
          aria-label={copied ? 'Copied' : 'Copy text'}
        >
          {copied ? (
            <Icons.Check {...stylex.props(styles.copyIcon)} />
          ) : (
            <Icons.Copy {...stylex.props(styles.copyIcon)} />
          )}
        </button>
      )}
    </Component>
  );
}
