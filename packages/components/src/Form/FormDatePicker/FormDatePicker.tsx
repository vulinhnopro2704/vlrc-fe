import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../theme/tokens.stylex';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { RangeDatePicker } from './RangeDatePicker';
import { SingleDatePicker } from './SingleDatePicker';
import type { FormDatePickerProps } from './types';
import { useFormDatePicker } from './useFormDatePicker';

const styles = stylex.create({
  formItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  requiredAsterisk: {
    color: colors.destructive,
    marginLeft: '0.25rem',
  },
});

function FormDatePicker<TFieldValues extends FieldValues>(
  props: FormDatePickerProps<TFieldValues>,
) {
  const {
    control,
    name,
    label,
    placeholder,
    status,
    size = 'large',
    width = 'auto',
    pickerType = 'date',
    dateFormat: customFormat,
    showTime,
    disabled = false,
    hideValue = false,
    allowClear = false,
    isRangePicker = false,
    onChangeDate,
    onChangeRange,
    rules = {},
    hideErrorMessage = false,
    suffixIcon,
    className,
    disabledDate,
    disabledTime,
  } = props;

  const { dateFormat, isRequired, processedRules, handleRangeChange, handleSingleChange } =
    useFormDatePicker({
      pickerType,
      showTime,
      dateFormat: customFormat,
      rules,
      onChangeDate,
      onChangeRange,
    });

  const renderRangePicker = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
  ) => (
    <RangeDatePicker
      value={field.value || [undefined, undefined]}
      onChange={(dates) => handleRangeChange(field, dates)}
      placeholder={placeholder}
      dateFormat={dateFormat}
      showTime={showTime}
      size={size}
      status={status}
      width={width}
      disabled={disabled}
      allowClear={allowClear}
      hideValue={hideValue}
      suffixIcon={suffixIcon}
      className={className}
      disabledDate={disabledDate}
    />
  );

  const renderSinglePicker = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
  ) => (
    <SingleDatePicker
      value={field.value}
      onChange={(date) => handleSingleChange(field, date)}
      placeholder={placeholder}
      pickerType={pickerType}
      dateFormat={dateFormat}
      showTime={showTime}
      size={size}
      status={status}
      width={width}
      disabled={disabled}
      allowClear={allowClear}
      hideValue={hideValue}
      suffixIcon={suffixIcon}
      className={className}
      disabledDate={disabledDate}
      disabledTime={disabledTime}
    />
  );

  return (
    <FormField
      control={control}
      name={name}
      rules={processedRules}
      render={({ field }) => (
        <FormItem sx={styles.formItem}>
          {label && (
            <FormLabel>
              {label}
              {isRequired && <span {...stylex.props(styles.requiredAsterisk)}>*</span>}
            </FormLabel>
          )}
          <FormControl>
            {isRangePicker ? renderRangePicker(field) : renderSinglePicker(field)}
          </FormControl>
          {!hideErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}

export default FormDatePicker;
