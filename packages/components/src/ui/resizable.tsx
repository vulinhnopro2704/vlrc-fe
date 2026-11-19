'use client';

import { type ComponentProps } from 'react';
import { GripVerticalIcon } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
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

export interface ResizablePanelGroupProps extends ComponentProps<typeof PanelGroup> {
  sx?: stylex.StyleXStyles;
}

function ResizablePanelGroup({ className, sx, ...props }: ResizablePanelGroupProps) {
  const styleProps = stylex.props(styles.panelGroup, sx);

  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

export interface ResizableHandleProps extends ComponentProps<typeof PanelResizeHandle> {
  withHandle?: boolean;
  sx?: stylex.StyleXStyles;
}

function ResizableHandle({ withHandle, className, sx, ...props }: ResizableHandleProps) {
  const styleProps = stylex.props(styles.handle, sx);

  return (
    <PanelResizeHandle
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
    </PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
