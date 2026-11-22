import type React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../../theme/tokens.stylex';
import type { ComponentSize } from '../../theme/types';
import type { ComponentWidth } from '../../theme/width';
import { resolveWidth } from '../../theme/width';
import { Box, Flex } from '../../layout';
import { Button } from '../../ui/button';
import { Text } from '../../Typography';
import { PopoverTrigger } from '../../ui/popover';
import { unstyledButtonStyles } from '../../utils';

export const datePickerStyles = stylex.create({
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
    textAlign: 'left',
    height: '100%',
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
    color: colors.mutedForeground,
    borderRadius: radius.sm,
    ':hover': {
      color: colors.destructive,
      backgroundColor: 'transparent',
    },
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
    },
  },
});

export const sizeWrapperStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: datePickerStyles.sizeXxs,
  xs: datePickerStyles.sizeXs,
  sm: datePickerStyles.sizeSm,
  md: datePickerStyles.sizeMd,
  lg: datePickerStyles.sizeLg,
  xl: datePickerStyles.sizeXl,
  xxl: datePickerStyles.sizeXxl,
};

export interface DatePickerTriggerInputProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  disabled?: boolean;
  resolvedSize: ComponentSize;
  typographySize: 'xs' | 'sm' | 'md' | 'lg';
  statusStyle?: stylex.StyleXStyles;
  width?: ComponentWidth;
  hasValue: boolean;
  displayValue?: string;
  placeholder: string;
  allowClear?: boolean;
  onClear: (e: React.SyntheticEvent) => void;
  renderIcon: () => React.ReactNode;
  className?: string;
  sx?: stylex.StyleXStyles;
}

export function DatePickerTriggerInput({
  id,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  disabled,
  resolvedSize,
  typographySize,
  statusStyle,
  width,
  hasValue,
  displayValue,
  placeholder,
  allowClear,
  onClear,
  renderIcon,
  className,
  sx,
}: DatePickerTriggerInputProps) {
  return (
    <Flex
      align="center"
      justify="between"
      sx={[
        datePickerStyles.wrapper,
        sizeWrapperStyles[resolvedSize],
        statusStyle,
        disabled && datePickerStyles.wrapperDisabled,
        width === 'auto' ? datePickerStyles.fullWidth : undefined,
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
          sx={[unstyledButtonStyles.reset, datePickerStyles.triggerInnerButton]}
        >
          {hasValue && displayValue ? (
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
      <Flex align="center" gap="xxs" sx={datePickerStyles.rightControls}>
        {allowClear && hasValue && (
          <Button
            type="button"
            data-slot="clear-button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear date"
            disabled={disabled}
            onClick={onClear}
            sx={[unstyledButtonStyles.reset, datePickerStyles.clearButton]}
          >
            <Text size={typographySize}>×</Text>
          </Button>
        )}
        <Box aria-hidden="true">{renderIcon()}</Box>
      </Flex>
    </Flex>
  );
}
