import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from '../theme/tokens.stylex';
import { Flex } from './flex';
import { Text } from '../Typography/Text';

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  svg: {
    overflow: 'visible',
  },
  track: {
    stroke: colors.secondary,
    strokeLinecap: 'round',
    fill: 'none',
  },
  indicator: {
    strokeLinecap: 'round',
    fill: 'none',
    transitionProperty: 'stroke-dashoffset',
    transitionDuration: '500ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  colorDefault: {
    stroke: colors.primary,
  },
  colorSuccess: {
    stroke: colors.success,
  },
  colorWarning: {
    stroke: colors.warning,
  },
  colorDestructive: {
    stroke: colors.destructive,
  },
  colorSecondary: {
    stroke: colors.secondaryForeground,
  },
  centerContent: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  minMaxRow: {
    width: '100%',
    marginTop: spacing.xxs,
  },
});

export type GaugeVariant = 'primary' | 'success' | 'warning' | 'destructive' | 'secondary';

export interface GaugeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: GaugeVariant;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => React.ReactNode;
  label?: React.ReactNode;
  children?: React.ReactNode;
  sx?: stylex.StyleXStyles;
}

export const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      size = 180,
      strokeWidth = 14,
      variant = 'primary',
      showValue = true,
      showMinMax = false,
      formatValue,
      label,
      children,
      sx,
      className,
      'aria-label': ariaLabel = 'Gauge measurement',
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.min(Math.max(value, min), max);
    const percentage = Math.round(((clampedValue - min) / (max - min || 1)) * 100);

    // Semi-circle math (180 degrees)
    const radius = (size - strokeWidth) / 2;
    const arcLength = Math.PI * radius;
    const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

    const variantStyle =
      variant === 'success'
        ? styles.colorSuccess
        : variant === 'warning'
          ? styles.colorWarning
          : variant === 'destructive'
            ? styles.colorDestructive
            : variant === 'secondary'
              ? styles.colorSecondary
              : styles.colorDefault;

    const rootSx = stylex.props(styles.root, sx);

    const formattedValue = formatValue ? formatValue(clampedValue) : `${clampedValue}%`;

    const svgHeight = size / 2 + strokeWidth / 2 + 4;

    return (
      <div
        ref={ref}
        role="meter"
        aria-valuenow={clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel}
        data-slot="gauge"
        data-variant={variant}
        {...rootSx}
        className={className ? `${rootSx.className || ''} ${className}`.trim() : rootSx.className}
        style={{ width: size }}
        {...props}
      >
        <svg
          viewBox={`0 0 ${size} ${svgHeight}`}
          width={size}
          height={svgHeight}
          {...stylex.props(styles.svg)}
        >
          {/* Background Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            strokeWidth={strokeWidth}
            {...stylex.props(styles.track)}
          />

          {/* Foreground Value Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            {...stylex.props(styles.indicator, variantStyle)}
          />
        </svg>

        {/* Center content */}
        <Flex
          vertical
          align="center"
          justify="center"
          gap="xxs"
          data-slot="gauge-content"
          {...stylex.props(styles.centerContent)}
        >
          {children ? (
            children
          ) : (
            <>
              {showValue && (
                <Text weight="bold" size="xl" data-slot="gauge-value">
                  {formattedValue}
                </Text>
              )}
              {label && (
                <Text type="secondary" size="xs" data-slot="gauge-label">
                  {label}
                </Text>
              )}
            </>
          )}
        </Flex>

        {/* Min / Max Footer */}
        {showMinMax && (
          <Flex
            justify="space-between"
            align="center"
            data-slot="gauge-minmax"
            {...stylex.props(styles.minMaxRow)}
          >
            <Text type="secondary" size="xs">
              {min}
            </Text>
            <Text type="secondary" size="xs">
              {max}
            </Text>
          </Flex>
        )}
      </div>
    );
  },
);

Gauge.displayName = 'Gauge';
