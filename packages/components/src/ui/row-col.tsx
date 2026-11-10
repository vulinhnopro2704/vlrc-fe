import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { resolveSpacing, isComponentSize, type SpacingValue } from '../theme';
import { useBreakpoint, getHighestBreakpoint, type Breakpoint } from './useBreakpoint';

// ============================================================================
// Types
// ============================================================================

export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch' | 'start' | 'center' | 'end';

export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

export type GutterTuple = readonly [SpacingValue, SpacingValue];

export type ResponsiveGutter = Partial<Record<Breakpoint, SpacingValue | GutterTuple>>;

export type RowGutter = SpacingValue | GutterTuple | ResponsiveGutter;

export interface RowContextType {
  gutter: [string, string];
}

export const RowContext = React.createContext<RowContextType>({
  gutter: ['0px', '0px'],
});

export function useRowContext(): RowContextType {
  return React.useContext(RowContext);
}

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Grid gutter spacing.
   * Accepts standard 7-tier scale ('xxs'..'xxl'), number (in px), string ('1rem'),
   * tuple `[horizontal, vertical]`, or responsive breakpoint mapping object `{ xs: 8, sm: 16, md: 24 }`.
   */
  gutter?: RowGutter;
  /**
   * Vertical alignment of columns in the row.
   * @default 'top'
   */
  align?: RowAlign;
  /**
   * Horizontal layout distribution along the main axis.
   * @default 'start'
   */
  justify?: RowJustify;
  /**
   * Whether grid columns wrap onto multiple lines.
   * @default true
   */
  wrap?: boolean;
  /**
   * Change the underlying DOM element by delegating to its child component (via Radix Slot).
   */
  asChild?: boolean;
  /**
   * Custom underlying HTML tag (e.g. 'ul', 'section', 'nav').
   * @default 'div'
   */
  as?: React.ElementType;
  /**
   * Meta StyleX custom override styles.
   */
  sx?: stylex.StyleXStyles;
}

export type ColSpanType = number | 'auto';

export interface ColResponsiveConfig {
  span?: ColSpanType;
  offset?: number;
  order?: number;
  pull?: number;
  push?: number;
  flex?: React.CSSProperties['flex'];
}

export type ColBreakpointProp = ColSpanType | ColResponsiveConfig;

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns to span (0 to 24, or 'auto').
   * 0 sets display to 'none'.
   */
  span?: ColSpanType;
  /**
   * Number of column cells to offset from the left (0 to 23).
   */
  offset?: number;
  /**
   * Flex order of the column.
   */
  order?: number;
  /**
   * Number of column cells to move to the left (relative positioning).
   */
  pull?: number;
  /**
   * Number of column cells to move to the right (relative positioning).
   */
  push?: number;
  /**
   * Flex layout property for custom flex item sizing.
   */
  flex?: React.CSSProperties['flex'];
  /**
   * Extra small screen (< 576px) breakpoint config.
   */
  xs?: ColBreakpointProp;
  /**
   * Small screen (>= 576px) breakpoint config.
   */
  sm?: ColBreakpointProp;
  /**
   * Medium screen (>= 768px) breakpoint config.
   */
  md?: ColBreakpointProp;
  /**
   * Large screen (>= 992px) breakpoint config.
   */
  lg?: ColBreakpointProp;
  /**
   * Extra large screen (>= 1200px) breakpoint config.
   */
  xl?: ColBreakpointProp;
  /**
   * Double extra large screen (>= 1600px) breakpoint config.
   */
  xxl?: ColBreakpointProp;
  /**
   * Change the underlying DOM element by delegating to its child component (via Radix Slot).
   */
  asChild?: boolean;
  /**
   * Custom underlying HTML tag (e.g. 'li', 'article', 'div').
   * @default 'div'
   */
  as?: React.ElementType;
  /**
   * Meta StyleX custom override styles.
   */
  sx?: stylex.StyleXStyles;
}

// ============================================================================
// StyleX Static Styles
// ============================================================================

const styles = stylex.create({
  // Row
  rowBase: {
    display: 'flex',
    boxSizing: 'border-box',
    marginLeft: 'calc(var(--gutter-x, 0px) / -2)',
    marginRight: 'calc(var(--gutter-x, 0px) / -2)',
    rowGap: 'var(--gutter-y, 0px)',
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
  rowNoWrap: {
    flexWrap: 'nowrap',
  },

  // Row Align
  alignTop: { alignItems: 'flex-start' },
  alignMiddle: { alignItems: 'center' },
  alignBottom: { alignItems: 'flex-end' },
  alignStretch: { alignItems: 'stretch' },

  // Row Justify
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyAround: { justifyContent: 'space-around' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyEvenly: { justifyContent: 'space-evenly' },

  // Col
  colBase: {
    position: 'relative',
    maxWidth: '100%',
    minHeight: 1,
    boxSizing: 'border-box',
    paddingLeft: 'calc(var(--gutter-x, 0px) / 2)',
    paddingRight: 'calc(var(--gutter-x, 0px) / 2)',
  },
  colAuto: {
    flex: '1 1 auto',
    maxWidth: '100%',
  },
  col0: { display: 'none' },

  // Spans 1-24
  col1: { flex: '0 0 4.166667%', maxWidth: '4.166667%' },
  col2: { flex: '0 0 8.333333%', maxWidth: '8.333333%' },
  col3: { flex: '0 0 12.5%', maxWidth: '12.5%' },
  col4: { flex: '0 0 16.666667%', maxWidth: '16.666667%' },
  col5: { flex: '0 0 20.833333%', maxWidth: '20.833333%' },
  col6: { flex: '0 0 25%', maxWidth: '25%' },
  col7: { flex: '0 0 29.166667%', maxWidth: '29.166667%' },
  col8: { flex: '0 0 33.333333%', maxWidth: '33.333333%' },
  col9: { flex: '0 0 37.5%', maxWidth: '37.5%' },
  col10: { flex: '0 0 41.666667%', maxWidth: '41.666667%' },
  col11: { flex: '0 0 45.833333%', maxWidth: '45.833333%' },
  col12: { flex: '0 0 50%', maxWidth: '50%' },
  col13: { flex: '0 0 54.166667%', maxWidth: '54.166667%' },
  col14: { flex: '0 0 58.333333%', maxWidth: '58.333333%' },
  col15: { flex: '0 0 62.5%', maxWidth: '62.5%' },
  col16: { flex: '0 0 66.666667%', maxWidth: '66.666667%' },
  col17: { flex: '0 0 70.833333%', maxWidth: '70.833333%' },
  col18: { flex: '0 0 75%', maxWidth: '75%' },
  col19: { flex: '0 0 79.166667%', maxWidth: '79.166667%' },
  col20: { flex: '0 0 83.333333%', maxWidth: '83.333333%' },
  col21: { flex: '0 0 87.5%', maxWidth: '87.5%' },
  col22: { flex: '0 0 91.666667%', maxWidth: '91.666667%' },
  col23: { flex: '0 0 95.833333%', maxWidth: '95.833333%' },
  col24: { flex: '0 0 100%', maxWidth: '100%' },

  // Offsets 1-23
  offset1: { marginLeft: '4.166667%' },
  offset2: { marginLeft: '8.333333%' },
  offset3: { marginLeft: '12.5%' },
  offset4: { marginLeft: '16.666667%' },
  offset5: { marginLeft: '20.833333%' },
  offset6: { marginLeft: '25%' },
  offset7: { marginLeft: '29.166667%' },
  offset8: { marginLeft: '33.333333%' },
  offset9: { marginLeft: '37.5%' },
  offset10: { marginLeft: '41.666667%' },
  offset11: { marginLeft: '45.833333%' },
  offset12: { marginLeft: '50%' },
  offset13: { marginLeft: '54.166667%' },
  offset14: { marginLeft: '58.333333%' },
  offset15: { marginLeft: '62.5%' },
  offset16: { marginLeft: '66.666667%' },
  offset17: { marginLeft: '70.833333%' },
  offset18: { marginLeft: '75%' },
  offset19: { marginLeft: '79.166667%' },
  offset20: { marginLeft: '83.333333%' },
  offset21: { marginLeft: '87.5%' },
  offset22: { marginLeft: '91.666667%' },
  offset23: { marginLeft: '95.833333%' },
});

const rowAlignStyles: Record<RowAlign, stylex.StyleXStyles> = {
  top: styles.alignTop,
  start: styles.alignTop,
  middle: styles.alignMiddle,
  center: styles.alignMiddle,
  bottom: styles.alignBottom,
  end: styles.alignBottom,
  stretch: styles.alignStretch,
};

const rowJustifyStyles: Record<RowJustify, stylex.StyleXStyles> = {
  start: styles.justifyStart,
  end: styles.justifyEnd,
  center: styles.justifyCenter,
  'space-around': styles.justifyAround,
  'space-between': styles.justifyBetween,
  'space-evenly': styles.justifyEvenly,
};

const colSpanStyles: Record<number, stylex.StyleXStyles> = {
  0: styles.col0,
  1: styles.col1,
  2: styles.col2,
  3: styles.col3,
  4: styles.col4,
  5: styles.col5,
  6: styles.col6,
  7: styles.col7,
  8: styles.col8,
  9: styles.col9,
  10: styles.col10,
  11: styles.col11,
  12: styles.col12,
  13: styles.col13,
  14: styles.col14,
  15: styles.col15,
  16: styles.col16,
  17: styles.col17,
  18: styles.col18,
  19: styles.col19,
  20: styles.col20,
  21: styles.col21,
  22: styles.col22,
  23: styles.col23,
  24: styles.col24,
};

const colOffsetStyles: Record<number, stylex.StyleXStyles> = {
  1: styles.offset1,
  2: styles.offset2,
  3: styles.offset3,
  4: styles.offset4,
  5: styles.offset5,
  6: styles.offset6,
  7: styles.offset7,
  8: styles.offset8,
  9: styles.offset9,
  10: styles.offset10,
  11: styles.offset11,
  12: styles.offset12,
  13: styles.offset13,
  14: styles.offset14,
  15: styles.offset15,
  16: styles.offset16,
  17: styles.offset17,
  18: styles.offset18,
  19: styles.offset19,
  20: styles.offset20,
  21: styles.offset21,
  22: styles.offset22,
  23: styles.offset23,
};

// ============================================================================
// Gutter Helper
// ============================================================================

function parseGutterPair(val?: SpacingValue | GutterTuple): [string, string] {
  if (val === undefined || val === null) {
    return ['0px', '0px'];
  }
  if (Array.isArray(val)) {
    const h = resolveSpacing(val[0]) || '0px';
    const v = resolveSpacing(val[1]) || '0px';
    return [h, v];
  }
  const s = resolveSpacing(val as SpacingValue) || '0px';
  return [s, '0px'];
}

function resolveRowGutter(
  gutter?: RowGutter,
  screens?: Record<Breakpoint, boolean>,
): [string, string] {
  if (!gutter) {
    return ['0px', '0px'];
  }
  // If gutter is responsive map object (not array)
  if (typeof gutter === 'object' && !Array.isArray(gutter) && !isComponentSize(gutter)) {
    if (!screens) {
      return ['0px', '0px'];
    }
    const currentBp = getHighestBreakpoint(screens);
    // Find active or lower matched breakpoint
    const breakpoints: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const startIndex = breakpoints.indexOf(currentBp);
    for (let i = startIndex; i < breakpoints.length; i++) {
      const bp = breakpoints[i];
      if ((gutter as ResponsiveGutter)[bp] !== undefined) {
        return parseGutterPair((gutter as ResponsiveGutter)[bp]);
      }
    }
    return ['0px', '0px'];
  }

  return parseGutterPair(gutter as SpacingValue | GutterTuple);
}

// ============================================================================
// Row Component
// ============================================================================

export const Row = React.forwardRef<HTMLDivElement, RowProps>(function Row(
  {
    gutter = 0,
    align = 'top',
    justify = 'start',
    wrap = true,
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
  const screens = useBreakpoint();
  const [gutterX, gutterY] = React.useMemo(
    () => resolveRowGutter(gutter, screens),
    [gutter, screens],
  );

  const sxProps = stylex.props(
    styles.rowBase,
    wrap ? styles.rowWrap : styles.rowNoWrap,
    align ? rowAlignStyles[align] : undefined,
    justify ? rowJustifyStyles[justify] : undefined,
    sx,
  );

  const mergedClassName = className
    ? `${sxProps.className || ''} ${className}`.trim()
    : sxProps.className;

  const dynamicStyle: React.CSSProperties & Record<`--${string}`, string | number | undefined> = {
    ...sxProps.style,
    ...style,
    '--gutter-x': gutterX,
    '--gutter-y': gutterY,
  };

  const contextValue = React.useMemo<RowContextType>(
    () => ({ gutter: [gutterX, gutterY] }),
    [gutterX, gutterY],
  );

  const Comp = asChild ? Slot : as;

  return (
    <RowContext.Provider value={contextValue}>
      <Comp
        ref={ref as any}
        data-slot="row"
        data-align={align}
        data-justify={justify}
        {...sxProps}
        style={dynamicStyle}
        className={mergedClassName}
        {...props}
      >
        {children}
      </Comp>
    </RowContext.Provider>
  );
});

Row.displayName = 'Row';

// ============================================================================
// Col Component
// ============================================================================

export const Col = React.forwardRef<HTMLDivElement, ColProps>(function Col(
  {
    span,
    offset,
    order,
    pull,
    push,
    flex,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
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
  const screens = useBreakpoint();

  // Resolve responsive configuration based on active breakpoint
  const responsiveConfig = React.useMemo<ColResponsiveConfig>(() => {
    const breakpoints: Array<{ bp: Breakpoint; val?: ColBreakpointProp }> = [
      { bp: 'xxl', val: xxl },
      { bp: 'xl', val: xl },
      { bp: 'lg', val: lg },
      { bp: 'md', val: md },
      { bp: 'sm', val: sm },
      { bp: 'xs', val: xs },
    ];

    for (const { bp, val } of breakpoints) {
      if (screens[bp] && val !== undefined) {
        if (typeof val === 'number' || val === 'auto') {
          return { span: val };
        }
        return val;
      }
    }
    return {};
  }, [screens, xs, sm, md, lg, xl, xxl]);

  const activeSpan = responsiveConfig.span ?? span;
  const activeOffset = responsiveConfig.offset ?? offset;
  const activeOrder = responsiveConfig.order ?? order;
  const activePull = responsiveConfig.pull ?? pull;
  const activePush = responsiveConfig.push ?? push;
  const activeFlex = responsiveConfig.flex ?? flex;

  // Determine span style
  let spanStyle: stylex.StyleXStyles | undefined;
  if (activeSpan === 'auto') {
    spanStyle = styles.colAuto;
  } else if (typeof activeSpan === 'number' && activeSpan >= 0 && activeSpan <= 24) {
    spanStyle = colSpanStyles[activeSpan];
  }

  // Determine offset style
  let offsetStyle: stylex.StyleXStyles | undefined;
  if (typeof activeOffset === 'number' && activeOffset >= 1 && activeOffset <= 23) {
    offsetStyle = colOffsetStyles[activeOffset];
  }

  const sxProps = stylex.props(styles.colBase, spanStyle, offsetStyle, sx);

  const mergedClassName = className
    ? `${sxProps.className || ''} ${className}`.trim()
    : sxProps.className;

  const dynamicStyle: React.CSSProperties = { ...sxProps.style, ...style };

  if (activeFlex !== undefined) {
    dynamicStyle.flex = activeFlex;
  }

  if (activeOrder !== undefined) {
    dynamicStyle.order = activeOrder;
  }

  if (activePush !== undefined && activePush > 0) {
    dynamicStyle.left = `${(activePush / 24) * 100}%`;
  }

  if (activePull !== undefined && activePull > 0) {
    dynamicStyle.right = `${(activePull / 24) * 100}%`;
  }

  const Comp = asChild ? Slot : as;

  return (
    <Comp
      ref={ref as any}
      data-slot="col"
      data-span={activeSpan}
      data-offset={activeOffset}
      {...sxProps}
      style={dynamicStyle}
      className={mergedClassName}
      {...props}
    >
      {children}
    </Comp>
  );
});

Col.displayName = 'Col';

/** Alias for Col */
export const Column = Col;
