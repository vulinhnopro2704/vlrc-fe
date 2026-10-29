import { debounce, isEmpty } from 'lodash-es';
import { useEffect, useRef, type ReactNode } from 'react';
import type { Table } from '@tanstack/react-table';
import * as stylex from '@stylexjs/stylex';
import { Input } from '../../ui/input';

const styles = stylex.create({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBlock: '1rem',
  },
  searchInput: {
    maxWidth: '24rem',
  },
});

export const DataTableToolbar = <TData,>({
  table,
  placeholder,
  debounceMs,
  right
}: {
  table: Table<TData>;
  placeholder: string;
  debounceMs: number;
  right: ReactNode;
}) => {
  const current = table.getState().globalFilter;
  const currentValue = typeof current === 'string' ? current : '';

  const debouncedSetRef = useRef(
    debounce((value: string) => {
      table.setGlobalFilter(value);
    }, debounceMs)
  );

  useEffect(() => {
    debouncedSetRef.current = debounce((value: string) => {
      table.setGlobalFilter(value);
    }, debounceMs);
    return () => {
      debouncedSetRef.current.cancel();
    };
  }, [table, debounceMs]);

  useEffect(() => {
    return () => {
      debouncedSetRef.current.cancel();
    };
  }, []);

  return (
    <div {...stylex.props(styles.toolbar)}>
      <Input
        placeholder={placeholder}
        defaultValue={currentValue}
        onChange={event => {
          const value = event.target.value;
          if (isEmpty(value)) {
            debouncedSetRef.current('');
            return;
          }
          debouncedSetRef.current(value);
        }}
        sx={styles.searchInput}
      />
      {right}
    </div>
  );
};
