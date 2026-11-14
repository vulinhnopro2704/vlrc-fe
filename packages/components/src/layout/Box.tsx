import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';
import { cn } from '../utils';

const styles = stylex.create({
  base: {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  // Spacing shorthands
  p_0: { padding: spacing['0'] },
  p_xxs: { padding: spacing.xxs },
  p_xs: { padding: spacing.xs },
  p_sm: { padding: spacing.sm },
  p_md: { padding: spacing.md },
  p_lg: { padding: spacing.lg },
  p_xl: { padding: spacing.xl },
  p_xxl: { padding: spacing.xxl },

  m_0: { margin: spacing['0'] },
  m_xxs: { margin: spacing.xxs },
  m_xs: { margin: spacing.xs },
  m_sm: { margin: spacing.sm },
  m_md: { margin: spacing.md },
  m_lg: { margin: spacing.lg },
  m_xl: { margin: spacing.xl },
  m_xxl: { margin: spacing.xxl },
  m_auto: { margin: 'auto' },

  mx_auto: { marginInline: 'auto' },
  my_auto: { marginBlock: 'auto' },
});

export type BoxSpacingTier = '0' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface BoxProps<T extends React.ElementType = 'div'> {
  as?: T;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sx?: stylex.StyleXStyles;
  p?: BoxSpacingTier;
  m?: BoxSpacingTier | 'auto';
  mx?: 'auto';
  my?: 'auto';
}

export type PolymorphicBoxProps<T extends React.ElementType> = BoxProps<T> &
  Omit<React.ComponentPropsWithRef<T>, keyof BoxProps<T>>;

export const Box = React.forwardRef(
  <T extends React.ElementType = 'div'>(
    { as, children, className, style, sx, p, m, mx, my, ...props }: PolymorphicBoxProps<T>,
    ref: React.Ref<any>,
  ) => {
    const Component = as || 'div';

    const pStyle = p ? (styles as any)[`p_${p}`] : null;
    const mStyle = m ? (styles as any)[`m_${m}`] : null;
    const mxStyle = mx === 'auto' ? styles.mx_auto : null;
    const myStyle = my === 'auto' ? styles.my_auto : null;

    const stylexProps = stylex.props(styles.base, pStyle, mStyle, mxStyle, myStyle, sx);

    return (
      <Component
        ref={ref}
        data-slot="box"
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
  props: PolymorphicBoxProps<T> & { ref?: React.Ref<any> },
) => React.ReactElement | null;

(Box as any).displayName = 'Box';
