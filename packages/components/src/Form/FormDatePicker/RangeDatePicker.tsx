import React, { type ReactNode } from 'react';
import Icons from '../../Icons';
import { vi } from 'date-fns/locale';
import * as stylex from '@stylexjs/stylex';

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
  const [isSelecting, setIsSelecting] = React.useState<boolean>(false);

  // Sync internal range with props on value change or popover open
  React.useEffect(() => {
    setSelectedRange({ from: startDate, to: endDate });
    setIsSelecting(false);
  }, [startDate, endDate, open]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRange({ from: undefined, to: undefined });
    setIsSelecting(false);
    onChange?.([undefined, undefined]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleDayClick = (day: Date) => {
    if (!isSelecting || !selectedRange.from) {
      // Step 1: User selects start date. Popover stays OPEN.
      setSelectedRange({ from: day, to: undefined });
      setIsSelecting(true);
      onChange?.([day, undefined]);
    } else {
      // Step 2: User selects end date. Range is now complete!
      let finalStart = selectedRange.from;
      let finalEnd = day;
      if (day < finalStart) {
        finalStart = day;
        finalEnd = selectedRange.from;
      }
      setSelectedRange({ from: finalStart, to: finalEnd });
      setIsSelecting(false);
      onChange?.([finalStart, finalEnd]);
      if (!showTime) {
        setOpen(false);
      }
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
          mode="range"
          size={resolvedSize}
          selected={selectedRange}
          onDayClick={handleDayClick}
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
