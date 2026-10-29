import { useState, type ReactNode } from 'react';
import { Controller, type FieldValues, type RegisterOptions } from 'react-hook-form';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '../ui/field';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import type { FormBaseProps, FormControlFunc, FormInputExtraProps } from './types';
import type { FieldPath } from 'react-hook-form';
import Icons from '../Icons';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

const getAutoComplete = (name: string, htmlType?: string) => {
  const normalizedName = name.toLowerCase();

  if (htmlType === 'password') {
    if (normalizedName.includes('confirm') || normalizedName.includes('new')) {
      return 'new-password';
    }

    return 'current-password';
  }

  if (htmlType === 'email' || normalizedName.includes('email')) {
    return 'email';
  }

  if (htmlType === 'tel' || normalizedName.includes('phone')) {
    return 'tel';
  }

  if (normalizedName.includes('name')) {
    return 'name';
  }

  if (normalizedName.includes('username')) {
    return 'username';
  }

  return undefined;
};

const styles = stylex.create({
  requiredAsterisk: {
    color: colors.destructive,
    marginLeft: '0.25rem',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  leftIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.mutedForeground,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.mutedForeground,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  inputWithLeftIcon: {
    paddingLeft: '2.5rem',
  },
  inputWithRightIcon: {
    paddingRight: '2.5rem',
  },
  passwordToggle: {
    position: 'absolute',
    right: '0.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.mutedForeground,
    ':hover': {
      color: colors.foreground,
    },
    zIndex: 2,
  },
  iconSize: {
    width: '1rem',
    height: '1rem',
  },
});

export function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  label,
  control,
  name,
  htmlType,
  description,
  controlFirst,
  horizontal,
  rules,
  className
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  const processedRules = (() => {
    const autoRules: RegisterOptions<TFieldValues, TName> = { ...rules };
    if (htmlType === 'email' && !rules?.pattern) {
      autoRules.pattern = {
        value: EMAIL_PATTERN,
        message: 'Email không hợp lệ'
      };
    }
    if (htmlType === 'tel' && !rules?.pattern) {
      autoRules.pattern = {
        value: PHONE_PATTERN,
        message: 'Số điện thoại không hợp lệ'
      };
    }

    if (rules?.required !== undefined && rules.required !== false) {
      if (typeof rules.required === 'string') {
        autoRules.required = rules.required;
      } else if (typeof rules.required === 'object') {
        if (!rules.required.message) {
          autoRules.required = {
            ...rules.required,
            message: 'Trường này là bắt buộc'
          };
        }
      } else {
        autoRules.required = 'Trường này là bắt buộc';
      }
    }

    return autoRules;
  })();

  return (
    <Controller
      control={control}
      name={name}
      rules={processedRules}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            {label && (
              <FieldLabel htmlFor={field.name}>
                {label}
                {rules?.required && (
                  <span {...stylex.props(styles.requiredAsterisk)}>*</span>
                )}
              </FieldLabel>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );
        const controlNode = children({
          ...field,
          id: field.name,
          'aria-invalid': fieldState.invalid
        });
        const errorElem = fieldState.invalid && <FieldError errors={[fieldState.error]} />;

        return (
          <Field
            className={className}
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}>
            {controlFirst ? (
              <>
                {controlNode}
                <FieldContent>
                  {labelElement}
                  {errorElem}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {controlNode}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

export const FormInput: FormControlFunc<FormInputExtraProps> = ({
  placeholder,
  inputClassName,
  leftIcon,
  rightIcon,
  disabled,
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.htmlType === 'password';
  const resolvedAutoComplete = autoComplete ?? getAutoComplete(String(props.name), props.htmlType);

  return (
    <FormBase {...props}>
      {field => (
        <div {...stylex.props(styles.inputWrapper)}>
          {leftIcon && (
            <div {...stylex.props(styles.leftIcon)}>
              {leftIcon}
            </div>
          )}
          <Input
            {...field}
            type={isPassword && showPassword ? 'text' : props.htmlType}
            autoComplete={resolvedAutoComplete}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
            sx={[
              leftIcon ? styles.inputWithLeftIcon : undefined,
              isPassword || rightIcon ? styles.inputWithRightIcon : undefined,
            ]}
          />
          {isPassword && (
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              onClick={() => setShowPassword(!showPassword)}
              sx={styles.passwordToggle}
              tabIndex={-1}>
              {showPassword ? (
                <Icons.EyeOff {...stylex.props(styles.iconSize)} />
              ) : (
                <Icons.Eye {...stylex.props(styles.iconSize)} />
              )}
            </Button>
          )}
          {!isPassword && rightIcon && (
            <div {...stylex.props(styles.rightIcon)}>
              {rightIcon}
            </div>
          )}
        </div>
      )}
    </FormBase>
  );
};

export const FormTextarea: FormControlFunc = props => {
  return <FormBase {...props}>{field => <Textarea {...field} />}</FormBase>;
};

export const FormSimpleSelect: FormControlFunc<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger aria-invalid={field['aria-invalid']} id={field.id} onBlur={onBlur}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
};

export const FormCheckbox: FormControlFunc<{ disabled?: boolean }> = ({ disabled, ...props }) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} disabled={disabled} />
      )}
    </FormBase>
  );
};
