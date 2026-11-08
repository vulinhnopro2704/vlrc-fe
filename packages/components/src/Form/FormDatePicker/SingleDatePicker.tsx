import React, { useState, type ReactNode } from 'react';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';

import { colors } from '../../theme/tokens.stylex';
import { Button } from '../../ui/button';
import { resolveWidth, type ComponentWidth } from '../../theme/width';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import type {
  DatePickerSize,
  DatePickerStatus,
  DisabledTime,
  PickerType,
  TimeConfig,
} from './types';
import { formatDateValue } from './useFormDatePicker';
import TimeInput from './TimeInput';
import TimePicker from './TimePicker';

const styles = stylex.create({
  triggerButton: {
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  sizeSmall: {
    height: '2rem',
    fontSize: '0.75rem',
  },
  sizeMedium: {
    height: '2.5rem',
    fontSize: '0.875rem',
  },
  sizeLarge: {
    height: '3rem',
    fontSize: '1rem',
  },
  statusError: {
    borderColor: colors.destructive,
  },
  statusWarning: {
    borderColor: '#eab308',
  },
  mutedText: {
    color: colors.mutedForeground,
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

interface SingleDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  dateFormat: string;
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
  disabledDate?: (date: Date) => boolean;
  disabledTime?: DisabledTime | ((date: Date) => DisabledTime);
  timeConfig?: TimeConfig;
}

export function SingleDatePicker({
  value,
  onChange,
  placeholder = 'Select Date',
  dateFormat,
  pickerType = 'date',
  showTime,
  size = 'large',
  status,
  width = 'auto',
  disabled,
  allowClear,
  hideValue,
  suffixIcon,
  className,
  disabledDate,
  disabledTime,
  timeConfig,
}: SingleDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());

  const displayValue = formatDateValue(value, dateFormat);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    let finalDate = date;
    if (showTime && value) {
      finalDate = new Date(date);
      finalDate.setHours(value.getHours());
      finalDate.setMinutes(value.getMinutes());
      finalDate.setSeconds(value.getSeconds());
    }

    onChange(finalDate);
    setCurrentMonth(finalDate);

    if (!showTime) {
      setOpen(false);
    }
  };

  const handleTimeChange = (newDate: Date) => {
    onChange(newDate);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const renderIcon = () => {
    if (suffixIcon) return suffixIcon;
    if (pickerType === 'time') return <Clock {...stylex.props(styles.icon)} />;
    return <CalendarIcon {...stylex.props(styles.icon)} />;
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

    return (
      <div {...stylex.props(styles.calendarWrapper)}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabledDate}
          captionLayout="dropdown"
          locale={vi}
          month={currentMonth}
          hidden={{
            after: new Date(new Date().getFullYear() + 50, 11, 31),
          }}
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

  const sizeStyle =
    size === 'small' ? styles.sizeSmall : size === 'medium' ? styles.sizeMedium : styles.sizeLarge;
  const statusStyle =
    status === 'error'
      ? styles.statusError
      : status === 'warning'
        ? styles.statusWarning
        : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          width={width}
          sx={[
            styles.triggerButton,
            sizeStyle,
            statusStyle,
            !value ? styles.mutedText : undefined,
            width === 'auto' ? styles.fullWidth : undefined,
          ]}
          className={className}
          style={width !== 'auto' ? { width: resolveWidth(width) } : undefined}
        >
          {!hideValue && displayValue ? displayValue : <span>{placeholder}</span>}
          <div {...stylex.props(styles.rightControls)}>
            {allowClear && value && (
              <span onClick={handleClear} {...stylex.props(styles.clearButton)}>
                ×
              </span>
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
