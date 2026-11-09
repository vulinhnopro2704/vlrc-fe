import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { resolveTooltipContent, renderWithTooltip } from './tooltip';
import type { ParagraphAlign, ParagraphProps, ParagraphSpacing, ParagraphVariant } from './types';
import { resolveCustomTypographyStyle } from './utils';
import { typographyWeightStyles } from './weightStyles';

const styles = stylex.create({
  base: {
    margin: 0,
    color: colors.foreground,
    lineHeight: 1.625,
  },

  // 7-tier Paragraph Sizing (8, 10, 12, 14, 16, 20, 24px)
  sizeXxs: {
    fontSize: '0.5rem', // 8px
    lineHeight: 1.4,
  },
  sizeXs: {
    fontSize: '0.625rem', // 10px
    lineHeight: 1.45,
  },
  sizeSm: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.5,
  },
  sizeMd: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.6,
  },
  sizeLg: {
    fontSize: '1rem', // 16px
    lineHeight: 1.625,
  },
  sizeXl: {
    fontSize: '1.25rem', // 20px
    lineHeight: 1.6,
  },
  sizeXxl: {
    fontSize: '1.5rem', // 24px
    lineHeight: 1.55,
  },

  // Variants
  defaultVariant: {},
  leadVariant: {
    fontSize: '1.25rem',
    lineHeight: 1.6,
    color: colors.mutedForeground,
    fontWeight: 400,
  },

  // Spacing
  spacingNone: {
    marginBottom: 0,
  },
  spacingSm: {
    marginBottom: '0.5rem',
  },
  spacingMd: {
    marginBottom: '1rem',
  },
  spacingLg: {
    marginBottom: '1.5rem',
  },

  // Alignment
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignJustify: {
    textAlign: 'justify',
  },

  ellipsisSingle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    maxWidth: '100%',
    minWidth: 0,
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

const paragraphSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

const variantStyles: Record<ParagraphVariant, stylex.StyleXStyles> = {
  default: styles.defaultVariant,
  lead: styles.leadVariant,
};

const spacingStyles: Record<ParagraphSpacing, stylex.StyleXStyles> = {
  none: styles.spacingNone,
  sm: styles.spacingSm,
  md: styles.spacingMd,
  lg: styles.spacingLg,
};

const alignStyles: Record<ParagraphAlign, stylex.StyleXStyles> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
  justify: styles.alignJustify,
};

export const Paragraph = React.forwardRef<HTMLElement, ParagraphProps>(function Paragraph(
  {
    size = 'md',
    variant = 'default',
    spacing = 'none',
    align = 'left',
    weight,
    required,
    customSize,
    lines,
    rows,
    lineHeight,
    ellipsis,
    tooltip,
    textDecoration,
    textDecorationLine,
    textDecorationStyle,
    textDecorationColor,
    textDecorationThickness,
    textUnderlineOffset,
    as: Component = 'p',
    className,
    children,
    sx,
    ...props
  }: ParagraphProps,
  ref,
) {
  const resolvedRows = lines ?? rows ?? (typeof ellipsis === 'object' ? ellipsis?.rows : undefined);
  const isSingleEllipsis =
    (ellipsis === true || (typeof ellipsis === 'object' && ellipsis !== null && !ellipsis.rows)) &&
    !resolvedRows;

  const currentSizeStyle = paragraphSizeStyles[size] ?? styles.sizeMd;

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

  const sxProps = stylex.props(
    styles.base,
    currentSizeStyle,
    variantStyles[variant],
    spacingStyles[spacing],
    alignStyles[align],
    weight && typographyWeightStyles[weight],
    isSingleEllipsis && styles.ellipsisSingle,
    sx,
  );

  const tooltipContent = resolveTooltipContent(tooltip, ellipsis, children);

  const element = (
    <Component
      ref={ref}
      data-slot="typography-paragraph"
      data-variant={variant}
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
    </Component>
  );

  return renderWithTooltip(element, tooltipContent);
});

Paragraph.displayName = 'Typography.Paragraph';
