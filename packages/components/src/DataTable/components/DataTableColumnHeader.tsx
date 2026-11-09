import * as React from 'react';
import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Flex } from '../../ui/flex';
import { Text } from '../../Typography/Text';

const styles = stylex.create({
  root: {
    height: '2rem',
    marginLeft: '-0.5rem',
  },
  icon: {
    width: '0.875rem',
    height: '0.875rem',
    marginLeft: '0.375rem',
  },
  menuIcon: {
    width: '0.875rem',
    height: '0.875rem',
    marginRight: '0.5rem',
    opacity: 0.7,
  },
});

export interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  sx?: stylex.StyleXStyles;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  sx,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <Flex
        align="center"
        data-slot="data-table-column-header"
        sx={sx}
        className={className}
        {...props}
      >
        <Text size="sm" weight="medium">
          {title}
        </Text>
      </Flex>
    );
  }

  const isSorted = column.getIsSorted();

  return (
    <Flex
      align="center"
      data-slot="data-table-column-header"
      sx={sx}
      className={className}
      {...props}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            data-slot="data-table-column-header-trigger"
            sx={[styles.root]}
          >
            <Text size="sm" weight="medium">
              {title}
            </Text>
            {isSorted === 'desc' ? (
              <ArrowDown data-slot="sort-icon-desc" {...stylex.props(styles.icon)} />
            ) : isSorted === 'asc' ? (
              <ArrowUp data-slot="sort-icon-asc" {...stylex.props(styles.icon)} />
            ) : (
              <ArrowUpDown data-slot="sort-icon-none" {...stylex.props(styles.icon)} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem data-slot="sort-asc" onClick={() => column.toggleSorting(false)}>
            <ArrowUp {...stylex.props(styles.menuIcon)} />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem data-slot="sort-desc" onClick={() => column.toggleSorting(true)}>
            <ArrowDown {...stylex.props(styles.menuIcon)} />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-slot="hide-column"
                onClick={() => column.toggleVisibility(false)}
              >
                <EyeOff {...stylex.props(styles.menuIcon)} />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Flex>
  );
}
