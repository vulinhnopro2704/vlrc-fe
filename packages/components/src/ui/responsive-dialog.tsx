import * as React from 'react';
import type * as stylex from '@stylexjs/stylex';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
} from './dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerContentProps,
  type DrawerHeaderProps,
  type DrawerFooterProps,
  type DrawerTitleProps,
  type DrawerDescriptionProps,
} from './drawer';
import { useBreakpoint, type Breakpoint } from './useBreakpoint';

interface ResponsiveDialogContextValue {
  isDesktop: boolean;
}

const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextValue>({
  isDesktop: true,
});

export function useResponsiveDialogContext() {
  return React.useContext(ResponsiveDialogContext);
}

export interface ResponsiveDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Breakpoint threshold for desktop mode. Defaults to 'md' (768px). */
  breakpoint?: Breakpoint;
  /** Force desktop or mobile mode manually */
  forceMode?: 'desktop' | 'mobile';
}

export function ResponsiveDialog({
  children,
  open,
  defaultOpen,
  onOpenChange,
  breakpoint = 'md',
  forceMode,
}: ResponsiveDialogProps) {
  const screens = useBreakpoint();
  const isDesktop =
    forceMode === 'desktop' ? true : forceMode === 'mobile' ? false : Boolean(screens[breakpoint]);

  const contextValue = React.useMemo(() => ({ isDesktop }), [isDesktop]);

  if (isDesktop) {
    return (
      <ResponsiveDialogContext.Provider value={contextValue}>
        <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      </ResponsiveDialogContext.Provider>
    );
  }

  return (
    <ResponsiveDialogContext.Provider value={contextValue}>
      <Drawer open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    </ResponsiveDialogContext.Provider>
  );
}

export interface ResponsiveDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function ResponsiveDialogTrigger({
  children,
  asChild,
  ...props
}: ResponsiveDialogTriggerProps) {
  const { isDesktop } = useResponsiveDialogContext();
  if (isDesktop) {
    return (
      <DialogTrigger asChild={asChild} {...props}>
        {children}
      </DialogTrigger>
    );
  }
  return (
    <DrawerTrigger asChild={asChild} {...props}>
      {children}
    </DrawerTrigger>
  );
}

export interface ResponsiveDialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function ResponsiveDialogClose({ children, asChild, ...props }: ResponsiveDialogCloseProps) {
  const { isDesktop } = useResponsiveDialogContext();
  if (isDesktop) {
    return (
      <DialogClose asChild={asChild} {...props}>
        {children}
      </DialogClose>
    );
  }
  return (
    <DrawerClose asChild={asChild} {...props}>
      {children}
    </DrawerClose>
  );
}

export interface ResponsiveDialogContentProps extends Omit<
  DialogContentProps & DrawerContentProps,
  'ref'
> {
  children?: React.ReactNode;
  sx?: stylex.StyleXStyles;
  className?: string;
}

export function ResponsiveDialogContent({
  children,
  sx,
  className,
  ...props
}: ResponsiveDialogContentProps) {
  const { isDesktop } = useResponsiveDialogContext();
  if (isDesktop) {
    return (
      <DialogContent sx={sx} className={className} {...props}>
        {children}
      </DialogContent>
    );
  }
  return (
    <DrawerContent sx={sx} className={className} {...props}>
      {children}
    </DrawerContent>
  );
}

export interface ResponsiveDialogHeaderProps extends Omit<
  DialogHeaderProps & DrawerHeaderProps,
  'ref'
> {
  children?: React.ReactNode;
  sx?: stylex.StyleXStyles;
  className?: string;
}

export function ResponsiveDialogHeader({
  children,
  sx,
  className,
  ...props
}: ResponsiveDialogHeaderProps) {
  const { isDesktop } = useResponsiveDialogContext();
  if (isDesktop) {
    return (
      <DialogHeader sx={sx} className={className} {...props}>
        {children}
      </DialogHeader>
    );
  }
  return (
    <DrawerHeader sx={sx} className={className} {...props}>
      {children}
    </DrawerHeader>
  );
}

export interface ResponsiveDialogFooterProps extends Omit<
  DialogFooterProps & DrawerFooterProps,
  'ref'
> {
  children?: React.ReactNode;
  sx?: stylex.StyleXStyles;
  className?: string;
}

export function ResponsiveDialogFooter({
  children,
  sx,
  className,
  ...props
}: ResponsiveDialogFooterProps) {
  const { isDesktop } = useResponsiveDialogContext();
  if (isDesktop) {
    return (
      <DialogFooter sx={sx} className={className} {...props}>
        {children}
      </DialogFooter>
    );
  }
  return (
    <DrawerFooter sx={sx} className={className} {...props}>
      {children}
    </DrawerFooter>
  );
}

export interface ResponsiveDialogTitleProps extends Omit<
  DialogTitleProps & DrawerTitleProps,
  'ref'
> {
  children?: React.ReactNode;
  sx?: stylex.StyleXStyles;
  className?: string;
}

export function ResponsiveDialogTitle({
  children,
  sx,
  className,
  ...props
}: ResponsiveDialogTitleProps) {
  const { isDesktop } = useResponsiveDialogContext();
  if (isDesktop) {
    return (
      <DialogTitle sx={sx} className={className} {...props}>
        {children}
      </DialogTitle>
    );
  }
  return (
    <DrawerTitle sx={sx} className={className} {...props}>
      {children}
    </DrawerTitle>
  );
}

export interface ResponsiveDialogDescriptionProps extends Omit<
  DialogDescriptionProps & DrawerDescriptionProps,
  'ref'
> {
  children?: React.ReactNode;
  sx?: stylex.StyleXStyles;
  className?: string;
}

export function ResponsiveDialogDescription({
  children,
  sx,
  className,
  ...props
}: ResponsiveDialogDescriptionProps) {
  const { isDesktop } = useResponsiveDialogContext();
  if (isDesktop) {
    return (
      <DialogDescription sx={sx} className={className} {...props}>
        {children}
      </DialogDescription>
    );
  }
  return (
    <DrawerDescription sx={sx} className={className} {...props}>
      {children}
    </DrawerDescription>
  );
}
