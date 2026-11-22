import type { FieldPath, FieldValues } from 'react-hook-form';
import { FormBase } from '../Form';
import { RangeDatePicker } from './RangeDatePicker';
import { SingleDatePicker } from './SingleDatePicker';
import type { FormDatePickerProps } from './types';
import { useFormDatePicker } from './useFormDatePicker';

function FormDatePicker<TFieldValues extends FieldValues>(
  props: FormDatePickerProps<TFieldValues>,
) {
  const {
    control,
    name,
    label,
    placeholder,
    status,
    size = 'md',
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
    suffixIcon,
    className,
    disabledDate,
    disabledTime,
    locale,
    numberOfMonths,
    closeOnSelect,
    startMonth,
    endMonth,
    required,
    description,
    controlFirst,
    horizontal,
  } = props;

  const resolvedRules = required ? { required: true, ...rules } : rules;

  const { dateFormat, processedRules, handleRangeChange, handleSingleChange } = useFormDatePicker({
    pickerType,
    showTime,
    dateFormat: customFormat,
    rules: resolvedRules,
    onChangeDate,
    onChangeRange,
  });

  return (
    <FormBase<TFieldValues, FieldPath<TFieldValues>>
      control={control}
      name={name}
      label={label}
      description={description}
      controlFirst={controlFirst}
      horizontal={horizontal}
      rules={processedRules}
      className={className}
    >
      {(field) => {
        const isInvalid = Boolean(field['aria-invalid']);
        const effectiveStatus = isInvalid ? 'error' : status;
        const describedBy = `${field.id}-description`;

        return isRangePicker ? (
          <RangeDatePicker
            id={field.id}
            aria-describedby={description ? describedBy : undefined}
            aria-invalid={field['aria-invalid']}
            value={field.value || [undefined, undefined]}
            onChange={(dates) => handleRangeChange(field, dates)}
            placeholder={placeholder}
            dateFormat={dateFormat}
            showTime={showTime}
            size={size}
            status={effectiveStatus}
            width={width}
            disabled={disabled}
            allowClear={allowClear}
            hideValue={hideValue}
            suffixIcon={suffixIcon}
            className={className}
            disabledDate={disabledDate}
            locale={locale}
            numberOfMonths={numberOfMonths}
            closeOnSelect={closeOnSelect}
            startMonth={startMonth}
            endMonth={endMonth}
          />
        ) : (
          <SingleDatePicker
            id={field.id}
            aria-describedby={description ? describedBy : undefined}
            aria-invalid={field['aria-invalid']}
            value={field.value}
            onChange={(date) => handleSingleChange(field, date)}
            placeholder={placeholder}
            pickerType={pickerType}
            dateFormat={dateFormat}
            showTime={showTime}
            size={size}
            status={effectiveStatus}
            width={width}
            disabled={disabled}
            allowClear={allowClear}
            hideValue={hideValue}
            suffixIcon={suffixIcon}
            className={className}
            disabledDate={disabledDate}
            disabledTime={disabledTime}
            locale={locale}
            startMonth={startMonth}
            endMonth={endMonth}
          />
        );
      }}
    </FormBase>
  );
}

export default FormDatePicker;
