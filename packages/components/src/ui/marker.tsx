import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from '../theme/tokens.stylex';
import { Box } from '../layout/Box';
import { Text } from '../Typography/Text';
import { cn } from '../utils';

export type MarkerVariant = 'default' | 'separator' | 'border';
export type MarkerSize = 'sm' | 'default' | 'lg';

interface MarkerContextValue {
  variant: MarkerVariant;
  size: MarkerSize;
}

const MarkerContext = createContext<MarkerContextValue>({
  variant: 'default',
  size: 'default',
});

const styles = stylex.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  // Variants
  variantDefault: {
    gap: spacing.xs,
    paddingBlock: spacing['1'],
  },
  variantBorder: {
    gap: spacing.xs,
    paddingBlock: spacing['1.5'],
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.borderDefault,
  },
  variantSeparator: {
    position: 'relative',
    gap: spacing.sm,
    paddingBlock: spacing['2'],
    justifyContent: 'center',
  },
  // Sizes
  sizeSm: {
    fontSize: '0.75rem',
  },
  sizeDefault: {
    fontSize: '0.875rem',
  },
  sizeLg: {
    fontSize: '1rem',
  },
  // Separator lines
  separatorLine: {
    flex: '1 1 0%',
    height: 1,
    backgroundColor: colors.borderDefault,
    borderWidth: 0,
  },
  // Icon
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: colors.fgMuted,
  },
  iconSm: {
    width: '0.875rem',
    height: '0.875rem',
  },
  iconDefault: {
    width: '1rem',
    height: '1rem',
  },
  iconLg: {
    width: '1.25rem',
    height: '1.25rem',
  },
  // Content
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 0,
    flex: '1 1 auto',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    color: colors.fgDefault,
  },
  contentSeparator: {
    flex: '0 0 auto',
    color: colors.fgMuted,
  },
});

export interface MarkerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MarkerVariant;
  size?: MarkerSize;
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const Marker = forwardRef<HTMLDivElement, MarkerProps>(
  ({ variant = 'default', size = 'default', sx, className, children, ...props }, ref) => {
    const isSeparator = variant === 'separator';

    const sxProps = stylex.props(
      styles.root,
      variant === 'default' && styles.variantDefault,
      variant === 'border' && styles.variantBorder,
      variant === 'separator' && styles.variantSeparator,
      size === 'sm' && styles.sizeSm,
      size === 'default' && styles.sizeDefault,
      size === 'lg' && styles.sizeLg,
      sx,
    );

    const contextValue = useMemo(() => ({ variant, size }), [variant, size]);

    return (
      <MarkerContext.Provider value={contextValue}>
        <Box
          ref={ref}
          data-slot="marker"
          data-variant={variant}
          data-size={size}
          className={cn(sxProps.className, className)}
          style={sxProps.style}
          {...props}
        >
          {isSeparator && (
            <Box data-slot="marker-rule-left" sx={styles.separatorLine} aria-hidden="true" />
          )}
          {children}
          {isSeparator && (
            <Box data-slot="marker-rule-right" sx={styles.separatorLine} aria-hidden="true" />
          )}
        </Box>
      </MarkerContext.Provider>
    );
  },
);

Marker.displayName = 'Marker';

export interface MarkerIconProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const MarkerIcon = forwardRef<HTMLDivElement, MarkerIconProps>(
  ({ sx, className, children, ...props }, ref) => {
    const { size } = useContext(MarkerContext);

    const sxProps = stylex.props(
      styles.icon,
      size === 'sm' && styles.iconSm,
      size === 'default' && styles.iconDefault,
      size === 'lg' && styles.iconLg,
      sx,
    );

    return (
      <Box
        ref={ref}
        data-slot="marker-icon"
        aria-hidden="true"
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

MarkerIcon.displayName = 'MarkerIcon';

export interface MarkerContentProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const MarkerContent = forwardRef<HTMLDivElement, MarkerContentProps>(
  ({ sx, className, children, ...props }, ref) => {
    const { variant } = useContext(MarkerContext);
    const isSeparator = variant === 'separator';

    const sxProps = stylex.props(styles.content, isSeparator && styles.contentSeparator, sx);

    return (
      <Box
        ref={ref}
        data-slot="marker-content"
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text type={isSeparator ? 'secondary' : 'default'}>{children}</Text>
        ) : (
          children
        )}
      </Box>
    );
  },
);

MarkerContent.displayName = 'MarkerContent';
