import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { buttonVariants } from './button';

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
    lineHeight: 1.25,
    fontWeight: 600,
    color: colors.foreground,
  },
  description: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
  },
});

function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal(props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

export interface AlertDialogOverlayProps extends React.ComponentProps<typeof AlertDialogPrimitive.Overlay> {
  sx?: stylex.StyleXStyles;
}

function AlertDialogOverlay({ className, sx, ...props }: AlertDialogOverlayProps) {
  const sxProps = stylex.props(styles.overlay, sx);
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AlertDialogContentProps extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
  sx?: stylex.StyleXStyles;
}

function AlertDialogContent({ className, sx, ...props }: AlertDialogContentProps) {
  const sxProps = stylex.props(styles.content, sx);
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, sx, ...props }: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="alert-dialog-header"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, sx, ...props }: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.footer, sx);
  return (
    <div
      data-slot="alert-dialog-footer"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  const btnClass = buttonVariants({ variant: 'default' });
  return (
    <AlertDialogPrimitive.Action
      className={className ? `${btnClass} ${className}`.trim() : btnClass}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  const btnClass = buttonVariants({ variant: 'outline' });
  return (
    <AlertDialogPrimitive.Cancel
      className={className ? `${btnClass} ${className}`.trim() : btnClass}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
