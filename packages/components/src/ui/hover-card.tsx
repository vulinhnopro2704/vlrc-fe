'use client';

import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { useZIndex } from '../theme/zIndex';
import { cn } from '../utils';

const styles = stylex.create({
  content: {
    zIndex: 100,
    width: '16rem',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
});

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

export interface HoverCardContentProps extends React.ComponentProps<
  typeof HoverCardPrimitive.Content
> {
  sx?: stylex.StyleXStyles;
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  sx,
  style,
  ...props
}: HoverCardContentProps) {
  const zIndex = useZIndex('popover');
  const styleProps = stylex.props(styles.content, sx);

  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        {...styleProps}
        style={{ zIndex, ...styleProps.style, ...style }}
        className={cn(styleProps.className, className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
