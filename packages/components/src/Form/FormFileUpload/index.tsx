import { useCallback, type ReactElement } from 'react';
import {
  useFormContext,
  type UseFormReturn,
  type FieldValues,
  type ErrorOption,
} from 'react-hook-form';
import { FormBase } from '../Form';
import type { FormControlFunc } from '../types';
import {
  FileUpload,
  type FileUploadProps,
  type FileUploadBaseProps,
  type FileUploadAutoProps,
  type FileUploadManualProps,
} from './FileUpload';

export type { FileUploadProps, FileUploadBaseProps, FileUploadAutoProps, FileUploadManualProps };

/**
 * Type guard verifying if an unknown target has setError and clearErrors methods.
 *
 * @param target Candidate object to inspect
 * @returns true if target implements setError and clearErrors
 */
function isFormErrorDispatcher(
  target: unknown,
): target is Pick<UseFormReturn<FieldValues>, 'setError' | 'clearErrors'> {
  if (typeof target !== 'object' || target === null) {
    return false;
  }
  return 'setError' in target && 'clearErrors' in target;
}

/**
 * Dispatches a validation error for a specific field to React Hook Form.
 * Prioritizes formContext if available, falling back to control instance.
 *
 * @param context Primary form context from useFormContext()
 * @param control Fallback form control passed via props
 * @param fieldName Name of the registered form field
 * @param errorMessage Descriptive error message to display
 */
function dispatchFieldError(
  context: UseFormReturn<FieldValues> | null,
  control: unknown,
  fieldName: string,
  errorMessage: string,
): void {
  const errorPayload: ErrorOption = { type: 'validate', message: errorMessage };

  if (context?.setError) {
    context.setError(fieldName, errorPayload, { shouldFocus: true });
    return;
  }

  if (isFormErrorDispatcher(control)) {
    control.setError(fieldName, errorPayload, { shouldFocus: true });
  }
}

/**
 * Clears validation errors for a specific field in React Hook Form.
 * Prioritizes formContext if available, falling back to control instance.
 *
 * @param context Primary form context from useFormContext()
 * @param control Fallback form control passed via props
 * @param fieldName Name of the registered form field
 */
function clearFieldError(
  context: UseFormReturn<FieldValues> | null,
  control: unknown,
  fieldName: string,
): void {
  if (context?.clearErrors) {
    context.clearErrors(fieldName);
    return;
  }

  if (isFormErrorDispatcher(control)) {
    control.clearErrors(fieldName);
  }
}

/**
 * Props for `FormFileUpload` / `FormFileUploader`, excluding `value` and `onChange`
 * which are controlled automatically by React Hook Form.
 */
export type FormFileUploadExtraProps = Omit<FileUploadProps, 'value' | 'onChange'>;
export type FormFileUploaderProps = FormFileUploadExtraProps;

/**
 * Connected React Hook Form control for file uploads with automatic label,
 * required indicator, description, and error messaging.
 *
 * Supports:
 * - `variant`: `'default' | 'avatar' | 'compact'`
 * - `autoUpload`: immediate upload via UploadThing or custom HTTP API
 * - `manual`: keeps `File` or `File[]` in form state until submission
 * - Customization props: `showFileList`, `showProgress`, `showPreview`, `showClear`
 */
export const FormFileUpload: FormControlFunc<FormFileUploadExtraProps> = (props): ReactElement => {
  const {
    control,
    name,
    rules: _r,
    label: _l,
    description: _d,
    htmlType: _ht,
    width: _w,
    className,
    sx,
    disabled: propsDisabled,
    onFileReject: userOnFileReject,
    onAccept: userOnAccept,
    ...restProps
  } = props;

  const formContext = useFormContext();

  const handleFileReject = useCallback(
    (file: File, message: string): void => {
      dispatchFieldError(formContext, control, name, message);
      userOnFileReject?.(file, message);
    },
    [formContext, name, control, userOnFileReject],
  );

  const handleAccept = useCallback(
    (files: File[]): void => {
      clearFieldError(formContext, control, name);
      userOnAccept?.(files);
    },
    [formContext, name, control, userOnAccept],
  );

  return (
    <FormBase {...props}>
      {({ onChange, value, disabled, 'aria-invalid': ariaInvalid }) => (
        <FileUpload
          {...(restProps as FileUploadProps)}
          value={value}
          onChange={(newVal) => {
            if (!newVal || (Array.isArray(newVal) && newVal.length === 0)) {
              clearFieldError(formContext, control, name);
            }
            onChange(newVal);
          }}
          onFileReject={handleFileReject}
          onAccept={handleAccept}
          hideError={Boolean(ariaInvalid)}
          disabled={disabled || propsDisabled}
          className={className}
          sx={sx}
        />
      )}
    </FormBase>
  );
};

export const FormFileUploader = FormFileUpload;
export default FormFileUpload;
export { FileUpload as FileDropzone };
