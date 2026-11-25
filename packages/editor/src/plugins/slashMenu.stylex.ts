import { create } from '@stylexjs/stylex';

export const MENU_WIDTH = 280;
export const MENU_MAX_HEIGHT = 320;
export const VIEWPORT_PADDING = 12;

export const styles = create({
  menu: {
    position: 'fixed',
    pointerEvents: 'auto',
    zIndex: 9999,
    width: `min(${MENU_WIDTH}px, calc(100dvw - ${VIEWPORT_PADDING * 2}px))`,
    maxHeight: `min(${MENU_MAX_HEIGHT}px, calc(100dvh - 24px))`,
    overflowY: 'auto',
    borderRadius: 'var(--radius-md)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border-default, var(--border))',
    backgroundColor: 'var(--color-surface-default, var(--background))',
    boxShadow: 'var(--shadow-lg)',
    padding: 'var(--spacing-1)',
    boxSizing: 'border-box',
    overscrollBehavior: 'contain',
    scrollBehavior: 'smooth',
  },
  groupHeading: {
    paddingInline: 'var(--spacing-sm)',
    paddingBlock: 'var(--spacing-1)',
    userSelect: 'none',
  },
  groupSpacing: { marginBlockStart: 'var(--spacing-1)' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    paddingInline: 'var(--spacing-sm)',
    paddingBlock: 'var(--spacing-xs)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    userSelect: 'none',
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    outline: 'none',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: 'var(--color-surface-subtle, var(--secondary))',
    },
  },
  itemSelected: {
    backgroundColor: 'var(--color-surface-subtle, var(--secondary))',
    boxShadow: 'var(--shadow-ring-focus)',
  },
  iconBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-surface-subtle, var(--secondary))',
    color: 'var(--color-fg-muted, var(--muted-foreground))',
    flexShrink: 0,
  },
  empty: {
    paddingInline: 'var(--spacing-md)',
    paddingBlock: 'var(--spacing-lg)',
    textAlign: 'center',
  },
});
