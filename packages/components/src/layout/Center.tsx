import * as React from 'react';
import { Center as AstryxCenter } from '@astryxdesign/core';
import type * as stylex from '@stylexjs/stylex';
import { cn } from '../utils';

export type CenterAxis = 'both' | 'horizontal' | 'vertical';

export interface CenterProps extends Omit<React.ComponentProps<typeof AstryxCenter>, 'xstyle'> {
  sx?: stylex.StyleXStyles;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <AstryxCenter ref={ref} xstyle={sx} className={cn(className)} {...props}>
        {children}
      </AstryxCenter>
    );
  },
);

Center.displayName = 'Center';
