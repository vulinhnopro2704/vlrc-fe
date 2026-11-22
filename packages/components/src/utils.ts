import { clsx, type ClassValue } from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { radius, shadow } from './theme/tokens.stylex';

export type StyleXStyles = stylex.StyleXStyles;

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

/**
 * Standard visually hidden srOnly styles using modern clipPath inset(50%).
 * Complies with Astryx accessibility rules (no deprecated rect clipping).
 */
export const srOnlyStyles = stylex.create({
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

/**
 * Reusable reset button styles for interactive wrappers (e.g. Popover/Dropdown trigger buttons)
 * that eliminates browser button chrome and default button padding/height.
 */
export const unstyledButtonStyles = stylex.create({
  reset: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingInline: 0,
    paddingBlock: 0,
    height: 'auto',
    minHeight: 0,
    width: 'auto',
    minWidth: 0,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    borderRadius: radius.full,
    boxShadow: 'none',
    ':hover': {
      backgroundColor: 'transparent',
    },
    ':active': {
      backgroundColor: 'transparent',
    },
    ':focus': {
      backgroundColor: 'transparent',
    },
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
    },
  },
});

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
