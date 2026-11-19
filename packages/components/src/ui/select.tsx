import { type ComponentProps } from 'react';
import {
  Content as SelectPrimitiveContent,
  Group as SelectPrimitiveGroup,
  Icon as SelectPrimitiveIcon,
  Item as SelectPrimitiveItem,
  ItemIndicator as SelectPrimitiveItemIndicator,
  ItemText as SelectPrimitiveItemText,
  Label as SelectPrimitiveLabel,
  Portal as SelectPrimitivePortal,
  Root as SelectPrimitiveRoot,
  ScrollDownButton as SelectPrimitiveScrollDownButton,
  ScrollUpButton as SelectPrimitiveScrollUpButton,
  Separator as SelectPrimitiveSeparator,
  Trigger as SelectPrimitiveTrigger,
  Value as SelectPrimitiveValue,
  Viewport as SelectPrimitiveViewport,
} from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';

import { colors, radius, shadow } from '../theme/tokens.stylex';
import { resolveWidth, type ComponentWidth } from '../theme/width';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';

const scaleIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: colors.background,
    color: colors.foreground,
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    boxShadow: shadow.xs,
    transitionProperty: 'border-color, box-shadow, color',
    transitionDuration: '150ms',
    outline: 'none',
    width: 'fit-content',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: shadow.ring,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  triggerDefault: {
    height: '2.25rem',
  },
  triggerSm: {
    height: '2rem',
    fontSize: '0.75rem',
    paddingInline: '0.5rem',
  },
  content: {
    position: 'relative',
    zIndex: 9999,
    minWidth: '8rem',
    maxHeight: '20rem',
    overflowY: 'auto',
    overflowX: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow: shadow.md,
    outline: 'none',
    boxSizing: 'border-box',
    animationName: scaleIn,
    animationDuration: '150ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  viewport: {
    padding: '0.25rem',
  },
  item: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    cursor: 'pointer',
    userSelect: 'none',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: radius.sm,
    paddingBlock: '0.375rem',
    paddingLeft: '0.5rem',
    paddingRight: '2rem',
    fontSize: '0.875rem',
    color: colors.popoverForeground,
    outline: 'none',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':focus': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  itemDisabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
  itemIndicator: {
    position: 'absolute',
    right: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.875rem',
    height: '0.875rem',
  },
  label: {
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    fontSize: '0.75rem',
    color: colors.mutedForeground,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBlock: '0.25rem',
    marginInline: '-0.25rem',
  },
  scrollButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: '0.25rem',
    cursor: 'default',
    color: colors.mutedForeground,
  },
  icon: {
    width: '1rem',
    height: '1rem',
    opacity: 0.5,
    pointerEvents: 'none',
    flexShrink: 0,
  },
});

function Select({ ...props }: ComponentProps<typeof SelectPrimitiveRoot>) {
  return <SelectPrimitiveRoot data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: ComponentProps<typeof SelectPrimitiveGroup>) {
  return <SelectPrimitiveGroup data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: ComponentProps<typeof SelectPrimitiveValue>) {
  return <SelectPrimitiveValue data-slot="select-value" {...props} />;
}

export interface SelectTriggerProps extends ComponentProps<typeof SelectPrimitiveTrigger> {
  size?: 'sm' | 'default';
  /** Configurable component width (presets: 'full', 'auto', 'md', px number, or custom CSS string) */
  width?: ComponentWidth;
  sx?: stylex.StyleXStyles;
}

function SelectTrigger({
  className,
  size = 'default',
  width,
  style,
  children,
  sx,
  ...props
}: SelectTriggerProps) {
  const resolvedWidth = resolveWidth(width);
  const sizeStyle = size === 'sm' ? styles.triggerSm : styles.triggerDefault;
  const sxProps = stylex.props(styles.trigger, sizeStyle, sx);

  return (
    <SelectPrimitiveTrigger
      data-slot="select-trigger"
      data-size={size}
      data-width={width}
      {...sxProps}
      style={{
        ...sxProps.style,
        ...style,
        ...(resolvedWidth ? { width: resolvedWidth } : {}),
      }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
      <SelectPrimitiveIcon asChild>
        <ChevronDownIcon {...stylex.props(styles.icon)} />
      </SelectPrimitiveIcon>
    </SelectPrimitiveTrigger>
  );
}

export interface SelectContentProps extends ComponentProps<typeof SelectPrimitiveContent> {
  sx?: stylex.StyleXStyles;
  container?: HTMLElement | DocumentFragment | null;
}

function SelectContent({
  className,
  children,
  position = 'popper',
  align = 'center',
  sx,
  container,
  style,
  ...props
}: SelectContentProps) {
  const zIndex = useZIndex('popover');
  const sxProps = stylex.props(styles.content, sx);

  return (
    <SelectPrimitivePortal container={container}>
      <SelectPrimitiveContent
        data-slot="select-content"
        position={position}
        align={align}
        {...sxProps}
        style={{ zIndex, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={zIndex + 10}>
          <SelectScrollUpButton />
          <SelectPrimitiveViewport {...stylex.props(styles.viewport)}>
            {children}
          </SelectPrimitiveViewport>
          <SelectScrollDownButton />
        </ZIndexProvider>
      </SelectPrimitiveContent>
    </SelectPrimitivePortal>
  );
}

export interface SelectLabelProps extends ComponentProps<typeof SelectPrimitiveLabel> {
  sx?: stylex.StyleXStyles;
}

function SelectLabel({ className, sx, ...props }: SelectLabelProps) {
  const sxProps = stylex.props(styles.label, sx);
  return (
    <SelectPrimitiveLabel
      data-slot="select-label"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface SelectItemProps extends ComponentProps<typeof SelectPrimitiveItem> {
  sx?: stylex.StyleXStyles;
}

function SelectItem({ className, children, disabled, sx, ...props }: SelectItemProps) {
  const sxProps = stylex.props(styles.item, disabled && styles.itemDisabled, sx);

  return (
    <SelectPrimitiveItem
      data-slot="select-item"
      disabled={disabled}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <span data-slot="select-item-indicator" {...stylex.props(styles.itemIndicator)}>
        <SelectPrimitiveItemIndicator>
          <CheckIcon size={14} />
        </SelectPrimitiveItemIndicator>
      </span>
      <SelectPrimitiveItemText>{children}</SelectPrimitiveItemText>
    </SelectPrimitiveItem>
  );
}

export interface SelectSeparatorProps extends ComponentProps<typeof SelectPrimitiveSeparator> {
  sx?: stylex.StyleXStyles;
}

function SelectSeparator({ className, sx, ...props }: SelectSeparatorProps) {
  const sxProps = stylex.props(styles.separator, sx);
  return (
    <SelectPrimitiveSeparator
      data-slot="select-separator"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitiveScrollUpButton>) {
  const sxProps = stylex.props(styles.scrollButton);
  return (
    <SelectPrimitiveScrollUpButton
      data-slot="select-scroll-up-button"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <ChevronUpIcon size={14} />
    </SelectPrimitiveScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitiveScrollDownButton>) {
  const sxProps = stylex.props(styles.scrollButton);
  return (
    <SelectPrimitiveScrollDownButton
      data-slot="select-scroll-down-button"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <ChevronDownIcon size={14} />
    </SelectPrimitiveScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
