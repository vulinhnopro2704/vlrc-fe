import type { ReactNode } from 'react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import type { InputProps } from '../ui/input';
import type { TextareaProps } from '../ui/textarea';
import type { CheckboxProps } from '../ui/checkbox';
import type { SwitchProps } from '../ui/switch';

/**
 * Base properties required for any form control connected to React Hook Form.
 * @template TFieldValues The shape of the form values.
 * @template TName The path to the specific field in the form values.
 * @template TTransformedValues The shape of the transformed form values.
 */
export type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  /** The name (path) of the field in the form data. */
  name: TName;
  /** The label text or element to display for the field. */
  label?: ReactNode;
  /** Additional descriptive text to display below or next to the field. */
  description?: ReactNode;
  /** The React Hook Form control object used to register the field. */
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control'];
};

/**
 * Properties for standard text input form component, inheriting all HTML input and Input component attributes.
 */
export type FormInputExtraProps = Omit<
  InputProps,
  'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'ref'
> & {
  /** Left icon element alias for prefix */
  leftIcon?: ReactNode;
  /** Right icon element alias for suffix */
  rightIcon?: ReactNode;
  /** Additional CSS classes to apply directly to the input element (vs wrapper className). */
  inputClassName?: string;
  /** Additional CSS classes to apply to the outermost field wrapper. */
  wrapperClassName?: string;
};

/**
 * Properties for textarea form component, inheriting all HTML textarea and Textarea component attributes.
 */
export type FormTextareaExtraProps = Omit<
  TextareaProps,
  'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'ref'
> & {
  /** Additional CSS classes to apply directly to the textarea element (vs wrapper className). */
  textareaClassName?: string;
  /** Additional CSS classes to apply to the outermost field wrapper. */
  wrapperClassName?: string;
};

/**
 * Properties for checkbox form component, inheriting all Radix checkbox attributes.
 */
export type FormCheckboxExtraProps = Omit<
  CheckboxProps,
  'name' | 'defaultChecked' | 'checked' | 'onCheckedChange' | 'ref'
> & {
  /** Additional CSS classes to apply directly to the checkbox element (vs wrapper className). */
  checkboxClassName?: string;
  /** Additional CSS classes to apply to the outermost field wrapper. */
  wrapperClassName?: string;
};

/**
 * Properties for switch form component, inheriting all Radix switch attributes.
 */
export type FormSwitchExtraProps = Omit<
  SwitchProps,
  'name' | 'defaultChecked' | 'checked' | 'onCheckedChange' | 'ref'
> & {
  /** Additional CSS classes to apply directly to the switch element (vs wrapper className). */
  switchClassName?: string;
  /** Additional CSS classes to apply to the outermost field wrapper. */
  wrapperClassName?: string;
};

/**
 * Properties for the internal FormBase wrapper component.
 * This component handles the boilerplate of connecting a UI element to React Hook Form
 * via the Controller component, along with rendering labels, descriptions, and error messages.
 */
export type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  /** If true, arranges the label and the control horizontally instead of vertically. */
  horizontal?: boolean;
  /** If true, renders the control element before the label element (useful for checkboxes/radios). */
  controlFirst?: boolean;
  /** Additional CSS classes to apply to the outermost field wrapper. */
  className?: string;
  /**
   * Render prop that provides the connected field props to the actual UI component.
   * It injects React Hook Form's field props along with `id` and `aria-invalid` for accessibility.
   */
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[0]['field'] & {
      'aria-invalid': boolean;
      id: string;
    },
  ) => ReactNode;
  /** Validation rules to apply to the field (e.g., required, min, max, pattern). */
  rules?: ControllerProps<TFieldValues, TName, TTransformedValues>['rules'];
  /** The HTML type attribute of the input, used for applying auto-validation rules (e.g., email, tel). */
  htmlType?: string;
};

/**
 * A type definition for standardizing the signature of form control components.
 * Form control components should accept base form control props, validation rules,
 * HTML type, generic class names, and any component-specific extra props.
 *
 * @template ExtraProps Additional props specific to the UI component being wrapped.
 */
export type FormControlFunc<ExtraProps extends object = Record<never, never>> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> &
    ExtraProps & {
      /** Validation rules for the field. */
      rules?: ControllerProps<TFieldValues, TName, TTransformedValues>['rules'];
      /** The HTML type attribute (e.g., 'text', 'password', 'email'). */
      htmlType?: string;
      /** Additional CSS classes for the component wrapper. */
      className?: string;
    },
) => ReactNode;
