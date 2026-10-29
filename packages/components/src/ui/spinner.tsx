import * as React from 'react';
import { Loader2Icon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  base: {
    width: '1rem',
    height: '1rem',
    animationName: spin,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
});

export interface SpinnerProps extends React.ComponentProps<'svg'> {
  sx?: stylex.StyleXStyles;
}

function Spinner({ className, sx, ...props }: SpinnerProps) {
  const sxProps = stylex.props(styles.base, sx);
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Spinner };
