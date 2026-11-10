import type React from 'react';
import type { BaseTypographyProps, LetterSpacingValue } from './types';
import { resolveSpacing } from '../theme/spacing';

export function resolveLetterSpacing(val?: LetterSpacingValue): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (val === 'tight') return '-0.035em';
  if (val === 'normal') return 'normal';
  if (val === 'wide') return '0.05em';
  if (typeof val === 'number') return `${val}px`;
  return val;
}

/**
 * Resolves inline styles for typography custom props (size, lineHeight, margins, letterSpacing, line clamp,
 * and comprehensive text decoration properties with number-to-px normalization).
 */
export function resolveCustomTypographyStyle(props: BaseTypographyProps): React.CSSProperties {
  const {
    customSize,
    color,
    lineHeight,
    lines,
    rows,
    ellipsis,
    textDecoration,
    textDecorationLine,
    textDecorationStyle,
    textDecorationColor,
    textDecorationThickness,
    textUnderlineOffset,
    margin,
    m,
    marginTop,
    mt,
    marginBottom,
    mb,
    marginLeft,
    ml,
    marginRight,
    mr,
    marginInline,
    mx,
    marginBlock,
    my,
    letterSpacing,
  } = props;

  const resolvedRows = lines ?? rows ?? (typeof ellipsis === 'object' ? ellipsis.rows : undefined);
  const style: React.CSSProperties = {};

  if (customSize !== undefined) {
    style.fontSize = typeof customSize === 'number' ? `${customSize}px` : customSize;
  }

  if (color !== undefined) {
    style.color = color;
  }

  if (lineHeight !== undefined) {
    style.lineHeight = lineHeight;
  }

  const resolvedMargin = margin ?? m;
  if (resolvedMargin !== undefined) {
    style.margin = resolveSpacing(resolvedMargin);
  }

  const resolvedMt = marginTop ?? mt;
  if (resolvedMt !== undefined) {
    style.marginTop = resolveSpacing(resolvedMt);
  }

  const resolvedMb = marginBottom ?? mb;
  if (resolvedMb !== undefined) {
    style.marginBottom = resolveSpacing(resolvedMb);
  }

  const resolvedMl = marginLeft ?? ml;
  if (resolvedMl !== undefined) {
    style.marginLeft = resolveSpacing(resolvedMl);
  }

  const resolvedMr = marginRight ?? mr;
  if (resolvedMr !== undefined) {
    style.marginRight = resolveSpacing(resolvedMr);
  }

  const resolvedMx = marginInline ?? mx;
  if (resolvedMx !== undefined) {
    style.marginInline = resolveSpacing(resolvedMx);
  }

  const resolvedMy = marginBlock ?? my;
  if (resolvedMy !== undefined) {
    style.marginBlock = resolveSpacing(resolvedMy);
  }

  if (letterSpacing !== undefined) {
    style.letterSpacing = resolveLetterSpacing(letterSpacing);
  }

  if (resolvedRows) {
    style.display = '-webkit-box';
    style.WebkitLineClamp = resolvedRows;
    style.WebkitBoxOrient = 'vertical';
    style.overflow = 'hidden';
  }

  if (textDecoration !== undefined) {
    style.textDecoration = textDecoration;
  }

  if (textDecorationLine !== undefined) {
    style.textDecorationLine = textDecorationLine;
  }

  if (textDecorationStyle !== undefined) {
    style.textDecorationStyle = textDecorationStyle as React.CSSProperties['textDecorationStyle'];
  }

  if (textDecorationColor !== undefined) {
    style.textDecorationColor = textDecorationColor;
  }

  if (textDecorationThickness !== undefined) {
    style.textDecorationThickness =
      typeof textDecorationThickness === 'number'
        ? `${textDecorationThickness}px`
        : textDecorationThickness;
  }

  if (textUnderlineOffset !== undefined) {
    style.textUnderlineOffset =
      typeof textUnderlineOffset === 'number' ? `${textUnderlineOffset}px` : textUnderlineOffset;
  }

  return style;
}
