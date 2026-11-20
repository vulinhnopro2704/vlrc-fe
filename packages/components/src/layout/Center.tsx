import type { ComponentProps } from 'react';
import { Center as AstryxCenter } from '@astryxdesign/core';
import type * as stylex from '@stylexjs/stylex';

export type CenterAxis = 'both' | 'horizontal' | 'vertical';

export interface CenterProps extends Omit<ComponentProps<typeof AstryxCenter>, 'xstyle'> {
  sx?: stylex.StyleXStyles;
}

export function Center({ sx, className, children, ...props }: CenterProps) {
  return (
    <AstryxCenter xstyle={sx} className={className} {...props}>
      {children}
    </AstryxCenter>
  );
}
