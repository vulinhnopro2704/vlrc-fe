import { noop } from 'lodash-es';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../theme/tokens.stylex';
import type {
  DataTableActionItem,
  DataTableApiConfig,
  DataTableEmptyConfig,
  DataTableInfiniteScrollConfig,
  DataTablePaginationConfig,
  DataTableSearchConfig
} from '../types';

const styles = stylex.create({
  empty: {
    color: colors.mutedForeground,
    paddingBlock: '2rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
});

export const DEFAULT_SEARCH: DataTableSearchConfig = {
  placeholder: 'Search...',
  debounceMs: 300
};

export const DEFAULT_PAGINATION: DataTablePaginationConfig = {
  pageSizeOptions: [10, 20, 50, 100]
};

export const DEFAULT_EMPTY: DataTableEmptyConfig = {
  render: () => <div {...stylex.props(styles.empty)}>No results.</div>
};

export const DEFAULT_API: DataTableApiConfig = {
  mode: 'client',
  isFetching: false,
  totalRows: 0,
  onQueryChange: noop
};

export const DEFAULT_INFINITE_SCROLL: DataTableInfiniteScrollConfig = {
  enabled: false,
  thresholdPx: 200,
  onEndReached: noop
};

export const createDefaultActions = <TData,>(): {
  getRowActions: () => DataTableActionItem<TData>[];
} => ({
  getRowActions: () => []
});
