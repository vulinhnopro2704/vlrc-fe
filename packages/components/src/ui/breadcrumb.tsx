import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { Text } from '../Typography';

const styles = stylex.create({
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    wordBreak: 'break-word',
    color: colors.mutedForeground,
  },

  // 7-tier List Sizing
  listXxs: {
    gap: '0.25rem',
    fontSize: '0.6875rem',
  },
  listXs: {
    gap: '0.375rem',
    fontSize: '0.75rem',
  },
  sm: {
    gap: '0.375rem',
    fontSize: '0.8125rem',
  },
  md: {
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  lg: {
    gap: '0.625rem',
    fontSize: '0.9375rem',
  },
  xl: {
    gap: '0.75rem',
    fontSize: '1rem',
  },
  xxl: {
    gap: '0.875rem',
    fontSize: '1.125rem',
  },

  item: {
    display: 'inline-flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },

  link: {
    color: colors.mutedForeground,
    textDecoration: 'none',
    cursor: 'pointer',
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: colors.foreground,
    },
  },

  page: {
    color: colors.foreground,
    fontWeight: 500,
  },

  separator: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    color: colors.mutedForeground,
    userSelect: 'none',
  },

  // 7-tier Icon Sizing
  iconXxs: {
    width: '0.75rem',
    height: '0.75rem',
  },
  iconXs: {
    width: '0.75rem',
    height: '0.75rem',
  },
  iconSm: {
    width: '0.875rem',
    height: '0.875rem',
  },
  iconMd: {
    width: '0.875rem',
    height: '0.875rem',
  },
  iconLg: {
    width: '1rem',
    height: '1rem',
  },
  iconXl: {
    width: '1.125rem',
    height: '1.125rem',
  },
  iconXxl: {
    width: '1.25rem',
    height: '1.25rem',
  },

  ellipsis: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
  },
});

const listSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.listXxs,
  xs: styles.listXs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
  xxl: styles.xxl,
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

const BreadcrumbContext = React.createContext<{ size: ComponentSize }>({ size: 'md' });

export interface BreadcrumbProps extends React.ComponentProps<'nav'> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function Breadcrumb({ size = 'md', className, sx, ...props }: BreadcrumbProps) {
  return (
    <BreadcrumbContext.Provider value={{ size }}>
      <nav aria-label="breadcrumb" data-slot="breadcrumb" className={className} {...props} />
    </BreadcrumbContext.Provider>
  );
}

export interface BreadcrumbListProps extends React.ComponentProps<'ol'> {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function BreadcrumbList({ size: propSize, className, sx, ...props }: BreadcrumbListProps) {
  const context = React.useContext(BreadcrumbContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const sizeStyle = listSizeStyles[resolvedSize] ?? styles.md;
  const sxProps = stylex.props(styles.list, sizeStyle, sx);

  return (
    <ol
      data-slot="breadcrumb-list"
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface BreadcrumbItemProps extends React.ComponentProps<'li'> {
  sx?: stylex.StyleXStyles;
}

function BreadcrumbItem({ className, sx, ...props }: BreadcrumbItemProps) {
  const sxProps = stylex.props(styles.item, sx);
  return (
    <li
      data-slot="breadcrumb-item"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface BreadcrumbLinkProps extends React.ComponentProps<'a'> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function BreadcrumbLink({ asChild, className, sx, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : 'a';
  const sxProps = stylex.props(styles.link, sx);

  return (
    <Comp
      data-slot="breadcrumb-link"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface BreadcrumbPageProps extends React.ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function BreadcrumbPage({ className, sx, ...props }: BreadcrumbPageProps) {
  const sxProps = stylex.props(styles.page, sx);
  return (
    <Text
      as="span"
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface BreadcrumbSeparatorProps extends React.ComponentProps<'li'> {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function BreadcrumbSeparator({
  size: propSize,
  children,
  className,
  sx,
  ...props
}: BreadcrumbSeparatorProps) {
  const context = React.useContext(BreadcrumbContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const iconSize = iconSizeStyles[resolvedSize] ?? styles.iconMd;
  const sxProps = stylex.props(styles.separator, sx);

  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children ?? <ChevronRight {...stylex.props(iconSize)} />}
    </li>
  );
}

export interface BreadcrumbEllipsisProps extends React.ComponentProps<'span'> {
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function BreadcrumbEllipsis({ size: propSize, className, sx, ...props }: BreadcrumbEllipsisProps) {
  const context = React.useContext(BreadcrumbContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const iconSize = iconSizeStyles[resolvedSize] ?? styles.iconMd;
  const sxProps = stylex.props(styles.ellipsis, sx);

  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <MoreHorizontal {...stylex.props(iconSize)} />
      <Text as="span" className="sr-only">
        More
      </Text>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
