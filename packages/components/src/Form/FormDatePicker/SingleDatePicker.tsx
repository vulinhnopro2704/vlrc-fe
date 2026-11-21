import React, { useState, type ReactNode } from 'react';
import type { Locale } from 'date-fns';
import * as stylex from '@stylexjs/stylex';

import Icons from '../../Icons';
import { colors, radius, shadow } from '../../theme/tokens.stylex';
import type { ComponentSize } from '../../theme/types';
import { Box, Flex } from '../../layout';
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
  wrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
    ':focus-within': {
      boxShadow: shadow.ringFocus,
      borderColor: colors.ring,
    },
  },
  wrapperDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  sizeXxs: { minHeight: '1.5rem', paddingInline: '0.5rem' },
  sizeXs: { minHeight: '1.75rem', paddingInline: '0.625rem' },
  sizeSm: { minHeight: '2rem', paddingInline: '0.75rem' },
  sizeMd: { minHeight: '2.25rem', paddingInline: '0.75rem' },
  sizeLg: { minHeight: '2.5rem', paddingInline: '1rem' },
  sizeXl: { minHeight: '2.75rem', paddingInline: '1.25rem' },
  sizeXxl: { minHeight: '3rem', paddingInline: '1.5rem' },
  triggerInnerButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    outline: 'none',
    textAlign: 'left',
    height: '100%',
  },
  triggerButton: {
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  statusError: {
    borderColor: colors.destructive,
  },
  statusWarning: {
    borderColor: colors.warning,
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
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    color: colors.mutedForeground,
    lineHeight: 1,
    outline: 'none',
    borderRadius: radius.sm,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      color: colors.destructive,
    },
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
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

const sizeWrapperStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

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
      <Flex
        align="center"
        justify="between"
        sx={[
          styles.wrapper,
          sizeWrapperStyles[resolvedSize],
          statusStyle,
          disabled && styles.wrapperDisabled,
          width === 'auto' ? styles.fullWidth : undefined,
          sx,
        ]}
        className={className}
        style={width !== 'auto' ? { width: resolveWidth(width) } : undefined}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
            variant="ghost"
            size={resolvedSize}
            disabled={disabled}
            sx={styles.triggerInnerButton}
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
          </Button>
        </PopoverTrigger>
        <Flex align="center" gap="xxs" sx={styles.rightControls}>
          {allowClear && value && (
            <Button
              type="button"
              data-slot="clear-button"
              variant="ghost"
              size="icon-xs"
              tabIndex={0}
              aria-label="Clear date"
              disabled={disabled}
              onClick={handleClear}
              sx={styles.clearButton}
            >
              <Text size={typographySize}>×</Text>
            </Button>
          )}
          <Box aria-hidden="true">{renderIcon()}</Box>
        </Flex>
      </Flex>
      <PopoverContent sx={styles.popoverContent} align="start">
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

export default SingleDatePicker;
