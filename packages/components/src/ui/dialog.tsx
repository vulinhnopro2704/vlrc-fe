import { type ComponentProps } from 'react';
import {
  Close as DialogPrimitiveClose,
  Content as DialogPrimitiveContent,
  Description as DialogPrimitiveDescription,
  Overlay as DialogPrimitiveOverlay,
  Portal as DialogPrimitivePortal,
  Root as DialogPrimitiveRoot,
  Title as DialogPrimitiveTitle,
  Trigger as DialogPrimitiveTrigger,
} from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const scaleIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.95)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    animationName: fadeIn,
    animationDuration: '200ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    overscrollBehavior: 'contain',
  },
  content: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 51,
    display: 'grid',
    width: '100%',
    maxWidth: '32rem',
    gap: '1rem',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: '1.5rem',
    boxShadow: shadow['2xl'],
    outline: 'none',
    animationName: scaleIn,
    animationDuration: '200ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    overscrollBehavior: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: '0.875rem',
    right: '0.875rem',
    borderRadius: radius.sm,
    opacity: 0.7,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    padding: '0.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'opacity, color',
    transitionDuration: '150ms',
    outline: 'none',
    ':hover': {
      opacity: 1,
      color: colors.foreground,
    },
    ':focus-visible': {
      boxShadow: shadow.ring,
    },
  },
  closeIcon: {
    width: '1rem',
    height: '1rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    textAlign: 'left',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    lineHeight: '1.5rem',
    fontWeight: 600,
    color: colors.foreground,
  },
  description: {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.mutedForeground,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

function Dialog(props: ComponentProps<typeof DialogPrimitiveRoot>) {
  return <DialogPrimitiveRoot data-slot="dialog" {...props} />;
}

function DialogTrigger(props: ComponentProps<typeof DialogPrimitiveTrigger>) {
  return <DialogPrimitiveTrigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: ComponentProps<typeof DialogPrimitivePortal>) {
  return <DialogPrimitivePortal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: ComponentProps<typeof DialogPrimitiveClose>) {
  return <DialogPrimitiveClose data-slot="dialog-close" {...props} />;
}

export interface DialogOverlayProps extends ComponentProps<typeof DialogPrimitiveOverlay> {
  sx?: stylex.StyleXStyles;
}

function DialogOverlay({ className, sx, style, ...props }: DialogOverlayProps) {
  const zIndex = useZIndex('overlay');
  const sxProps = stylex.props(styles.overlay, sx);
  return (
    <DialogPrimitiveOverlay
      data-slot="dialog-overlay"
      {...sxProps}
      style={{ zIndex, ...sxProps.style, ...style }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DialogContentProps extends ComponentProps<typeof DialogPrimitiveContent> {
  showCloseButton?: boolean;
  sx?: stylex.StyleXStyles;
  container?: HTMLElement | DocumentFragment | null;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  sx,
  container,
  style,
  ...props
}: DialogContentProps) {
  const baseZIndex = useZIndex('modal');
  const sxProps = stylex.props(styles.content, sx);
  return (
    <DialogPortal data-slot="dialog-portal" container={container}>
      <DialogOverlay style={{ zIndex: baseZIndex }} />
      <DialogPrimitiveContent
        data-slot="dialog-content"
        {...sxProps}
        style={{ zIndex: baseZIndex + 1, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={baseZIndex + 10}>{children}</ZIndexProvider>
        {showCloseButton && (
          <DialogPrimitiveClose data-slot="dialog-close" {...stylex.props(styles.closeButton)}>
            <XIcon {...stylex.props(styles.closeIcon)} />
            <span {...stylex.props(styles.srOnly)}>Close</span>
          </DialogPrimitiveClose>
        )}
      </DialogPrimitiveContent>
    </DialogPortal>
  );
}

export type DialogHeaderProps = ComponentProps<'div'> & {
  sx?: stylex.StyleXStyles;
};

function DialogHeader({ className, sx, ...props }: DialogHeaderProps) {
  const sxProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="dialog-header"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export type DialogFooterProps = ComponentProps<'div'> & {
  sx?: stylex.StyleXStyles;
};

function DialogFooter({ className, sx, ...props }: DialogFooterProps) {
  const sxProps = stylex.props(styles.footer, sx);
  return (
    <div
      data-slot="dialog-footer"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export type DialogTitleProps = ComponentProps<typeof DialogPrimitiveTitle> & {
  sx?: stylex.StyleXStyles;
};

function DialogTitle({ className, sx, ...props }: DialogTitleProps) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <DialogPrimitiveTitle
      data-slot="dialog-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export type DialogDescriptionProps = ComponentProps<typeof DialogPrimitiveDescription> & {
  sx?: stylex.StyleXStyles;
};

function DialogDescription({ className, sx, ...props }: DialogDescriptionProps) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <DialogPrimitiveDescription
      data-slot="dialog-description"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
