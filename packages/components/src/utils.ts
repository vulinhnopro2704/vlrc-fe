import { clsx, type ClassValue } from 'clsx';
import type * as stylex from '@stylexjs/stylex';

export type StyleXStyles = stylex.StyleXStyles;

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export interface RovingNavigationOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
}

/**
 * Calculates the next active index for keyboard roving tabindex navigation (Arrow keys, Home, End).
 * Returns the target index, or null if the key is not a navigation key.
 */
export function getNextRovingIndex(
  key: string,
  currentIndex: number,
  totalCount: number,
  options: RovingNavigationOptions = {},
): number | null {
  if (totalCount <= 0) return null;
  const { orientation = 'both', loop = true } = options;
  const allowHorizontal = orientation === 'horizontal' || orientation === 'both';
  const allowVertical = orientation === 'vertical' || orientation === 'both';

  const isNext =
    (allowHorizontal && key === 'ArrowRight') || (allowVertical && key === 'ArrowDown');
  const isPrev = (allowHorizontal && key === 'ArrowLeft') || (allowVertical && key === 'ArrowUp');

  if (isNext) {
    if (currentIndex < 0) return 0;
    return loop ? (currentIndex + 1) % totalCount : Math.min(currentIndex + 1, totalCount - 1);
  }
  if (isPrev) {
    if (currentIndex < 0) return totalCount - 1;
    return loop ? (currentIndex - 1 + totalCount) % totalCount : Math.max(currentIndex - 1, 0);
  }
  if (key === 'Home') {
    return 0;
  }
  if (key === 'End') {
    return totalCount - 1;
  }
  return null;
}
