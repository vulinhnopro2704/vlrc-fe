import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as stylex from '@stylexjs/stylex';

export type StyleXStyles = stylex.StyleXStyles;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper to resolve StyleX properties deterministically.
 */
export function sx(...styles: (stylex.StyleXStyles | undefined | null | false)[]) {
  return stylex.props(...styles);
}

