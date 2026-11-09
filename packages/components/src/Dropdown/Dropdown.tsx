import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii, spacing } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { resolveWidth } from '../theme/width';
import { Flex } from '../layout';
import { Text } from '../Typography';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu';
import type {
  DropdownCheckboxItem,
  DropdownGroupItem,
  DropdownItemType,
  DropdownPlacement,
  DropdownProps,
  DropdownSeparatorItem,
} from './types';

function isSeparator(item: DropdownItemType): item is DropdownSeparatorItem {
  return item.type === 'separator' || item.type === 'divider';
}

function isGroup(item: DropdownItemType): item is DropdownGroupItem {
  return item.type === 'group' || item.type === 'label';
}

function isCheckbox(item: DropdownItemType): item is DropdownCheckboxItem {
  return item.type === 'checkbox';
}

const styles = stylex.create({
  content: {
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    padding: spacing.xxs,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  sizeSm: {
    minWidth: '8rem',
  },
  sizeMd: {
    minWidth: '10rem',
  },
  sizeLg: {
    minWidth: '12.5rem',
  },
  itemSizeSm: {
    paddingInline: spacing.xs,
    paddingBlock: spacing.xxs,
    gap: spacing.xs,
  },
  itemSizeMd: {
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    gap: spacing.sm,
  },
  itemSizeLg: {
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    gap: spacing.sm,
  },
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'inherit',
  },
  labelFlex: {
    flex: '1 1 auto',
    minWidth: 0,
  },
});

const PLACEMENT_MAP: Record<
  DropdownPlacement,
  { side: 'top' | 'bottom'; align: 'start' | 'center' | 'end' }
> = {
  bottomLeft: { side: 'bottom', align: 'start' },
  bottom: { side: 'bottom', align: 'center' },
  bottomRight: { side: 'bottom', align: 'end' },
  topLeft: { side: 'top', align: 'start' },
  top: { side: 'top', align: 'center' },
  topRight: { side: 'top', align: 'end' },
};

function resolveTextSize(size: ComponentSize): 'xs' | 'sm' | 'md' {
  switch (size) {
    case 'xxs':
    case 'xs':
    case 'sm':
      return 'xs';
    case 'lg':
    case 'xl':
    case 'xxl':
      return 'md';
    case 'md':
    default:
      return 'sm';
  }
}

/**
 * Dropdown / PopupMenu composite component.
 * High-level wrapper eliminating boilerplate by accepting a declarative `items`
 * array or `menu={{ items, onClick }}` configuration.
 *
 * Utilizes the VLRC design tokens, StyleX sizing, and Typography primitives.
 */
export function Dropdown({
  items,
  menu,
  size = 'md',
  trigger = 'click',
  align,
  side,
  sideOffset = 4,
  placement,
  disabled = false,
  open,
  onOpenChange,
  children,
  sx,
  className,
  container,
  width,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  // Derive side and align from placement if provided
  const placementConfig = placement ? PLACEMENT_MAP[placement] : undefined;
  const resolvedSide = side ?? placementConfig?.side ?? 'bottom';
  const resolvedAlign = align ?? placementConfig?.align ?? 'start';

  const resolvedItems = menu?.items ?? items ?? [];

  const textSize = resolveTextSize(size);
  const sizeStyle =
    size === 'sm' || size === 'xs' || size === 'xxs'
      ? styles.sizeSm
      : size === 'lg' || size === 'xl' || size === 'xxl'
        ? styles.sizeLg
        : styles.sizeMd;

  const itemSizeStyle =
    size === 'sm' || size === 'xs' || size === 'xxs'
      ? styles.itemSizeSm
      : size === 'lg' || size === 'xl' || size === 'xxl'
        ? styles.itemSizeLg
        : styles.itemSizeMd;

  const renderItem = (item: DropdownItemType, index: number): React.ReactNode => {
    const key = item.key ?? `item-${index}`;

    if (isSeparator(item)) {
      return <DropdownMenuSeparator key={key} />;
    }

    if (isGroup(item)) {
      return (
        <DropdownMenuGroup key={key}>
          {item.label && (
            <DropdownMenuLabel sx={item.sx}>
              {typeof item.label === 'string' ? (
                <Text size="xs" type="secondary" weight="medium">
                  {item.label}
                </Text>
              ) : (
                item.label
              )}
            </DropdownMenuLabel>
          )}
          {item.children?.map(renderItem)}
        </DropdownMenuGroup>
      );
    }

    if (isCheckbox(item)) {
      return (
        <DropdownMenuCheckboxItem
          key={key}
          checked={item.checked}
          disabled={item.disabled}
          onCheckedChange={item.onCheckedChange}
          sx={[itemSizeStyle, item.sx]}
        >
          {item.icon && <span {...stylex.props(styles.iconWrapper)}>{item.icon}</span>}
          <span {...stylex.props(styles.labelFlex)}>
            {typeof item.label === 'string' ? (
              <Text size={textSize} weight="normal">
                {item.label}
              </Text>
            ) : (
              item.label
            )}
          </span>
        </DropdownMenuCheckboxItem>
      );
    }

    // Submenu with recursive rendering
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={key}>
          <DropdownMenuSubTrigger disabled={item.disabled} sx={[itemSizeStyle, item.sx]}>
            {item.icon && <span {...stylex.props(styles.iconWrapper)}>{item.icon}</span>}
            <span {...stylex.props(styles.labelFlex)}>
              {typeof item.label === 'string' ? (
                <Text size={textSize} weight="normal">
                  {item.label}
                </Text>
              ) : (
                item.label
              )}
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent sx={[styles.content, sizeStyle]}>
            {item.children.map(renderItem)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    // Standard action item
    return (
      <DropdownMenuItem
        key={key}
        disabled={item.disabled}
        variant={item.danger ? 'destructive' : undefined}
        sx={[itemSizeStyle, item.sx]}
        onSelect={(domEvent) => {
          item.onClick?.({ key, domEvent: domEvent as unknown as React.MouseEvent });
          menu?.onClick?.({ key });
        }}
      >
        <Flex align="center" gap={size === 'sm' ? 'xs' : 'sm'} sx={styles.labelFlex}>
          {item.icon && <span {...stylex.props(styles.iconWrapper)}>{item.icon}</span>}
          <span {...stylex.props(styles.labelFlex)}>
            {typeof item.label === 'string' ? (
              <Text size={textSize} weight="normal" type={item.danger ? 'danger' : 'default'}>
                {item.label}
              </Text>
            ) : (
              item.label
            )}
          </span>
        </Flex>
        {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
      </DropdownMenuItem>
    );
  };

  const hoverProps =
    trigger === 'hover' && !disabled
      ? {
          onMouseEnter: () => handleOpenChange(true),
          onMouseLeave: () => handleOpenChange(false),
        }
      : {};

  const resolvedWidth = width ? resolveWidth(width) : undefined;
  const contentStyle = resolvedWidth
    ? { width: resolvedWidth, minWidth: resolvedWidth }
    : undefined;

  return (
    <DropdownMenu open={currentOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {React.cloneElement(children, hoverProps)}
      </DropdownMenuTrigger>
      {resolvedItems.length > 0 && (
        <DropdownMenuContent
          align={resolvedAlign}
          side={resolvedSide}
          sideOffset={sideOffset}
          sx={[styles.content, sizeStyle, sx]}
          className={className}
          container={container}
          style={contentStyle}
          {...(trigger === 'hover' ? hoverProps : {})}
        >
          {resolvedItems.map(renderItem)}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

/** Semantic alias for Dropdown */
export const PopupMenu = Dropdown;
