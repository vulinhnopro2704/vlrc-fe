/**
 * Universal 7-tier sizing scale for VLRC Design System.
 * - xxs: Double Extra Small
 * - xs: Extra Small
 * - sm: Small
 * - md: Medium (Design System Default)
 * - lg: Large
 * - xl: Extra Large
 * - xxl: Double Extra Large
 */
export type ComponentSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const COMPONENT_SIZES = [
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
] as const satisfies readonly ComponentSize[];

export type ComponentSizeOrLegacy = ComponentSize | 'default' | '2xl';

export const DEFAULT_COMPONENT_SIZE: ComponentSize = 'md';
