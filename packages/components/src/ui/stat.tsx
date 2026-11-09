import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { colors, radii, spacing } from '../theme/tokens.stylex';
import { Flex } from './flex';
import { Text } from '../Typography/Text';

const styles = stylex.create({
  root: {
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    color: colors.cardForeground,
  },
  bordered: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
  },
  header: {
    width: '100%',
  },
  value: {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: colors.foreground,
  },
  trend: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  trendPositive: {
    color: 'var(--success, #22c55e)',
  },
  trendNegative: {
    color: colors.destructive,
  },
  trendNeutral: {
    color: colors.mutedForeground,
  },
  trendIcon: {
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
  },
  indicatorWrapper: {
    color: colors.mutedForeground,
  },
});

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  sx?: stylex.StyleXStyles;
}

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ bordered = true, sx, className, children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        vertical
        gap="xs"
        data-slot="stat"
        sx={[styles.root, bordered && styles.bordered, sx]}
        className={className}
        {...props}
      >
        {children}
      </Flex>
    );
  },
);
Stat.displayName = 'Stat';

export interface StatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export const StatHeader = React.forwardRef<HTMLDivElement, StatHeaderProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        align="center"
        justify="space-between"
        gap="sm"
        data-slot="stat-header"
        sx={[styles.header, sx]}
        className={className}
        {...props}
      >
        {children}
      </Flex>
    );
  },
);
StatHeader.displayName = 'StatHeader';

export interface StatLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  sx?: stylex.StyleXStyles;
}

export const StatLabel = React.forwardRef<HTMLSpanElement, StatLabelProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        as="span"
        type="secondary"
        size="sm"
        weight="medium"
        data-slot="stat-label"
        sx={sx}
        className={className}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
StatLabel.displayName = 'StatLabel';

export interface StatValueProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export const StatValue = React.forwardRef<HTMLDivElement, StatValueProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        weight="bold"
        size="xxl"
        data-slot="stat-value"
        sx={[styles.value, sx]}
        className={className}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
StatValue.displayName = 'StatValue';

export type StatTrendDirection = 'up' | 'down' | 'neutral';

export interface StatTrendProps extends React.HTMLAttributes<HTMLSpanElement> {
  direction?: StatTrendDirection;
  /** Invert colors: down becomes positive/green and up becomes negative/red (e.g. latency, bounce rate) */
  inverted?: boolean;
  sx?: stylex.StyleXStyles;
}

export const StatTrend = React.forwardRef<HTMLSpanElement, StatTrendProps>(
  ({ direction = 'neutral', inverted = false, sx, className, children, ...props }, ref) => {
    const isPositive = (!inverted && direction === 'up') || (inverted && direction === 'down');

    const trendStyle =
      direction === 'neutral'
        ? styles.trendNeutral
        : isPositive
          ? styles.trendPositive
          : styles.trendNegative;

    const IconComponent =
      direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;

    return (
      <Flex
        ref={ref}
        inline
        align="center"
        gap="xxs"
        data-slot="stat-trend"
        data-direction={direction}
        sx={[styles.trend, trendStyle, sx]}
        className={className}
        {...props}
      >
        <IconComponent data-slot="stat-trend-icon" {...stylex.props(styles.trendIcon)} />
        {children}
      </Flex>
    );
  },
);
StatTrend.displayName = 'StatTrend';

export interface StatDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  sx?: stylex.StyleXStyles;
}

export const StatDescription = React.forwardRef<HTMLParagraphElement, StatDescriptionProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        as="p"
        type="secondary"
        size="xs"
        data-slot="stat-description"
        sx={sx}
        className={className}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
StatDescription.displayName = 'StatDescription';

export interface StatIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export const StatIndicator = React.forwardRef<HTMLDivElement, StatIndicatorProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        align="center"
        justify="center"
        data-slot="stat-indicator"
        sx={[styles.indicatorWrapper, sx]}
        className={className}
        {...props}
      >
        {children}
      </Flex>
    );
  },
);
StatIndicator.displayName = 'StatIndicator';
