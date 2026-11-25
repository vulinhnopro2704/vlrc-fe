import { useId, useState, type ReactElement } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Box } from '../layout/Box';
import { Text } from '../Typography';
import { Tag } from '../Tag';
import Icons from '../Icons';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import divider from './assets/Divider.svg';
import closeIcon from './assets/IconClose.svg';
import searchIcon from './assets/IconSearch.svg';
import checkIcon from './assets/IconCheck.svg';
import { styles } from './styles';
import type { FilterPopupCategory, FilterPopupOption, FilterPopupSelection } from './types';

type FilterPopupCopy = {
  label: string;
  search: string;
  clear: string;
  clearAll: string;
  empty: string;
  resultCount: (visible: number, total: number) => string;
};

const defaultCopy: FilterPopupCopy = {
  label: 'Filter',
  search: 'Search',
  clear: 'Clear',
  clearAll: 'Clear All',
  empty: 'No options found',
  resultCount: (visible, total) => `${visible} of ${total}`,
};

export function FilterPopup({
  items,
  value,
  defaultValue,
  onChange,
  trigger,
  disabled,
  copy,
}: {
  items: readonly FilterPopupCategory[];
  value?: FilterPopupSelection;
  defaultValue?: FilterPopupSelection;
  onChange?: (value: FilterPopupSelection) => void;
  trigger?: ReactElement;
  disabled?: boolean;
  copy?: Partial<FilterPopupCopy>;
}) {
  const [selection, setSelection] = useState(defaultValue ?? {});

  const handleChange = (next: FilterPopupSelection) => {
    if (value === undefined) setSelection(next);
    onChange?.(next);
  };

  const labels = { ...defaultCopy, ...copy };
  const selected = value ?? selection;
  const count = Object.values(selected).reduce((total, values) => total + (values?.length ?? 0), 0);

  const renderTrigger = () =>
    trigger ?? (
      <Button variant="outline" size="sm" disabled={disabled} prefix={<Icons.Filter size={16} />}>
        {labels.label}
        {count > 0 && <Tag size="sm" label={String(count)} />}
      </Button>
    );

  return (
    <Popover>
      <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
      <PopoverContent align="start" aria-label={labels.label} sx={styles.popup}>
        <FilterPopupContent
          items={items}
          selection={selected}
          onChange={handleChange}
          labels={labels}
        />
      </PopoverContent>
    </Popover>
  );
}

function FilterPopupContent({
  items,
  selection,
  onChange,
  labels,
}: {
  items: readonly FilterPopupCategory[];
  selection: FilterPopupSelection;
  onChange: (selection: FilterPopupSelection) => void;
  labels: FilterPopupCopy;
}) {
  const id = useId();
  const [activeKey, setActiveKey] = useState(items[0]?.key);
  const [search, setSearch] = useState('');
  const category = items.find((item) => item.key === activeKey) ?? items[0];
  const options = category?.options ?? [];
  const selected = (category && selection[category.key]) ?? [];
  const query = search.trim().toLocaleLowerCase();
  const visibleOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query),
  );

  const changeCategory = (key: string) => {
    setActiveKey(key);
    setSearch('');
  };

  const updateCategory = (nextValues: readonly string[]) => {
    if (!category) return;
    const { [category.key]: previousValues, ...otherCategories } = selection;
    if (!previousValues?.length && !nextValues.length) return;
    onChange(
      nextValues.length ? { ...otherCategories, [category.key]: nextValues } : otherCategories,
    );
  };

  const renderCategory = (item: FilterPopupCategory) => {
    const count = selection[item.key]?.length ?? 0;
    const active = item.key === category?.key;
    return (
      <Button
        key={item.key}
        variant="ghost"
        size="sm"
        aria-pressed={active}
        aria-controls={`${id}-options`}
        sx={[styles.category, active && styles.activeCategory]}
        onClick={() => changeCategory(item.key)}
      >
        <Text size="md" ellipsis sx={styles.categoryLabel}>
          {item.label}
        </Text>
        {count > 0 && <Text sx={styles.count}>{count}</Text>}
      </Button>
    );
  };

  const renderOption = (option: FilterPopupOption, index: number) => {
    const checked = selected.includes(option.value);
    const optionId = `${id}-option-${index}`;
    return (
      <Box as="label" key={option.value} htmlFor={optionId} sx={styles.option}>
        <Checkbox
          id={optionId}
          aria-label={option.label}
          size="lg"
          checked={checked}
          sx={[styles.checkbox, checked && styles.checkboxSelected]}
          indicator={<img src={checkIcon} alt="" />}
          onCheckedChange={(next) =>
            updateCategory(
              next === true
                ? [...selected, option.value]
                : selected.filter((value) => value !== option.value),
            )
          }
        />
        {option.icon}
        <Text size="md" type={checked ? 'default' : 'secondary'} ellipsis>
          {option.label}
        </Text>
      </Box>
    );
  };

  const renderClear = (label: string, onClick: () => void, disabled: boolean) => (
    <Button
      variant="ghost"
      size="xxs"
      sx={styles.footerAction}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={closeIcon} alt="" {...stylex.props(styles.closeIcon)} />
      {label}
    </Button>
  );

  return (
    <Box sx={styles.layout}>
      <Box sx={styles.column}>
        <Box sx={styles.categories}>{items.map(renderCategory)}</Box>
        {renderClear(
          labels.clearAll,
          () => onChange({}),
          !Object.values(selection).some((values) => values?.length),
        )}
      </Box>
      <Box sx={styles.divider} aria-hidden="true">
        <img src={divider} alt="" {...stylex.props(styles.dividerImage)} />
      </Box>
      <Box as="section" sx={styles.column} id={`${id}-options`} aria-label={category?.label}>
        <Box sx={styles.optionsWithSearch}>
          <Input
            size="sm"
            type="search"
            wrapperSx={styles.search}
            aria-label={labels.search}
            placeholder={labels.search}
            prefixIcon={<img src={searchIcon} alt="" />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Box key={category?.key} sx={styles.options}>
            {visibleOptions.map(renderOption)}
            {!visibleOptions.length && (
              <Box sx={styles.empty}>
                <Text type="secondary" size="sm">
                  {labels.empty}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={styles.footer}>
          {renderClear(labels.clear, () => updateCategory([]), !selected.length)}
          <Box as="output">
            <Text type="secondary" size="sm">
              {labels.resultCount(visibleOptions.length, options.length)}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
