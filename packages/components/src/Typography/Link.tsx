import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import Icons from '../Icons';
import { resolveTooltipContent, renderWithTooltip } from './tooltip';
import type { LinkProps, LinkUnderline } from './types';
import { resolveCustomTypographyStyle } from './utils';
import { typographyWeightStyles } from './weightStyles';

const styles = stylex.create({
  base: {
    color: colors.primary,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontWeight: 500,
    outline: 'none',
    transitionProperty: 'color, text-decoration-color',
    transitionDuration: '150ms',
    ':focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '2px',
    },
  },

  // 7-tier Link Sizing (8, 10, 12, 14, 16, 20, 24px)
  sizeXxs: {
    fontSize: '0.5rem', // 8px
  },
  sizeXs: {
    fontSize: '0.625rem', // 10px
  },
  sizeSm: {
    fontSize: '0.75rem', // 12px
  },
  sizeMd: {
    fontSize: '0.875rem', // 14px (default)
  },
  sizeLg: {
    fontSize: '1rem', // 16px
  },
  sizeXl: {
    fontSize: '1.25rem', // 20px
  },
  sizeXxl: {
    fontSize: '1.5rem', // 24px
  },

  // Underlines
  always: {
    textDecoration: 'underline',
  },
  hover: {
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  none: {
    textDecoration: 'none',
  },

  disabled: {
    pointerEvents: 'none',
    opacity: 0.5,
    cursor: 'not-allowed',
    color: colors.mutedForeground,
  },

  externalIcon: {
    width: '0.75rem',
    height: '0.75rem',
    opacity: 0.8,
    transform: 'rotate(-45deg)',
  },

  ellipsisSingle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    verticalAlign: 'bottom',
    maxWidth: '100%',
    minWidth: 0,
  },
});

const linkSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

const underlineStyles: Record<LinkUnderline, stylex.StyleXStyles> = {
  always: styles.always,
  hover: styles.hover,
  none: styles.none,
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    size = 'md',
    external,
    underline = 'hover',
    disabled,
    weight,
    target,
    rel,
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
    as: Component = 'a',
    className,
    children,
    sx,
    ...props
  }: LinkProps,
  ref,
) {
  const resolvedTarget = external ? (target ?? '_blank') : target;
  const resolvedRel = external ? (rel ?? 'noopener noreferrer') : rel;

  const resolvedRows = lines ?? rows ?? (typeof ellipsis === 'object' ? ellipsis?.rows : undefined);
  const isSingleEllipsis =
    (ellipsis === true || (typeof ellipsis === 'object' && ellipsis !== null && !ellipsis.rows)) &&
    !resolvedRows;

  const currentSizeStyle = linkSizeStyles[size] ?? styles.sizeMd;

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
    underlineStyles[underline],
    weight && typographyWeightStyles[weight],
    disabled && styles.disabled,
    isSingleEllipsis && styles.ellipsisSingle,
    sx,
  );

  const tooltipContent = resolveTooltipContent(tooltip, ellipsis, children);

  const element = (
    <Component
      ref={ref}
      data-slot="typography-link"
      data-size={size}
      data-weight={weight}
      href={disabled ? undefined : href}
      target={resolvedTarget}
      rel={resolvedRel}
      aria-disabled={disabled}
      {...sxProps}
      style={{ ...sxProps.style, ...customStyle }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
      {external && <Icons.ArrowRight {...stylex.props(styles.externalIcon)} />}
    </Component>
  );

  return renderWithTooltip(element, tooltipContent);
});

Link.displayName = 'Typography.Link';
