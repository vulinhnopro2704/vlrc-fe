import React, { type ReactNode } from 'react';
import type { Locale } from 'date-fns';
import * as stylex from '@stylexjs/stylex';
import Icons from '../../Icons';
import type { ComponentWidth } from '../../theme/width';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent } from '../../ui/popover';
import {
  resolveDatePickerSize,
  type DatePickerSize,
  type DatePickerStatus,
  type TimeConfig,
} from './types';
import { DatePickerTriggerInput, datePickerStyles } from './DatePickerTrigger';
import { buildRangeDisplayValue, getDefaultFormat } from './useFormDatePicker';

const styles = stylex.create({
  icon: {
    width: '1rem',
    height: '1rem',
    opacity: 0.5,
  },
  popoverContent: {
    width: 'auto',
    padding: 0,
  },
});

export interface StandaloneRangeDatePickerProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  value?: [Date | undefined, Date | undefined];
  onChange?: (dates: [Date | undefined, Date | undefined]) => void;
  placeholder?: string;
  dateFormat?: string;
  showTime?: boolean | TimeConfig;
  size?: DatePickerSize;
  status?: DatePickerStatus;
  width?: ComponentWidth;
  disabled?: boolean;
  allowClear?: boolean;
  hideValue?: boolean;
  suffixIcon?: ReactNode;
  className?: string;
  sx?: stylex.StyleXStyles;
  disabledDate?: (date: Date) => boolean;
  locale?: Locale;
  numberOfMonths?: number;
  closeOnSelect?: boolean;
  startMonth?: Date;
  endMonth?: Date;
}

export function RangeDatePicker({
  id,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  value = [undefined, undefined],
  onChange,
  placeholder = 'Select Date Range',
  dateFormat,
  showTime,
  size = 'md',
  status,
  width = 'auto',
  disabled,
  allowClear,
  hideValue,
  suffixIcon,
  className,
  sx,
  disabledDate,
  locale,
  numberOfMonths = 2,
  closeOnSelect = false,
  startMonth,
  endMonth,
}: StandaloneRangeDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const resolvedSize = resolveDatePickerSize(size);
  const [startDate, endDate] = value;
  const resolvedFormat = dateFormat || getDefaultFormat('date', showTime);
  const displayValue = buildRangeDisplayValue(startDate, endDate, resolvedFormat);

  const [selectedRange, setSelectedRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate,
  });

  // Sync internal range with props on value change
  React.useEffect(() => {
    setSelectedRange({ from: startDate, to: endDate });
  }, [startDate, endDate]);

  const handleClear = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setSelectedRange({ from: undefined, to: undefined });
    onChange?.([undefined, undefined]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    const from = range?.from;
    const to = range?.to;
    setSelectedRange({ from, to });
    if (from && to) {
      onChange?.([from, to]);
      if (closeOnSelect && !showTime) {
        setOpen(false);
      }
    } else if (from) {
      onChange?.([from, undefined]);
    } else {
      onChange?.([undefined, undefined]);
    }
  };

  const statusStyle =
    status === 'error'
      ? datePickerStyles.statusError
      : status === 'warning'
        ? datePickerStyles.statusWarning
        : undefined;

  const typographySize =
    resolvedSize === 'xxs' || resolvedSize === 'xs'
      ? 'xs'
      : resolvedSize === 'xl' || resolvedSize === 'xxl'
        ? 'lg'
        : 'sm';

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <DatePickerTriggerInput
        id={id}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        resolvedSize={resolvedSize}
        typographySize={typographySize}
        statusStyle={statusStyle}
        width={width}
        hasValue={Boolean(!hideValue && (startDate || endDate))}
        displayValue={displayValue}
        placeholder={placeholder}
        allowClear={allowClear}
        onClear={handleClear}
        renderIcon={() => suffixIcon || <Icons.CalendarIcon {...stylex.props(styles.icon)} />}
        className={className}
        sx={sx}
      />
      <PopoverContent sx={styles.popoverContent} align="start">
        <Calendar
          mode="range"
          min={1}
          resetOnSelect
          size={resolvedSize}
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={disabledDate}
          captionLayout="dropdown"
          numberOfMonths={numberOfMonths}
          locale={locale}
          startMonth={startMonth}
          endMonth={endMonth}
        />
      </PopoverContent>
    </Popover>
  );
}

export default RangeDatePicker;
