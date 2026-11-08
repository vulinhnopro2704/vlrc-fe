import type React from 'react';
import type { BaseTypographyProps } from './types';

/**
 * Resolves inline styles for typography custom props (size, lineHeight, line clamp,
 * and comprehensive text decoration properties with number-to-px normalization).
 */
export function resolveCustomTypographyStyle(props: BaseTypographyProps): React.CSSProperties {
  const {
    customSize,
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
  } = props;

  const resolvedRows = lines ?? rows ?? (typeof ellipsis === 'object' ? ellipsis.rows : undefined);
  const style: React.CSSProperties = {};

  if (customSize !== undefined) {
    style.fontSize = typeof customSize === 'number' ? `${customSize}px` : customSize;
  }

  if (lineHeight !== undefined) {
    style.lineHeight = lineHeight;
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
