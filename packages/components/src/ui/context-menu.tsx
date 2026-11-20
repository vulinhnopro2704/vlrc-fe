import { type ComponentProps } from 'react';
import {
  CheckboxItem as ContextMenuPrimitiveCheckboxItem,
  Content as ContextMenuPrimitiveContent,
  Group as ContextMenuPrimitiveGroup,
  Item as ContextMenuPrimitiveItem,
  ItemIndicator as ContextMenuPrimitiveItemIndicator,
  Label as ContextMenuPrimitiveLabel,
  Portal as ContextMenuPrimitivePortal,
  RadioGroup as ContextMenuPrimitiveRadioGroup,
  RadioItem as ContextMenuPrimitiveRadioItem,
  Root as ContextMenuPrimitiveRoot,
  Separator as ContextMenuPrimitiveSeparator,
  Sub as ContextMenuPrimitiveSub,
  SubContent as ContextMenuPrimitiveSubContent,
  SubTrigger as ContextMenuPrimitiveSubTrigger,
  Trigger as ContextMenuPrimitiveTrigger,
} from '@radix-ui/react-context-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';
import { cn } from '../utils';
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
  itemDisabled: {
    pointerEvents: 'none',
    opacity: 0.5,
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

function ContextMenu({ ...props }: ComponentProps<typeof ContextMenuPrimitiveRoot>) {
  return <ContextMenuPrimitiveRoot data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ ...props }: ComponentProps<typeof ContextMenuPrimitiveTrigger>) {
  return <ContextMenuPrimitiveTrigger data-slot="context-menu-trigger" {...props} />;
}

function ContextMenuGroup({ ...props }: ComponentProps<typeof ContextMenuPrimitiveGroup>) {
  return <ContextMenuPrimitiveGroup data-slot="context-menu-group" {...props} />;
}

function ContextMenuPortal({ ...props }: ComponentProps<typeof ContextMenuPrimitivePortal>) {
  return <ContextMenuPrimitivePortal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuSub({ ...props }: ComponentProps<typeof ContextMenuPrimitiveSub>) {
  return <ContextMenuPrimitiveSub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: ComponentProps<typeof ContextMenuPrimitiveRadioGroup>) {
  return <ContextMenuPrimitiveRadioGroup data-slot="context-menu-radio-group" {...props} />;
}

export interface ContextMenuSubTriggerProps extends ComponentProps<
  typeof ContextMenuPrimitiveSubTrigger
> {
  inset?: boolean;
  sx?: stylex.StyleXStyles;
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  sx,
  ...props
}: ContextMenuSubTriggerProps) {
  const styleProps = stylex.props(styles.subTrigger, inset ? styles.itemInset : undefined, sx);

  return (
    <ContextMenuPrimitiveSubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.chevronRight)} />
    </ContextMenuPrimitiveSubTrigger>
  );
}

export interface ContextMenuSubContentProps extends ComponentProps<
  typeof ContextMenuPrimitiveSubContent
> {
  sx?: stylex.StyleXStyles;
}

function ContextMenuSubContent({ className, sx, ...props }: ContextMenuSubContentProps) {
  const styleProps = stylex.props(styles.content, sx);

  return (
    <ContextMenuPrimitiveSubContent
      data-slot="context-menu-sub-content"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ContextMenuContentProps extends ComponentProps<
  typeof ContextMenuPrimitiveContent
> {
  sx?: stylex.StyleXStyles;
}

function ContextMenuContent({ className, sx, style, children, ...props }: ContextMenuContentProps) {
  const zIndex = useZIndex('popover');
  const styleProps = stylex.props(styles.content, sx);

  return (
    <ContextMenuPrimitivePortal>
      <ContextMenuPrimitiveContent
        data-slot="context-menu-content"
        {...styleProps}
        style={{ zIndex, ...styleProps.style, ...style }}
        className={cn(styleProps.className, className)}
        {...props}
      >
        <ZIndexProvider value={zIndex + 10}>{children}</ZIndexProvider>
      </ContextMenuPrimitiveContent>
    </ContextMenuPrimitivePortal>
  );
}

export interface ContextMenuItemProps extends ComponentProps<typeof ContextMenuPrimitiveItem> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  sx?: stylex.StyleXStyles;
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  sx,
  ...props
}: ContextMenuItemProps) {
  const styleProps = stylex.props(
    styles.item,
    variant === 'destructive' ? styles.itemDestructive : undefined,
    inset ? styles.itemInset : undefined,
    sx,
  );

  return (
    <ContextMenuPrimitiveItem
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ContextMenuCheckboxItemProps extends ComponentProps<
  typeof ContextMenuPrimitiveCheckboxItem
> {
  sx?: stylex.StyleXStyles;
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  sx,
  ...props
}: ContextMenuCheckboxItemProps) {
  const styleProps = stylex.props(styles.item, styles.itemInset, sx);

  return (
    <ContextMenuPrimitiveCheckboxItem
      data-slot="context-menu-checkbox-item"
      checked={checked}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <ContextMenuPrimitiveItemIndicator>
          <CheckIcon {...stylex.props(styles.icon)} />
        </ContextMenuPrimitiveItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitiveCheckboxItem>
  );
}

export interface ContextMenuRadioItemProps extends ComponentProps<
  typeof ContextMenuPrimitiveRadioItem
> {
  sx?: stylex.StyleXStyles;
}

function ContextMenuRadioItem({ className, children, sx, ...props }: ContextMenuRadioItemProps) {
  const styleProps = stylex.props(styles.item, styles.itemInset, sx);

  return (
    <ContextMenuPrimitiveRadioItem
      data-slot="context-menu-radio-item"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      <span {...stylex.props(styles.indicatorContainer)}>
        <ContextMenuPrimitiveItemIndicator>
          <CircleIcon {...stylex.props(styles.circleIcon)} />
        </ContextMenuPrimitiveItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitiveRadioItem>
  );
}

export interface ContextMenuLabelProps extends ComponentProps<typeof ContextMenuPrimitiveLabel> {
  inset?: boolean;
  sx?: stylex.StyleXStyles;
}

function ContextMenuLabel({ className, inset, sx, ...props }: ContextMenuLabelProps) {
  const styleProps = stylex.props(styles.label, inset ? styles.itemInset : undefined, sx);

  return (
    <ContextMenuPrimitiveLabel
      data-slot="context-menu-label"
      data-inset={inset}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ContextMenuSeparatorProps extends ComponentProps<
  typeof ContextMenuPrimitiveSeparator
> {
  sx?: stylex.StyleXStyles;
}

function ContextMenuSeparator({ className, sx, ...props }: ContextMenuSeparatorProps) {
  const styleProps = stylex.props(styles.separator, sx);

  return (
    <ContextMenuPrimitiveSeparator
      data-slot="context-menu-separator"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ContextMenuShortcutProps extends ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function ContextMenuShortcut({ className, sx, ...props }: ContextMenuShortcutProps) {
  const styleProps = stylex.props(styles.shortcut, sx);

  return (
    <Text
      as="span"
      data-slot="context-menu-shortcut"
      size="xs"
      type="secondary"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
