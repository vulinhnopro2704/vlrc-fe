import { type ComponentProps } from 'react';
import {
  Arrow as TooltipPrimitiveArrow,
  Content as TooltipPrimitiveContent,
  Portal as TooltipPrimitivePortal,
  Provider as TooltipPrimitiveProvider,
  Root as TooltipPrimitiveRoot,
  Trigger as TooltipPrimitiveTrigger,
} from '@radix-ui/react-tooltip';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex } from '../theme/zIndex';

const fadeIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  content: {
    backgroundColor: colors.foreground,
    color: colors.background,
    zIndex: 110,
    width: 'fit-content',
    borderRadius: radius.md,
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    fontSize: '0.75rem',
    boxShadow: shadow.md,
    animationName: fadeIn,
    animationDuration: '150ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  arrow: {
    fill: colors.foreground,
  },
});

function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitiveProvider>) {
  return (
    <TooltipPrimitiveProvider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip(props: ComponentProps<typeof TooltipPrimitiveRoot>) {
  return (
    <TooltipProvider>
      <TooltipPrimitiveRoot data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(props: ComponentProps<typeof TooltipPrimitiveTrigger>) {
  return <TooltipPrimitiveTrigger data-slot="tooltip-trigger" {...props} />;
}

export interface TooltipContentProps extends ComponentProps<typeof TooltipPrimitiveContent> {
  sx?: stylex.StyleXStyles;
  container?: HTMLElement | DocumentFragment | null;
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  sx,
  container,
  style,
  ...props
}: TooltipContentProps) {
  const zIndex = useZIndex('tooltip');
  const sxProps = stylex.props(styles.content, sx);

  return (
    <TooltipPrimitivePortal container={container}>
      <TooltipPrimitiveContent
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...sxProps}
        style={{ zIndex, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
        <TooltipPrimitiveArrow {...stylex.props(styles.arrow)} />
      </TooltipPrimitiveContent>
    </TooltipPrimitivePortal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
