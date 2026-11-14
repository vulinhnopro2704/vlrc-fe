import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { useZIndex, ZIndexProvider } from '../theme/zIndex';

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideUp = stylex.keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    animationName: fadeIn,
    animationDuration: '200ms',
  },
  content: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 51,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85vh',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    color: colors.foreground,
    boxShadow: shadow.xl,
    outline: 'none',
    boxSizing: 'border-box',
    animationName: slideUp,
    animationDuration: '250ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  handle: {
    marginInline: 'auto',
    marginTop: '0.75rem',
    marginBottom: '0.25rem',
    height: '0.25rem',
    width: '3rem',
    borderRadius: radius.full,
    backgroundColor: colors.mutedForeground,
    opacity: 0.4,
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    padding: '1.25rem 1.5rem',
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1.25rem 1.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: colors.foreground,
  },
  description: {
    margin: 0,
    fontSize: '0.875rem',
    color: colors.mutedForeground,
  },
});

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}

function DrawerTrigger(props: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose(props: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export interface DrawerOverlayProps extends React.ComponentProps<typeof DrawerPrimitive.Overlay> {
  sx?: stylex.StyleXStyles;
}

function DrawerOverlay({ className, sx, style, ...props }: DrawerOverlayProps) {
  const zIndex = useZIndex('overlay');
  const sxProps = stylex.props(styles.overlay, sx);
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      {...sxProps}
      style={{ zIndex, ...sxProps.style, ...style }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DrawerContentProps extends React.ComponentProps<typeof DrawerPrimitive.Content> {
  sx?: stylex.StyleXStyles;
}

function DrawerContent({ className, children, sx, style, ...props }: DrawerContentProps) {
  const baseZIndex = useZIndex('drawer');
  const sxProps = stylex.props(styles.content, sx);
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay style={{ zIndex: baseZIndex }} />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        {...sxProps}
        style={{ zIndex: baseZIndex + 1, ...sxProps.style, ...style }}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        <ZIndexProvider value={baseZIndex + 10}>
          <div data-slot="drawer-handle" {...stylex.props(styles.handle)} />
          {children}
        </ZIndexProvider>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

export interface DrawerHeaderProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function DrawerHeader({ className, sx, ...props }: DrawerHeaderProps) {
  const sxProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="drawer-header"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DrawerFooterProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function DrawerFooter({ className, sx, ...props }: DrawerFooterProps) {
  const sxProps = stylex.props(styles.footer, sx);
  return (
    <div
      data-slot="drawer-footer"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DrawerTitleProps extends React.ComponentProps<typeof DrawerPrimitive.Title> {
  sx?: stylex.StyleXStyles;
}

function DrawerTitle({ className, sx, ...props }: DrawerTitleProps) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface DrawerDescriptionProps extends React.ComponentProps<
  typeof DrawerPrimitive.Description
> {
  sx?: stylex.StyleXStyles;
}

function DrawerDescription({ className, sx, ...props }: DrawerDescriptionProps) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
