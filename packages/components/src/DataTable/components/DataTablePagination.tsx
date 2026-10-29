import { map } from 'lodash-es';
import type { Table } from '@tanstack/react-table';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../theme/tokens.stylex';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import type { DataTableApiConfig } from '../types';

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    paddingBlock: '1rem',
  },
  selectedInfo: {
    color: colors.mutedForeground,
    flex: '1 1 0%',
    fontSize: '0.875rem',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  pageNumber: {
    fontSize: '0.875rem',
    fontWeight: 500,
    paddingInline: '0.5rem',
    color: colors.foreground,
  },
});

export const DataTablePagination = <TData,>({
  table,
  tableState,
  pageSizeOptions,
  apiConfig
}: {
  table: Table<TData>;
  tableState: Table<TData>['getState'] extends () => infer S ? S : never;
  pageSizeOptions: number[];
  apiConfig: DataTableApiConfig;
}) => {
  const pageIndex = tableState.pagination.pageIndex;
  const pageSize = tableState.pagination.pageSize;

  const totalRows =
    apiConfig.mode === 'server' ? apiConfig.totalRows : table.getFilteredRowModel().rows.length;

  const pageCount = pageSize > 0 ? Math.ceil(totalRows / pageSize) : 0;

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.selectedInfo)}>
        {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s) selected.
      </div>

      <div {...stylex.props(styles.controls)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              Rows: {pageSize}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {map(pageSizeOptions, opt => (
              <DropdownMenuItem
                key={String(opt)}
                onClick={() => table.setPageSize(opt)}
                disabled={opt === pageSize}>
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>

        <span {...stylex.props(styles.pageNumber)}>
          {pageIndex + 1} / {Math.max(1, pageCount)}
        </span>

        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};
