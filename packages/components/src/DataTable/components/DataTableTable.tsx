import { isEmpty, map } from 'lodash-es';
import { Fragment } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  flexRender,
  type ExpandedState,
  type Table,
  type VisibilityState,
} from '@tanstack/react-table';

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

import { colors, spacing } from '../../theme/tokens.stylex';
import type { DataTableEmptyConfig, DataTableExpandConfig } from '../types';

const styles = stylex.create({
  compactHead: {
    backgroundColor: colors.surfaceSubtle,
    height: spacing['9'],
    paddingInline: spacing.sm,
    color: colors.mutedForeground,
    fontWeight: 600,
  },
  compactCell: { paddingBlock: spacing.xs, paddingInline: spacing.sm },
  emptyCell: {
    height: '6rem',
    textAlign: 'center',
  },
  expandCell: {
    padding: 0,
  },
});

export const DataTableTable = <TData,>({
  table,
  columnVisibility,
  expandedState,
  expandConfig,
  empty,
  columnsCount,
  compact,
}: {
  table: Table<TData>;
  columnVisibility: VisibilityState;
  expandedState: ExpandedState;
  expandConfig: DataTableExpandConfig<TData>;
  empty: DataTableEmptyConfig;
  columnsCount: number;
  compact: boolean;
}) => {
  // TanStack keeps the table reference stable while its row models change.
  'use no memo';
  const rows = table.getRowModel().rows;
  void expandedState;

  const renderHeader = () => (
    <TableHeader>
      {map(table.getHeaderGroups(), (headerGroup) => (
        <TableRow key={headerGroup.id}>
          {map(headerGroup.headers, (header) => {
            if (header.isPlaceholder || columnVisibility[header.column.id] === false) {
              return null;
            }
            const headerContent =
              header.column.columnDef.header !== undefined
                ? flexRender(header.column.columnDef.header, header.getContext())
                : header.column.id;

            return (
              <TableHead key={header.id} sx={compact && styles.compactHead}>
                {headerContent}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );

  const renderBody = () => {
    if (isEmpty(rows)) {
      return (
        <TableRow>
          <TableCell colSpan={columnsCount} sx={styles.emptyCell}>
            {empty.render()}
          </TableCell>
        </TableRow>
      );
    }
    return map(rows, (row) => (
      <Fragment key={row.id}>
        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
          {map(row.getVisibleCells(), (cell) => (
            <TableCell key={cell.id} sx={compact && styles.compactCell}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>

        {expandConfig.enabled && row.getIsExpanded() ? (
          <TableRow>
            <TableCell colSpan={columnsCount} sx={styles.expandCell}>
              {expandConfig.renderSubComponent(row)}
            </TableCell>
          </TableRow>
        ) : null}
      </Fragment>
    ));
  };

  return (
    <UITable>
      {renderHeader()}
      <TableBody>{renderBody()}</TableBody>
    </UITable>
  );
};
