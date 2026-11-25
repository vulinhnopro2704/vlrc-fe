import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow, spacing } from '../theme/tokens.stylex';

export const styles = stylex.create({
  popup: {
    boxSizing: 'border-box',
    width: '34.375rem',
    fontFamily: 'var(--font-family-body, system-ui, sans-serif)',
    maxWidth: 'var(--radix-popover-content-available-width)',
    maxHeight: 'var(--radix-popover-content-available-height)',
    padding: spacing.sm,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
    overflowY: 'auto',
    animationName: 'none',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 200fr) 1px minmax(0, 294fr)',
    columnGap: spacing.md,
    alignItems: 'start',
    '@media (max-width: 37rem)': {
      columnGap: spacing.xs,
    },
  },
  divider: {
    position: 'relative',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  dividerImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(90deg)',
    maxWidth: 'none',
  },
  column: {
    minWidth: 0,
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gap: spacing.xs,
  },
  categories: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    justifyContent: 'center',
    position: 'relative',
    minWidth: 0,
    minHeight: { default: spacing.xl, '@media (pointer: coarse)': spacing['11'] },
    paddingInline: spacing.sm,
    fontWeight: 400,
  },
  categoryLabel: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
  },
  activeCategory: {
    backgroundColor: colors.surfaceMuted,
  },
  count: {
    minWidth: spacing['5'],
    paddingInline: spacing.xxs,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSubtle,
    textAlign: 'center',
    fontSize: '0.625rem',
    lineHeight: '0.875rem',
  },
  optionsWithSearch: {
    display: 'grid',
    gap: spacing.xs,
    minHeight: 0,
  },
  search: {
    backgroundColor: colors.surfaceSubtle,
    boxShadow: shadow.none,
  },
  options: {
    minHeight: 'min(15.5rem, 40dvh)',
    maxHeight: 'min(15.5rem, 40dvh)',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: { default: spacing.xl, '@media (pointer: coarse)': spacing['11'] },
    paddingInline: spacing.sm,
    borderRadius: radius.default,
    cursor: 'pointer',
    ':hover': { backgroundColor: colors.surfaceSubtle },
  },
  checkbox: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderRadius: radius.sm,
    boxShadow: shadow.none,
  },
  checkboxSelected: {
    backgroundColor: colors.fgMuted,
    borderColor: colors.fgMuted,
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: spacing.md,
    '@media (max-width: 37rem)': {
      paddingInline: 0,
    },
  },
  footerAction: {
    justifySelf: 'start',
    minHeight: { default: spacing.lg, '@media (pointer: coarse)': spacing['11'] },
  },
  closeIcon: {
    flexShrink: 0,
    width: '0.875rem',
    height: '0.875rem',
  },
  empty: {
    padding: spacing.sm,
  },
});
