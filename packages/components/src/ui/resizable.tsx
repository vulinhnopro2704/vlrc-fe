'use client';

import * as React from 'react';
import { GripVerticalIcon } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../theme/tokens.stylex';
import { cn } from '../utils';

const styles = stylex.create({
  panelGroup: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  handle: {
    position: 'relative',
    display: 'flex',
    width: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    outline: 'none',
  },
  handleGrip: {
    zIndex: 10,
    display: 'flex',
    height: '1rem',
    width: '0.75rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  icon: {
    width: '0.625rem',
    height: '0.625rem',
  },
});

export interface ResizablePanelGroupProps extends React.ComponentProps<
  typeof ResizablePrimitive.PanelGroup
> {
  sx?: stylex.StyleXStyles;
}

function ResizablePanelGroup({ className, sx, ...props }: ResizablePanelGroupProps) {
  const styleProps = stylex.props(styles.panelGroup, sx);

  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

export interface ResizableHandleProps extends React.ComponentProps<
  typeof ResizablePrimitive.PanelResizeHandle
> {
  withHandle?: boolean;
  sx?: stylex.StyleXStyles;
}

function ResizableHandle({ withHandle, className, sx, ...props }: ResizableHandleProps) {
  const styleProps = stylex.props(styles.handle, sx);

  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {withHandle && (
        <div {...stylex.props(styles.handleGrip)}>
          <GripVerticalIcon {...stylex.props(styles.icon)} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
