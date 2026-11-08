import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideInRight = stylex.keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
});

const slideInLeft = stylex.keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
});

const slideInTop = stylex.keyframes({
  from: { transform: 'translateY(-100%)' },
  to: { transform: 'translateY(0)' },
});

const slideInBottom = stylex.keyframes({
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
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  baseContent: {
    position: 'fixed',
    zIndex: 51,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.background,
    color: colors.foreground,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: 'none',
    boxSizing: 'border-box',
    animationDuration: '250ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  right: {
    top: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
    maxWidth: '24rem',
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: colors.border,
    animationName: slideInRight,
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0,
    height: '100%',
    width: '100%',
    maxWidth: '24rem',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: colors.border,
    animationName: slideInLeft,
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    maxHeight: '80vh',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    animationName: slideInTop,
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80vh',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    animationName: slideInBottom,
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    borderRadius: radii.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    padding: '0.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    transitionProperty: 'color, background-color',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.foreground,
    },
    ':focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
  closeIcon: {
    width: '1rem',
    height: '1rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    padding: '1.5rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1.5rem',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    lineHeight: 1.4,
    fontWeight: 600,
    color: colors.foreground,
  },
  description: {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: 1.5,
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

const sideStyles: Record<SheetSide, stylex.StyleXStyles> = {
  right: styles.right,
  left: styles.left,
  top: styles.top,
  bottom: styles.bottom,
};

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

export interface SheetOverlayProps extends React.ComponentProps<typeof SheetPrimitive.Overlay> {
  sx?: stylex.StyleXStyles;
}

function SheetOverlay({ className, sx, ...props }: SheetOverlayProps) {
  const sxProps = stylex.props(styles.overlay, sx);
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface SheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content> {
  side?: SheetSide;
  sx?: stylex.StyleXStyles;
}

function SheetContent({ className, children, side = 'right', sx, ...props }: SheetContentProps) {
  const sideStyle = sideStyles[side] ?? styles.right;
  const sxProps = stylex.props(styles.baseContent, sideStyle, sx);

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
        <SheetPrimitive.Close {...stylex.props(styles.closeBtn)} aria-label="Close">
          <XIcon {...stylex.props(styles.closeIcon)} />
          <span {...stylex.props(styles.srOnly)}>Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export interface SheetHeaderProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SheetHeader({ className, sx, ...props }: SheetHeaderProps) {
  const sxProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="sheet-header"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface SheetFooterProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SheetFooter({ className, sx, ...props }: SheetFooterProps) {
  const sxProps = stylex.props(styles.footer, sx);
  return (
    <div
      data-slot="sheet-footer"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface SheetTitleProps extends React.ComponentProps<typeof SheetPrimitive.Title> {
  sx?: stylex.StyleXStyles;
}

function SheetTitle({ className, sx, ...props }: SheetTitleProps) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface SheetDescriptionProps extends React.ComponentProps<
  typeof SheetPrimitive.Description
> {
  sx?: stylex.StyleXStyles;
}

function SheetDescription({ className, sx, ...props }: SheetDescriptionProps) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
