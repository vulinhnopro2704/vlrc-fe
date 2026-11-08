import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { BlockquoteProps, BlockquoteVariant } from './types';
import { resolveCustomTypographyStyle } from './utils';

const styles = stylex.create({
  base: {
    margin: 0,
    paddingBlock: '0.75rem',
    paddingInline: '1.25rem',
    color: colors.foreground,
    lineHeight: 1.6,
  },

  // Variants
  defaultVariant: {
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    borderLeftColor: colors.primary,
    fontStyle: 'italic',
    color: colors.mutedForeground,
  },
  borderedVariant: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: radii.md,
    backgroundColor: colors.background,
  },
  filledVariant: {
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    borderLeftColor: colors.primary,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
});

const variantStyles: Record<BlockquoteVariant, stylex.StyleXStyles> = {
  default: styles.defaultVariant,
  bordered: styles.borderedVariant,
  filled: styles.filledVariant,
};

export function Blockquote({
  variant = 'default',
  cite,
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
  as: Component = 'blockquote',
  className,
  children,
  sx,
  ...props
}: BlockquoteProps) {
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

  const sxProps = stylex.props(styles.base, variantStyles[variant], sx);

  return (
    <Component
      data-slot="typography-blockquote"
      data-variant={variant}
      cite={cite}
      {...sxProps}
      style={{ ...sxProps.style, ...customStyle }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Component>
  );
}
