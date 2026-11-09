import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii, spacing } from '../theme/tokens.stylex';
import { Button, type ButtonProps } from './button';
import { Kbd } from './kbd';

interface ActionBarContextValue {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ActionBarContext = React.createContext<ActionBarContextValue>({
  open: false,
});

function useActionBarContext(component: string): ActionBarContextValue {
  const context = React.useContext(ActionBarContext);
  if (!context) {
    throw new Error(`${component} must be used within an ActionBar`);
  }
  return context;
}

const styles = stylex.create({
  root: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    color: colors.foreground,
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    paddingInline: spacing.md,
    paddingBlock: spacing.xs,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transitionProperty: 'transform, opacity',
    transitionDuration: '200ms',
  },
  selection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    paddingRight: spacing.xs,
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  separator: {
    width: 1,
    height: '1.25rem',
    backgroundColor: colors.border,
    marginInline: '0.125rem',
  },
  close: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

export interface ActionBarProps extends React.ComponentProps<'div'> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  sx?: stylex.StyleXStyles;
}

function ActionBar({
  className,
  open = true,
  onOpenChange,
  onEscapeKeyDown,
  sx,
  children,
  ...props
}: ActionBarProps) {
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeKeyDown?.(e);
        if (!e.defaultPrevented) {
          onOpenChange?.(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange, onEscapeKeyDown]);

  if (!open) return null;

  const sxProps = stylex.props(styles.root, sx);

  return (
    <ActionBarContext.Provider value={{ open, onOpenChange }}>
      <div
        role="toolbar"
        aria-label="Bulk actions toolbar"
        data-slot="action-bar"
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </div>
    </ActionBarContext.Provider>
  );
}

export interface ActionBarSelectionProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ActionBarSelection({ className, sx, children, ...props }: ActionBarSelectionProps) {
  const sxProps = stylex.props(styles.selection, sx);
  return (
    <div
      data-slot="action-bar-selection"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ActionBarGroupProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ActionBarGroup({ className, sx, children, ...props }: ActionBarGroupProps) {
  const sxProps = stylex.props(styles.group, sx);
  return (
    <div
      data-slot="action-bar-group"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ActionBarItemProps extends ButtonProps {
  sx?: stylex.StyleXStyles;
}

function ActionBarItem({
  variant = 'ghost',
  size = 'sm',
  className,
  ...props
}: ActionBarItemProps) {
  return (
    <Button
      variant={variant}
      size={size}
      data-slot="action-bar-item"
      className={className}
      {...props}
    />
  );
}

export interface ActionBarSeparatorProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ActionBarSeparator({ className, sx, ...props }: ActionBarSeparatorProps) {
  const sxProps = stylex.props(styles.separator, sx);
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      data-slot="action-bar-separator"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface ActionBarCloseProps extends ButtonProps {
  showShortcut?: boolean;
  sx?: stylex.StyleXStyles;
}

function ActionBarClose({
  variant = 'ghost',
  size = 'sm',
  showShortcut = true,
  onClick,
  children = 'Clear',
  ...props
}: ActionBarCloseProps) {
  const { onOpenChange } = useActionBarContext('ActionBarClose');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    onOpenChange?.(false);
  };

  return (
    <Button
      variant={variant}
      size={size}
      data-slot="action-bar-close"
      onClick={handleClick}
      {...props}
    >
      {children}
      {showShortcut && <Kbd size="xs">ESC</Kbd>}
    </Button>
  );
}

export {
  ActionBar,
  ActionBarSelection,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSeparator,
  ActionBarClose,
};
