import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const scaleIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  content: {
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    zIndex: 50,
    width: '18rem',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
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
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  sx,
  ...props
}: PopoverContentProps) {
  const sxProps = stylex.props(styles.content, sx);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
