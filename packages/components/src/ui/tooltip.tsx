import { isValidElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
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

export interface TooltipProps extends ComponentProps<typeof TooltipPrimitiveRoot> {
  /**
   * Shorthand self-contained tooltip. When provided, the single child becomes
   * the trigger and `content` is rendered as the tooltip body, without having
   * to compose TooltipTrigger / TooltipContent manually.
   */
  content?: ReactNode;
}

function Tooltip({ content, children, ...props }: TooltipProps) {
  if (content != null) {
    return (
      <TooltipProvider>
        <TooltipPrimitiveRoot data-slot="tooltip" {...props}>
          {isValidElement(children) ? (
            <TooltipPrimitiveTrigger asChild>{children as ReactElement}</TooltipPrimitiveTrigger>
          ) : (
            <TooltipPrimitiveTrigger asChild>
              <span>{children}</span>
            </TooltipPrimitiveTrigger>
          )}
          <TooltipContent>{content}</TooltipContent>
        </TooltipPrimitiveRoot>
      </TooltipProvider>
    );
  }
  return (
    <TooltipProvider>
      <TooltipPrimitiveRoot data-slot="tooltip" {...props}>
        {children}
      </TooltipPrimitiveRoot>
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
