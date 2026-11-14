import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';
import { Flex } from './flex';

export type KbdSize = 'xs' | 'sm' | 'md' | 'lg';
export type KbdVariant = 'default' | 'outline';

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    pointerEvents: 'none',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: '150ms',
  },
  default: {
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    boxShadow: shadow.xs,
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.foreground,
  },

  // Sizes
  sizeXs: {
    minHeight: '1.125rem',
    minWidth: '1.125rem',
    paddingInline: '0.25rem',
    paddingBlock: '0.0625rem',
    fontSize: '0.625rem',
  },
  sizeSm: {
    minHeight: '1.25rem',
    minWidth: '1.25rem',
    paddingInline: '0.375rem',
    paddingBlock: '0.125rem',
    fontSize: '0.6875rem',
  },
  sizeMd: {
    minHeight: '1.5rem',
    minWidth: '1.5rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.1875rem',
    fontSize: '0.75rem',
  },
  sizeLg: {
    minHeight: '1.75rem',
    minWidth: '1.75rem',
    paddingInline: '0.625rem',
    paddingBlock: '0.25rem',
    fontSize: '0.875rem',
  },

  group: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
});

const sizeStyles: Record<KbdSize, stylex.StyleXStyles> = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const variantStyles: Record<KbdVariant, stylex.StyleXStyles> = {
  default: styles.default,
  outline: styles.outline,
};

export interface KbdProps extends React.ComponentProps<'kbd'> {
  size?: KbdSize;
  variant?: KbdVariant;
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function Kbd({
  className,
  size = 'sm',
  variant = 'default',
  asChild = false,
  sx,
  ...props
}: KbdProps) {
  const Comp = asChild ? Slot : 'kbd';
  const sizeStyle = size !== 'sm' ? sizeStyles[size] : styles.sizeSm;
  const sxProps = stylex.props(styles.base, variantStyles[variant], sizeStyle, sx);

  return (
    <Comp
      data-slot="kbd"
      data-size={size}
      data-variant={variant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface KbdGroupProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function KbdGroup({ className, asChild = false, sx, children, ...props }: KbdGroupProps) {
  const sxProps = stylex.props(styles.group, sx);
  const mergedClassName = className
    ? `${sxProps.className || ''} ${className}`.trim()
    : sxProps.className;

  return (
    <Flex
      asChild={asChild}
      role="group"
      data-slot="kbd-group"
      align="center"
      className={mergedClassName}
      {...props}
    >
      {children}
    </Flex>
  );
}

export { Kbd, KbdGroup };
