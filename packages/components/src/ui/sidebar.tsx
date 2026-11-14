'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { PanelLeftIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';

import { colors, radius, shadow } from '../theme/tokens.stylex';
import { cn } from '../utils';
import { Button } from './button';
import { Input } from './input';
import { Separator } from './separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet';
import { Skeleton } from './skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  return React.useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
    () => false,
  );
}

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

const styles = stylex.create({
  provider: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
  },
  sidebarNone: {
    backgroundColor: colors.sidebar,
    color: colors.sidebarForeground,
    display: 'flex',
    height: '100%',
    width: 'var(--sidebar-width, 16rem)',
    flexDirection: 'column',
  },
  mobileSheetContent: {
    backgroundColor: colors.sidebar,
    color: colors.sidebarForeground,
    width: 'var(--sidebar-width, 18rem)',
    padding: 0,
  },
  mobileInner: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  desktopWrapper: {
    color: colors.sidebarForeground,
  },
  desktopGap: {
    position: 'relative',
    width: 'var(--sidebar-width, 16rem)',
    backgroundColor: 'transparent',
    transitionProperty: 'width',
    transitionDuration: '200ms',
    transitionTimingFunction: 'linear',
  },
  desktopContainer: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    zIndex: 10,
    display: 'flex',
    height: '100vh',
    width: 'var(--sidebar-width, 16rem)',
    transitionProperty: 'left, right, width',
    transitionDuration: '200ms',
    transitionTimingFunction: 'linear',
  },
  desktopInner: {
    backgroundColor: colors.sidebar,
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  trigger: {
    width: '1.75rem',
    height: '1.75rem',
  },
  rail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 20,
    width: '1rem',
    transform: 'translateX(-50%)',
    transitionProperty: 'all',
    transitionDuration: '200ms',
    transitionTimingFunction: 'linear',
  },
  inset: {
    backgroundColor: colors.background,
    position: 'relative',
    display: 'flex',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  input: {
    backgroundColor: colors.background,
    height: '2rem',
    width: '100%',
    boxShadow: shadow.none,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.5rem',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.5rem',
  },
  separator: {
    backgroundColor: colors.sidebarBorder,
    marginInline: '0.5rem',
    width: 'auto',
  },
  content: {
    display: 'flex',
    minHeight: 0,
    flex: 1,
    flexDirection: 'column',
    gap: '0.5rem',
    overflow: 'auto',
  },
  group: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    minWidth: 0,
    flexDirection: 'column',
    padding: '0.5rem',
  },
  groupLabel: {
    color: colors.sidebarForeground,
    opacity: 0.7,
    display: 'flex',
    height: '2rem',
    flexShrink: 0,
    alignItems: 'center',
    borderRadius: radius.md,
    paddingInline: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    outline: 'none',
    transitionProperty: 'margin, opacity',
    transitionDuration: '200ms',
    transitionTimingFunction: 'linear',
  },
  groupAction: {
    color: colors.sidebarForeground,
    position: 'absolute',
    top: '0.875rem',
    right: '0.75rem',
    display: 'flex',
    aspectRatio: '1 / 1',
    width: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    padding: 0,
    outline: 'none',
    transitionProperty: 'transform',
    ':hover': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
  },
  groupContent: {
    width: '100%',
    fontSize: '0.875rem',
  },
  menu: {
    display: 'flex',
    width: '100%',
    minWidth: 0,
    flexDirection: 'column',
    gap: '0.25rem',
  },
  menuItem: {
    position: 'relative',
  },
  menuButtonBase: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: '0.5rem',
    overflow: 'hidden',
    borderRadius: radius.md,
    padding: '0.5rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    outline: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.sidebarForeground,
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    ':hover': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
    ':active': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
  menuButtonOutline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.sidebarBorder,
  },
  menuButtonActive: {
    backgroundColor: colors.sidebarAccent,
    color: colors.sidebarAccentForeground,
    fontWeight: 500,
  },
  sizeDefault: {
    height: '2rem',
    fontSize: '0.875rem',
  },
  sizeSm: {
    height: '1.75rem',
    fontSize: '0.75rem',
  },
  sizeLg: {
    height: '3rem',
    fontSize: '0.875rem',
  },
  menuAction: {
    color: colors.sidebarForeground,
    position: 'absolute',
    top: '0.375rem',
    right: '0.25rem',
    display: 'flex',
    aspectRatio: '1 / 1',
    width: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    padding: 0,
    outline: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, transform',
    transitionDuration: '100ms',
    ':hover': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
  },
  menuBadge: {
    color: colors.sidebarForeground,
    pointerEvents: 'none',
    position: 'absolute',
    right: '0.25rem',
    display: 'flex',
    height: '1.25rem',
    minWidth: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingInline: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    userSelect: 'none',
  },
  skeletonContainer: {
    display: 'flex',
    height: '2rem',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: radius.md,
    paddingInline: '0.5rem',
  },
  skeletonIcon: {
    width: '1rem',
    height: '1rem',
    borderRadius: radius.md,
  },
  skeletonText: {
    height: '1rem',
    flex: 1,
  },
  menuSub: {
    marginInlineStart: '0.875rem',
    display: 'flex',
    minWidth: 0,
    flexDirection: 'column',
    gap: '0.25rem',
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: colors.sidebarBorder,
    paddingInlineStart: '0.625rem',
    paddingBlock: '0.125rem',
  },
  menuSubItem: {
    position: 'relative',
  },
  menuSubButton: {
    color: colors.sidebarForeground,
    display: 'flex',
    height: '1.75rem',
    minWidth: 0,
    alignItems: 'center',
    gap: '0.5rem',
    overflow: 'hidden',
    borderRadius: radius.md,
    paddingInline: '0.5rem',
    outline: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    ':hover': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
    ':active': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
  },
  subBtnActive: {
    backgroundColor: colors.sidebarAccent,
    color: colors.sidebarAccentForeground,
  },
  subBtnSm: {
    fontSize: '0.75rem',
  },
  subBtnMd: {
    fontSize: '0.875rem',
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

type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

export interface SidebarProviderProps extends React.ComponentProps<'div'> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sx?: stylex.StyleXStyles;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  sx,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  const styleProps = stylex.props(styles.provider, sx);

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          {...styleProps}
          className={cn(styleProps.className, className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends React.ComponentProps<'div'> {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  sx?: stylex.StyleXStyles;
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  sx,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    const styleProps = stylex.props(styles.sidebarNone, sx);
    return (
      <div
        data-slot="sidebar"
        {...styleProps}
        className={cn(styleProps.className, className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          {...stylex.props(styles.mobileSheetContent)}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader {...stylex.props(styles.srOnly)}>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div {...stylex.props(styles.mobileInner)}>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  const containerStyleProps = stylex.props(styles.desktopContainer, sx);

  return (
    <div
      {...stylex.props(styles.desktopWrapper)}
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div data-slot="sidebar-gap" {...stylex.props(styles.desktopGap)} />
      <div
        data-slot="sidebar-container"
        {...containerStyleProps}
        style={{
          [side]: 0,
          ...(props.style || {}),
        }}
        className={cn(containerStyleProps.className, className)}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          {...stylex.props(styles.desktopInner)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
  sx?: stylex.StyleXStyles;
}

function SidebarTrigger({ className, onClick, sx, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      sx={[styles.trigger, sx]}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span {...stylex.props(styles.srOnly)}>Toggle Sidebar</span>
    </Button>
  );
}

export interface SidebarRailProps extends React.ComponentProps<'button'> {
  sx?: stylex.StyleXStyles;
}

function SidebarRail({ className, sx, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar();
  const styleProps = stylex.props(styles.rail, sx);

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarInsetProps extends React.ComponentProps<'main'> {
  sx?: stylex.StyleXStyles;
}

function SidebarInset({ className, sx, ...props }: SidebarInsetProps) {
  const styleProps = stylex.props(styles.inset, sx);
  return (
    <main
      data-slot="sidebar-inset"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarInputProps extends React.ComponentProps<typeof Input> {
  sx?: stylex.StyleXStyles;
}

function SidebarInput({ className, sx, ...props }: SidebarInputProps) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      sx={[styles.input, sx]}
      className={className}
      {...props}
    />
  );
}

export interface SidebarHeaderProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SidebarHeader({ className, sx, ...props }: SidebarHeaderProps) {
  const styleProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarFooterProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SidebarFooter({ className, sx, ...props }: SidebarFooterProps) {
  const styleProps = stylex.props(styles.footer, sx);
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarSeparatorProps extends React.ComponentProps<typeof Separator> {
  sx?: stylex.StyleXStyles;
}

function SidebarSeparator({ className, sx, ...props }: SidebarSeparatorProps) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      sx={[styles.separator, sx]}
      className={className}
      {...props}
    />
  );
}

export interface SidebarContentProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SidebarContent({ className, sx, ...props }: SidebarContentProps) {
  const styleProps = stylex.props(styles.content, sx);
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarGroupProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SidebarGroup({ className, sx, ...props }: SidebarGroupProps) {
  const styleProps = stylex.props(styles.group, sx);
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarGroupLabelProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function SidebarGroupLabel({ className, asChild = false, sx, ...props }: SidebarGroupLabelProps) {
  const Comp = asChild ? Slot : 'div';
  const styleProps = stylex.props(styles.groupLabel, sx);

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarGroupActionProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function SidebarGroupAction({ className, asChild = false, sx, ...props }: SidebarGroupActionProps) {
  const Comp = asChild ? Slot : 'button';
  const styleProps = stylex.props(styles.groupAction, sx);

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarGroupContentProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SidebarGroupContent({ className, sx, ...props }: SidebarGroupContentProps) {
  const styleProps = stylex.props(styles.groupContent, sx);
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarMenuProps extends React.ComponentProps<'ul'> {
  sx?: stylex.StyleXStyles;
}

function SidebarMenu({ className, sx, ...props }: SidebarMenuProps) {
  const styleProps = stylex.props(styles.menu, sx);
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarMenuItemProps extends React.ComponentProps<'li'> {
  sx?: stylex.StyleXStyles;
}

function SidebarMenuItem({ className, sx, ...props }: SidebarMenuItemProps) {
  const styleProps = stylex.props(styles.menuItem, sx);
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export type SidebarMenuButtonVariant = 'default' | 'outline';
export type SidebarMenuButtonSize = 'default' | 'sm' | 'lg';

const sidebarMenuButtonVariants = () => {
  return '';
};

export interface SidebarMenuButtonProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  isActive?: boolean;
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  sx?: stylex.StyleXStyles;
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  sx,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const { isMobile, state } = useSidebar();

  const sizeStyle =
    size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeDefault;
  const variantStyle = variant === 'outline' ? styles.menuButtonOutline : undefined;
  const activeStyle = isActive ? styles.menuButtonActive : undefined;

  const styleProps = stylex.props(styles.menuButtonBase, variantStyle, sizeStyle, activeStyle, sx);

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

export interface SidebarMenuActionProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  showOnHover?: boolean;
  sx?: stylex.StyleXStyles;
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  sx,
  ...props
}: SidebarMenuActionProps) {
  const Comp = asChild ? Slot : 'button';
  const styleProps = stylex.props(styles.menuAction, sx);

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarMenuBadgeProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function SidebarMenuBadge({ className, sx, ...props }: SidebarMenuBadgeProps) {
  const styleProps = stylex.props(styles.menuBadge, sx);
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarMenuSkeletonProps extends React.ComponentProps<'div'> {
  showIcon?: boolean;
  sx?: stylex.StyleXStyles;
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  sx,
  ...props
}: SidebarMenuSkeletonProps) {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  const styleProps = stylex.props(styles.skeletonContainer, sx);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {showIcon && <Skeleton sx={styles.skeletonIcon} data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        sx={styles.skeletonText}
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
            width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export interface SidebarMenuSubProps extends React.ComponentProps<'ul'> {
  sx?: stylex.StyleXStyles;
}

function SidebarMenuSub({ className, sx, ...props }: SidebarMenuSubProps) {
  const styleProps = stylex.props(styles.menuSub, sx);
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarMenuSubItemProps extends React.ComponentProps<'li'> {
  sx?: stylex.StyleXStyles;
}

function SidebarMenuSubItem({ className, sx, ...props }: SidebarMenuSubItemProps) {
  const styleProps = stylex.props(styles.menuSubItem, sx);
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface SidebarMenuSubButtonProps extends React.ComponentProps<'a'> {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
  sx?: stylex.StyleXStyles;
}

function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  sx,
  ...props
}: SidebarMenuSubButtonProps) {
  const Comp = asChild ? Slot : 'a';
  const sizeStyle = size === 'sm' ? styles.subBtnSm : styles.subBtnMd;
  const activeStyle = isActive ? styles.subBtnActive : undefined;
  const styleProps = stylex.props(styles.menuSubButton, sizeStyle, activeStyle, sx);

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  sidebarMenuButtonVariants,
  useSidebar,
};
