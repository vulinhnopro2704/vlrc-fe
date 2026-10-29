import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

const styles = stylex.create({
  base: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    animationName: pulse,
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
});

export interface SkeletonProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function Skeleton({ className, sx, ...props }: SkeletonProps) {
  const sxProps = stylex.props(styles.base, sx);
  return (
    <div
      data-slot="skeleton"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Skeleton };
