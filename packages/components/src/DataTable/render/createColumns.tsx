import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ColumnDef, Row } from '@tanstack/react-table';

import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';

import { DataTableRowActions } from '../components/DataTableRowActions';
import type { DataTableValue } from '../types';

export const createSelectionColumn = <TData,>(): ColumnDef<TData, DataTableValue> => ({
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
      }
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label='Select all'
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(!!value)}
      aria-label='Select row'
    />
  ),
  enableSorting: false,
  enableHiding: false
});

export const createExpanderColumn = <TData,>(): ColumnDef<TData, DataTableValue> => ({
  id: 'expand',
  enableSorting: false,
  enableHiding: false,
  header: () => null,
  cell: ({ row }) => <ExpanderCell row={row} />
});

const ExpanderCell = <TData,>({ row }: { row: Row<TData> }) => {
  if (row.getCanExpand()) {
    return (
      <Button
        variant='ghost'
        size='icon-sm'
        onClick={() => row.toggleExpanded()}>
        <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Toggle</span>
        {row.getIsExpanded() ? <ChevronDown style={{ width: 16, height: 16 }} /> : <ChevronRight style={{ width: 16, height: 16 }} />}
      </Button>
    );
  }
  return null;
};

export const createRowActionsColumn = <TData,>(): ColumnDef<TData, DataTableValue> => ({
  id: 'actions',
  enableHiding: false,
  header: () => null,
  cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />
});
