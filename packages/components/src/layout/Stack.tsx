import type { ComponentProps } from 'react';
import {
  Stack as AstryxStack,
  HStack as AstryxHStack,
  VStack as AstryxVStack,
  StackItem as AstryxStackItem,
} from '@astryxdesign/core';
import type * as stylex from '@stylexjs/stylex';

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

export function Stack({ gap, sx, className, children, ...props }: StackProps) {
  const resolvedGap = resolveStackGap(gap);
  return (
    <AstryxStack gap={resolvedGap} xstyle={sx} className={className} {...props}>
      {children}
    </AstryxStack>
  );
}

export interface HStackProps extends Omit<ComponentProps<typeof AstryxHStack>, 'gap' | 'xstyle'> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export function HStack({ gap, sx, className, children, ...props }: HStackProps) {
  const resolvedGap = resolveStackGap(gap);
  return (
    <AstryxHStack gap={resolvedGap} xstyle={sx} className={className} {...props}>
      {children}
    </AstryxHStack>
  );
}

export interface VStackProps extends Omit<ComponentProps<typeof AstryxVStack>, 'gap' | 'xstyle'> {
  gap?: StackGap;
  sx?: stylex.StyleXStyles;
}

export function VStack({ gap, sx, className, children, ...props }: VStackProps) {
  const resolvedGap = resolveStackGap(gap);
  return (
    <AstryxVStack gap={resolvedGap} xstyle={sx} className={className} {...props}>
      {children}
    </AstryxVStack>
  );
}

export interface StackItemProps extends Omit<ComponentProps<typeof AstryxStackItem>, 'xstyle'> {
  sx?: stylex.StyleXStyles;
}

export function StackItem({ sx, className, children, ...props }: StackItemProps) {
  return (
    <AstryxStackItem xstyle={sx} className={className} {...props}>
      {children}
    </AstryxStackItem>
  );
}
