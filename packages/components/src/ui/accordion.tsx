import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { Text } from '../Typography';

const styles = stylex.create({
  root: {
    width: '100%',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  header: {
    display: 'flex',
    margin: 0,
    width: '100%',
  },
  trigger: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.foreground,
    display: 'flex',
    flex: '1 1 0%',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'left',
    outline: 'none',
    transitionProperty: 'all',
    transitionDuration: '200ms',
    ':hover': {
      textDecoration: 'underline',
    },
    ':focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '2px',
      borderRadius: radius.sm,
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },

  // 7-tier Trigger Sizing
  triggerXxs: {
    paddingBlock: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    gap: '0.5rem',
  },
  triggerXs: {
    paddingBlock: '0.5rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    gap: '0.625rem',
  },
  triggerSm: {
    paddingBlock: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    gap: '0.75rem',
  },
  triggerMd: {
    paddingBlock: '1rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    gap: '1rem',
  },
  triggerLg: {
    paddingBlock: '1.25rem',
    fontSize: '1rem',
    fontWeight: 500,
    gap: '1.125rem',
  },
  triggerXl: {
    paddingBlock: '1.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    gap: '1.25rem',
  },
  triggerXxl: {
    paddingBlock: '1.75rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    gap: '1.5rem',
  },

  chevron: {
    color: colors.mutedForeground,
    flexShrink: 0,
    pointerEvents: 'none',
    transitionProperty: 'transform',
    transitionDuration: '200ms',
  },

  // 7-tier Chevron Sizing
  chevronXxs: {
    width: '0.75rem',
    height: '0.75rem',
  },
  chevronXs: {
    width: '0.8125rem',
    height: '0.8125rem',
  },
  chevronSm: {
    width: '0.875rem',
    height: '0.875rem',
  },
  chevronMd: {
    width: '1rem',
    height: '1rem',
  },
  chevronLg: {
    width: '1.125rem',
    height: '1.125rem',
  },
  chevronXl: {
    width: '1.25rem',
    height: '1.25rem',
  },
  chevronXxl: {
    width: '1.5rem',
    height: '1.5rem',
  },

  content: {
    overflow: 'hidden',
    color: colors.foreground,
  },
  contentInner: {
    lineHeight: 1.5,
  },

  // 7-tier Content Sizing
  contentXxs: {
    paddingBottom: '0.375rem',
    fontSize: '0.75rem',
  },
  contentXs: {
    paddingBottom: '0.5rem',
    fontSize: '0.8125rem',
  },
  contentSm: {
    paddingBottom: '0.75rem',
    fontSize: '0.875rem',
  },
  contentMd: {
    paddingBottom: '1rem',
    fontSize: '0.875rem',
  },
  contentLg: {
    paddingBottom: '1.25rem',
    fontSize: '0.9375rem',
  },
  contentXl: {
    paddingBottom: '1.5rem',
    fontSize: '1rem',
  },
  contentXxl: {
    paddingBottom: '1.75rem',
    fontSize: '1.125rem',
  },
});

const triggerSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.triggerXxs,
  xs: styles.triggerXs,
  sm: styles.triggerSm,
  md: styles.triggerMd,
  lg: styles.triggerLg,
  xl: styles.triggerXl,
  xxl: styles.triggerXxl,
};

const chevronSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.chevronXxs,
  xs: styles.chevronXs,
  sm: styles.chevronSm,
  md: styles.chevronMd,
  lg: styles.chevronLg,
  xl: styles.chevronXl,
  xxl: styles.chevronXxl,
};

const contentSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.contentXxs,
  xs: styles.contentXs,
  sm: styles.contentSm,
  md: styles.contentMd,
  lg: styles.contentLg,
  xl: styles.contentXl,
  xxl: styles.contentXxl,
};

const AccordionContext = React.createContext<{ size: ComponentSize }>({ size: 'md' });

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
};

function Accordion({ size = 'md', className, sx, ...props }: AccordionProps) {
  const sxProps = stylex.props(styles.root, sx);
  return (
    <AccordionContext.Provider value={{ size }}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-size={size}
        {...(props as React.ComponentProps<typeof AccordionPrimitive.Root>)}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      />
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.ComponentProps<typeof AccordionPrimitive.Item> {
  sx?: stylex.StyleXStyles;
}

function AccordionItem({ className, sx, ...props }: AccordionItemProps) {
  const sxProps = stylex.props(styles.item, sx);
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AccordionTriggerProps extends React.ComponentProps<
  typeof AccordionPrimitive.Trigger
> {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function AccordionTrigger({
  size: propSize,
  className,
  children,
  sx,
  ...props
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  const resolvedSize = propSize ?? context.size ?? 'md';

  const triggerSize = triggerSizeStyles[resolvedSize] ?? styles.triggerMd;
  const chevronSize = chevronSizeStyles[resolvedSize] ?? styles.chevronMd;
  const sxProps = stylex.props(styles.trigger, triggerSize, sx);

  return (
    <AccordionPrimitive.Header {...stylex.props(styles.header)}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        data-size={resolvedSize}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <Text as="span" type="inherit">
          {children}
        </Text>
        <ChevronDownIcon {...stylex.props(styles.chevron, chevronSize)} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export interface AccordionContentProps extends React.ComponentProps<
  typeof AccordionPrimitive.Content
> {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function AccordionContent({
  size: propSize,
  className,
  children,
  sx,
  ...props
}: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  const resolvedSize = propSize ?? context.size ?? 'md';

  const contentSize = contentSizeStyles[resolvedSize] ?? styles.contentMd;
  const sxProps = stylex.props(styles.content, sx);

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <div {...stylex.props(styles.contentInner, contentSize)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
