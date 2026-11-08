import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: radii.md,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
  },
  dialogContent: {
    overflow: 'hidden',
    padding: 0,
    maxWidth: '32rem',
  },
  inputWrapper: {
    display: 'flex',
    height: '2.5rem',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    paddingInline: '0.75rem',
  },
  searchIcon: {
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
    opacity: 0.5,
    color: colors.foreground,
  },
  input: {
    display: 'flex',
    height: '2.25rem',
    width: '100%',
    borderRadius: radii.md,
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: '0.875rem',
    outline: 'none',
    color: colors.foreground,
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  list: {
    maxHeight: 300,
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '0.25rem',
  },
  empty: {
    paddingBlock: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: colors.mutedForeground,
  },
  group: {
    overflow: 'hidden',
    padding: '0.25rem',
    color: colors.foreground,
  },
  separator: {
    height: 1,
    marginInline: '-0.25rem',
    backgroundColor: colors.border,
    borderWidth: 0,
  },
  item: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: radii.sm,
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    userSelect: 'none',
    cursor: 'pointer',
    color: colors.foreground,
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    color: colors.mutedForeground,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

export interface CommandProps extends React.ComponentProps<typeof CommandPrimitive> {
  sx?: stylex.StyleXStyles;
}

function Command({ className, sx, ...props }: CommandProps) {
  const sxProps = stylex.props(styles.root, sx);
  return (
    <CommandPrimitive
      data-slot="command"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader {...stylex.props(styles.srOnly)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        sx={styles.dialogContent}
        className={className}
        showCloseButton={showCloseButton}
      >
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

export interface CommandInputProps extends React.ComponentProps<typeof CommandPrimitive.Input> {
  wrapperSx?: stylex.StyleXStyles;
  sx?: stylex.StyleXStyles;
}

function CommandInput({ className, wrapperSx, sx, ...props }: CommandInputProps) {
  const wrapperSxProps = stylex.props(styles.inputWrapper, wrapperSx);
  const inputSxProps = stylex.props(styles.input, sx);

  return (
    <div data-slot="command-input-wrapper" {...wrapperSxProps}>
      <SearchIcon {...stylex.props(styles.searchIcon)} />
      <CommandPrimitive.Input
        data-slot="command-input"
        {...inputSxProps}
        className={
          className ? `${inputSxProps.className || ''} ${className}`.trim() : inputSxProps.className
        }
        {...props}
      />
    </div>
  );
}

export interface CommandListProps extends React.ComponentProps<typeof CommandPrimitive.List> {
  sx?: stylex.StyleXStyles;
}

function CommandList({ className, sx, ...props }: CommandListProps) {
  const sxProps = stylex.props(styles.list, sx);
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface CommandEmptyProps extends React.ComponentProps<typeof CommandPrimitive.Empty> {
  sx?: stylex.StyleXStyles;
}

function CommandEmpty({ className, sx, ...props }: CommandEmptyProps) {
  const sxProps = stylex.props(styles.empty, sx);
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface CommandGroupProps extends React.ComponentProps<typeof CommandPrimitive.Group> {
  sx?: stylex.StyleXStyles;
}

function CommandGroup({ className, sx, ...props }: CommandGroupProps) {
  const sxProps = stylex.props(styles.group, sx);
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface CommandSeparatorProps extends React.ComponentProps<
  typeof CommandPrimitive.Separator
> {
  sx?: stylex.StyleXStyles;
}

function CommandSeparator({ className, sx, ...props }: CommandSeparatorProps) {
  const sxProps = stylex.props(styles.separator, sx);
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface CommandItemProps extends React.ComponentProps<typeof CommandPrimitive.Item> {
  sx?: stylex.StyleXStyles;
}

function CommandItem({ className, sx, ...props }: CommandItemProps) {
  const sxProps = stylex.props(styles.item, sx);
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface CommandShortcutProps extends React.ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function CommandShortcut({ className, sx, ...props }: CommandShortcutProps) {
  const sxProps = stylex.props(styles.shortcut, sx);
  return (
    <span
      data-slot="command-shortcut"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
