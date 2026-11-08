import type { FieldValues } from 'react-hook-form';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../theme/tokens.stylex';
import { FormBase } from '../Form';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import type { FormRadioProps } from './types';
import { useFormRadio } from './useFormRadio';

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    marginTop: '0.125rem',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  label: {
    cursor: 'pointer',
    fontWeight: 400,
    fontSize: '0.875rem',
    color: colors.foreground,
    userSelect: 'none',
  },
  scrollable: {
    overflowY: 'auto',
  },
});

export function FormRadio<TFieldValues extends FieldValues>({
  name,
  control,
  label = '',
  size: _size = 'middle',
  options = [],
  onChange,
  value,
  rules = {},
  disabled = false,
  optionType: _optionType = 'default',
  buttonStyle: _buttonStyle,
  autoHeightMax,
  showEmpty = false,
  hideErrorMessage: _hideErrorMessage = false,
  className,
}: FormRadioProps<TFieldValues>) {
  const { processedRules, parseValue, emitChange } = useFormRadio({
    rules,
    value,
    onChange,
    showEmpty,
  });

  return (
    <FormBase
      name={name}
      control={control}
      label={label}
      rules={processedRules}
      className={className}
    >
      {(field) => (
        <RadioGroup
          value={parseValue(value ?? field.value)}
          onValueChange={(newValue) => emitChange(field.onChange, newValue)}
          disabled={disabled}
          sx={[styles.list, autoHeightMax ? styles.scrollable : undefined]}
          style={autoHeightMax ? { maxHeight: `${autoHeightMax}px` } : undefined}
        >
          {options.map((option) => (
            <div key={String(option.value)} {...stylex.props(styles.option)}>
              <RadioGroupItem
                value={String(option.value)}
                id={`${String(name)}-${option.value}`}
                disabled={disabled || option.disabled}
              />
              <Label htmlFor={`${String(name)}-${option.value}`} sx={styles.label}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </FormBase>
  );
}
