import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

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
  },
  content: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 50,
    display: 'grid',
    width: '100%',
    maxWidth: '32rem',
    gap: '1rem',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: 'none',
    animationName: scaleIn,
    animationDuration: '200ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    borderRadius: radii.sm,
    opacity: 0.7,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.foreground,
    padding: '0.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    outline: 'none',
    ':hover': {
      opacity: 1,
    },
    ':focus-visible': {
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
  },
  closeIcon: {
    width: '1rem',
    height: '1rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.125rem',
    lineHeight: 1,
    fontWeight: 600,
    color: colors.foreground,
  },
  description: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
  },
});

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export interface DialogOverlayProps extends React.ComponentProps<typeof DialogPrimitive.Overlay> {
  sx?: stylex.StyleXStyles;
}

function DialogOverlay({ className, sx, ...props }: DialogOverlayProps) {
  const sxProps = stylex.props(styles.overlay, sx);
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
  sx?: stylex.StyleXStyles;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  sx,
  ...props
}: DialogContentProps) {
  const sxProps = stylex.props(styles.content, sx);
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            {...stylex.props(styles.closeButton)}
          >
            <XIcon {...stylex.props(styles.closeIcon)} />
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, sx, ...props }: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
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

function DialogFooter({ className, sx, ...props }: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
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

function DialogTitle({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <DialogPrimitive.Description
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
