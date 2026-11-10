import type { FocusEvent, KeyboardEvent } from 'react';
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import type { NumericFormatProps } from 'react-number-format';

import { cn } from '../../utils';

const numericInputBaseClass: string[] = [];

type PassthroughProps = Partial<
  Omit<
    NumericFormatProps,
    'value' | 'onValueChange' | 'placeholder' | 'max' | 'min' | 'name' | 'onChange' | 'width'
  >
>;

type HandlerArgs<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  currentValue: number | undefined;
  field: ControllerRenderProps<TFieldValues, TName>;
};

type UseFormNumberInputParams<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  rules?: RegisterOptions<TFieldValues, TName>;
  inputClassName?: string;
  stepper: number;
  min: number;
  max: number;
  onChange?: (value: number | undefined) => void;
  passthroughProps: PassthroughProps;
};

export function useFormNumberInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  rules,
  inputClassName,
  stepper,
  min,
  max,
  onChange,
  passthroughProps,
}: UseFormNumberInputParams<TFieldValues, TName>): {
  isRequired: boolean;
  enhancedRules: RegisterOptions<TFieldValues, TName> | undefined;
  numericClass: string;
  getHandlers: (args: HandlerArgs<TFieldValues, TName>) => {
    handleIncrement: () => void;
    handleDecrement: () => void;
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    handleBlur: (e?: FocusEvent<HTMLInputElement>) => void;
    numericOnValueChange: (values: { value: string; floatValue: number | undefined }) => void;
  };
} {
  const isRequired = rules?.required !== undefined && rules.required !== false;

  const enhancedRules = (() => {
    if (!rules) return rules;

    const newRules = { ...rules };
    if (
      isRequired &&
      typeof newRules.required !== 'string' &&
      typeof newRules.required !== 'object'
    ) {
      newRules.required = 'This field is required';
    } else if (typeof newRules.required === 'object' && !newRules.required.message) {
      newRules.required = {
        ...newRules.required,
        message: 'This field is required',
      };
    }
    return newRules;
  })();

  const numericClass = cn(numericInputBaseClass, inputClassName);

  const getHandlers = ({ currentValue, field }: HandlerArgs<TFieldValues, TName>) => {
    const handleIncrement = () => {
      const base = currentValue ?? 0;
      const next = Math.min(base + stepper, max);
      field.onChange(next);
      onChange?.(next);
    };

    const handleDecrement = () => {
      const base = currentValue ?? 0;
      const next = Math.max(base - stepper, min);
      field.onChange(next);
      onChange?.(next);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }

      passthroughProps.onKeyDown?.(e);
    };

    const handleBlur = (e?: FocusEvent<HTMLInputElement>) => {
      const cur = currentValue;
      if (cur !== undefined) {
        if (cur < min) {
          field.onChange(min);
          onChange?.(min);
        } else if (cur > max) {
          field.onChange(max);
          onChange?.(max);
        }
      }
      field.onBlur();
      if (e) {
        passthroughProps.onBlur?.(e);
      }
    };

    const numericOnValueChange = (values: { value: string; floatValue: number | undefined }) => {
      const newValue = values.floatValue === undefined ? undefined : values.floatValue;
      field.onChange(newValue);
      onChange?.(newValue);
    };

    return {
      handleIncrement,
      handleDecrement,
      handleKeyDown,
      handleBlur,
      numericOnValueChange,
    };
  };

  return {
    isRequired,
    enhancedRules,
    numericClass,
    getHandlers,
  };
}
