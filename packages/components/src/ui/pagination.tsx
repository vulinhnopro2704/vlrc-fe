import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { Text, type TextType } from '../Typography';

const styles = stylex.create({
  nav: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '0.25rem',
  },
  item: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    textDecoration: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: 500,
    color: colors.foreground,
    backgroundColor: 'transparent',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: '150ms',
    outline: 'none',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '2px',
    },
  },
  linkActive: {
    borderColor: colors.border,
    backgroundColor: colors.background,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ':hover': {
      backgroundColor: colors.background,
    },
  },

  // 7-tier Link Sizing
  linkXxs: {
    height: '1.5rem',
    minWidth: '1.5rem',
    fontSize: '0.6875rem',
    paddingInline: '0.375rem',
    gap: '0.25rem',
  },
  linkXs: {
    height: '1.75rem',
    minWidth: '1.75rem',
    fontSize: '0.75rem',
    paddingInline: '0.5rem',
    gap: '0.25rem',
  },
  linkSm: {
    height: '2rem',
    minWidth: '2rem',
    fontSize: '0.8125rem',
    paddingInline: '0.625rem',
    gap: '0.375rem',
  },
  linkMd: {
    height: '2.25rem',
    minWidth: '2.25rem',
    fontSize: '0.875rem',
    paddingInline: '0.75rem',
    gap: '0.375rem',
  },
  linkLg: {
    height: '2.5rem',
    minWidth: '2.5rem',
    fontSize: '0.9375rem',
    paddingInline: '0.875rem',
    gap: '0.5rem',
  },
  linkXl: {
    height: '2.875rem',
    minWidth: '2.875rem',
    fontSize: '1rem',
    paddingInline: '1rem',
    gap: '0.5rem',
  },
  linkXxl: {
    height: '3.25rem',
    minWidth: '3.25rem',
    fontSize: '1.125rem',
    paddingInline: '1.25rem',
    gap: '0.625rem',
  },

  // 7-tier Icon Sizing
  iconXxs: {
    width: '0.75rem',
    height: '0.75rem',
  },
  iconXs: {
    width: '0.8125rem',
    height: '0.8125rem',
  },
  iconSm: {
    width: '0.875rem',
    height: '0.875rem',
  },
  iconMd: {
    width: '1rem',
    height: '1rem',
  },
  iconLg: {
    width: '1.125rem',
    height: '1.125rem',
  },
  iconXl: {
    width: '1.25rem',
    height: '1.25rem',
  },
  iconXxl: {
    width: '1.375rem',
    height: '1.375rem',
  },

  ellipsis: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.mutedForeground,
  },
});

const linkSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.linkXxs,
  xs: styles.linkXs,
  sm: styles.linkSm,
  md: styles.linkMd,
  lg: styles.linkLg,
  xl: styles.linkXl,
  xxl: styles.linkXxl,
};

const iconSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.iconXxs,
  xs: styles.iconXs,
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
  xl: styles.iconXl,
  xxl: styles.iconXxl,
};

const PaginationContext = React.createContext<{ size: ComponentSize }>({ size: 'md' });

export interface PaginationProps extends React.ComponentProps<'nav'> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function Pagination({ size = 'md', className, sx, ...props }: PaginationProps) {
  const sxProps = stylex.props(styles.nav, sx);
  return (
    <PaginationContext.Provider value={{ size }}>
      <nav
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        data-size={size}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    </PaginationContext.Provider>
  );
}

export interface PaginationContentProps extends React.ComponentProps<'ul'> {
  sx?: stylex.StyleXStyles;
}

function PaginationContent({ className, sx, ...props }: PaginationContentProps) {
  const sxProps = stylex.props(styles.content, sx);
  return (
    <ul
      data-slot="pagination-content"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface PaginationItemProps extends React.ComponentProps<'li'> {
  sx?: stylex.StyleXStyles;
}

function PaginationItem({ className, sx, ...props }: PaginationItemProps) {
  const sxProps = stylex.props(styles.item, sx);
  return (
    <li
      data-slot="pagination-item"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface PaginationLinkProps extends Omit<React.ComponentProps<'a'>, 'type'> {
  isActive?: boolean;
  size?: ComponentSize;
  type?: TextType;
  sx?: stylex.StyleXStyles;
}

function PaginationLink({
  className,
  isActive,
  size: propSize,
  sx,
  ...props
}: PaginationLinkProps) {
  const context = React.useContext(PaginationContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const sizeStyle = linkSizeStyles[resolvedSize] ?? styles.linkMd;
  const sxProps = stylex.props(styles.link, sizeStyle, isActive && styles.linkActive, sx);

  return (
    <Text
      as="a"
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      data-size={resolvedSize}
      type="inherit"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  children,
  size: propSize,
  sx,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const context = React.useContext(PaginationContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const iconSize = iconSizeStyles[resolvedSize] ?? styles.iconMd;

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size={resolvedSize}
      className={className}
      sx={sx}
      {...props}
    >
      <ChevronLeftIcon {...stylex.props(iconSize)} />
      <Text as="span" size={resolvedSize} type="inherit">
        {children ?? 'Previous'}
      </Text>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  children,
  size: propSize,
  sx,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const context = React.useContext(PaginationContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const iconSize = iconSizeStyles[resolvedSize] ?? styles.iconMd;

  return (
    <PaginationLink
      aria-label="Go to next page"
      size={resolvedSize}
      className={className}
      sx={sx}
      {...props}
    >
      <Text as="span" size={resolvedSize} type="inherit">
        {children ?? 'Next'}
      </Text>
      <ChevronRightIcon {...stylex.props(iconSize)} />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  size: propSize,
  sx,
  ...props
}: React.ComponentProps<'span'> & { size?: ComponentSize; sx?: stylex.StyleXStyles }) {
  const context = React.useContext(PaginationContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const iconSize = iconSizeStyles[resolvedSize] ?? styles.iconMd;
  const sizeStyle = linkSizeStyles[resolvedSize] ?? styles.linkMd;
  const sxProps = stylex.props(styles.ellipsis, sizeStyle, sx);

  return (
    <span
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <MoreHorizontalIcon {...stylex.props(iconSize)} />
      <Text as="span" className="sr-only">
        More pages
      </Text>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
