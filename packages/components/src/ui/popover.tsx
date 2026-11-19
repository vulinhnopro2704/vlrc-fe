import { type ComponentProps } from 'react';
import {
  Anchor as PopoverPrimitiveAnchor,
  Content as PopoverPrimitiveContent,
  Portal as PopoverPrimitivePortal,
  Root as PopoverPrimitiveRoot,
  Trigger as PopoverPrimitiveTrigger,
} from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';

const scaleIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  content: {
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    zIndex: 100,
    width: '18rem',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    padding: '1rem',
    boxShadow: shadow.md,
    outline: 'none',
    animationName: scaleIn,
    animationDuration: '150ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
});

function Popover(props: ComponentProps<typeof PopoverPrimitiveRoot>) {
  return <PopoverPrimitiveRoot data-slot="popover" {...props} />;
}

function PopoverTrigger(props: ComponentProps<typeof PopoverPrimitiveTrigger>) {
  return <PopoverPrimitiveTrigger data-slot="popover-trigger" {...props} />;
}

function PopoverAnchor(props: ComponentProps<typeof PopoverPrimitiveAnchor>) {
  return <PopoverPrimitiveAnchor data-slot="popover-anchor" {...props} />;
}

export interface PopoverContentProps extends ComponentProps<typeof PopoverPrimitiveContent> {
  sx?: stylex.StyleXStyles;
  container?: HTMLElement | DocumentFragment | null;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  sx,
  container,
  style,
  children,
  ...props
}: PopoverContentProps) {
  const zIndex = useZIndex('popover');
  const sxProps = stylex.props(styles.content, sx);

  return (
    <PopoverPrimitivePortal container={container}>
      <PopoverPrimitiveContent
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        {...sxProps}
        style={{ zIndex, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={zIndex + 10}>{children}</ZIndexProvider>
      </PopoverPrimitiveContent>
    </PopoverPrimitivePortal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
