import { type ComponentProps } from 'react';
import {
  Action as AlertDialogPrimitiveAction,
  Cancel as AlertDialogPrimitiveCancel,
  Content as AlertDialogPrimitiveContent,
  Description as AlertDialogPrimitiveDescription,
  Overlay as AlertDialogPrimitiveOverlay,
  Portal as AlertDialogPrimitivePortal,
  Root as AlertDialogPrimitiveRoot,
  Title as AlertDialogPrimitiveTitle,
  Trigger as AlertDialogPrimitiveTrigger,
} from '@radix-ui/react-alert-dialog';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';
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
    padding: '1rem',
    boxShadow: shadow['2xl'],
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

function AlertDialog(props: ComponentProps<typeof AlertDialogPrimitiveRoot>) {
  return <AlertDialogPrimitiveRoot data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: ComponentProps<typeof AlertDialogPrimitiveTrigger>) {
  return <AlertDialogPrimitiveTrigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal(props: ComponentProps<typeof AlertDialogPrimitivePortal>) {
  return <AlertDialogPrimitivePortal data-slot="alert-dialog-portal" {...props} />;
}

export interface AlertDialogOverlayProps extends ComponentProps<
  typeof AlertDialogPrimitiveOverlay
> {
  sx?: stylex.StyleXStyles;
}

function AlertDialogOverlay({ className, sx, style, ...props }: AlertDialogOverlayProps) {
  const zIndex = useZIndex('overlay');
  const sxProps = stylex.props(styles.overlay, sx);
  return (
    <AlertDialogPrimitiveOverlay
      data-slot="alert-dialog-overlay"
      {...sxProps}
      style={{ zIndex, ...sxProps.style, ...style }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AlertDialogContentProps extends ComponentProps<
  typeof AlertDialogPrimitiveContent
> {
  sx?: stylex.StyleXStyles;
  container?: HTMLElement | DocumentFragment | null;
}

function AlertDialogContent({
  className,
  sx,
  children,
  container,
  style,
  ...props
}: AlertDialogContentProps) {
  const baseZIndex = useZIndex('modal');
  const sxProps = stylex.props(styles.content, sx);
  return (
    <AlertDialogPortal container={container}>
      <AlertDialogOverlay style={{ zIndex: baseZIndex }} />
      <AlertDialogPrimitiveContent
        data-slot="alert-dialog-content"
        {...sxProps}
        style={{ zIndex: baseZIndex + 1, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={baseZIndex + 10}>{children}</ZIndexProvider>
      </AlertDialogPrimitiveContent>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  sx,
  ...props
}: ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
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

function AlertDialogFooter({
  className,
  sx,
  ...props
}: ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
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
}: ComponentProps<typeof AlertDialogPrimitiveTitle> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <AlertDialogPrimitiveTitle
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
}: ComponentProps<typeof AlertDialogPrimitiveDescription> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <AlertDialogPrimitiveDescription
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
}: ComponentProps<typeof AlertDialogPrimitiveAction>) {
  const btnClass = buttonVariants({ variant: 'default' });
  return (
    <AlertDialogPrimitiveAction
      className={className ? `${btnClass} ${className}`.trim() : btnClass}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitiveCancel>) {
  const btnClass = buttonVariants({ variant: 'outline' });
  return (
    <AlertDialogPrimitiveCancel
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
