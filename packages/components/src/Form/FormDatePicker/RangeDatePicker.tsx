import React, { type ReactNode } from 'react';
import Icons from '../../Icons';
import { vi } from 'date-fns/locale';
import * as stylex from '@stylexjs/stylex';

import { colors } from '../../theme/tokens.stylex';
import { Button } from '../../ui/button';
import { resolveWidth, type ComponentWidth } from '../../theme/width';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import type { DatePickerSize, DatePickerStatus, TimeConfig } from './types';
import { buildRangeDisplayValue } from './useFormDatePicker';

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
});

interface RangeDatePickerProps {
  value: [Date | undefined, Date | undefined];
  onChange: (dates: [Date | undefined, Date | undefined]) => void;
  placeholder?: string;
  dateFormat: string;
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
}

export function RangeDatePicker({
  value,
  onChange,
  placeholder = 'Select Date Range',
  dateFormat,
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
}: RangeDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectingEnd, setSelectingEnd] = React.useState(false);

  const [startDate, endDate] = value;

  const displayValue = buildRangeDisplayValue(startDate, endDate, dateFormat);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!startDate || selectingEnd) {
      if (!startDate) {
        onChange([date, undefined]);
        setSelectingEnd(true);
      } else {
        const newEndDate = date < startDate ? startDate : date;
        const newStartDate = date < startDate ? date : startDate;
        onChange([newStartDate, newEndDate]);
        if (!showTime) {
          setOpen(false);
          setSelectingEnd(false);
        }
      }
    } else {
      const newEndDate = date < startDate ? startDate : date;
      const newStartDate = date < startDate ? date : startDate;
      onChange([newStartDate, newEndDate]);
      if (!showTime) {
        setOpen(false);
        setSelectingEnd(false);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([undefined, undefined]);
    setSelectingEnd(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectingEnd(false);
    }
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
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          width={width}
          sx={[
            styles.triggerButton,
            sizeStyle,
            statusStyle,
            !displayValue ? styles.mutedText : undefined,
            width === 'auto' ? styles.fullWidth : undefined,
          ]}
          className={className}
          style={width !== 'auto' ? { width: resolveWidth(width) } : undefined}
        >
          {!hideValue && displayValue ? displayValue : <span>{placeholder}</span>}
          <div {...stylex.props(styles.rightControls)}>
            {allowClear && (startDate || endDate) && (
              <span onClick={handleClear} {...stylex.props(styles.clearButton)}>
                ×
              </span>
            )}
            {suffixIcon || <Icons.CalendarIcon {...stylex.props(styles.icon)} />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent sx={styles.popoverContent} align="start">
        <Calendar
          mode="single"
          selected={selectingEnd ? endDate : startDate}
          onSelect={handleDateSelect}
          disabled={disabledDate}
          captionLayout="dropdown"
          hidden={{
            after: new Date(new Date().getFullYear() + 50, 11, 31),
          }}
          locale={vi}
        />
      </PopoverContent>
    </Popover>
  );
}

export default RangeDatePicker;
