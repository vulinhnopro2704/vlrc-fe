import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

const styles = stylex.create({
  root: {
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: colors.background,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'box-shadow, border-color, background-color',
    transitionDuration: '150ms',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
    boxSizing: 'border-box',
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  rootChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.primaryForeground,
  },

  // 7-tier Root Sizes (Crisp square checkbox dimensions)
  sizeXxs: {
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '0.1875rem',
  },
  sizeXs: {
    width: '0.875rem',
    height: '0.875rem',
    borderRadius: '0.1875rem',
  },
  sizeSm: {
    width: '1rem',
    height: '1rem',
    borderRadius: '0.25rem',
  },
  sizeMd: {
    width: '1.125rem',
    height: '1.125rem',
    borderRadius: '0.25rem',
  },
  sizeLg: {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '0.3125rem',
  },
  sizeXl: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '0.375rem',
  },
  sizeXxl: {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '0.4375rem',
  },

  indicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primaryForeground,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },

  // 7-tier Icon Sizes
  iconXxs: {
    width: '0.5625rem',
    height: '0.5625rem',
  },
  iconXs: {
    width: '0.6875rem',
    height: '0.6875rem',
  },
  iconSm: {
    width: '0.8125rem',
    height: '0.8125rem',
  },
  iconMd: {
    width: '0.9375rem',
    height: '0.9375rem',
  },
  iconLg: {
    width: '1.0625rem',
    height: '1.0625rem',
  },
  iconXl: {
    width: '1.25rem',
    height: '1.25rem',
  },
  iconXxl: {
    width: '1.5rem',
    height: '1.5rem',
  },
});

const rootSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

const iconSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.iconXxs,
  xs: styles.iconXs,
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
  xl: styles.iconXl,
  xxl: styles.iconXxl,
};

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function Checkbox({
  className,
  size = 'md',
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  sx,
  ...props
}: CheckboxProps) {
  const isControlled = controlledChecked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isChecked = isControlled ? Boolean(controlledChecked) : uncontrolledChecked;

  React.useEffect(() => {
    if (!isControlled && defaultChecked !== undefined) {
      setUncontrolledChecked(defaultChecked);
    }
  }, [defaultChecked, isControlled]);

  const handleCheckedChange = (nextChecked: boolean | 'indeterminate') => {
    if (!isControlled) {
      setUncontrolledChecked(nextChecked === true);
    }
    onCheckedChange?.(nextChecked);
  };

  const rootSize = rootSizeStyles[size] ?? styles.sizeMd;
  const iconSize = iconSizeStyles[size] ?? styles.iconMd;

  const sxProps = stylex.props(styles.root, rootSize, isChecked && styles.rootChecked, sx);

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        {...stylex.props(styles.indicator)}
      >
        <CheckIcon {...stylex.props(iconSize)} strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
