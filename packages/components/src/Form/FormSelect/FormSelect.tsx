import React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { FormBase } from '../Form';
import type { FormMultiSelectProps, FormSingleSelectProps } from './types';
import { useFormSelect } from './useFormSelect';
import BaseSelect from '../../Select';
import type { SelectValue } from '../../Select/type';

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  T extends SelectValue = SelectValue,
>(props: FormMultiSelectProps<TFieldValues, T>): React.ReactElement;
export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  T extends SelectValue = SelectValue,
>(props: FormSingleSelectProps<TFieldValues, T>): React.ReactElement;
export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  T extends SelectValue = SelectValue,
>(
  props: FormMultiSelectProps<TFieldValues, T> | FormSingleSelectProps<TFieldValues, T>,
): React.ReactElement {
  const { baseSelectProps, isMulti, createChangeHandlers } = useFormSelect(props);
  const { required, rules, ...restProps } = props;
  const mergedRules = required ? { required: true, ...rules } : rules;

  return (
    <FormBase<TFieldValues, FieldPath<TFieldValues>> {...restProps} rules={mergedRules}>
      {(field) => {
        const { onChangeMulti, onChangeSingle } = createChangeHandlers(field);
        return isMulti ? (
          <BaseSelect<T>
            {...baseSelectProps}
            isMulti
            value={field.value as T[]}
            onChange={onChangeMulti}
          />
        ) : (
          <BaseSelect<T>
            {...baseSelectProps}
            isMulti={false}
            value={field.value as T}
            onChange={onChangeSingle}
          />
        );
      }}
    </FormBase>
  );
}
