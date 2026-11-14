import type { FieldPath, FieldValues } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import * as stylex from '@stylexjs/stylex';

import { colors, radius, shadow } from '../../theme/tokens.stylex';
import { FormBase } from '../Form';
import { StepperControls } from './StepperControls';
import type { FormNumberInputProps } from './types';
import { useFormNumberInput } from './useFormNumberInput';
import { cn } from '../../utils';

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  numericInput: {
    width: '100%',
    minWidth: 0,
    borderRadius: radius.md,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    color: colors.foreground,
    boxShadow: shadow.xs,
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    height: '2.25rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
});

export function FormNumberInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  label,
  stepper = 1,
  min = '0',
  max = '100',
  minValue = Number.NEGATIVE_INFINITY,
  maxValue = Number.POSITIVE_INFINITY,
  thousandSeparator,
  placeholder,
  fixedDecimalScale = false,
  decimalScale = 0,
  suffix,
  prefix,
  inputClassName,
  onChange,
  rules,
  description,
  horizontal,
  controlFirst,
  width,
  ...props
}: FormNumberInputProps<TFieldValues, TName, TTransformedValues>) {
  const { enhancedRules, numericClass, getHandlers } = useFormNumberInput<TFieldValues, TName>({
    min: minValue,
    max: maxValue,
    rules,
    inputClassName,
    stepper,
    onChange,
    passthroughProps: props,
  });

  return (
    <FormBase
      control={control}
      name={name}
      label={label}
      description={description}
      rules={enhancedRules}
      horizontal={horizontal}
      controlFirst={controlFirst}
      width={width}
    >
      {({ id, 'aria-invalid': ariaInvalid, ...field }) => {
        const currentValue = field.value as number | undefined;
        const {
          handleIncrement,
          handleDecrement,
          handleKeyDown,
          handleBlur,
          numericOnValueChange,
        } = getHandlers({ currentValue, field });

        const inputStyleProps = stylex.props(styles.numericInput);

        return (
          <div {...stylex.props(styles.wrapper)}>
            <NumericFormat
              min={min}
              max={max}
              aria-invalid={ariaInvalid}
              value={currentValue ?? ''}
              onValueChange={numericOnValueChange}
              thousandSeparator={thousandSeparator}
              decimalScale={decimalScale}
              fixedDecimalScale={fixedDecimalScale}
              allowNegative={minValue < 0}
              valueIsNumericString={false}
              onBlur={handleBlur}
              suffix={suffix}
              prefix={prefix}
              placeholder={placeholder || '0'}
              getInputRef={field.ref}
              onKeyDown={handleKeyDown}
              name={field.name}
              {...props}
              id={id}
              {...inputStyleProps}
              className={cn(inputStyleProps.className, numericClass, props.className)}
            />
            <StepperControls
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              disableIncrement={currentValue !== undefined && currentValue >= maxValue}
              disableDecrement={currentValue !== undefined && currentValue <= minValue}
            />
          </div>
        );
      }}
    </FormBase>
  );
}
