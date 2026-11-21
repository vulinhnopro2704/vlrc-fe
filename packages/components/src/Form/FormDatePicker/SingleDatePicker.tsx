import React, { useState, type ReactNode } from 'react';
import type { Locale } from 'date-fns';
import * as stylex from '@stylexjs/stylex';

import Icons from '../../Icons';
import { colors } from '../../theme/tokens.stylex';
import { Box, Flex } from '../../layout';
import type { ComponentWidth } from '../../theme/width';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent } from '../../ui/popover';
import {
  resolveDatePickerSize,
  type DatePickerSize,
  type DatePickerStatus,
  type DisabledTime,
  type PickerType,
  type TimeConfig,
} from './types';
import { DatePickerTriggerInput, datePickerStyles } from './DatePickerTrigger';
import { formatDateValue, getDefaultFormat } from './useFormDatePicker';
import TimeInput from './TimeInput';
import TimePicker from './TimePicker';
import MonthPickerPanel from './MonthPickerPanel';
import YearPickerPanel from './YearPickerPanel';

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
  timeWrapper: {
    padding: '0.5rem',
  },
  timeInputWrapper: {
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
  },
  calendarWrapper: {
    display: 'flex',
  },
});

export interface StandaloneDatePickerProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  dateFormat?: string;
  pickerType?: PickerType;
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
  disabledTime?: DisabledTime | ((date: Date) => DisabledTime);
  timeConfig?: TimeConfig;
  locale?: Locale;
  startMonth?: Date;
  endMonth?: Date;
}

export function SingleDatePicker({
  id,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  value,
  onChange,
  placeholder = 'Select Date',
  dateFormat,
  pickerType = 'date',
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
  disabledTime,
  timeConfig,
  locale,
  startMonth,
  endMonth,
}: StandaloneDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());

  const resolvedSize = resolveDatePickerSize(size);
  const resolvedFormat = dateFormat || getDefaultFormat(pickerType, showTime);
  const displayValue = formatDateValue(value, resolvedFormat);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }

    let finalDate = date;
    if (showTime && value) {
      finalDate = new Date(date);
      finalDate.setHours(value.getHours());
      finalDate.setMinutes(value.getMinutes());
      finalDate.setSeconds(value.getSeconds());
    }

    onChange?.(finalDate);
    setCurrentMonth(finalDate);

    if (!showTime) {
      setOpen(false);
    }
  };

  const handleTimeChange = (newDate: Date) => {
    onChange?.(newDate);
  };

  const handleClear = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  };

  const renderIcon = () => {
    if (suffixIcon) return suffixIcon;
    if (pickerType === 'time') return <Icons.Clock {...stylex.props(styles.icon)} />;
    return <Icons.CalendarIcon {...stylex.props(styles.icon)} />;
  };

  const renderContent = () => {
    if (pickerType === 'time') {
      return (
        <Box sx={styles.timeWrapper}>
          <TimePicker
            value={value}
            onChange={handleTimeChange}
            timeConfig={timeConfig}
            disabledTime={buildDisabledTime(value, disabledTime)}
          />
          <Box sx={styles.timeInputWrapper}>
            <TimeInput value={value} onChange={handleTimeChange} timeConfig={timeConfig} />
          </Box>
        </Box>
      );
    }

    if (pickerType === 'month') {
      return (
        <MonthPickerPanel
          value={value}
          onChange={handleDateSelect}
          disabledDate={disabledDate}
          locale={locale}
        />
      );
    }

    if (pickerType === 'year') {
      return (
        <YearPickerPanel value={value} onChange={handleDateSelect} disabledDate={disabledDate} />
      );
    }

    return (
      <Flex sx={styles.calendarWrapper}>
        <Calendar
          mode="single"
          size={resolvedSize}
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabledDate}
          captionLayout="dropdown"
          locale={locale}
          month={currentMonth}
          startMonth={startMonth}
          endMonth={endMonth}
          onMonthChange={setCurrentMonth}
        />
        {showTime && (
          <Box sx={styles.timeWrapper}>
            <TimePicker
              value={value}
              onChange={handleTimeChange}
              timeConfig={timeConfig}
              disabledTime={buildDisabledTime(value, disabledTime)}
            />
          </Box>
        )}
      </Flex>
    );
  };

  const buildDisabledTime = (
    currentValue?: Date,
    disabledTimeConfig?: DisabledTime | ((date: Date) => DisabledTime),
  ): DisabledTime => {
    if (!disabledTimeConfig) return {};
    const resolved =
      typeof disabledTimeConfig === 'function' && currentValue
        ? disabledTimeConfig(currentValue)
        : typeof disabledTimeConfig === 'function'
          ? {}
          : disabledTimeConfig;
    return {
      disabledHours: () => resolved.disabledHours?.() || [],
      disabledMinutes: (h) => resolved.disabledMinutes?.(h) || [],
      disabledSeconds: (h, m) => resolved.disabledSeconds?.(h, m) || [],
    };
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
    <Popover open={open} onOpenChange={setOpen}>
      <DatePickerTriggerInput
        id={id}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        resolvedSize={resolvedSize}
        typographySize={typographySize}
        statusStyle={statusStyle}
        width={width}
        hasValue={Boolean(!hideValue && value)}
        displayValue={displayValue}
        placeholder={placeholder}
        allowClear={allowClear}
        onClear={handleClear}
        renderIcon={renderIcon}
        className={className}
        sx={sx}
      />
      <PopoverContent sx={styles.popoverContent} align="start">
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

export default SingleDatePicker;
