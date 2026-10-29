import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const fadeIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  content: {
    backgroundColor: colors.foreground,
    color: colors.background,
    zIndex: 50,
    width: 'fit-content',
    borderRadius: radii.md,
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    fontSize: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  sx?: stylex.StyleXStyles;
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  sx,
  ...props
}: TooltipContentProps) {
  const sxProps = stylex.props(styles.content, sx);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow {...stylex.props(styles.arrow)} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
