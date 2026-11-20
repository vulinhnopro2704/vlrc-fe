import type { HTMLAttributes, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import { Text } from '../Typography/Text';

export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CircularProgressVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive';

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
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  svg: {
    transform: 'rotate(-90deg)',
    overflow: 'visible',
  },
  svgIndeterminate: {
    animationName: spin,
    animationDuration: '1.4s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  track: {
    stroke: colors.secondary,
    transitionProperty: 'stroke',
    transitionDuration: '200ms',
  },
  indicator: {
    strokeLinecap: 'round',
    transitionProperty: 'stroke-dashoffset, stroke',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  centerContent: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    pointerEvents: 'none',
  },

  // Color Variants
  colorDefault: { stroke: colors.primary },
  colorSecondary: { stroke: colors.mutedForeground },
  colorSuccess: { stroke: colors.success },
  colorWarning: { stroke: colors.warning },
  colorDestructive: { stroke: colors.destructive },
});

const SIZE_CONFIGS: Record<
  CircularProgressSize,
  { size: number; strokeWidth: number; textSize: 'xs' | 'sm' | 'md' | 'lg' }
> = {
  xs: { size: 24, strokeWidth: 3, textSize: 'xs' },
  sm: { size: 32, strokeWidth: 3, textSize: 'xs' },
  md: { size: 48, strokeWidth: 4, textSize: 'sm' },
  lg: { size: 64, strokeWidth: 5, textSize: 'md' },
  xl: { size: 96, strokeWidth: 6, textSize: 'lg' },
};

const variantStyles: Record<CircularProgressVariant, stylex.StyleXStyles> = {
  primary: styles.colorDefault,
  secondary: styles.colorSecondary,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  destructive: styles.colorDestructive,
};

export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  size?: CircularProgressSize | number;
  strokeWidth?: number;
  variant?: CircularProgressVariant;
  indeterminate?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => ReactNode;
  sx?: stylex.StyleXStyles;
}

export function CircularProgress({
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
}: CircularProgressProps) {
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

  const variantStyle = variantStyles[variant] ?? styles.colorDefault;
  const rootSx = stylex.props(styles.root, sx);
  const formattedText = formatValue ? formatValue(clampedValue) : `${percentage}%`;

  return (
    <div
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
}
