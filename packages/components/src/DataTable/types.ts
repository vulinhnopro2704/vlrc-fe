import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type DataTableMode = 'client' | 'server';

export type DataTableQuery = {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
};

export type DataTableEmptyConfig = {
  render: () => ReactNode;
};

export type DataTableActionItem<TData> = {
  id: string;
  label: string;
  disabled: boolean;
  onSelect: (row: Row<TData>) => void;
};

export type DataTableActionsConfig<TData> = {
  getRowActions: (row: Row<TData>) => DataTableActionItem<TData>[];
};

export type DataTableSearchConfig = {
  placeholder: string;
  debounceMs: number;
};

export type DataTablePaginationConfig = {
  pageSizeOptions: number[];
};

export type DataTableInfiniteScrollConfig = {
  enabled: boolean;
  thresholdPx: number;
  onEndReached: (query: DataTableQuery) => void;
};

export type DataTableApiConfig = {
  mode: DataTableMode;
  isFetching: boolean;
  totalRows: number;
  onQueryChange: (query: DataTableQuery) => void;
};

export type DataTableExpandConfig<TData> = {
  enabled: boolean;
  renderSubComponent: (row: Row<TData>) => ReactNode;
  getSubRows: (row: TData) => TData[];
};

export type DataTableInitialState = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
  expanded: ExpandedState;
};
export type DataTableValue = string | number | boolean | null | undefined | Date | object;

export type DataTableProps<TData> = {
  /** The data array rendered by the table. */
  data: TData[];
  /** Column definitions conforming to TanStack Table specifications. */
  columns: ColumnDef<TData, DataTableValue>[];
  /** Optional initial state for sorting, filters, pagination, or column visibility. */
  initialState?: DataTableInitialState;
  /** Custom empty state renderer when no records match. */
  empty?: DataTableEmptyConfig;
  /** Global search configuration with debounced search input. */
  search?: DataTableSearchConfig;
  /** Pagination configuration including page size options. */
  pagination?: DataTablePaginationConfig;
  /** Row action menu configuration. */
  actions?: DataTableActionsConfig<TData>;
  /** Server-side API coordination config for remote sorting, paging, and filtering. */
  api?: DataTableApiConfig;
  /** Infinite scroll configuration for virtualized or stream-loaded tables. */
  infiniteScroll?: DataTableInfiniteScrollConfig;
  /** Row expander configuration for nested rows or sub-components. */
  expand?: DataTableExpandConfig<TData>;
  /** Optional CSS class for the table container. */
  className?: string;
  /** Optional CSS class for the outer wrapper. */
  containerClassName?: string;
  /** Custom row id generator function. */
  getRowId?: (originalRow: TData, index: number, parent: Row<TData> | null) => string;
  /** Custom action buttons or widgets rendered on the right side of the toolbar. */
  renderToolbarRight?: (table: Table<TData>) => ReactNode;
};
