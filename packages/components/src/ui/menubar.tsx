'use client';

import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { cn } from '../utils';

const styles = stylex.create({
  root: {
    display: 'flex',
    height: '2.25rem',
    alignItems: 'center',
    gap: '0.25rem',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    padding: '0.25rem',
    backgroundColor: colors.background,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: radii.sm,
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: 500,
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
    ':focus': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  content: {
    zIndex: 50,
    minWidth: '12rem',
    overflow: 'hidden',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    padding: '0.25rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  subContent: {
    zIndex: 50,
    minWidth: '8rem',
    overflow: 'hidden',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    padding: '0.25rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  item: {
    position: 'relative',
    display: 'flex',
    cursor: 'pointer',
    userSelect: 'none',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: radii.sm,
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    outline: 'none',
    color: colors.foreground,
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':focus': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  itemDestructive: {
    color: colors.destructive,
    ':hover': {
      backgroundColor: colors.destructive,
      color: colors.destructiveForeground,
    },
    ':focus': {
      backgroundColor: colors.destructive,
      color: colors.destructiveForeground,
    },
  },
  itemInset: {
    paddingLeft: '2rem',
  },
  subTrigger: {
    display: 'flex',
    cursor: 'pointer',
    userSelect: 'none',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: radii.sm,
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    color: colors.foreground,
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':focus': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  indicatorContainer: {
    pointerEvents: 'none',
    position: 'absolute',
    left: '0.5rem',
    display: 'flex',
    width: '0.875rem',
    height: '0.875rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '1rem',
    height: '1rem',
  },
  circleIcon: {
    width: '0.5rem',
    height: '0.5rem',
    fill: 'currentColor',
  },
  chevronRight: {
    marginLeft: 'auto',
    width: '1rem',
    height: '1rem',
  },
  label: {
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: colors.foreground,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBlock: '0.25rem',
    marginInline: '-0.25rem',
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    color: colors.mutedForeground,
  },
});

export interface MenubarProps extends React.ComponentProps<typeof MenubarPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function Menubar({ className, sx, ...props }: MenubarProps) {
  const styleProps = stylex.props(styles.root, sx);
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

export interface MenubarTriggerProps extends React.ComponentProps<typeof MenubarPrimitive.Trigger> {
  sx?: stylex.StyleXStyles;
}

function MenubarTrigger({ className, sx, ...props }: MenubarTriggerProps) {
  const styleProps = stylex.props(styles.trigger, sx);
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface MenubarContentProps extends React.ComponentProps<typeof MenubarPrimitive.Content> {
  sx?: stylex.StyleXStyles;
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  sx,
  ...props
}: MenubarContentProps) {
  const styleProps = stylex.props(styles.content, sx);
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        {...styleProps}
        className={cn(styleProps.className, className)}
        {...props}
      />
    </MenubarPortal>
  );
}

export interface MenubarItemProps extends React.ComponentProps<typeof MenubarPrimitive.Item> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  sx?: stylex.StyleXStyles;
}

function MenubarItem({ className, inset, variant = 'default', sx, ...props }: MenubarItemProps) {
  const styleProps = stylex.props(
    styles.item,
    variant === 'destructive' ? styles.itemDestructive : undefined,
    inset ? styles.itemInset : undefined,
    sx,
  );
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface MenubarCheckboxItemProps extends React.ComponentProps<
  typeof MenubarPrimitive.CheckboxItem
> {
  sx?: stylex.StyleXStyles;
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  sx,
  ...props
}: MenubarCheckboxItemProps) {
  const styleProps = stylex.props(styles.item, styles.itemInset, sx);
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      checked={checked}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon {...stylex.props(styles.icon)} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

export interface MenubarRadioItemProps extends React.ComponentProps<
  typeof MenubarPrimitive.RadioItem
> {
  sx?: stylex.StyleXStyles;
}

function MenubarRadioItem({ className, children, sx, ...props }: MenubarRadioItemProps) {
  const styleProps = stylex.props(styles.item, styles.itemInset, sx);
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon {...stylex.props(styles.circleIcon)} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

export interface MenubarLabelProps extends React.ComponentProps<typeof MenubarPrimitive.Label> {
  inset?: boolean;
  sx?: stylex.StyleXStyles;
}

function MenubarLabel({ className, inset, sx, ...props }: MenubarLabelProps) {
  const styleProps = stylex.props(styles.label, inset ? styles.itemInset : undefined, sx);
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface MenubarSeparatorProps extends React.ComponentProps<
  typeof MenubarPrimitive.Separator
> {
  sx?: stylex.StyleXStyles;
}

function MenubarSeparator({ className, sx, ...props }: MenubarSeparatorProps) {
  const styleProps = stylex.props(styles.separator, sx);
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface MenubarShortcutProps extends React.ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function MenubarShortcut({ className, sx, ...props }: MenubarShortcutProps) {
  const styleProps = stylex.props(styles.shortcut, sx);
  return (
    <span
      data-slot="menubar-shortcut"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

export interface MenubarSubTriggerProps extends React.ComponentProps<
  typeof MenubarPrimitive.SubTrigger
> {
  inset?: boolean;
  sx?: stylex.StyleXStyles;
}

function MenubarSubTrigger({ className, inset, children, sx, ...props }: MenubarSubTriggerProps) {
  const styleProps = stylex.props(styles.subTrigger, inset ? styles.itemInset : undefined, sx);
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.chevronRight)} />
    </MenubarPrimitive.SubTrigger>
  );
}

export interface MenubarSubContentProps extends React.ComponentProps<
  typeof MenubarPrimitive.SubContent
> {
  sx?: stylex.StyleXStyles;
}

function MenubarSubContent({ className, sx, ...props }: MenubarSubContentProps) {
  const styleProps = stylex.props(styles.subContent, sx);
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
