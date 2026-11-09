import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii, spacing } from '../theme/tokens.stylex';
import { Title, Text } from '../Typography';

export type TimelineOrientation = 'vertical' | 'horizontal';
export type TimelineStatus = 'completed' | 'active' | 'pending';
export type TimelineDotSize = 'sm' | 'md' | 'lg';
export type TimelineDotVariant = 'default' | 'outline' | 'solid';

interface TimelineContextValue {
  orientation: TimelineOrientation;
  activeIndex?: number;
}

const TimelineContext = React.createContext<TimelineContextValue>({
  orientation: 'vertical',
});

interface TimelineItemContextValue {
  status: TimelineStatus;
  step: number;
  isLast: boolean;
}

const TimelineItemContext = React.createContext<TimelineItemContextValue>({
  status: 'pending',
  step: 0,
  isLast: false,
});

const styles = stylex.create({
  root: {
    width: '100%',
  },
  rootVertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  rootHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    overflowX: 'auto',
  },

  // Item
  item: {
    position: 'relative',
    display: 'flex',
    minWidth: 0,
  },
  itemVertical: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md,
  },
  itemHorizontal: {
    flexDirection: 'column',
    flex: 1,
    gap: spacing.sm,
  },

  // Gutter / Track
  trackVertical: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    width: '2rem',
  },
  trackHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  // Dot
  dotBase: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    flexShrink: 0,
    zIndex: 1,
    transitionProperty: 'background-color, border-color, box-shadow, color',
    transitionDuration: '150ms',
  },
  dotSm: {
    width: '1rem',
    height: '1rem',
    fontSize: '0.625rem',
  },
  dotMd: {
    width: '1.5rem',
    height: '1.5rem',
    fontSize: '0.75rem',
  },
  dotLg: {
    width: '2rem',
    height: '2rem',
    fontSize: '0.875rem',
  },

  dotCompleted: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    borderColor: colors.primary,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  dotActive: {
    backgroundColor: colors.background,
    color: colors.primary,
    borderColor: colors.primary,
    borderWidth: 2,
    borderStyle: 'solid',
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent)',
  },
  dotPending: {
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    borderColor: colors.border,
    borderWidth: 1,
    borderStyle: 'solid',
  },

  // Connector
  connector: {
    backgroundColor: colors.border,
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
  },
  connectorCompleted: {
    backgroundColor: colors.primary,
  },
  connectorVertical: {
    width: 2,
    flex: 1,
    minHeight: '1.75rem',
    marginTop: spacing.xxs,
    marginBottom: spacing.xxs,
  },
  connectorHorizontal: {
    height: 2,
    flex: 1,
    minWidth: '1.5rem',
    marginLeft: spacing.xxs,
    marginRight: spacing.xxs,
  },

  // Content
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  contentVerticalNotLast: {
    paddingBottom: spacing.lg,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
    width: '100%',
  },

  // Time
  time: {
    fontSize: '0.75rem',
    color: colors.mutedForeground,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
});

const dotSizeStyles: Record<TimelineDotSize, stylex.StyleXStyles> = {
  sm: styles.dotSm,
  md: styles.dotMd,
  lg: styles.dotLg,
};

const dotStatusStyles: Record<TimelineStatus, stylex.StyleXStyles> = {
  completed: styles.dotCompleted,
  active: styles.dotActive,
  pending: styles.dotPending,
};

export interface TimelineProps extends React.ComponentProps<'div'> {
  orientation?: TimelineOrientation;
  activeIndex?: number;
  sx?: stylex.StyleXStyles;
}

function Timeline({
  className,
  orientation = 'vertical',
  activeIndex,
  sx,
  children,
  ...props
}: TimelineProps) {
  const contextValue = React.useMemo(
    () => ({ orientation, activeIndex }),
    [orientation, activeIndex],
  );

  const orientationStyle = orientation === 'vertical' ? styles.rootVertical : styles.rootHorizontal;
  const sxProps = stylex.props(styles.root, orientationStyle, sx);

  return (
    <TimelineContext.Provider value={contextValue}>
      <div
        role="list"
        data-slot="timeline"
        data-orientation={orientation}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </div>
    </TimelineContext.Provider>
  );
}

export interface TimelineItemProps extends React.ComponentProps<'div'> {
  step?: number;
  status?: TimelineStatus;
  isLast?: boolean;
  sx?: stylex.StyleXStyles;
}

function TimelineItem({
  className,
  step = 0,
  status: statusProp,
  isLast = false,
  sx,
  children,
  ...props
}: TimelineItemProps) {
  const { orientation, activeIndex } = React.useContext(TimelineContext);

  const status: TimelineStatus = React.useMemo(() => {
    if (statusProp) return statusProp;
    if (activeIndex === undefined) return 'pending';
    if (step < activeIndex) return 'completed';
    if (step === activeIndex) return 'active';
    return 'pending';
  }, [statusProp, activeIndex, step]);

  const itemContextValue = React.useMemo(() => ({ status, step, isLast }), [status, step, isLast]);

  const itemOrientationStyle =
    orientation === 'vertical' ? styles.itemVertical : styles.itemHorizontal;
  const sxProps = stylex.props(styles.item, itemOrientationStyle, sx);

  return (
    <TimelineItemContext.Provider value={itemContextValue}>
      <div
        role="listitem"
        data-slot="timeline-item"
        data-status={status}
        data-orientation={orientation}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </div>
    </TimelineItemContext.Provider>
  );
}

export interface TimelineDotProps extends React.ComponentProps<'div'> {
  size?: TimelineDotSize;
  status?: TimelineStatus;
  customIcon?: React.ReactNode;
  sx?: stylex.StyleXStyles;
}

function TimelineDot({
  className,
  size = 'md',
  status: statusProp,
  customIcon,
  sx,
  children,
  ...props
}: TimelineDotProps) {
  const itemContext = React.useContext(TimelineItemContext);
  const resolvedStatus = statusProp ?? itemContext.status;

  const sxProps = stylex.props(
    styles.dotBase,
    dotSizeStyles[size],
    dotStatusStyles[resolvedStatus],
    sx,
  );

  const defaultContent = () => {
    if (customIcon) return customIcon;
    if (resolvedStatus === 'completed') {
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }
    if (resolvedStatus === 'active') {
      return (
        <div
          style={{
            width: size === 'sm' ? 4 : 6,
            height: size === 'sm' ? 4 : 6,
            borderRadius: '9999px',
            backgroundColor: 'currentColor',
          }}
          aria-hidden="true"
        />
      );
    }
    return null;
  };

  return (
    <div
      data-slot="timeline-dot"
      data-status={resolvedStatus}
      data-size={size}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children ?? defaultContent()}
    </div>
  );
}

export interface TimelineConnectorProps extends React.ComponentProps<'div'> {
  forceMount?: boolean;
  sx?: stylex.StyleXStyles;
}

function TimelineConnector({
  className,
  forceMount = false,
  sx,
  ...props
}: TimelineConnectorProps) {
  const { orientation } = React.useContext(TimelineContext);
  const { status, isLast } = React.useContext(TimelineItemContext);

  if (isLast && !forceMount) {
    return null;
  }

  const isCompleted = status === 'completed';
  const orientationStyle =
    orientation === 'vertical' ? styles.connectorVertical : styles.connectorHorizontal;

  const sxProps = stylex.props(
    styles.connector,
    orientationStyle,
    isCompleted && styles.connectorCompleted,
    sx,
  );

  return (
    <div
      aria-hidden="true"
      data-slot="timeline-connector"
      data-completed={isCompleted ? '' : undefined}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface TimelineTrackProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function TimelineTrack({ className, sx, children, ...props }: TimelineTrackProps) {
  const { orientation } = React.useContext(TimelineContext);
  const trackStyle = orientation === 'vertical' ? styles.trackVertical : styles.trackHorizontal;
  const sxProps = stylex.props(trackStyle, sx);

  return (
    <div
      data-slot="timeline-track"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TimelineContentProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function TimelineContent({ className, sx, children, ...props }: TimelineContentProps) {
  const { isLast } = React.useContext(TimelineItemContext);
  const { orientation } = React.useContext(TimelineContext);
  const isVertical = orientation === 'vertical';

  const sxProps = stylex.props(
    styles.content,
    isVertical && !isLast && styles.contentVerticalNotLast,
    sx,
  );
  return (
    <div
      data-slot="timeline-content"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TimelineHeaderProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function TimelineHeader({ className, sx, children, ...props }: TimelineHeaderProps) {
  const sxProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="timeline-header"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TimelineTitleProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function TimelineTitle({ className, children, ...props }: TimelineTitleProps) {
  return (
    <Title level={5} size="sm" data-slot="timeline-title" className={className} {...props}>
      {children}
    </Title>
  );
}

export interface TimelineDescriptionProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function TimelineDescription({ className, children, ...props }: TimelineDescriptionProps) {
  return (
    <Text
      as="p"
      type="secondary"
      size="sm"
      data-slot="timeline-description"
      className={className}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface TimelineTimeProps extends React.ComponentProps<'time'> {
  sx?: stylex.StyleXStyles;
}

function TimelineTime({ className, sx, children, ...props }: TimelineTimeProps) {
  const sxProps = stylex.props(styles.time, sx);
  return (
    <time
      data-slot="timeline-time"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </time>
  );
}

export {
  Timeline,
  TimelineItem,
  TimelineTrack,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
};
