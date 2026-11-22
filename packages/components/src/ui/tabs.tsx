import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import {
  Content as TabsPrimitiveContent,
  List as TabsPrimitiveList,
  Root as TabsPrimitiveRoot,
  Trigger as TabsPrimitiveTrigger,
} from '@radix-ui/react-tabs';
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

export type TabsVariant = 'default' | 'line';

export type TabItem = {
  key: string;
  label?: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  sx?: stylex.StyleXStyles;
};

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
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    boxSizing: 'border-box',
    width: 'fit-content',
    gap: '2px',
  },
  listLine: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    padding: 0,
    gap: '1rem',
    width: '100%',
    justifyContent: 'flex-start',
  },

  // 7-tier List Sizing
  listXxs: {
    height: '1.5rem',
    padding: '2px',
    borderRadius: radius.sm,
  },
  listXs: {
    height: '1.75rem',
    padding: '2px',
    borderRadius: radius.sm,
  },
  listSm: {
    height: '2rem',
    padding: '3px',
    borderRadius: radius.md,
  },
  listMd: {
    height: '2.25rem',
    padding: '3px',
    borderRadius: radius.lg,
  },
  listLg: {
    height: '2.625rem',
    padding: '4px',
    borderRadius: radius.lg,
  },
  listXl: {
    height: '3rem',
    padding: '4px',
    borderRadius: radius.xl,
  },
  listXxl: {
    height: '3.5rem',
    padding: '5px',
    borderRadius: radius.xl,
  },

  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    borderRadius: radius.md,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    borderWidth: 0,
    outline: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: 500,
    lineHeight: 1,
    height: '100%',
    transitionProperty: 'background-color, color, box-shadow, border-color',
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
  triggerLine: {
    borderRadius: 0,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    paddingInline: '0.5rem',
    height: '100%',
  },

  // 7-tier Trigger Sizing
  triggerXxs: {
    paddingInline: '0.5rem',
    fontSize: '0.6875rem',
    borderRadius: radius.sm,
    gap: '0.25rem',
  },
  triggerXs: {
    paddingInline: '0.625rem',
    fontSize: '0.75rem',
    borderRadius: radius.sm,
    gap: '0.25rem',
  },
  triggerSm: {
    paddingInline: '0.75rem',
    fontSize: '0.8125rem',
    borderRadius: radius.sm,
    gap: '0.375rem',
  },
  triggerMd: {
    paddingInline: '0.875rem',
    fontSize: '0.875rem',
    borderRadius: radius.md,
    gap: '0.375rem',
  },
  triggerLg: {
    paddingInline: '1rem',
    fontSize: '0.9375rem',
    borderRadius: radius.md,
    gap: '0.5rem',
  },
  triggerXl: {
    paddingInline: '1.25rem',
    fontSize: '1rem',
    borderRadius: radius.lg,
    gap: '0.5rem',
  },
  triggerXxl: {
    paddingInline: '1.5rem',
    fontSize: '1.125rem',
    borderRadius: radius.lg,
    gap: '0.625rem',
  },

  content: {
    flex: '1 1 0%',
    outline: 'none',
    ':focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '2px',
      borderRadius: radius.md,
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

const TabsContext = createContext<{ size: ComponentSize; variant: TabsVariant }>({
  size: 'md',
  variant: 'default',
});

export type TabsProps = Omit<ComponentProps<typeof TabsPrimitiveRoot>, 'onChange'> & {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
  /** Declarative array of tab items */
  items?: TabItem[];
  /** Alias for value (controlled active tab key) */
  activeKey?: string;
  /** Alias for defaultValue (uncontrolled default active tab key) */
  defaultActiveKey?: string;
  /** Callback fired when active tab changes */
  onChange?: (activeKey: string) => void;
  /** Visual tab style variant ('default' | 'line') */
  variant?: TabsVariant;
  /** Custom styles applied to internal TabsList when using items */
  listSx?: stylex.StyleXStyles;
  /** Custom class applied to internal TabsList when using items */
  listClassName?: string;
  /** Custom styles applied to internal TabsContent when using items */
  contentSx?: stylex.StyleXStyles;
};

function Tabs({
  size = 'md',
  variant = 'default',
  className,
  sx,
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  value,
  defaultValue,
  onValueChange,
  listSx,
  listClassName,
  contentSx,
  children,
  ...props
}: TabsProps) {
  const resolvedValue = activeKey !== undefined ? activeKey : value;
  const resolvedDefaultValue = defaultActiveKey !== undefined ? defaultActiveKey : defaultValue;
  const handleValueChange = (newKey: string) => {
    onValueChange?.(newKey);
    onChange?.(newKey);
  };

  const sxProps = stylex.props(styles.root, sx);

  return (
    <TabsContext.Provider value={{ size, variant }}>
      <TabsPrimitiveRoot
        data-slot="tabs"
        data-size={size}
        data-variant={variant}
        value={resolvedValue}
        defaultValue={resolvedDefaultValue}
        onValueChange={handleValueChange}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {items ? (
          <>
            <TabsList className={listClassName} sx={listSx} variant={variant} size={size}>
              {items.map((item) => {
                const label = item.label ?? item.title;
                return (
                  <TabsTrigger
                    key={item.key}
                    value={item.key}
                    disabled={item.disabled}
                    variant={variant}
                    size={size}
                    className={item.className}
                    sx={item.sx}
                  >
                    {item.icon}
                    {label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {items.map((item) =>
              item.children !== undefined && item.children !== null ? (
                <TabsContent key={item.key} value={item.key} sx={contentSx}>
                  {item.children}
                </TabsContent>
              ) : null,
            )}
            {children}
          </>
        ) : (
          children
        )}
      </TabsPrimitiveRoot>
    </TabsContext.Provider>
  );
}

export type TabsListProps = ComponentProps<typeof TabsPrimitiveList> & {
  size?: ComponentSize;
  variant?: TabsVariant;
  sx?: stylex.StyleXStyles;
};

function TabsList({
  size: propSize,
  variant: propVariant,
  className,
  sx,
  ...props
}: TabsListProps) {
  const context = useContext(TabsContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const resolvedVariant = propVariant ?? context.variant ?? 'default';
  const sizeStyle = listSizeStyles[resolvedSize] ?? styles.listMd;
  const variantStyle = resolvedVariant === 'line' ? styles.listLine : null;
  const sxProps = stylex.props(styles.list, sizeStyle, variantStyle, sx);

  return (
    <TabsPrimitiveList
      data-slot="tabs-list"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export type TabsTriggerProps = ComponentProps<typeof TabsPrimitiveTrigger> & {
  size?: ComponentSize;
  variant?: TabsVariant;
  sx?: stylex.StyleXStyles;
};

function TabsTrigger({
  size: propSize,
  variant: propVariant,
  className,
  sx,
  children,
  ...props
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const resolvedVariant = propVariant ?? context.variant ?? 'default';
  const sizeStyle = triggerSizeStyles[resolvedSize] ?? styles.triggerMd;
  const variantStyle = resolvedVariant === 'line' ? styles.triggerLine : null;
  const sxProps = stylex.props(styles.trigger, sizeStyle, variantStyle, sx);

  return (
    <TabsPrimitiveTrigger
      data-slot="tabs-trigger"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </TabsPrimitiveTrigger>
  );
}

export type TabsContentProps = ComponentProps<typeof TabsPrimitiveContent> & {
  sx?: stylex.StyleXStyles;
};

function TabsContent({ className, sx, ...props }: TabsContentProps) {
  const sxProps = stylex.props(styles.content, sx);
  return (
    <TabsPrimitiveContent
      data-slot="tabs-content"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
