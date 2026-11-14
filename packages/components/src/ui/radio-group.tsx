import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

const styles = stylex.create({
  root: {
    display: 'grid',
    gap: '0.75rem',
  },
  item: {
    aspectRatio: '1 / 1',
    flexShrink: 0,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: colors.background,
    boxShadow: shadow.xs,
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: shadow.ring,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },

  // 7-tier Item Sizes
  itemXxs: {
    width: '0.75rem',
    height: '0.75rem',
  },
  itemXs: {
    width: '0.875rem',
    height: '0.875rem',
  },
  itemSm: {
    width: '1rem',
    height: '1rem',
  },
  itemMd: {
    width: '1.125rem',
    height: '1.125rem',
  },
  lg: {
    width: '1.25rem',
    height: '1.25rem',
  },
  xl: {
    width: '1.5rem',
    height: '1.5rem',
  },
  xxl: {
    width: '1.75rem',
    height: '1.75rem',
  },

  indicator: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },

  dot: {
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },

  // 7-tier Dot Sizes
  dotXxs: {
    width: '0.375rem',
    height: '0.375rem',
  },
  dotXs: {
    width: '0.4375rem',
    height: '0.4375rem',
  },
  dotSm: {
    width: '0.5rem',
    height: '0.5rem',
  },
  dotMd: {
    width: '0.5625rem',
    height: '0.5625rem',
  },
  dotLg: {
    width: '0.625rem',
    height: '0.625rem',
  },
  dotXl: {
    width: '0.75rem',
    height: '0.75rem',
  },
  dotXxl: {
    width: '0.875rem',
    height: '0.875rem',
  },
});

const itemSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.itemXxs,
  xs: styles.itemXs,
  sm: styles.itemSm,
  md: styles.itemMd,
  lg: styles.lg,
  xl: styles.xl,
  xxl: styles.xxl,
};

const dotSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.dotXxs,
  xs: styles.dotXs,
  sm: styles.dotSm,
  md: styles.dotMd,
  lg: styles.dotLg,
  xl: styles.dotXl,
  xxl: styles.dotXxl,
};

const RadioGroupContext = React.createContext<{ size: ComponentSize }>({ size: 'md' });

export interface RadioGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function RadioGroup({ size = 'md', className, sx, ...props }: RadioGroupProps) {
  const sxProps = stylex.props(styles.root, sx);
  return (
    <RadioGroupContext.Provider value={{ size }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        data-size={size}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function RadioGroupItem({ size: propSize, className, sx, ...props }: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const resolvedSize = propSize ?? context.size ?? 'md';

  const itemSize = itemSizeStyles[resolvedSize] ?? styles.itemMd;
  const dotSize = dotSizeStyles[resolvedSize] ?? styles.dotMd;
  const sxProps = stylex.props(styles.item, itemSize, sx);

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        {...stylex.props(styles.indicator)}
      >
        <span {...stylex.props(styles.dot, dotSize)} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
