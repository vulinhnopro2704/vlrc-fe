import * as React from 'react';
import type { Column } from '@tanstack/react-table';
import * as stylex from '@stylexjs/stylex';
import { colors, radii, spacing } from '../../theme/tokens.stylex';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Text } from '../../Typography';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Separator } from '../../ui/separator';

const styles = stylex.create({
  trigger: {
    height: '2rem',
    borderStyle: 'dashed',
    fontSize: '0.75rem',
    gap: spacing.xs,
  },
  triggerBadgeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  popoverContent: {
    width: '12.5rem',
    padding: 0,
  },
  checkbox: {
    display: 'flex',
    height: '1rem',
    width: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    marginRight: spacing.xs,
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.primaryForeground,
  },
  optionLabel: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  count: {
    marginLeft: 'auto',
    display: 'flex',
    height: '1rem',
    width: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    fontSize: '0.6875rem',
    color: colors.mutedForeground,
  },
  clearItem: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 500,
  },
  separator: {
    height: '1rem',
    marginInline: spacing.xxs,
  },
  optionIcon: {
    marginRight: spacing.xs,
    display: 'flex',
    alignItems: 'center',
  },
});

export interface DataTableFacetedFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface DataTableFacetedFilterProps<TData, TValue = unknown> {
  column?: Column<TData, TValue>;
  title?: string;
  options: DataTableFacetedFilterOption[];
  selectedValues?: string[];
  onValueChange?: (values: string[]) => void;
  sx?: stylex.StyleXStyles;
}

export function DataTableFacetedFilter<TData, TValue = unknown>({
  column,
  title,
  options,
  selectedValues: controlledSelected,
  onValueChange,
  sx,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const columnFilterValue = column?.getFilterValue();

  const selectedSet = React.useMemo<Set<string>>(() => {
    if (controlledSelected !== undefined) {
      return new Set(controlledSelected);
    }
    if (Array.isArray(columnFilterValue)) {
      return new Set(columnFilterValue.map(String));
    }
    return new Set();
  }, [controlledSelected, columnFilterValue]);

  const updateSelected = (nextSet: Set<string>) => {
    const filterValues = Array.from(nextSet);
    if (column) {
      column.setFilterValue(filterValues.length ? filterValues : undefined);
    }
    onValueChange?.(filterValues);
  };

  const handleSelect = (value: string) => {
    const nextSet = new Set(selectedSet);
    if (nextSet.has(value)) {
      nextSet.delete(value);
    } else {
      nextSet.add(value);
    }
    updateSelected(nextSet);
  };

  const handleClear = () => {
    updateSelected(new Set());
  };

  const triggerSx = stylex.props(styles.trigger, sx);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-slot="data-table-faceted-filter-trigger"
          {...triggerSx}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          {title}
          {selectedSet.size > 0 && (
            <>
              <Separator orientation="vertical" sx={styles.separator} />
              <Badge variant="secondary" size="xxs">
                {selectedSet.size}
              </Badge>
              <div {...stylex.props(styles.triggerBadgeGroup)}>
                {selectedSet.size > 2 ? (
                  <Badge variant="secondary" size="xxs">
                    {selectedSet.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedSet.has(option.value))
                    .map((option) => (
                      <Badge variant="secondary" size="xxs" key={option.value}>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" {...stylex.props(styles.popoverContent)}>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value);
                const OptionIcon = option.icon;

                return (
                  <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                    <div {...stylex.props(styles.checkbox, isSelected && styles.checkboxSelected)}>
                      {isSelected && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    {OptionIcon && (
                      <span {...stylex.props(styles.optionIcon)}>
                        <OptionIcon />
                      </span>
                    )}
                    <Text as="span" size="sm" sx={styles.optionLabel}>
                      {option.label}
                    </Text>
                    {option.count !== undefined && (
                      <Text as="span" size="xs" type="secondary" sx={styles.count}>
                        {option.count}
                      </Text>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleClear} {...stylex.props(styles.clearItem)}>
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
