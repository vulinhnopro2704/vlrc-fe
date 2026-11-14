import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';

import { colors, radius } from '../theme/tokens.stylex';
import { cn } from '../utils';
import { Separator } from './separator';
import { Paragraph, Text } from '../Typography';

const styles = stylex.create({
  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    fontSize: '0.875rem',
    borderRadius: radius.md,
    flexWrap: 'wrap',
    outline: 'none',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '100ms',
  },
  variantDefault: {
    backgroundColor: 'transparent',
  },
  variantOutline: {
    borderColor: colors.border,
  },
  variantMuted: {
    backgroundColor: colors.muted,
  },
  sizeDefault: {
    padding: '1rem',
    gap: '1rem',
  },
  sizeSm: {
    paddingBlock: '0.75rem',
    paddingInline: '1rem',
    gap: '0.625rem',
  },
  mediaBase: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  mediaIcon: {
    width: '2rem',
    height: '2rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.muted,
  },
  mediaImage: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '0.25rem',
  },
  title: {
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: 1.375,
    fontWeight: 500,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  header: {
    display: 'flex',
    flexBasis: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  footer: {
    display: 'flex',
    flexBasis: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
});

export interface ItemGroupProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ItemGroup({ className, sx, ...props }: ItemGroupProps) {
  const styleProps = stylex.props(styles.group, sx);
  return (
    <div
      role="list"
      data-slot="item-group"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={className}
      {...props}
    />
  );
}

export type ItemVariant = 'default' | 'outline' | 'muted';
export type ItemSize = 'default' | 'sm';

export interface ItemProps extends React.ComponentProps<'div'> {
  variant?: ItemVariant;
  size?: ItemSize;
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function Item({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  sx,
  ...props
}: ItemProps) {
  const Comp = asChild ? Slot : 'div';
  const variantStyle =
    variant === 'outline'
      ? styles.variantOutline
      : variant === 'muted'
        ? styles.variantMuted
        : styles.variantDefault;
  const sizeStyle = size === 'sm' ? styles.sizeSm : styles.sizeDefault;
  const styleProps = stylex.props(styles.item, variantStyle, sizeStyle, sx);

  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export type ItemMediaVariant = 'default' | 'icon' | 'image';

export interface ItemMediaProps extends React.ComponentProps<'div'> {
  variant?: ItemMediaVariant;
  sx?: stylex.StyleXStyles;
}

function ItemMedia({ className, variant = 'default', sx, ...props }: ItemMediaProps) {
  const variantStyle =
    variant === 'icon' ? styles.mediaIcon : variant === 'image' ? styles.mediaImage : undefined;
  const styleProps = stylex.props(styles.mediaBase, variantStyle, sx);

  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ItemContentProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ItemContent({ className, sx, ...props }: ItemContentProps) {
  const styleProps = stylex.props(styles.content, sx);
  return (
    <div
      data-slot="item-content"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ItemTitleProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ItemTitle({ className, sx, ...props }: ItemTitleProps) {
  const styleProps = stylex.props(styles.title, sx);
  return (
    <Text
      as="div"
      weight="medium"
      data-slot="item-title"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ItemDescriptionProps extends React.ComponentProps<'p'> {
  sx?: stylex.StyleXStyles;
}

function ItemDescription({ className, sx, ...props }: ItemDescriptionProps) {
  const styleProps = stylex.props(styles.description, sx);
  return (
    <Paragraph
      as="p"
      size="sm"
      type="secondary"
      data-slot="item-description"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ItemActionsProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ItemActions({ className, sx, ...props }: ItemActionsProps) {
  const styleProps = stylex.props(styles.actions, sx);
  return (
    <div
      data-slot="item-actions"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ItemHeaderProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ItemHeader({ className, sx, ...props }: ItemHeaderProps) {
  const styleProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="item-header"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface ItemFooterProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function ItemFooter({ className, sx, ...props }: ItemFooterProps) {
  const styleProps = stylex.props(styles.footer, sx);
  return (
    <div
      data-slot="item-footer"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
