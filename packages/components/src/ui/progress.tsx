import type { ComponentProps } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../theme/tokens.stylex';

const styles = stylex.create({
  root: {
    position: 'relative',
    height: '1rem',
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  indicator: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    transitionProperty: 'width',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-in-out',
  },
});

export interface ProgressProps extends ComponentProps<'div'> {
  value?: number;
  sx?: stylex.StyleXStyles;
}

function Progress({ className, value = 0, sx, style, ...props }: ProgressProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  const sxProps = stylex.props(styles.root, sx);

  return (
    <div
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
      data-slot="progress"
      {...sxProps}
      style={style}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <div {...stylex.props(styles.indicator)} style={{ width: `${safeValue}%` }} />
    </div>
  );
}

export { Progress };
