import { useState, type ReactNode } from 'react';
import { Controller, type FieldValues, type RegisterOptions } from 'react-hook-form';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button, type ButtonProps } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import type {
  FormBaseProps,
  FormControlFunc,
  FormInputExtraProps,
  FormTextareaExtraProps,
  FormCheckboxExtraProps,
  FormSwitchExtraProps,
} from './types';
import type { FieldPath } from 'react-hook-form';
import Icons from '../Icons';
import { Text } from '../Typography';

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
    marginLeft: '0.1875rem',
    display: 'inline-block',
    lineHeight: 1,
    fontSize: '0.875rem',
    userSelect: 'none',
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
  TTransformedValues = TFieldValues,
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
  className,
  width,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  const processedRules = (() => {
    const autoRules: RegisterOptions<TFieldValues, TName> = { ...rules };
    if (htmlType === 'email' && !rules?.pattern) {
      autoRules.pattern = {
        value: EMAIL_PATTERN,
        message: 'Invalid email address',
      };
    }
    if (htmlType === 'tel' && !rules?.pattern) {
      autoRules.pattern = {
        value: PHONE_PATTERN,
        message: 'Invalid phone number',
      };
    }

    if (rules?.required !== undefined && rules.required !== false) {
      if (typeof rules.required === 'string') {
        autoRules.required = rules.required;
      } else if (typeof rules.required === 'object') {
        if (!rules.required.message) {
          autoRules.required = {
            ...rules.required,
            message: 'This field is required',
          };
        }
      } else {
        autoRules.required = 'This field is required';
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
                <Text as="span" weight="medium" size="sm" required={Boolean(rules?.required)}>
                  {label}
                </Text>
              </FieldLabel>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );
        const controlNode = children({
          ...field,
          id: field.name,
          'aria-invalid': fieldState.invalid,
        });
        const errorElem = fieldState.invalid && <FieldError errors={[fieldState.error]} />;

        return (
          <Field
            className={className}
            width={width}
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}
          >
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
  inputClassName,
  wrapperClassName,
  className,
  leftIcon,
  rightIcon,
  prefix,
  prefixIcon,
  prefixButton,
  suffix,
  suffixIcon,
  suffixButton,
  buttonSize,
  iconSize,
  autoComplete,
  htmlType,
  htmlSize,
  sx,
  width,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = htmlType ?? props.type;
  const isPassword = inputType === 'password';
  const resolvedAutoComplete = autoComplete ?? getAutoComplete(String(props.name), inputType);

  const resolvedPrefix = prefix ?? prefixIcon ?? leftIcon;
  const resolvedSuffix = suffix ?? suffixIcon ?? rightIcon;

  const passwordSuffixButton = isPassword ? (
    <Button
      type="button"
      htmlType="button"
      variant="ghost"
      size={buttonSize ? (`icon-${buttonSize}` as ButtonProps['size']) : 'icon-sm'}
      onClick={() => setShowPassword(!showPassword)}
      tabIndex={-1}
    >
      {showPassword ? (
        <Icons.EyeOff {...stylex.props(styles.iconSize)} />
      ) : (
        <Icons.Eye {...stylex.props(styles.iconSize)} />
      )}
    </Button>
  ) : undefined;

  const resolvedSuffixButton = suffixButton ?? passwordSuffixButton;

  return (
    <FormBase
      name={props.name}
      control={props.control}
      label={props.label}
      description={props.description}
      rules={props.rules}
      htmlType={inputType}
      className={wrapperClassName}
      width={width}
    >
      {(field) => (
        <Input
          {...field}
          {...props}
          width={width}
          type={isPassword && showPassword ? 'text' : inputType}
          htmlType={isPassword && showPassword ? 'text' : inputType}
          htmlSize={htmlSize}
          autoComplete={resolvedAutoComplete}
          buttonSize={buttonSize}
          iconSize={iconSize}
          prefix={resolvedPrefix}
          prefixButton={prefixButton}
          suffix={resolvedSuffix}
          suffixButton={resolvedSuffixButton}
          className={inputClassName ?? className}
          sx={sx}
        />
      )}
    </FormBase>
  );
};

export const FormTextarea: FormControlFunc<FormTextareaExtraProps> = ({
  textareaClassName,
  wrapperClassName,
  className,
  sx,
  width,
  ...props
}) => {
  return (
    <FormBase
      name={props.name}
      control={props.control}
      label={props.label}
      description={props.description}
      rules={props.rules}
      className={wrapperClassName}
      width={width}
    >
      {(field) => (
        <Textarea
          {...field}
          {...props}
          width={width}
          className={textareaClassName ?? className}
          sx={sx}
        />
      )}
    </FormBase>
  );
};

export const FormSimpleSelect: FormControlFunc<{ children: ReactNode }> = ({
  children,
  width,
  ...props
}) => {
  return (
    <FormBase {...props} width={width}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger
            aria-invalid={field['aria-invalid']}
            id={field.id}
            onBlur={onBlur}
            width={width}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
};

export const FormCheckbox: FormControlFunc<FormCheckboxExtraProps> = ({
  checkboxClassName,
  wrapperClassName,
  className,
  sx,
  disabled,
  size = 'md',
  ...props
}) => {
  return (
    <FormBase
      name={props.name}
      control={props.control}
      label={props.label}
      description={props.description}
      rules={props.rules}
      horizontal
      controlFirst
      className={wrapperClassName}
    >
      {({ onChange, value, ...field }) => (
        <Checkbox
          {...field}
          {...props}
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
          size={size}
          className={checkboxClassName ?? className}
          sx={sx}
        />
      )}
    </FormBase>
  );
};

export const FormSwitch: FormControlFunc<FormSwitchExtraProps> = ({
  switchClassName,
  wrapperClassName,
  className,
  sx,
  disabled,
  size = 'md',
  ...props
}) => {
  return (
    <FormBase
      name={props.name}
      control={props.control}
      label={props.label}
      description={props.description}
      rules={props.rules}
      horizontal
      controlFirst
      className={wrapperClassName}
    >
      {({ onChange, value, ...field }) => (
        <Switch
          {...field}
          {...props}
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
          size={size}
          className={switchClassName ?? className}
          sx={sx}
        />
      )}
    </FormBase>
  );
};
