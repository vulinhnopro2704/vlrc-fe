import { clsx, type ClassValue } from 'clsx';
import type * as stylex from '@stylexjs/stylex';

export type StyleXStyles = stylex.StyleXStyles;

export const cn = (...inputs: ClassValue[]) => clsx(inputs);
