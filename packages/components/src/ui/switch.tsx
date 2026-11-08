import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    flexShrink: 0,
    cursor: 'pointer',
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    backgroundColor: colors.input,
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: '200ms',
    outline: 'none',
    boxSizing: 'border-box',
    padding: 0,
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
  },

  // 7-tier Root Sizes
  rootXxs: {
    height: '1rem',
    width: '1.75rem',
  },
  rootXs: {
    height: '1.125rem',
    width: '2rem',
  },
  rootSm: {
    height: '1.25rem',
    width: '2.25rem',
  },
  rootMd: {
    height: '1.375rem',
    width: '2.5rem',
  },
  rootLg: {
    height: '1.5rem',
    width: '2.75rem',
  },
  rootXl: {
    height: '1.75rem',
    width: '3.25rem',
  },
  rootXxl: {
    height: '2rem',
    width: '3.75rem',
  },

  thumb: {
    pointerEvents: 'none',
    display: 'block',
    borderRadius: radii.full,
    backgroundColor: colors.background,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
    transitionProperty: 'transform',
    transitionDuration: '200ms',
    transform: 'translateX(0)',
    boxSizing: 'border-box',
  },

  // 7-tier Thumb Sizes
  thumbXxs: {
    height: '0.75rem',
    width: '0.75rem',
  },
  thumbXs: {
    height: '0.875rem',
    width: '0.875rem',
  },
  thumbSm: {
    height: '1rem',
    width: '1rem',
  },
  thumbMd: {
    height: '1.125rem',
    width: '1.125rem',
  },
  thumbLg: {
    height: '1.25rem',
    width: '1.25rem',
  },
  thumbXl: {
    height: '1.5rem',
    width: '1.5rem',
  },
  thumbXxl: {
    height: '1.75rem',
    width: '1.75rem',
  },

  // 7-tier Thumb Checked Transforms
  thumbCheckedXxs: {
    transform: 'translateX(0.75rem)',
  },
  thumbCheckedXs: {
    transform: 'translateX(0.875rem)',
  },
  thumbCheckedSm: {
    transform: 'translateX(1rem)',
  },
  thumbCheckedMd: {
    transform: 'translateX(1.125rem)',
  },
  thumbCheckedLg: {
    transform: 'translateX(1.25rem)',
  },
  thumbCheckedXl: {
    transform: 'translateX(1.5rem)',
  },
  thumbCheckedXxl: {
    transform: 'translateX(1.75rem)',
  },
});

const rootSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.rootXxs,
  xs: styles.rootXs,
  sm: styles.rootSm,
  md: styles.rootMd,
  lg: styles.rootLg,
  xl: styles.rootXl,
  xxl: styles.rootXxl,
};

const thumbSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.thumbXxs,
  xs: styles.thumbXs,
  sm: styles.thumbSm,
  md: styles.thumbMd,
  lg: styles.thumbLg,
  xl: styles.thumbXl,
  xxl: styles.thumbXxl,
};

const thumbCheckedStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.thumbCheckedXxs,
  xs: styles.thumbCheckedXs,
  sm: styles.thumbCheckedSm,
  md: styles.thumbCheckedMd,
  lg: styles.thumbCheckedLg,
  xl: styles.thumbCheckedXl,
  xxl: styles.thumbCheckedXxl,
};

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function Switch({
  className,
  size = 'md',
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  sx,
  ...props
}: SwitchProps) {
  const isControlled = controlledChecked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isChecked = isControlled ? Boolean(controlledChecked) : uncontrolledChecked;

  React.useEffect(() => {
    if (!isControlled && defaultChecked !== undefined) {
      setUncontrolledChecked(defaultChecked);
    }
  }, [defaultChecked, isControlled]);

  const handleCheckedChange = (nextChecked: boolean) => {
    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
  };

  const rootSize = rootSizeStyles[size] ?? styles.rootMd;
  const thumbSize = thumbSizeStyles[size] ?? styles.thumbMd;
  const thumbCheckedStyle = thumbCheckedStyles[size] ?? styles.thumbCheckedMd;

  const sxProps = stylex.props(styles.root, rootSize, isChecked && styles.rootChecked, sx);
  const thumbSxProps = stylex.props(styles.thumb, thumbSize, isChecked && thumbCheckedStyle);

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" {...thumbSxProps} />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
