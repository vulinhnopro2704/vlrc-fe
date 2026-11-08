import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  },
  list: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    boxSizing: 'border-box',
    width: 'fit-content',
  },

  // 7-tier List Sizing
  listXxs: {
    height: '1.5rem',
    padding: '2px',
    borderRadius: radii.sm,
  },
  listXs: {
    height: '1.75rem',
    padding: '2px',
    borderRadius: radii.sm,
  },
  listSm: {
    height: '2rem',
    padding: '3px',
    borderRadius: radii.md,
  },
  listMd: {
    height: '2.25rem',
    padding: '3px',
    borderRadius: radii.lg,
  },
  listLg: {
    height: '2.625rem',
    padding: '4px',
    borderRadius: radii.lg,
  },
  listXl: {
    height: '3rem',
    padding: '4px',
    borderRadius: radii.xl,
  },
  listXxl: {
    height: '3.5rem',
    padding: '5px',
    borderRadius: radii.xl,
  },

  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    borderRadius: radii.md,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    borderWidth: 0,
    outline: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: 500,
    height: '100%',
    transitionProperty: 'background-color, color, box-shadow',
    transitionDuration: '150ms',
    boxSizing: 'border-box',
    ':hover': {
      color: colors.foreground,
    },
    ':focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '2px',
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },

  // 7-tier Trigger Sizing
  triggerXxs: {
    paddingInline: '0.5rem',
    fontSize: '0.6875rem',
    borderRadius: radii.none,
    gap: '0.25rem',
  },
  triggerXs: {
    paddingInline: '0.625rem',
    fontSize: '0.75rem',
    borderRadius: radii.sm,
    gap: '0.25rem',
  },
  triggerSm: {
    paddingInline: '0.75rem',
    fontSize: '0.8125rem',
    borderRadius: radii.sm,
    gap: '0.375rem',
  },
  triggerMd: {
    paddingInline: '0.875rem',
    fontSize: '0.875rem',
    borderRadius: radii.md,
    gap: '0.375rem',
  },
  triggerLg: {
    paddingInline: '1rem',
    fontSize: '0.9375rem',
    borderRadius: radii.md,
    gap: '0.5rem',
  },
  triggerXl: {
    paddingInline: '1.25rem',
    fontSize: '1rem',
    borderRadius: radii.lg,
    gap: '0.5rem',
  },
  triggerXxl: {
    paddingInline: '1.5rem',
    fontSize: '1.125rem',
    borderRadius: radii.lg,
    gap: '0.625rem',
  },

  content: {
    flex: '1 1 0%',
    outline: 'none',
    ':focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '2px',
      borderRadius: radii.md,
    },
  },
});

const listSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.listXxs,
  xs: styles.listXs,
  sm: styles.listSm,
  md: styles.listMd,
  lg: styles.listLg,
  xl: styles.listXl,
  xxl: styles.listXxl,
};

const triggerSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.triggerXxs,
  xs: styles.triggerXs,
  sm: styles.triggerSm,
  md: styles.triggerMd,
  lg: styles.triggerLg,
  xl: styles.triggerXl,
  xxl: styles.triggerXxl,
};

const TabsContext = React.createContext<{ size: ComponentSize }>({ size: 'md' });

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
};

function Tabs({ size = 'md', className, sx, ...props }: TabsProps) {
  const sxProps = stylex.props(styles.root, sx);
  return (
    <TabsContext.Provider value={{ size }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-size={size}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    </TabsContext.Provider>
  );
}

export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
};

function TabsList({ size: propSize, className, sx, ...props }: TabsListProps) {
  const context = React.useContext(TabsContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const sizeStyle = listSizeStyles[resolvedSize] ?? styles.listMd;
  const sxProps = stylex.props(styles.list, sizeStyle, sx);

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
};

function TabsTrigger({ size: propSize, className, sx, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const sizeStyle = triggerSizeStyles[resolvedSize] ?? styles.triggerMd;
  const sxProps = stylex.props(styles.trigger, sizeStyle, sx);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content> & {
  sx?: stylex.StyleXStyles;
};

function TabsContent({ className, sx, ...props }: TabsContentProps) {
  const sxProps = stylex.props(styles.content, sx);
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
