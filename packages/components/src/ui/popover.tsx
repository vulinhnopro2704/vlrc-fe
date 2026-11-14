import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
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

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export interface PopoverContentProps extends React.ComponentProps<typeof PopoverPrimitive.Content> {
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
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        {...sxProps}
        style={{ zIndex, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={zIndex + 10}>{children}</ZIndexProvider>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
