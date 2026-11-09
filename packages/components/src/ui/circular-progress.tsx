import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import { Text } from '../Typography/Text';

const spin = stylex.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
  },
  svg: {
    display: 'block',
    transform: 'rotate(-90deg)',
  },
  svgIndeterminate: {
    animationName: spin,
    animationDuration: '1.4s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  track: {
    stroke: colors.secondary,
  },
  indicator: {
    strokeLinecap: 'round',
    transitionProperty: 'stroke-dashoffset',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-in-out',
  },
  colorDefault: {
    stroke: colors.primary,
  },
  colorSecondary: {
    stroke: colors.secondaryForeground,
  },
  colorDestructive: {
    stroke: colors.destructive,
  },
  colorWarning: {
    stroke: 'var(--warning, #f59e0b)',
  },
  colorSuccess: {
    stroke: 'var(--success, #22c55e)',
  },
  centerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
});

export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CircularProgressVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'warning'
  | 'success';

const SIZE_CONFIGS: Record<
  CircularProgressSize,
  { size: number; strokeWidth: number; textSize: 'xs' | 'sm' | 'md' | 'lg' }
> = {
  xs: { size: 24, strokeWidth: 2.5, textSize: 'xs' },
  sm: { size: 36, strokeWidth: 3, textSize: 'xs' },
  md: { size: 48, strokeWidth: 4, textSize: 'sm' },
  lg: { size: 64, strokeWidth: 5, textSize: 'md' },
  xl: { size: 96, strokeWidth: 6, textSize: 'lg' },
};

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  size?: CircularProgressSize | number;
  strokeWidth?: number;
  variant?: CircularProgressVariant;
  indeterminate?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => React.ReactNode;
  sx?: stylex.StyleXStyles;
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      size = 'md',
      strokeWidth: customStrokeWidth,
      variant = 'primary',
      indeterminate: forceIndeterminate,
      showValue = false,
      formatValue,
      children,
      sx,
      className,
      style,
      'aria-label': ariaLabel = 'Circular progress',
      ...props
    },
    ref,
  ) => {
    const isIndeterminate = forceIndeterminate || value === undefined || Number.isNaN(value);

    const defaultConfig = typeof size === 'string' ? SIZE_CONFIGS[size] : undefined;
    const diameter = typeof size === 'number' ? size : (defaultConfig?.size ?? 48);
    const strokeWidth = customStrokeWidth ?? defaultConfig?.strokeWidth ?? 4;

    const radius = Math.max(0, (diameter - strokeWidth) / 2);
    const circumference = 2 * Math.PI * radius;

    const clampedValue = Math.min(Math.max(value ?? 0, min), max);
    const percentage = Math.round(((clampedValue - min) / (max - min || 1)) * 100);

    const strokeDashoffset = isIndeterminate
      ? circumference * 0.75
      : circumference - (circumference * percentage) / 100;

    const variantStyle =
      variant === 'secondary'
        ? styles.colorSecondary
        : variant === 'destructive'
          ? styles.colorDestructive
          : variant === 'warning'
            ? styles.colorWarning
            : variant === 'success'
              ? styles.colorSuccess
              : styles.colorDefault;

    const rootSx = stylex.props(styles.root, sx);

    const formattedText = formatValue ? formatValue(clampedValue) : `${percentage}%`;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel}
        data-slot="circular-progress"
        data-state={isIndeterminate ? 'indeterminate' : 'determinate'}
        {...rootSx}
        className={className ? `${rootSx.className || ''} ${className}`.trim() : rootSx.className}
        style={{ width: diameter, height: diameter, ...style }}
        {...props}
      >
        <svg
          viewBox={`0 0 ${diameter} ${diameter}`}
          width={diameter}
          height={diameter}
          {...stylex.props(styles.svg, isIndeterminate && styles.svgIndeterminate)}
        >
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            {...stylex.props(styles.track)}
          />
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            {...stylex.props(styles.indicator, variantStyle)}
          />
        </svg>

        {(showValue || children) && (
          <div {...stylex.props(styles.centerContent)}>
            {children ? (
              children
            ) : (
              <Text
                weight="medium"
                size={defaultConfig?.textSize ?? 'sm'}
                data-slot="circular-progress-value"
              >
                {formattedText}
              </Text>
            )}
          </div>
        )}
      </div>
    );
  },
);

CircularProgress.displayName = 'CircularProgress';
