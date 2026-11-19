'use client';

import { type ComponentProps } from 'react';
import {
  Content as HoverCardPrimitiveContent,
  Portal as HoverCardPrimitivePortal,
  Root as HoverCardPrimitiveRoot,
  Trigger as HoverCardPrimitiveTrigger,
} from '@radix-ui/react-hover-card';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex } from '../theme/zIndex';
import { cn } from '../utils';

const styles = stylex.create({
  content: {
    zIndex: 100,
    width: '16rem',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    padding: '1rem',
    boxShadow: shadow.md,
    outline: 'none',
  },
});

function HoverCard({ ...props }: ComponentProps<typeof HoverCardPrimitiveRoot>) {
  return <HoverCardPrimitiveRoot data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: ComponentProps<typeof HoverCardPrimitiveTrigger>) {
  return <HoverCardPrimitiveTrigger data-slot="hover-card-trigger" {...props} />;
}

export interface HoverCardContentProps extends ComponentProps<typeof HoverCardPrimitiveContent> {
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
    <HoverCardPrimitivePortal data-slot="hover-card-portal">
      <HoverCardPrimitiveContent
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        {...styleProps}
        style={{ zIndex, ...styleProps.style, ...style }}
        className={cn(styleProps.className, className)}
        {...props}
      />
    </HoverCardPrimitivePortal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
