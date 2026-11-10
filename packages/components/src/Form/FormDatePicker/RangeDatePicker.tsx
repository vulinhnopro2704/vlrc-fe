import React, { type ReactNode } from 'react';
import type { Locale } from 'date-fns';
import * as stylex from '@stylexjs/stylex';
import Icons from '../../Icons';

import { colors } from '../../theme/tokens.stylex';
import { Button } from '../../ui/button';
import { Text } from '../../Typography';
import { resolveWidth, type ComponentWidth } from '../../theme/width';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import {
  resolveDatePickerSize,
  type DatePickerSize,
  type DatePickerStatus,
  type TimeConfig,
} from './types';
import { buildRangeDisplayValue, getDefaultFormat } from './useFormDatePicker';

const styles = stylex.create({
  triggerButton: {
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  statusError: {
    borderColor: colors.destructive,
  },
  statusWarning: {
    borderColor: '#eab308',
  },
  fullWidth: {
    width: '100%',
  },
  rightControls: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  clearButton: {
    cursor: 'pointer',
    ':hover': {
      color: colors.destructive,
    },
  },
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

  const handleClear = (e: React.MouseEvent) => {
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
      ? styles.statusError
      : status === 'warning'
        ? styles.statusWarning
        : undefined;

  const typographySize =
    resolvedSize === 'xxs' || resolvedSize === 'xs'
      ? 'xs'
      : resolvedSize === 'xl' || resolvedSize === 'xxl'
        ? 'lg'
        : 'sm';

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={resolvedSize}
          disabled={disabled}
          width={width}
          sx={[
            styles.triggerButton,
            statusStyle,
            width === 'auto' ? styles.fullWidth : undefined,
            sx,
          ]}
          className={className}
          style={width !== 'auto' ? { width: resolveWidth(width) } : undefined}
        >
          {!hideValue && displayValue ? (
            <Text size={typographySize} weight="normal">
              {displayValue}
            </Text>
          ) : (
            <Text size={typographySize} type="muted">
              {placeholder}
            </Text>
          )}
          <div {...stylex.props(styles.rightControls)}>
            {allowClear && (startDate || endDate) && (
              <Text as="span" onClick={handleClear} sx={styles.clearButton}>
                ×
              </Text>
            )}
            {suffixIcon || <Icons.CalendarIcon {...stylex.props(styles.icon)} />}
          </div>
        </Button>
      </PopoverTrigger>
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
