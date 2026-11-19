import { forwardRef, type ComponentProps } from 'react';
import { Center as AstryxCenter } from '@astryxdesign/core';
import type * as stylex from '@stylexjs/stylex';
import { cn } from '../utils';

export type CenterAxis = 'both' | 'horizontal' | 'vertical';

export interface CenterProps extends Omit<ComponentProps<typeof AstryxCenter>, 'xstyle'> {
  sx?: stylex.StyleXStyles;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <AstryxCenter ref={ref} xstyle={sx} className={cn(className)} {...props}>
        {children}
      </AstryxCenter>
    );
  },
);

Center.displayName = 'Center';
