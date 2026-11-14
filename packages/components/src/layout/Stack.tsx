import * as React from 'react';
import {
  Stack as AstryxStack,
  HStack as AstryxHStack,
  VStack as AstryxVStack,
  StackItem as AstryxStackItem,
} from '@astryxdesign/core';
import type * as stylex from '@stylexjs/stylex';
import { cn } from '../utils';

export type AstryxSpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10;
export type SpacingTier = '0' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type StackGap = AstryxSpacingStep | SpacingTier;

const TIER_TO_STEP_MAP: Record<SpacingTier, AstryxSpacingStep> = {
  '0': 0,
  xxs: 1,
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
  xxl: 10,
};

function resolveStackGap(gap: StackGap | undefined): AstryxSpacingStep | undefined {
  if (gap === undefined) return undefined;
  if (typeof gap === 'number') return gap as AstryxSpacingStep;
  return TIER_TO_STEP_MAP[gap] ?? 4;
}

export interface StackProps extends Omit<
  React.ComponentProps<typeof AstryxStack>,
  'gap' | 'xstyle'
> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  ({ gap, sx, className, children, ...props }, ref) => {
    const resolvedGap = resolveStackGap(gap);
    return (
      <AstryxStack ref={ref} gap={resolvedGap} xstyle={sx} className={cn(className)} {...props}>
        {children}
      </AstryxStack>
    );
  },
);

Stack.displayName = 'Stack';

export interface HStackProps extends Omit<
  React.ComponentProps<typeof AstryxHStack>,
  'gap' | 'xstyle'
> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export const HStack = React.forwardRef<HTMLElement, HStackProps>(
  ({ gap, sx, className, children, ...props }, ref) => {
    const resolvedGap = resolveStackGap(gap);
    return (
      <AstryxHStack ref={ref} gap={resolvedGap} xstyle={sx} className={cn(className)} {...props}>
        {children}
      </AstryxHStack>
    );
  },
);

HStack.displayName = 'HStack';

export interface VStackProps extends Omit<
  React.ComponentProps<typeof AstryxVStack>,
  'gap' | 'xstyle'
> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export const VStack = React.forwardRef<HTMLElement, VStackProps>(
  ({ gap, sx, className, children, ...props }, ref) => {
    const resolvedGap = resolveStackGap(gap);
    return (
      <AstryxVStack ref={ref} gap={resolvedGap} xstyle={sx} className={cn(className)} {...props}>
        {children}
      </AstryxVStack>
    );
  },
);

VStack.displayName = 'VStack';

export interface StackItemProps extends Omit<
  React.ComponentProps<typeof AstryxStackItem>,
  'xstyle'
> {
  sx?: stylex.StyleXStyles;
}

export const StackItem = React.forwardRef<HTMLElement, StackItemProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <AstryxStackItem ref={ref} xstyle={sx} className={cn(className)} {...props}>
        {children}
      </AstryxStackItem>
    );
  },
);

StackItem.displayName = 'StackItem';
