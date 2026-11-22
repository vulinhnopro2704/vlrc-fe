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
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: shadow.ring,
    },
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
  min,
  max,
  minValue,
  maxValue,
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
  const resolvedMin = (() => {
    if (minValue !== undefined) return minValue;
    if (min !== undefined && min !== '') return Number(min);
    return Number.NEGATIVE_INFINITY;
  })();

  const resolvedMax = (() => {
    if (maxValue !== undefined) return maxValue;
    if (max !== undefined && max !== '') return Number(max);
    return Number.POSITIVE_INFINITY;
  })();

  const { enhancedRules, numericClass, getHandlers } = useFormNumberInput<TFieldValues, TName>({
    min: resolvedMin,
    max: resolvedMax,
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
              min={resolvedMin !== Number.NEGATIVE_INFINITY ? resolvedMin : undefined}
              max={resolvedMax !== Number.POSITIVE_INFINITY ? resolvedMax : undefined}
              aria-invalid={ariaInvalid}
              value={currentValue ?? ''}
              onValueChange={numericOnValueChange}
              thousandSeparator={thousandSeparator}
              decimalScale={decimalScale}
              fixedDecimalScale={fixedDecimalScale}
              allowNegative={resolvedMin < 0}
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
              disableIncrement={currentValue !== undefined && currentValue >= resolvedMax}
              disableDecrement={currentValue !== undefined && currentValue <= resolvedMin}
            />
          </div>
        );
      }}
    </FormBase>
  );
}
