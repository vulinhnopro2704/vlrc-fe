'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface AvatarGroupContextValue {
  size?: ComponentSize;
  inGroup?: boolean;
}

const AvatarGroupContext = React.createContext<AvatarGroupContextValue | null>(null);

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: radius.full,
  },
  // 7-tier Avatar Sizes
  sizeXxs: {
    width: '1.25rem',
    height: '1.25rem',
    fontSize: '0.625rem',
  },
  sizeXs: {
    width: '1.5rem',
    height: '1.5rem',
    fontSize: '0.6875rem',
  },
  sizeSm: {
    width: '1.75rem',
    height: '1.75rem',
    fontSize: '0.75rem',
  },
  sizeMd: {
    width: '2rem',
    height: '2rem',
    fontSize: '0.875rem',
  },
  sizeLg: {
    width: '2.5rem',
    height: '2.5rem',
    fontSize: '1rem',
  },
  sizeXl: {
    width: '3rem',
    height: '3rem',
    fontSize: '1.25rem',
  },
  sizeXxl: {
    width: '4rem',
    height: '4rem',
    fontSize: '1.5rem',
  },
  image: {
    aspectRatio: '1 / 1',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  fallback: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    fontWeight: 500,
  },

  // Group styles
  group: {
    display: 'inline-flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  groupItem: {
    marginLeft: '-0.5rem',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.background,
    ':first-child': {
      marginLeft: 0,
    },
  },
  overflowFallback: {
    backgroundColor: colors.muted,
    color: colors.foreground,
    fontWeight: 600,
    cursor: 'pointer',
  },
  overflowTrigger: {
    display: 'inline-flex',
    cursor: 'pointer',
  },
  overflowPopoverContent: {
    width: 'auto',
    maxWidth: '20rem',
    padding: '0.75rem',
  },
  overflowList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
  },
});

const sizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function Avatar({ className, size, sx, ...props }: AvatarProps) {
  const groupContext = React.useContext(AvatarGroupContext);
  const resolvedSize: ComponentSize = size ?? groupContext?.size ?? 'md';
  const inGroup = Boolean(groupContext?.inGroup);

  const sxProps = stylex.props(
    styles.root,
    sizeStyles[resolvedSize] ?? styles.sizeMd,
    inGroup && styles.groupItem,
    sx,
  );

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {
  sx?: stylex.StyleXStyles;
}

function AvatarImage({ className, sx, ...props }: AvatarImageProps) {
  const sxProps = stylex.props(styles.image, sx);
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  sx?: stylex.StyleXStyles;
}

function AvatarFallback({ className, sx, ...props }: AvatarFallbackProps) {
  const sxProps = stylex.props(styles.fallback, sx);
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AvatarGroupProps extends React.ComponentProps<'div'> {
  /** Maximum number of visible avatars before showing +N indicator */
  max?: number;
  /** Size for all avatars in group */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function AvatarGroup({ className, max, size = 'md', sx, children, ...props }: AvatarGroupProps) {
  const sxProps = stylex.props(styles.group, sx);
  const validChildren = React.Children.toArray(children).filter(React.isValidElement);

  const visibleChildren = max !== undefined ? validChildren.slice(0, max) : validChildren;
  const hiddenChildren = max !== undefined ? validChildren.slice(max) : [];
  const overflowCount = max !== undefined ? Math.max(0, validChildren.length - max) : 0;

  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPopoverOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setPopoverOpen(false);
    }, 150);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const contextValue = React.useMemo(() => ({ size, inGroup: true }), [size]);

  return (
    <AvatarGroupContext.Provider value={contextValue}>
      <div
        role="group"
        data-slot="avatar-group"
        data-size={size}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {visibleChildren}
        {overflowCount > 0 && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <div
                {...stylex.props(styles.overflowTrigger)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Avatar size={size} data-slot="avatar-group-overflow">
                  <AvatarFallback sx={styles.overflowFallback}>+{overflowCount}</AvatarFallback>
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              sx={styles.overflowPopoverContent}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <AvatarGroupContext.Provider value={{ size, inGroup: false }}>
                <div {...stylex.props(styles.overflowList)}>{hiddenChildren}</div>
              </AvatarGroupContext.Provider>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </AvatarGroupContext.Provider>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
