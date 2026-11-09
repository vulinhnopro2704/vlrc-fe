import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';
import {
  resolveWidth,
  type ComponentWidth,
  type ComponentSize,
  isComponentSize,
  resolveGap,
  type GapProp,
} from '../theme';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export type FlexAlign =
  | 'start'
  | 'end'
  | 'center'
  | 'baseline'
  | 'stretch'
  | 'flex-start'
  | 'flex-end';

export type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'between'
  | 'around'
  | 'evenly'
  | 'flex-start'
  | 'flex-end'
  | 'stretch';

export type FlexWrap = boolean | 'nowrap' | 'wrap' | 'wrap-reverse';

export type FlexType = 'flex' | 'inline-flex' | 'inline' | 'block';

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Shorthand for vertical flex direction (flex-direction: column).
   * Takes precedence over `direction` when true.
   */
  vertical?: boolean;
  /**
   * Direction of flex container.
   * @default 'row'
   */
  direction?: FlexDirection;
  /**
   * Alignment of items along the cross axis (align-items).
   */
  align?: FlexAlign;
  /**
   * Distribution of space between and around content items along the main axis (justify-content).
   */
  justify?: FlexJustify;
  /**
   * Whether flex items are forced onto one line or can wrap onto multiple lines.
   * Can be boolean (`true` maps to 'wrap', `false` maps to 'nowrap') or explicit CSS flex-wrap string.
   */
  wrap?: FlexWrap;
  /**
   * Gap between items.
   * Accepts standard 7-tier scale ('xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'),
   * a number (in pixels), arbitrary CSS string, or tuple `[rowGap, colGap]`.
   */
  gap?: GapProp;
  /**
   * Display type: flex block or inline-flex.
   * Accepts 'flex', 'inline-flex', 'inline' (maps to inline-flex), or 'block' (maps to flex).
   * @default 'flex'
   */
  type?: FlexType;
  /**
   * Shorthand boolean to display as inline-flex.
   */
  inline?: boolean;
  /**
   * Shorthand for CSS `flex` property (e.g. '1', '1 1 auto', 'none').
   */
  flex?: React.CSSProperties['flex'];
  /**
   * Flex grow factor. Can be boolean (true -> 1, false -> 0) or numeric.
   */
  grow?: boolean | number;
  /**
   * Flex shrink factor. Can be boolean (true -> 1, false -> 0) or numeric.
   */
  shrink?: boolean | number;
  /**
   * Flex basis value.
   */
  basis?: React.CSSProperties['flexBasis'];
  /**
   * Semantic component width preset or custom length.
   */
  width?: ComponentWidth;
  /**
   * Explicit height length or number in pixels.
   */
  height?: number | string;
  /**
   * Change the underlying DOM element by delegating to its child component (via Radix Slot).
   */
  asChild?: boolean;
  /**
   * Underlying HTML tag or React component to render (e.g. 'section', 'nav', 'main').
   * @default 'div'
   */
  as?: React.ElementType;
  /**
   * Meta StyleX custom override styles.
   */
  sx?: stylex.StyleXStyles;
}

const styles = stylex.create({
  base: {
    display: 'flex',
    boxSizing: 'border-box',
  },
  inline: {
    display: 'inline-flex',
  },

  // Direction
  dirRow: { flexDirection: 'row' },
  dirRowReverse: { flexDirection: 'row-reverse' },
  dirCol: { flexDirection: 'column' },
  dirColReverse: { flexDirection: 'column-reverse' },

  // Align
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  alignBaseline: { alignItems: 'baseline' },
  alignStretch: { alignItems: 'stretch' },

  // Justify
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  justifyStretch: { justifyContent: 'stretch' },

  // Wrap
  wrapNowrap: { flexWrap: 'nowrap' },
  wrapWrap: { flexWrap: 'wrap' },
  wrapReverse: { flexWrap: 'wrap-reverse' },

  // Static 7-tier gap scale tokens
  gapXxs: { gap: spacing.xxs },
  gapXs: { gap: spacing.xs },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  gapLg: { gap: spacing.lg },
  gapXl: { gap: spacing.xl },
  gapXxl: { gap: spacing.xxl },
});

const directionStyles: Record<FlexDirection, stylex.StyleXStyles> = {
  row: styles.dirRow,
  'row-reverse': styles.dirRowReverse,
  column: styles.dirCol,
  'column-reverse': styles.dirColReverse,
};

const alignStyles: Record<string, stylex.StyleXStyles> = {
  start: styles.alignStart,
  'flex-start': styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  'flex-end': styles.alignEnd,
  baseline: styles.alignBaseline,
  stretch: styles.alignStretch,
};

const justifyStyles: Record<string, stylex.StyleXStyles> = {
  start: styles.justifyStart,
  'flex-start': styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  'flex-end': styles.justifyEnd,
  'space-between': styles.justifyBetween,
  between: styles.justifyBetween,
  'space-around': styles.justifyAround,
  around: styles.justifyAround,
  'space-evenly': styles.justifyEvenly,
  evenly: styles.justifyEvenly,
  stretch: styles.justifyStretch,
};

const wrapStyles: Record<string, stylex.StyleXStyles> = {
  nowrap: styles.wrapNowrap,
  wrap: styles.wrapWrap,
  'wrap-reverse': styles.wrapReverse,
};

const gapTierStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.gapXxs,
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  xxl: styles.gapXxl,
};

export const Flex = React.forwardRef<HTMLElement, FlexProps>(function Flex(
  {
    vertical,
    direction = 'row',
    align,
    justify,
    wrap,
    gap,
    type = 'flex',
    inline = false,
    flex,
    grow,
    shrink,
    basis,
    width,
    height,
    asChild = false,
    as = 'div',
    className,
    style,
    sx,
    children,
    ...props
  },
  ref,
) {
  const isInline = inline || type === 'inline-flex' || type === 'inline';
  const effectiveDirection: FlexDirection = vertical ? 'column' : direction;

  let resolvedWrapKey: string | undefined;
  if (typeof wrap === 'boolean') {
    resolvedWrapKey = wrap ? 'wrap' : 'nowrap';
  } else if (typeof wrap === 'string') {
    resolvedWrapKey = wrap;
  }

  // Check if gap matches static 7-tier scale token for zero-runtime StyleX optimization
  const isStaticTier = isComponentSize(gap);
  const staticGapStyle = isStaticTier ? gapTierStyles[gap] : undefined;

  const sxProps = stylex.props(
    styles.base,
    isInline && styles.inline,
    directionStyles[effectiveDirection],
    align ? alignStyles[align] : undefined,
    justify ? justifyStyles[justify] : undefined,
    resolvedWrapKey ? wrapStyles[resolvedWrapKey] : undefined,
    staticGapStyle,
    sx,
  );

  const mergedClassName = className
    ? `${sxProps.className || ''} ${className}`.trim()
    : sxProps.className;

  // Dynamic style calculation for non-static values
  const dynamicStyle: React.CSSProperties = { ...sxProps.style, ...style };

  if (gap !== undefined && !isStaticTier) {
    dynamicStyle.gap = resolveGap(gap);
  }

  if (flex !== undefined) {
    dynamicStyle.flex = flex;
  }

  if (grow !== undefined) {
    dynamicStyle.flexGrow = typeof grow === 'boolean' ? (grow ? 1 : 0) : grow;
  }

  if (shrink !== undefined) {
    dynamicStyle.flexShrink = typeof shrink === 'boolean' ? (shrink ? 1 : 0) : shrink;
  }

  if (basis !== undefined) {
    dynamicStyle.flexBasis = basis;
  }

  const resolvedW = resolveWidth(width);
  if (resolvedW) {
    dynamicStyle.width = resolvedW;
  }

  if (height !== undefined) {
    dynamicStyle.height = typeof height === 'number' ? `${height}px` : height;
  }

  const Comp = asChild ? Slot : as;

  return (
    <Comp
      ref={ref as any}
      data-slot="flex"
      data-direction={effectiveDirection}
      data-inline={isInline ? 'true' : undefined}
      {...sxProps}
      style={dynamicStyle}
      className={mergedClassName}
      {...props}
    >
      {children}
    </Comp>
  );
});

Flex.displayName = 'Flex';
