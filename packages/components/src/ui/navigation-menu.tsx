import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';

import { colors, radius, shadow } from '../theme/tokens.stylex';
import { cn } from '../utils';

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    maxWidth: 'max-content',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    display: 'flex',
    flex: 1,
    listStyleType: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  item: {
    position: 'relative',
  },
  trigger: {
    display: 'inline-flex',
    height: '2.25rem',
    width: 'max-content',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.background,
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    outline: 'none',
    color: colors.foreground,
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':focus': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
  chevron: {
    position: 'relative',
    top: '1px',
    marginLeft: '0.25rem',
    width: '0.75rem',
    height: '0.75rem',
    transitionProperty: 'transform',
    transitionDuration: '300ms',
  },
  content: {
    top: 0,
    left: 0,
    width: 'auto',
    padding: '0.5rem',
    paddingRight: '0.625rem',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow: shadow.md,
  },
  viewportContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 50,
    display: 'flex',
    justifyContent: 'center',
  },
  viewport: {
    position: 'relative',
    marginTop: '0.375rem',
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow: shadow.md,
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    borderRadius: radius.sm,
    padding: '0.5rem',
    fontSize: '0.875rem',
    outline: 'none',
    color: colors.foreground,
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':focus': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  indicator: {
    position: 'relative',
    top: '100%',
    zIndex: 1,
    display: 'flex',
    height: '0.375rem',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  indicatorArrow: {
    position: 'relative',
    top: '60%',
    width: '0.5rem',
    height: '0.5rem',
    transform: 'rotate(45deg)',
    borderTopLeftRadius: radius.sm,
    backgroundColor: colors.border,
    boxShadow: shadow.md,
  },
});

export interface NavigationMenuProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Root
> {
  viewport?: boolean;
  sx?: stylex.StyleXStyles;
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  sx,
  ...props
}: NavigationMenuProps) {
  const styleProps = stylex.props(styles.root, sx);
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

export interface NavigationMenuListProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.List
> {
  sx?: stylex.StyleXStyles;
}

function NavigationMenuList({ className, sx, ...props }: NavigationMenuListProps) {
  const styleProps = stylex.props(styles.list, sx);
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface NavigationMenuItemProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Item
> {
  sx?: stylex.StyleXStyles;
}

function NavigationMenuItem({ className, sx, ...props }: NavigationMenuItemProps) {
  const styleProps = stylex.props(styles.item, sx);
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = () => {
  return '';
};

export interface NavigationMenuTriggerProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Trigger
> {
  sx?: stylex.StyleXStyles;
}

function NavigationMenuTrigger({ className, children, sx, ...props }: NavigationMenuTriggerProps) {
  const styleProps = stylex.props(styles.trigger, sx);
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {children} <ChevronDownIcon {...stylex.props(styles.chevron)} aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

export interface NavigationMenuContentProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Content
> {
  sx?: stylex.StyleXStyles;
}

function NavigationMenuContent({ className, sx, ...props }: NavigationMenuContentProps) {
  const styleProps = stylex.props(styles.content, sx);
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface NavigationMenuViewportProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Viewport
> {
  sx?: stylex.StyleXStyles;
}

function NavigationMenuViewport({ className, sx, ...props }: NavigationMenuViewportProps) {
  const styleProps = stylex.props(styles.viewport, sx);
  return (
    <div {...stylex.props(styles.viewportContainer)}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        {...styleProps}
        className={cn(styleProps.className, className)}
        {...props}
      />
    </div>
  );
}

export interface NavigationMenuLinkProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Link
> {
  sx?: stylex.StyleXStyles;
}

function NavigationMenuLink({ className, sx, ...props }: NavigationMenuLinkProps) {
  const styleProps = stylex.props(styles.link, sx);
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface NavigationMenuIndicatorProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Indicator
> {
  sx?: stylex.StyleXStyles;
}

function NavigationMenuIndicator({ className, sx, ...props }: NavigationMenuIndicatorProps) {
  const styleProps = stylex.props(styles.indicator, sx);
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      <div {...stylex.props(styles.indicatorArrow)} />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
