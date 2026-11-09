import type { ComponentSize } from './types';

/**
 * Standard pixel and rem values for the universal 7-tier scale.
 * - xxs: 0.25rem (4px)
 * - xs:  0.50rem (8px)
 * - sm:  0.75rem (12px)
 * - md:  1.00rem (16px) - Default
 * - lg:  1.50rem (24px)
 * - xl:  2.00rem (32px)
 * - xxl: 3.00rem (48px)
 */
export const ComponentSpacingPresetMap: Record<ComponentSize, { rem: string; px: number }> = {
  xxs: { rem: '0.25rem', px: 4 },
  xs: { rem: '0.5rem', px: 8 },
  sm: { rem: '0.75rem', px: 12 },
  md: { rem: '1rem', px: 16 },
  lg: { rem: '1.5rem', px: 24 },
  xl: { rem: '2rem', px: 32 },
  xxl: { rem: '3rem', px: 48 },
} as const;

export type SpacingValue = ComponentSize | number | (string & {});

/**
 * Checks whether a given value is one of the 7-tier ComponentSize tokens.
 */
export function isComponentSize(val: unknown): val is ComponentSize {
  return typeof val === 'string' && val in ComponentSpacingPresetMap;
}

/**
 * Resolves a SpacingValue to a valid CSS length string.
 * - ComponentSize: returns CSS variable expression (e.g. `var(--spacing-md, 1rem)`)
 * - number: returns `${number}px` (e.g. 16 -> '16px')
 * - string: returned as-is (e.g. '1.5rem', '20px')
 */
export function resolveSpacing(val?: SpacingValue): string | undefined {
  if (val === undefined || val === null) {
    return undefined;
  }
  if (typeof val === 'number') {
    return `${val}px`;
  }
  if (isComponentSize(val)) {
    return `var(--spacing-${val}, ${ComponentSpacingPresetMap[val].rem})`;
  }
  return val;
}

/**
 * Resolves a SpacingValue to an approximate numeric pixel value if possible.
 * Useful for calculating half-gutters (negative margins and padding).
 */
export function resolveSpacingPixel(val?: SpacingValue): number | undefined {
  if (val === undefined || val === null) {
    return undefined;
  }
  if (typeof val === 'number') {
    return val;
  }
  if (isComponentSize(val)) {
    return ComponentSpacingPresetMap[val].px;
  }
  if (typeof val === 'string') {
    if (val.endsWith('px')) {
      const parsed = parseFloat(val);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    if (val.endsWith('rem')) {
      const parsed = parseFloat(val);
      return Number.isNaN(parsed) ? undefined : parsed * 16;
    }
  }
  return undefined;
}

/**
 * Resolves gap prop which can be a single spacing value or a tuple `[rowGap, colGap]` / `[gapY, gapX]`.
 */
export type GapProp = SpacingValue | readonly [SpacingValue, SpacingValue];

export function resolveGap(gap?: GapProp): string | undefined {
  if (gap === undefined || gap === null) {
    return undefined;
  }
  if (Array.isArray(gap)) {
    const row = resolveSpacing(gap[0]);
    const col = resolveSpacing(gap[1]);
    if (row && col) {
      return `${row} ${col}`;
    }
    return row || col || undefined;
  }
  return resolveSpacing(gap as SpacingValue);
}
