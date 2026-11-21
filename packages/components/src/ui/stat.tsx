import type { HTMLAttributes } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { colors, radius } from '../theme/tokens.stylex';
import { Paragraph, Text } from '../Typography';
import { Flex } from './flex';

const styles = stylex.create({
  root: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: '1.25rem',
    position: 'relative',
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '200ms',
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
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  trend: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1,
    paddingInline: '0.375rem',
    paddingBlock: '0.125rem',
    borderRadius: radius.sm,
  },
  trendPositive: {
    color: colors.success,
    backgroundColor: 'color-mix(in srgb, var(--color-success, #22c55e) 12%, transparent)',
  },
  trendNegative: {
    color: colors.destructive,
    backgroundColor: 'color-mix(in srgb, var(--destructive) 12%, transparent)',
  },
  trendNeutral: {
    color: colors.mutedForeground,
    backgroundColor: 'color-mix(in srgb, var(--muted-foreground) 10%, transparent)',
  },
  trendIcon: {
    width: '0.875rem',
    height: '0.875rem',
    flexShrink: 0,
  },
  indicatorWrapper: {
    flexShrink: 0,
    color: colors.mutedForeground,
  },
});

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  sx?: stylex.StyleXStyles;
}

export function Stat({ bordered = true, sx, className, children, ...props }: StatProps) {
  return (
    <Flex
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
}

export interface StatHeaderProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export function StatHeader({ sx, className, children, ...props }: StatHeaderProps) {
  return (
    <Flex
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
}

export interface StatLabelProps extends HTMLAttributes<HTMLSpanElement> {
  sx?: stylex.StyleXStyles;
}

export function StatLabel({ sx, className, children, ...props }: StatLabelProps) {
  return (
    <Text
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
}

export interface StatValueProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export function StatValue({ sx, className, children, ...props }: StatValueProps) {
  return (
    <Text
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
}

export type StatTrendDirection = 'up' | 'down' | 'neutral';

export interface StatTrendProps extends HTMLAttributes<HTMLSpanElement> {
  direction?: StatTrendDirection;
  /** Invert colors: down becomes positive/green and up becomes negative/red (e.g. latency, bounce rate) */
  inverted?: boolean;
  sx?: stylex.StyleXStyles;
}

export function StatTrend({
  direction = 'neutral',
  inverted = false,
  sx,
  className,
  children,
  ...props
}: StatTrendProps) {
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
}

export interface StatDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  sx?: stylex.StyleXStyles;
}

export function StatDescription({ sx, className, children, ...props }: StatDescriptionProps) {
  return (
    <Paragraph
      type="secondary"
      size="xs"
      data-slot="stat-description"
      sx={sx}
      className={className}
      {...props}
    >
      {children}
    </Paragraph>
  );
}

export interface StatIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export function StatIndicator({ sx, className, children, ...props }: StatIndicatorProps) {
  return (
    <Flex
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
}
