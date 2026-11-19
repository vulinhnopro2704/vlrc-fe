import { createContext, useContext, type ComponentProps } from 'react';
import {
  Item as ToggleGroupPrimitiveItem,
  Root as ToggleGroupPrimitiveRoot,
} from '@radix-ui/react-toggle-group';
import * as stylex from '@stylexjs/stylex';
import { radius, shadow } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { toggleStyles, toggleVariantStyles, toggleSizeStyles, type ToggleVariant } from './toggle';

const styles = stylex.create({
  group: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    borderRadius: radius.md,
  },
  groupOutline: {
    boxShadow: shadow.xs,
  },
  itemGrouped: {
    borderRadius: 0,
    minWidth: 0,
    flex: '1 1 0%',
    ':first-child': {
      borderTopLeftRadius: radius.md,
      borderBottomLeftRadius: radius.md,
    },
    ':last-child': {
      borderTopRightRadius: radius.md,
      borderBottomRightRadius: radius.md,
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

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: 'md',
  variant: 'default',
});

export type ToggleGroupProps = (
  | (Omit<
      ComponentProps<typeof ToggleGroupPrimitiveRoot>,
      'size' | 'type' | 'value' | 'defaultValue' | 'onValueChange'
    > & {
      type: 'single';
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    })
  | (Omit<
      ComponentProps<typeof ToggleGroupPrimitiveRoot>,
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
    <ToggleGroupPrimitiveRoot
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      {...(props as ComponentProps<typeof ToggleGroupPrimitiveRoot>)}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitiveRoot>
  );
}

export interface ToggleGroupItemProps extends Omit<
  ComponentProps<typeof ToggleGroupPrimitiveItem>,
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
  const context = useContext(ToggleGroupContext);
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
    <ToggleGroupPrimitiveItem
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </ToggleGroupPrimitiveItem>
  );
}

export { ToggleGroup, ToggleGroupItem };
