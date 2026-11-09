import type React from 'react';
import type * as stylex from '@stylexjs/stylex';
import type { ComponentWidth } from '../theme/width';
import type { ComponentSize } from '../theme/types';

export interface DropdownActionItem {
  type?: 'item';
  key: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: (info: { key: string | number; domEvent: React.MouseEvent }) => void;
  children?: DropdownItemType[];
  sx?: stylex.StyleXStyles;
}

export interface DropdownSeparatorItem {
  type: 'separator' | 'divider';
  key?: string | number;
}

export interface DropdownGroupItem {
  type: 'group' | 'label';
  key?: string | number;
  label: React.ReactNode;
  children?: DropdownItemType[];
  sx?: stylex.StyleXStyles;
}

export interface DropdownCheckboxItem {
  type: 'checkbox';
  key: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  sx?: stylex.StyleXStyles;
}

export type DropdownItemType =
  | DropdownActionItem
  | DropdownSeparatorItem
  | DropdownGroupItem
  | DropdownCheckboxItem;

export type DropdownPlacement =
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'
  | 'topLeft'
  | 'top'
  | 'topRight';

export interface DropdownMenuConfig {
  items: DropdownItemType[];
  onClick?: (info: { key: string | number }) => void;
}

export interface DropdownProps {
  /** Declarative list of items */
  items?: DropdownItemType[];
  /** Declarative menu configuration with items and optional onClick callback */
  menu?: DropdownMenuConfig;
  /** Component size tier: 'sm' | 'md' | 'lg' (default: 'md') */
  size?: ComponentSize;
  /** Trigger interaction (default: 'click') */
  trigger?: 'click' | 'hover';
  /** Alignment relative to the trigger */
  align?: 'start' | 'center' | 'end';
  /** Side relative to the trigger */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Distance from the trigger (default: 4) */
  sideOffset?: number;
  /** Placement shortcut ('bottomLeft', 'bottomRight', 'topLeft', etc.) */
  placement?: DropdownPlacement;
  /** Disabled state */
  disabled?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open state change callback */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element */
  children: React.ReactElement;
  /** StyleX override for dropdown content */
  sx?: stylex.StyleXStyles;
  /** Custom className */
  className?: string;
  /** Portal container */
  container?: HTMLElement | DocumentFragment | null;
  /** Width specification (e.g. 'auto', 'full', px number, or custom string) */
  width?: ComponentWidth;
}
