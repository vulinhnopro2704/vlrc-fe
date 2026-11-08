import * as stylex from '@stylexjs/stylex';
import type { TypographyWeight } from './types';

const styles = stylex.create({
  thin: {
    fontWeight: 100,
  },
  extraLight: {
    fontWeight: 200,
  },
  light: {
    fontWeight: 300,
  },
  regular: {
    fontWeight: 400,
  },
  medium: {
    fontWeight: 500,
  },
  semibold: {
    fontWeight: 600,
  },
  bold: {
    fontWeight: 700,
  },
  extraBold: {
    fontWeight: 800,
  },
  black: {
    fontWeight: 900,
  },
});

export const typographyWeightStyles: Record<TypographyWeight, stylex.StyleXStyles> = {
  thin: styles.thin,
  'extra-light': styles.extraLight,
  extralight: styles.extraLight,
  light: styles.light,
  normal: styles.regular,
  regular: styles.regular,
  medium: styles.medium,
  'semi-bold': styles.semibold,
  semibold: styles.semibold,
  bold: styles.bold,
  'extra-bold': styles.extraBold,
  extrabold: styles.extraBold,
  black: styles.black,
};
