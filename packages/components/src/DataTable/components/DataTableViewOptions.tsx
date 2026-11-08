import { useState } from 'react';
import { map } from 'lodash-es';
import { ChevronDown } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import type { Table, VisibilityState } from '@tanstack/react-table';
import { colors } from '../../theme/tokens.stylex';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

const styles = stylex.create({
  icon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  triggerOpen: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
});

export const DataTableViewOptions = <TData,>({
  table,
  columnVisibility,
}: {
  table: Table<TData>;
  columnVisibility: VisibilityState;
}) => {
  const [open, setOpen] = useState(false);
  const columns = table.getAllColumns().filter((c) => c.getCanHide());

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" sx={open ? styles.triggerOpen : undefined}>
          Columns <ChevronDown {...stylex.props(styles.icon)} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {map(columns, (col) => (
          <DropdownMenuCheckboxItem
            key={col.id}
            checked={columnVisibility[col.id] !== false}
            onCheckedChange={() => col.toggleVisibility(columnVisibility[col.id] === false)}
          >
            {col.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
