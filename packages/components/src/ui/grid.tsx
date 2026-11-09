import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';
import {
  isComponentSize,
  resolveSpacing,
  resolveGap,
  type GapProp,
  type SpacingValue,
  type ComponentSize,
} from '../theme';
import { Row, Col, Column } from './row-col';
import { useBreakpoint, type Breakpoint } from './useBreakpoint';

// ============================================================================
// Types
// ============================================================================

export type GridAutoFlow = 'row' | 'column' | 'row dense' | 'column dense';

export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

export type GridJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch';

export type ResponsiveGridColumns = Partial<Record<Breakpoint, number | string>>;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns or explicit CSS template string.
   * Can also be responsive object: `{ xs: 1, sm: 2, md: 3, lg: 4 }`.
   * e.g. `columns={3}` produces `repeat(3, minmax(0, 1fr))`.
   */
  columns?: number | string | ResponsiveGridColumns;
  /**
   * Number of rows or explicit CSS template string.
   */
  rows?: number | string;
  /**
   * Mantine / Chakra SimpleGrid feature: automatically computes responsive columns
   * using `repeat(auto-fit, minmax(minChildWidth, 1fr))`.
   */
  minChildWidth?: number | string;
  /**
   * Gap between grid cells.
   * Accepts standard 7-tier scale ('xxs'..'xxl'), number (in px), string ('1rem'), or tuple `[rowGap, colGap]`.
   */
  gap?: GapProp;
  /**
   * Row gap specifically.
   */
  rowGap?: SpacingValue;
  /**
   * Column gap specifically.
   */
  columnGap?: SpacingValue;
  /**
   * Grid auto-flow direction.
   */
  autoFlow?: GridAutoFlow;
  /**
   * CSS grid-auto-rows size.
   */
  autoRows?: string;
  /**
   * CSS grid-auto-columns size.
   */
  autoColumns?: string;
  /**
   * Items alignment along the block axis (align-items).
   */
  align?: GridAlign;
  /**
   * Items alignment along the inline axis (justify-content).
   */
  justify?: GridJustify;
  /**
   * Render as inline-grid instead of grid.
   */
  inline?: boolean;
  /**
   * Change the underlying DOM element by delegating to its child component (via Radix Slot).
   */
  asChild?: boolean;
  /**
   * Underlying HTML tag (e.g. 'ul', 'section', 'nav').
   * @default 'div'
   */
  as?: React.ElementType;
  /**
   * Meta StyleX custom override styles.
   */
  sx?: stylex.StyleXStyles;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns this item spans.
   * e.g. `colSpan={2}` produces `grid-column: span 2 / span 2`.
   */
  colSpan?: number | 'auto';
  /**
   * Number of rows this item spans.
   * e.g. `rowSpan={2}` produces `grid-row: span 2 / span 2`.
   */
  rowSpan?: number | 'auto';
  /**
   * Starting column line (grid-column-start).
   */
  colStart?: number | string;
  /**
   * Ending column line (grid-column-end).
   */
  colEnd?: number | string;
  /**
   * Starting row line (grid-row-start).
   */
  rowStart?: number | string;
  /**
   * Ending row line (grid-row-end).
   */
  rowEnd?: number | string;
  /**
   * Named grid area (grid-area).
   */
  area?: string;
  /**
   * Change the underlying DOM element by delegating to its child component (via Radix Slot).
   */
  asChild?: boolean;
  /**
   * Underlying HTML tag (e.g. 'li', 'article', 'div').
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
  base: {
    display: 'grid',
    boxSizing: 'border-box',
  },
  inline: {
    display: 'inline-grid',
  },

  // Align
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  alignStretch: { alignItems: 'stretch' },

  // Justify
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  justifyStretch: { justifyContent: 'stretch' },

  // Flow
  flowRow: { gridAutoFlow: 'row' },
  flowCol: { gridAutoFlow: 'column' },
  flowRowDense: { gridAutoFlow: 'row dense' },
  flowColDense: { gridAutoFlow: 'column dense' },

  // Static 7-tier gap scale tokens
  gapXxs: { gap: spacing.xxs },
  gapXs: { gap: spacing.xs },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  gapLg: { gap: spacing.lg },
  gapXl: { gap: spacing.xl },
  gapXxl: { gap: spacing.xxl },

  // GridItem Base
  itemBase: {
    boxSizing: 'border-box',
    minWidth: 0,
  },
});

const alignStyles: Record<GridAlign, stylex.StyleXStyles> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
};

const justifyStyles: Record<GridJustify, stylex.StyleXStyles> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  'space-between': styles.justifyBetween,
  'space-around': styles.justifyAround,
  'space-evenly': styles.justifyEvenly,
  stretch: styles.justifyStretch,
};

const flowStyles: Record<GridAutoFlow, stylex.StyleXStyles> = {
  row: styles.flowRow,
  column: styles.flowCol,
  'row dense': styles.flowRowDense,
  'column dense': styles.flowColDense,
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

// ============================================================================
// Grid Item Component
// ============================================================================

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(function GridItem(
  {
    colSpan,
    rowSpan,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    area,
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
  const sxProps = stylex.props(styles.itemBase, sx);

  const mergedClassName = className
    ? `${sxProps.className || ''} ${className}`.trim()
    : sxProps.className;

  const dynamicStyle: React.CSSProperties = { ...sxProps.style, ...style };

  if (colSpan !== undefined) {
    dynamicStyle.gridColumn = colSpan === 'auto' ? 'auto' : `span ${colSpan} / span ${colSpan}`;
  }
  if (rowSpan !== undefined) {
    dynamicStyle.gridRow = rowSpan === 'auto' ? 'auto' : `span ${rowSpan} / span ${rowSpan}`;
  }
  if (colStart !== undefined) dynamicStyle.gridColumnStart = colStart;
  if (colEnd !== undefined) dynamicStyle.gridColumnEnd = colEnd;
  if (rowStart !== undefined) dynamicStyle.gridRowStart = rowStart;
  if (rowEnd !== undefined) dynamicStyle.gridRowEnd = rowEnd;
  if (area !== undefined) dynamicStyle.gridArea = area;

  const Comp = asChild ? Slot : as;

  return (
    <Comp
      ref={ref as any}
      data-slot="grid-item"
      {...sxProps}
      style={dynamicStyle}
      className={mergedClassName}
      {...props}
    >
      {children}
    </Comp>
  );
});

GridItem.displayName = 'GridItem';

// ============================================================================
// Grid Component
// ============================================================================

interface GridComponent extends React.ForwardRefExoticComponent<
  GridProps & React.RefAttributes<HTMLDivElement>
> {
  Row: typeof Row;
  Col: typeof Col;
  Column: typeof Column;
  Item: typeof GridItem;
  useBreakpoint: typeof useBreakpoint;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    columns,
    rows,
    minChildWidth,
    gap,
    rowGap,
    columnGap,
    autoFlow,
    autoRows,
    autoColumns,
    align,
    justify,
    inline = false,
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

  // Check static tier gap
  const isStaticTier = isComponentSize(gap);
  const staticGapStyle = isStaticTier ? gapTierStyles[gap] : undefined;

  const sxProps = stylex.props(
    styles.base,
    inline && styles.inline,
    align ? alignStyles[align] : undefined,
    justify ? justifyStyles[justify] : undefined,
    autoFlow ? flowStyles[autoFlow] : undefined,
    staticGapStyle,
    sx,
  );

  const mergedClassName = className
    ? `${sxProps.className || ''} ${className}`.trim()
    : sxProps.className;

  const dynamicStyle: React.CSSProperties = { ...sxProps.style, ...style };

  // Resolve columns
  if (minChildWidth !== undefined) {
    const widthStr = typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth;
    dynamicStyle.gridTemplateColumns = `repeat(auto-fit, minmax(${widthStr}, 1fr))`;
  } else if (columns !== undefined) {
    if (typeof columns === 'number') {
      dynamicStyle.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    } else if (typeof columns === 'string') {
      dynamicStyle.gridTemplateColumns = columns;
    } else if (typeof columns === 'object') {
      // Responsive column mapping
      const breakpoints: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
      let activeCols: number | string | undefined;
      for (const bp of breakpoints) {
        if (screens[bp] && columns[bp] !== undefined) {
          activeCols = columns[bp];
          break;
        }
      }
      if (activeCols !== undefined) {
        dynamicStyle.gridTemplateColumns =
          typeof activeCols === 'number' ? `repeat(${activeCols}, minmax(0, 1fr))` : activeCols;
      }
    }
  }

  // Resolve rows
  if (rows !== undefined) {
    dynamicStyle.gridTemplateRows =
      typeof rows === 'number' ? `repeat(${rows}, minmax(0, 1fr))` : rows;
  }

  // Non-static gap or custom gap
  if (gap !== undefined && !isStaticTier) {
    dynamicStyle.gap = resolveGap(gap);
  }
  if (rowGap !== undefined) {
    dynamicStyle.rowGap = resolveSpacing(rowGap);
  }
  if (columnGap !== undefined) {
    dynamicStyle.columnGap = resolveSpacing(columnGap);
  }
  if (autoRows !== undefined) dynamicStyle.gridAutoRows = autoRows;
  if (autoColumns !== undefined) dynamicStyle.gridAutoColumns = autoColumns;

  const Comp = asChild ? Slot : as;

  return (
    <Comp
      ref={ref as any}
      data-slot="grid"
      {...sxProps}
      style={dynamicStyle}
      className={mergedClassName}
      {...props}
    >
      {children}
    </Comp>
  );
}) as GridComponent;

Grid.displayName = 'Grid';
Grid.Row = Row;
Grid.Col = Col;
Grid.Column = Column;
Grid.Item = GridItem;
Grid.useBreakpoint = useBreakpoint;
