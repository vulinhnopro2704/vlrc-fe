import { forwardRef, type ComponentProps } from 'react';
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

export interface StackProps extends Omit<ComponentProps<typeof AstryxStack>, 'gap' | 'xstyle'> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
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

export interface HStackProps extends Omit<ComponentProps<typeof AstryxHStack>, 'gap' | 'xstyle'> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export const HStack = forwardRef<HTMLElement, HStackProps>(
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

export interface VStackProps extends Omit<ComponentProps<typeof AstryxVStack>, 'gap' | 'xstyle'> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export const VStack = forwardRef<HTMLElement, VStackProps>(
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

export interface StackItemProps extends Omit<ComponentProps<typeof AstryxStackItem>, 'xstyle'> {
  sx?: stylex.StyleXStyles;
}

export const StackItem = forwardRef<HTMLElement, StackItemProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <AstryxStackItem ref={ref} xstyle={sx} className={cn(className)} {...props}>
        {children}
      </AstryxStackItem>
    );
  },
);

StackItem.displayName = 'StackItem';
