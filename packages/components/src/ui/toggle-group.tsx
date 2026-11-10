import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import * as stylex from '@stylexjs/stylex';
import { radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { toggleStyles, toggleVariantStyles, toggleSizeStyles, type ToggleVariant } from './toggle';

const styles = stylex.create({
  group: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    borderRadius: radii.md,
  },
  groupOutline: {
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  itemGrouped: {
    borderRadius: 0,
    minWidth: 0,
    flex: '1 1 0%',
    ':first-child': {
      borderTopLeftRadius: radii.md,
      borderBottomLeftRadius: radii.md,
    },
    ':last-child': {
      borderTopRightRadius: radii.md,
      borderBottomRightRadius: radii.md,
    },
  },
  itemGroupedOutline: {
    ':not(:first-child)': {
      borderLeftWidth: 0,
    },
  },
});

interface ToggleGroupContextValue {
  size: ComponentSize;
  variant: ToggleVariant;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: 'md',
  variant: 'default',
});

export type ToggleGroupProps = (
  | (Omit<
      React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
      'size' | 'type' | 'value' | 'defaultValue' | 'onValueChange'
    > & {
      type: 'single';
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    })
  | (Omit<
      React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
      'size' | 'type' | 'value' | 'defaultValue' | 'onValueChange'
    > & {
      type: 'multiple';
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    })
) & {
  size?: ComponentSize;
  variant?: ToggleVariant;
  sx?: stylex.StyleXStyles;
};

function ToggleGroup({
  className,
  variant = 'default',
  size = 'md',
  children,
  sx,
  ...props
}: ToggleGroupProps) {
  const sxProps = stylex.props(styles.group, variant === 'outline' && styles.groupOutline, sx);

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      {...(props as React.ComponentProps<typeof ToggleGroupPrimitive.Root>)}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export interface ToggleGroupItemProps extends Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive.Item>,
  'size'
> {
  size?: ComponentSize;
  variant?: ToggleVariant;
  sx?: stylex.StyleXStyles;
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  sx,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = variant ?? context.variant ?? 'default';
  const resolvedSize = size ?? context.size ?? 'md';

  const currentVariant = toggleVariantStyles[resolvedVariant] ?? toggleStyles.defaultVariant;
  const currentSize = toggleSizeStyles[resolvedSize] ?? toggleStyles.sizeMd;
  const sxProps = stylex.props(
    toggleStyles.base,
    currentVariant,
    currentSize,
    styles.itemGrouped,
    resolvedVariant === 'outline' && styles.itemGroupedOutline,
    sx,
  );

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
