import type { CSSProperties, ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid';

const styles = stylex.create({
  base: {
    width: '100%',
    marginInline: 'auto',
    paddingInline: spacing.md,
    boxSizing: 'border-box',
  },
  sizeXs: { maxWidth: '30rem' },
  sizeSm: { maxWidth: '40rem' },
  sizeMd: { maxWidth: '48rem' },
  sizeLg: { maxWidth: '64rem' },
  sizeXl: { maxWidth: '80rem' },
  size2Xl: { maxWidth: '96rem' },
  sizeFluid: { maxWidth: '100%' },

  gutterNone: { paddingInline: 0 },
  gutterSm: { paddingInline: spacing.sm },
  gutterMd: { paddingInline: spacing.md },
  gutterLg: { paddingInline: spacing.lg },
});

const sizeStyles: Record<ContainerSize, stylex.StyleXStyles> = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  '2xl': styles.size2Xl,
  fluid: styles.sizeFluid,
};

const gutterStyles: Record<'none' | 'sm' | 'md' | 'lg', stylex.StyleXStyles> = {
  none: styles.gutterNone,
  sm: styles.gutterSm,
  md: styles.gutterMd,
  lg: styles.gutterLg,
};

export interface ContainerProps<T extends ElementType = 'div'> {
  as?: T;
  size?: ContainerSize;
  gutter?: 'none' | 'sm' | 'md' | 'lg';
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  sx?: stylex.StyleXStyles;
}

export type PolymorphicContainerProps<T extends ElementType = 'div'> = ContainerProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof ContainerProps<T>>;

export function Container<T extends ElementType = 'div'>({
  as,
  size = 'xl',
  gutter = 'md',
  children,
  className,
  style,
  sx,
  ...props
}: PolymorphicContainerProps<T>) {
  const Component = as ?? 'div';
  const sizeStyle = sizeStyles[size] ?? styles.sizeXl;
  const gutterStyle = gutterStyles[gutter] ?? styles.gutterMd;
  const resolvedProps = stylex.props(styles.base, sizeStyle, gutterStyle, sx);

  return (
    <Component
      data-slot="container"
      data-size={size}
      {...props}
      {...resolvedProps}
      style={{ ...resolvedProps.style, ...style }}
      className={
        className ? `${resolvedProps.className || ''} ${className}`.trim() : resolvedProps.className
      }
    >
      {children}
    </Component>
  );
}
