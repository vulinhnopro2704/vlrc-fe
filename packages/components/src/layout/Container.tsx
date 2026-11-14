import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';
import { cn } from '../utils';

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

export interface ContainerProps<T extends React.ElementType = 'div'> {
  as?: T;
  size?: ContainerSize;
  gutter?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sx?: stylex.StyleXStyles;
}

export type PolymorphicContainerProps<T extends React.ElementType> = ContainerProps<T> &
  Omit<React.ComponentPropsWithRef<T>, keyof ContainerProps<T>>;

export const Container = React.forwardRef(
  <T extends React.ElementType = 'div'>(
    {
      as,
      size = 'xl',
      gutter = 'md',
      children,
      className,
      style,
      sx,
      ...props
    }: PolymorphicContainerProps<T>,
    ref: React.Ref<any>,
  ) => {
    const Component = as || 'div';

    const sizeStyle =
      size === 'xs'
        ? styles.sizeXs
        : size === 'sm'
          ? styles.sizeSm
          : size === 'md'
            ? styles.sizeMd
            : size === 'lg'
              ? styles.sizeLg
              : size === 'xl'
                ? styles.sizeXl
                : size === '2xl'
                  ? styles.size2Xl
                  : styles.sizeFluid;

    const gutterStyle =
      gutter === 'none'
        ? styles.gutterNone
        : gutter === 'sm'
          ? styles.gutterSm
          : gutter === 'lg'
            ? styles.gutterLg
            : styles.gutterMd;

    const stylexProps = stylex.props(styles.base, sizeStyle, gutterStyle, sx);

    return (
      <Component
        ref={ref}
        data-slot="container"
        data-size={size}
        {...props}
        {...stylexProps}
        style={{ ...stylexProps.style, ...style }}
        className={cn(stylexProps.className, className)}
      >
        {children}
      </Component>
    );
  },
) as <T extends React.ElementType = 'div'>(
  props: PolymorphicContainerProps<T> & { ref?: React.Ref<any> },
) => React.ReactElement | null;

(Container as any).displayName = 'Container';
