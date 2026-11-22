import MultiSelect from '../../MultiSelect';
import { FormBase } from '../Form';
import type { FormControlFunc } from '../types';
import type { MultiSelectProps } from '../../MultiSelect/type';

/**
 * MultiSelect props adapted for form usage: the value wiring (value / onValueChange)
 * is handled by the FormBase -> Controller connection, so it must not be required here.
 */
type FormMultiSelectExtraProps = Omit<
  MultiSelectProps,
  'value' | 'defaultValue' | 'onValueChange' | 'ref'
> &
  Record<string, unknown>;

export const FormMultiSelect: FormControlFunc<FormMultiSelectExtraProps> = ({
  options,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, value, ...field }) => (
        <MultiSelect {...field} options={options} onValueChange={onChange} value={value} />
      )}
    </FormBase>
  );
};

export default FormMultiSelect;
