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
export const FormFileUpload: FormControlFunc<FormFileUploadExtraProps> = (props) => {
  return (
    <FormBase {...props}>
      {({ onChange, value, disabled }) => (
        <FileUpload
          {...(props as unknown as FileUploadProps)}
          value={value}
          onChange={onChange}
          disabled={disabled || props.disabled}
          className={props.className}
          sx={props.sx}
        />
      )}
    </FormBase>
  );
};

export const FormFileUploader = FormFileUpload;
export default FormFileUpload;
export { FileUpload as FileDropzone };
