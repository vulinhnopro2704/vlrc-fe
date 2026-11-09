import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { Flex, type FlexProps } from './flex';
import { useBreakpoint, type Breakpoint, BREAKPOINTS } from './useBreakpoint';

const styles = stylex.create({
  root: {
    width: '100%',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
});

export type ResponsiveColumns = Partial<Record<Breakpoint, number>> & {
  default?: number;
};

export interface MasonryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  columns?: number | ResponsiveColumns;
  gap?: FlexProps['gap'];
  children: React.ReactNode;
  sx?: stylex.StyleXStyles;
}

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ columns = 3, gap = 'md', children, sx, className, ...props }, ref) => {
    const screens = useBreakpoint();

    const columnCount = React.useMemo(() => {
      if (typeof columns === 'number') {
        return Math.max(1, columns);
      }

      // Check breakpoints in descending order: xxl -> xl -> lg -> md -> sm -> xs
      for (let i = BREAKPOINTS.length - 1; i >= 0; i--) {
        const bp = BREAKPOINTS[i];
        if (screens[bp] && columns[bp] !== undefined) {
          return Math.max(1, columns[bp]!);
        }
      }

      return Math.max(1, columns.default ?? 1);
    }, [columns, screens]);

    // Partition children into column buckets
    const childArray = React.Children.toArray(children).filter(Boolean);

    const columnBuckets = React.useMemo(() => {
      const buckets: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);

      childArray.forEach((child, index) => {
        buckets[index % columnCount].push(child);
      });

      return buckets;
    }, [childArray, columnCount]);

    return (
      <Flex
        ref={ref}
        gap={gap}
        data-slot="masonry"
        data-columns={columnCount}
        sx={[styles.root, sx]}
        className={className}
        {...props}
      >
        {columnBuckets.map((bucketItems, colIndex) => (
          <Flex
            key={colIndex}
            vertical
            gap={gap}
            data-slot="masonry-column"
            data-column-index={colIndex}
            sx={[styles.column]}
          >
            {bucketItems}
          </Flex>
        ))}
      </Flex>
    );
  },
);

Masonry.displayName = 'Masonry';
