import { get, isEmpty, map } from 'lodash-es';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Row, Table } from '@tanstack/react-table';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';

import type { DataTableActionsConfig } from '../types';

export const DataTableRowActions = <TData,>({
  row,
  table
}: {
  row: Row<TData>;
  table: Table<TData>;
}) => {
  const { t } = useTranslation();
  const meta = table.options.meta as
    | { getRowActions?: DataTableActionsConfig<TData>['getRowActions'] }
    | undefined;
  const getRowActions = get(meta, 'getRowActions');
  const items = getRowActions === undefined ? [] : getRowActions(row);

  if (isEmpty(items)) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm'>
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>{t('datatable_open_menu')}</span>
          <MoreHorizontal style={{ width: 16, height: 16 }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{t('datatable_actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {map(items, item => (
          <DropdownMenuItem
            key={item.id}
            disabled={item.disabled}
            onClick={() => item.onSelect(row)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
