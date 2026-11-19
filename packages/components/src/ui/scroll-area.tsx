'use client';

import { type ComponentProps } from 'react';
import {
  Corner as ScrollAreaPrimitiveCorner,
  Root as ScrollAreaPrimitiveRoot,
  ScrollAreaScrollbar as ScrollAreaPrimitiveScrollAreaScrollbar,
  ScrollAreaThumb as ScrollAreaPrimitiveScrollAreaThumb,
  Viewport as ScrollAreaPrimitiveViewport,
} from '@radix-ui/react-scroll-area';
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../theme/tokens.stylex';
import { cn } from '../utils';

const styles = stylex.create({
  root: {
    position: 'relative',
  },
  viewport: {
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    outline: 'none',
  },
  scrollbar: {
    display: 'flex',
    touchAction: 'none',
    padding: '1px',
    userSelect: 'none',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '150ms',
  },
  scrollbarVertical: {
    height: '100%',
    width: '0.625rem',
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
  },
  scrollbarHorizontal: {
    height: '0.625rem',
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'transparent',
  },
  thumb: {
    position: 'relative',
    flex: 1,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
});

export interface ScrollAreaProps extends ComponentProps<typeof ScrollAreaPrimitiveRoot> {
  sx?: stylex.StyleXStyles;
}

function ScrollArea({ className, children, sx, ...props }: ScrollAreaProps) {
  const styleProps = stylex.props(styles.root, sx);

  return (
    <ScrollAreaPrimitiveRoot
      data-slot="scroll-area"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      <ScrollAreaPrimitiveViewport
        data-slot="scroll-area-viewport"
        {...stylex.props(styles.viewport)}
      >
        {children}
      </ScrollAreaPrimitiveViewport>
      <ScrollBar />
      <ScrollAreaPrimitiveCorner />
    </ScrollAreaPrimitiveRoot>
  );
}

export interface ScrollBarProps extends ComponentProps<
  typeof ScrollAreaPrimitiveScrollAreaScrollbar
> {
  sx?: stylex.StyleXStyles;
}

function ScrollBar({ className, orientation = 'vertical', sx, ...props }: ScrollBarProps) {
  const styleProps = stylex.props(
    styles.scrollbar,
    orientation === 'vertical' ? styles.scrollbarVertical : styles.scrollbarHorizontal,
    sx,
  );

  return (
    <ScrollAreaPrimitiveScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      <ScrollAreaPrimitiveScrollAreaThumb
        data-slot="scroll-area-thumb"
        {...stylex.props(styles.thumb)}
      />
    </ScrollAreaPrimitiveScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
