import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const styles = stylex.create({
  root: {
    position: 'relative',
    height: '1rem',
    width: '100%',
    overflow: 'hidden',
    borderRadius: radii.full,
    backgroundColor: colors.secondary,
  },
  indicator: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    transitionProperty: 'width',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-in-out',
  },
});

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  sx?: stylex.StyleXStyles;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, sx, style, ...props }, ref) => {
    const safeValue = Math.min(Math.max(value, 0), 100);
    const sxProps = stylex.props(styles.root, sx);

    return (
      <div
        ref={ref}
        data-slot="progress"
        {...sxProps}
        style={style}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <div
          {...stylex.props(styles.indicator)}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
