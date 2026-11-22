import { type ComponentProps } from 'react';
import {
  CheckboxItem as DropdownMenuPrimitiveCheckboxItem,
  Content as DropdownMenuPrimitiveContent,
  Group as DropdownMenuPrimitiveGroup,
  Item as DropdownMenuPrimitiveItem,
  ItemIndicator as DropdownMenuPrimitiveItemIndicator,
  Label as DropdownMenuPrimitiveLabel,
  Portal as DropdownMenuPrimitivePortal,
  RadioGroup as DropdownMenuPrimitiveRadioGroup,
  RadioItem as DropdownMenuPrimitiveRadioItem,
  Root as DropdownMenuPrimitiveRoot,
  Separator as DropdownMenuPrimitiveSeparator,
  Sub as DropdownMenuPrimitiveSub,
  SubContent as DropdownMenuPrimitiveSubContent,
  SubTrigger as DropdownMenuPrimitiveSubTrigger,
  Trigger as DropdownMenuPrimitiveTrigger,
} from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';
import { Text } from '../Typography';

const styles = stylex.create({
  content: {
    zIndex: 100,
    minWidth: '8rem',
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    padding: '0.25rem',
    boxShadow: shadow.md,
    outline: 'none',
  },
  item: {
    position: 'relative',
    display: 'flex',
    cursor: 'pointer',
    userSelect: 'none',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: radius.sm,
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
    borderRadius: radius.sm,
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

function DropdownMenu(props: ComponentProps<typeof DropdownMenuPrimitiveRoot>) {
  return <DropdownMenuPrimitiveRoot data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: ComponentProps<typeof DropdownMenuPrimitivePortal>) {
  return <DropdownMenuPrimitivePortal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger(props: ComponentProps<typeof DropdownMenuPrimitiveTrigger>) {
  return <DropdownMenuPrimitiveTrigger data-slot="dropdown-menu-trigger" {...props} />;
}

export interface DropdownMenuContentProps extends ComponentProps<
  typeof DropdownMenuPrimitiveContent
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
    <DropdownMenuPrimitivePortal container={container}>
      <DropdownMenuPrimitiveContent
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...sxProps}
        style={{ zIndex, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={zIndex + 10}>{children}</ZIndexProvider>
      </DropdownMenuPrimitiveContent>
    </DropdownMenuPrimitivePortal>
  );
}

function DropdownMenuGroup(props: ComponentProps<typeof DropdownMenuPrimitiveGroup>) {
  return <DropdownMenuPrimitiveGroup data-slot="dropdown-menu-group" {...props} />;
}

export interface DropdownMenuItemProps extends ComponentProps<typeof DropdownMenuPrimitiveItem> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  /** Shorthand for `variant="destructive"` */
  destructive?: boolean;
  sx?: stylex.StyleXStyles;
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  destructive,
  sx,
  ...props
}: DropdownMenuItemProps) {
  const resolvedVariant = destructive ? 'destructive' : variant;
  const sxProps = stylex.props(
    styles.item,
    resolvedVariant === 'destructive' && styles.itemDestructive,
    inset && styles.itemInset,
    sx,
  );
  return (
    <DropdownMenuPrimitiveItem
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={resolvedVariant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DropdownMenuCheckboxItemProps extends ComponentProps<
  typeof DropdownMenuPrimitiveCheckboxItem
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
    <DropdownMenuPrimitiveCheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <DropdownMenuPrimitiveItemIndicator>
          <CheckIcon {...stylex.props(styles.indicatorIcon)} />
        </DropdownMenuPrimitiveItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitiveCheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: ComponentProps<typeof DropdownMenuPrimitiveRadioGroup>) {
  return <DropdownMenuPrimitiveRadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

export interface DropdownMenuRadioItemProps extends ComponentProps<
  typeof DropdownMenuPrimitiveRadioItem
> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuRadioItem({ className, children, sx, ...props }: DropdownMenuRadioItemProps) {
  const sxProps = stylex.props(styles.item, styles.itemInset, sx);
  return (
    <DropdownMenuPrimitiveRadioItem
      data-slot="dropdown-menu-radio-item"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <DropdownMenuPrimitiveItemIndicator>
          <CircleIcon {...stylex.props(styles.radioIndicatorIcon)} />
        </DropdownMenuPrimitiveItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitiveRadioItem>
  );
}

export interface DropdownMenuLabelProps extends ComponentProps<typeof DropdownMenuPrimitiveLabel> {
  inset?: boolean;
  sx?: stylex.StyleXStyles;
}

function DropdownMenuLabel({ className, inset, sx, ...props }: DropdownMenuLabelProps) {
  const sxProps = stylex.props(styles.label, inset && styles.itemInset, sx);
  return (
    <DropdownMenuPrimitiveLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DropdownMenuSeparatorProps extends ComponentProps<
  typeof DropdownMenuPrimitiveSeparator
> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuSeparator({ className, sx, ...props }: DropdownMenuSeparatorProps) {
  const sxProps = stylex.props(styles.separator, sx);
  return (
    <DropdownMenuPrimitiveSeparator
      data-slot="dropdown-menu-separator"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DropdownMenuShortcutProps extends ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function DropdownMenuShortcut({ className, sx, ...props }: DropdownMenuShortcutProps) {
  const sxProps = stylex.props(styles.shortcut, sx);
  return (
    <Text
      data-slot="dropdown-menu-shortcut"
      size="xs"
      type="secondary"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function DropdownMenuSub(props: ComponentProps<typeof DropdownMenuPrimitiveSub>) {
  return <DropdownMenuPrimitiveSub data-slot="dropdown-menu-sub" {...props} />;
}

export interface DropdownMenuSubTriggerProps extends ComponentProps<
  typeof DropdownMenuPrimitiveSubTrigger
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
    <DropdownMenuPrimitiveSubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.chevronRight)} />
    </DropdownMenuPrimitiveSubTrigger>
  );
}

export interface DropdownMenuSubContentProps extends ComponentProps<
  typeof DropdownMenuPrimitiveSubContent
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
    <DropdownMenuPrimitiveSubContent
      data-slot="dropdown-menu-sub-content"
      {...sxProps}
      style={{ zIndex, ...sxProps.style, ...style }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <ZIndexProvider value={zIndex + 10}>{children}</ZIndexProvider>
    </DropdownMenuPrimitiveSubContent>
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
