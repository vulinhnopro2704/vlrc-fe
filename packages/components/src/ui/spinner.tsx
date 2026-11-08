import * as React from 'react';
import { Loader2Icon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import type { ComponentSize } from '../theme/types';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  base: {
    animationName: spin,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    flexShrink: 0,
  },
  sizeXxs: {
    width: '0.75rem',
    height: '0.75rem',
  },
  sizeXs: {
    width: '0.875rem',
    height: '0.875rem',
  },
  sizeSm: {
    width: '1rem',
    height: '1rem',
  },
  sizeMd: {
    width: '1.25rem',
    height: '1.25rem',
  },
  sizeLg: {
    width: '1.5rem',
    height: '1.5rem',
  },
  sizeXl: {
    width: '2rem',
    height: '2rem',
  },
  sizeXxl: {
    width: '2.5rem',
    height: '2.5rem',
  },
});

const sizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

export interface SpinnerProps extends React.ComponentProps<'svg'> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function Spinner({ className, size = 'sm', sx, ...props }: SpinnerProps) {
  const sxProps = stylex.props(styles.base, sizeStyles[size] ?? styles.sizeSm, sx);
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      data-size={size}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Spinner };
