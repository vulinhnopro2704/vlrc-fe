import React, { useState, type ReactNode } from 'react';
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
  type DisabledTime,
  type PickerType,
  type TimeConfig,
} from './types';
import { formatDateValue, getDefaultFormat } from './useFormDatePicker';
import TimeInput from './TimeInput';
import TimePicker from './TimePicker';
import MonthPickerPanel from './MonthPickerPanel';
import YearPickerPanel from './YearPickerPanel';

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

  const handleClear = (e: React.MouseEvent) => {
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
        <div {...stylex.props(styles.timeWrapper)}>
          <TimePicker
            value={value}
            onChange={handleTimeChange}
            timeConfig={timeConfig}
            disabledTime={buildDisabledTime(value, disabledTime)}
          />
          <div {...stylex.props(styles.timeInputWrapper)}>
            <TimeInput value={value} onChange={handleTimeChange} timeConfig={timeConfig} />
          </div>
        </div>
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
      <div {...stylex.props(styles.calendarWrapper)}>
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
          <div {...stylex.props(styles.timeWrapper)}>
            <TimePicker
              value={value}
              onChange={handleTimeChange}
              timeConfig={timeConfig}
              disabledTime={buildDisabledTime(value, disabledTime)}
            />
          </div>
        )}
      </div>
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
    <Popover open={open} onOpenChange={setOpen}>
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
            {allowClear && value && (
              <Text as="span" onClick={handleClear} sx={styles.clearButton}>
                ×
              </Text>
            )}
            {renderIcon()}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent sx={styles.popoverContent} align="start">
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

export default SingleDatePicker;
