import React, { useMemo, useRef, useState } from 'react';
import { isNil } from 'lodash-es';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import Icons from '../Icons';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MultiSelectTags } from './MultiSelectTags';
import type {
  BaseMultiSelectProps,
  BaseSelectOption,
  BaseSelectProps,
  BaseSingleSelectProps,
  SelectValue
} from './type';

const styles = stylex.create({
  trigger: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: '15rem',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    fontSize: '0.75rem',
    backgroundColor: colors.background,
    color: colors.foreground,
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '150ms',
  },
  triggerOpen: {
    borderColor: colors.ring,
    boxShadow: '0 0 0 2px color-mix(in srgb, var(--ring) 50%, transparent)',
  },
  triggerDisabled: {
    backgroundColor: colors.muted,
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  labelArea: {
    flex: '1 1 0%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    fontSize: '0.75rem',
  },
  placeholder: {
    color: colors.mutedForeground,
  },
  clearIcon: {
    width: '0.875rem',
    height: '0.875rem',
    marginLeft: '0.5rem',
    color: colors.mutedForeground,
    flexShrink: 0,
    cursor: 'pointer',
    ':hover': {
      color: colors.destructive,
    },
  },
  chevronIcon: {
    width: '0.875rem',
    height: '0.875rem',
    marginLeft: '0.5rem',
    color: colors.mutedForeground,
    flexShrink: 0,
  },
  popoverContent: {
    padding: 0,
    width: '15rem',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: '0.5rem',
    paddingBlock: '0.375rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  searchIcon: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
    color: colors.mutedForeground,
  },
  searchInput: {
    width: '100%',
    outline: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: '0.75rem',
    color: colors.foreground,
  },
  selectAllRow: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 500,
    ':hover': {
      backgroundColor: colors.accent,
    },
  },
  optionsList: {
    maxHeight: '14rem',
    overflowY: 'auto',
  },
  emptyNotice: {
    padding: '0.75rem',
    textAlign: 'center',
    color: colors.mutedForeground,
    fontSize: '0.75rem',
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    color: colors.foreground,
    ':hover': {
      backgroundColor: colors.accent,
    },
  },
  optionSelected: {
    backgroundColor: 'color-mix(in srgb, var(--accent) 50%, transparent)',
  },
  optionDisabled: {
    pointerEvents: 'none',
    opacity: 0.6,
  },
  checkSquare: {
    marginLeft: '0.5rem',
    width: '1rem',
    height: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    borderRadius: radii.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  checkSquareSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.primaryForeground,
  },
  checkIcon: {
    width: '0.75rem',
    height: '0.75rem',
  },
});

function isMultiProps<T extends SelectValue>(
  props: BaseSelectProps<T>
): props is BaseMultiSelectProps<T> {
  return props.isMulti === true;
}

export function BaseSelect<T extends SelectValue = SelectValue>(
  props: BaseMultiSelectProps<T>
): React.ReactElement;
export function BaseSelect<T extends SelectValue = SelectValue>(
  props: BaseSingleSelectProps<T>
): React.ReactElement;
export function BaseSelect<T extends SelectValue = SelectValue>(
  props: BaseMultiSelectProps<T> | BaseSingleSelectProps<T>
): React.ReactElement {
  const {
    options,
    injectOptions = [],
    placeholder = 'Chọn...',
    isClearable = true,
    isSearchable = true,
    isLoading = false,
    className = '',
    disabled = false,
    onSearchTextChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    fetchNextPage,
    maxTagCount = 'responsive',
    tagRender,
    showSelectAll = false
  } = props;

  const isMulti = isMultiProps(props);
  const { value } = props;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allOptions = useMemo(() => {
    const map = new Map<T, BaseSelectOption<T>>();

    for (const opt of injectOptions) {
      map.set(opt.value, opt);
    }
    for (const opt of options) {
      map.set(opt.value, opt);
    }
    return Array.from(map.values());
  }, [options, injectOptions]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return allOptions;
    return allOptions.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [allOptions, search]);

  const selectedValues: T[] = useMemo(() => {
    if (isNil(value)) return [];
    if (isMulti) {
      return Array.isArray(value) ? value : [];
    }
    return [value as T];
  }, [value, isMulti]);

  const selectedOptions = useMemo(() => {
    return allOptions.filter(opt => selectedValues.includes(opt.value));
  }, [allOptions, selectedValues]);

  const handleSelect = (val: T) => {
    if (disabled) return;
    if (isMulti) {
      const exists = selectedValues.includes(val);
      const next = exists
        ? selectedValues.filter(v => v !== val)
        : [...selectedValues, val];
      if (props.onChange) {
        props.onChange(next);
      }
    } else {
      if (props.onChange) {
        props.onChange(val);
      }
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (isMulti) {
      if (props.onChange) {
        props.onChange([]);
      }
    } else {
      if (props.onChange) {
        props.onChange(undefined as unknown as T);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearchTextChange?.(e.target.value);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage?.();
      }
    }
  };

  const displayLabel = useMemo(() => {
    if (isMulti) return '';
    const found = allOptions.find(opt => opt.value === selectedValues[0]);
    return found?.label || '';
  }, [selectedValues, allOptions, isMulti]);

  const handleRemoveTag = (val: T) => {
    if (disabled || !isMultiProps(props)) return;
    const newVals = selectedValues.filter(v => v !== val);
    if (props.onChange) {
      props.onChange(newVals);
    }
  };

  const handleSelectAll = () => {
    if (disabled || !isMultiProps(props)) return;
    if (selectedValues.length === filteredOptions.length) {
      if (props.onChange) {
        props.onChange([]);
      }
    } else {
      const allValues = filteredOptions.map(opt => opt.value);
      if (props.onChange) {
        props.onChange(allValues);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          {...stylex.props(
            styles.trigger,
            open && styles.triggerOpen,
            disabled && styles.triggerDisabled
          )}
          className={className}
          onClick={() => !disabled && setOpen(v => !v)}
          disabled={disabled}>
          {isMulti && selectedValues.length > 0 ? (
            <MultiSelectTags
              selectedOptions={selectedOptions}
              maxTagCount={maxTagCount}
              onRemove={handleRemoveTag}
              disabled={disabled}
              tagRender={tagRender}
            />
          ) : (
            <span {...stylex.props(styles.labelArea)}>
              {displayLabel || <span {...stylex.props(styles.placeholder)}>{placeholder}</span>}
            </span>
          )}
          {isClearable && selectedValues.length > 0 && !disabled && (
            <Icons.XIcon
              {...stylex.props(styles.clearIcon)}
              onClick={handleClear}
            />
          )}
          <Icons.ChevronDownIcon {...stylex.props(styles.chevronIcon)} />
        </button>
      </PopoverTrigger>
      <PopoverContent sx={styles.popoverContent} align='start'>
        {isSearchable && !disabled && (
          <div {...stylex.props(styles.searchBar)}>
            <Icons.SearchIcon {...stylex.props(styles.searchIcon)} />
            <input
              ref={inputRef}
              {...stylex.props(styles.searchInput)}
              placeholder='Tìm kiếm...'
              value={search}
              onChange={handleSearchChange}
              autoFocus
              disabled={disabled}
            />
          </div>
        )}
        {isMulti && showSelectAll && !disabled && filteredOptions.length > 0 && (
          <div
            {...stylex.props(styles.selectAllRow)}
            onClick={handleSelectAll}>
            <span style={{ flex: '1 1 0%' }}>
              {selectedValues.length === filteredOptions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </span>
            <span {...stylex.props(styles.placeholder)}>
              ({selectedValues.length}/{filteredOptions.length})
            </span>
          </div>
        )}
        <div {...stylex.props(styles.optionsList)} onScroll={handleScroll}>
          {isLoading && allOptions.length === 0 ? (
            <div {...stylex.props(styles.emptyNotice)}>Đang tải...</div>
          ) : filteredOptions.length === 0 ? (
            <div {...stylex.props(styles.emptyNotice)}>Không có dữ liệu</div>
          ) : (
            <>
              {filteredOptions.map(opt => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <div
                    key={String(opt.value)}
                    {...stylex.props(
                      styles.optionRow,
                      isSelected && styles.optionSelected,
                      disabled && styles.optionDisabled
                    )}
                    onClick={() => handleSelect(opt.value)}>
                    {opt.icon && <span style={{ marginRight: '0.5rem' }}>{opt.icon}</span>}
                    <span style={{ flex: '1 1 0%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {opt.label}
                    </span>
                    {isMulti && (
                      <span
                        {...stylex.props(
                          styles.checkSquare,
                          isSelected && styles.checkSquareSelected
                        )}>
                        {isSelected && (
                          <Icons.CheckIcon {...stylex.props(styles.checkIcon)} />
                        )}
                      </span>
                    )}
                    {!isMulti && isSelected && (
                      <Icons.CheckIcon {...stylex.props(styles.checkIcon)} style={{ color: 'var(--primary)' }} />
                    )}
                  </div>
                );
              })}
              {(isFetchingNextPage || (hasNextPage && filteredOptions.length > 0)) && (
                <div {...stylex.props(styles.emptyNotice)}>
                  {isFetchingNextPage ? 'Đang tải thêm...' : ''}
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default BaseSelect;
