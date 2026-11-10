import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';
import { Text } from '../Typography';

const styles = stylex.create({
  content: {
    zIndex: 100,
    minWidth: '8rem',
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
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
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
  indicatorContainer: {
    position: 'absolute',
    left: '0.5rem',
    display: 'flex',
    width: '0.875rem',
    height: '0.875rem',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  label: {
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.mutedForeground,
    userSelect: 'none',
  },
  separator: {
    height: 1,
    marginInline: '-0.25rem',
    marginBlock: '0.25rem',
    backgroundColor: colors.border,
    borderWidth: 0,
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    color: colors.mutedForeground,
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
  chevronRight: {
    marginLeft: 'auto',
    width: '1rem',
    height: '1rem',
  },
  indicatorIcon: {
    width: 14,
    height: 14,
  },
  radioIndicatorIcon: {
    width: 8,
    height: 8,
    fill: 'currentColor',
  },
});

function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export interface DropdownMenuContentProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Content
> {
  sx?: stylex.StyleXStyles;
  container?: HTMLElement | DocumentFragment | null;
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  sx,
  container,
  style,
  children,
  ...props
}: DropdownMenuContentProps) {
  const zIndex = useZIndex('popover');
  const sxProps = stylex.props(styles.content, sx);
  return (
    <DropdownMenuPrimitive.Portal container={container}>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...sxProps}
        style={{ zIndex, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={zIndex + 10}>{children}</ZIndexProvider>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

export interface DropdownMenuItemProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  sx?: stylex.StyleXStyles;
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  sx,
  ...props
}: DropdownMenuItemProps) {
  const sxProps = stylex.props(
    styles.item,
    variant === 'destructive' && styles.itemDestructive,
    inset && styles.itemInset,
    sx,
  );
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DropdownMenuCheckboxItemProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  sx,
  ...props
}: DropdownMenuCheckboxItemProps) {
  const sxProps = stylex.props(styles.item, styles.itemInset, sx);
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon {...stylex.props(styles.indicatorIcon)} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>,
) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

export interface DropdownMenuRadioItemProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem
> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuRadioItem({ className, children, sx, ...props }: DropdownMenuRadioItemProps) {
  const sxProps = stylex.props(styles.item, styles.itemInset, sx);
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon {...stylex.props(styles.radioIndicatorIcon)} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

export interface DropdownMenuLabelProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
> {
  inset?: boolean;
  sx?: stylex.StyleXStyles;
}

function DropdownMenuLabel({ className, inset, sx, ...props }: DropdownMenuLabelProps) {
  const sxProps = stylex.props(styles.label, inset && styles.itemInset, sx);
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DropdownMenuSeparatorProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuSeparator({ className, sx, ...props }: DropdownMenuSeparatorProps) {
  const sxProps = stylex.props(styles.separator, sx);
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DropdownMenuShortcutProps extends React.ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuShortcut({ className, sx, ...props }: DropdownMenuShortcutProps) {
  const sxProps = stylex.props(styles.shortcut, sx);
  return (
    <Text
      as="span"
      data-slot="dropdown-menu-shortcut"
      size="xs"
      type="secondary"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function DropdownMenuSub(props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

export interface DropdownMenuSubTriggerProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> {
  inset?: boolean;
  sx?: stylex.StyleXStyles;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  sx,
  ...props
}: DropdownMenuSubTriggerProps) {
  const sxProps = stylex.props(styles.subTrigger, inset && styles.itemInset, sx);
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.chevronRight)} />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export interface DropdownMenuSubContentProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuSubContent({
  className,
  sx,
  style,
  children,
  ...props
}: DropdownMenuSubContentProps) {
  const zIndex = useZIndex('popover', 1);
  const sxProps = stylex.props(styles.content, sx);
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      {...sxProps}
      style={{ zIndex, ...sxProps.style, ...style }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <ZIndexProvider value={zIndex + 10}>{children}</ZIndexProvider>
    </DropdownMenuPrimitive.SubContent>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
