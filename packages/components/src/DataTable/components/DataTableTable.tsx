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

import type { DataTableEmptyConfig, DataTableExpandConfig } from '../types';

const styles = stylex.create({
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
}: {
  table: Table<TData>;
  columnVisibility: VisibilityState;
  expandedState: ExpandedState;
  expandConfig: DataTableExpandConfig<TData>;
  empty: DataTableEmptyConfig;
  columnsCount: number;
}) => {
  const rows = table.getRowModel().rows;
  void expandedState;

  const renderHeader = () => (
    <TableHeader>
      {map(table.getHeaderGroups(), (headerGroup) => (
        <TableRow key={headerGroup.id}>
          {map(headerGroup.headers, (header) => {
            if (
              header.isPlaceholder ||
              columnVisibility[header.column.id] === false ||
              header.column.columnDef.header === undefined
            ) {
              return null;
            }
            return (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
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
            <TableCell key={cell.id}>
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
