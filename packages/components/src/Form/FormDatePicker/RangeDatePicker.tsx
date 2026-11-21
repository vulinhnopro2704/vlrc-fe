import React, { type ReactNode } from 'react';
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
  type TimeConfig,
} from './types';
import { buildRangeDisplayValue, getDefaultFormat } from './useFormDatePicker';

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
          {allowClear && (startDate || endDate) && (
            <Button
              type="button"
              data-slot="clear-button"
              variant="ghost"
              size="icon-xs"
              tabIndex={0}
              aria-label="Clear date range"
              disabled={disabled}
              onClick={handleClear}
              sx={styles.clearButton}
            >
              <Text size={typographySize}>×</Text>
            </Button>
          )}
          <Box aria-hidden="true">
            {suffixIcon || <Icons.CalendarIcon {...stylex.props(styles.icon)} />}
          </Box>
        </Flex>
      </Flex>
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
