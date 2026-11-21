import { type ComponentProps } from 'react';
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
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    borderRadius: radius.md,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.border,
    transitionProperty: 'color, background-color, border-color, box-shadow',
    transitionDuration: '150ms',
  },
  default: {
    backgroundColor: colors.muted,
    color: colors.foreground,
    boxShadow: shadow.xs,
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.foreground,
    borderBottomWidth: 1,
  },

  // Sizes
  sizeXs: {
    minHeight: '1.25rem',
    minWidth: '1.25rem',
    paddingInline: '0.3125rem',
    paddingBlock: '0.0625rem',
    fontSize: '0.625rem',
    borderRadius: radius.sm,
  },
  sizeSm: {
    minHeight: '1.375rem',
    minWidth: '1.375rem',
    paddingInline: '0.375rem',
    paddingBlock: '0.125rem',
    fontSize: '0.6875rem',
    borderRadius: radius.sm,
  },
  sizeMd: {
    minHeight: '1.625rem',
    minWidth: '1.625rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.125rem',
    fontSize: '0.75rem',
    borderRadius: radius.md,
  },
  sizeLg: {
    minHeight: '1.875rem',
    minWidth: '1.875rem',
    paddingInline: '0.625rem',
    paddingBlock: '0.1875rem',
    fontSize: '0.875rem',
    borderRadius: radius.md,
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

export interface KbdProps extends ComponentProps<'kbd'> {
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

export interface KbdGroupProps extends ComponentProps<'div'> {
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
