import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow, spacing } from '../theme/tokens.stylex';
import { Button, type ButtonProps } from './button';
import { Text } from '../Typography';

interface EditableContextValue {
  value: string;
  setValue: (value: string) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  disabled: boolean;
  readOnly: boolean;
  placeholder: string;
  triggerMode: 'click' | 'dblclick';
  submitOnBlur: boolean;
  submit: () => void;
  cancel: () => void;
  edit: () => void;
}

const EditableContext = React.createContext<EditableContextValue | null>(null);

function useEditableContext(component: string): EditableContextValue {
  const context = React.useContext(EditableContext);
  if (!context) {
    throw new Error(`${component} must be used within an Editable`);
  }
  return context;
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    maxWidth: '100%',
  },
  area: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    width: '100%',
  },
  preview: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: radius.sm,
    paddingInline: spacing.xs,
    paddingBlock: '0.125rem',
    cursor: 'pointer',
    color: colors.foreground,
    transitionProperty: 'background-color, color',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: colors.muted,
    },
  },
  previewPlaceholder: {
    color: colors.mutedForeground,
  },
  previewDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
  input: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.ring,
    backgroundColor: colors.background,
    color: colors.foreground,
    paddingInline: spacing.xs,
    paddingBlock: '0.125rem',
    outline: 'none',
    boxShadow: shadow.ring,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontFamily: 'inherit',
    minWidth: '4rem',
  },
  toolbar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
});

export interface EditableProps extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  editing?: boolean;
  defaultEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  triggerMode?: 'click' | 'dblclick';
  submitOnBlur?: boolean;
  sx?: stylex.StyleXStyles;
}

function Editable({
  className,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  onSubmit,
  onCancel,
  editing: controlledEditing,
  defaultEditing = false,
  onEditingChange,
  disabled = false,
  readOnly = false,
  placeholder = 'Click to edit...',
  triggerMode = 'click',
  submitOnBlur = true,
  sx,
  children,
  ...props
}: EditableProps) {
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue);
  const [internalEditing, setInternalEditing] = React.useState<boolean>(defaultEditing);
  const previousValueRef = React.useRef<string>(defaultValue);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const isEditing = controlledEditing !== undefined ? controlledEditing : internalEditing;

  const setEditing = React.useCallback(
    (nextEditing: boolean) => {
      if (disabled || readOnly) return;
      if (controlledEditing === undefined) {
        setInternalEditing(nextEditing);
      }
      onEditingChange?.(nextEditing);
    },
    [disabled, readOnly, controlledEditing, onEditingChange],
  );

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [controlledValue, onValueChange],
  );

  const edit = React.useCallback(() => {
    if (disabled || readOnly) return;
    previousValueRef.current = currentValue;
    setEditing(true);
  }, [disabled, readOnly, currentValue, setEditing]);

  const submit = React.useCallback(() => {
    if (!isEditing) return;
    setEditing(false);
    onSubmit?.(currentValue);
  }, [isEditing, setEditing, onSubmit, currentValue]);

  const cancel = React.useCallback(() => {
    if (!isEditing) return;
    setValue(previousValueRef.current);
    setEditing(false);
    onCancel?.();
  }, [isEditing, setValue, setEditing, onCancel]);

  const contextValue = React.useMemo<EditableContextValue>(
    () => ({
      value: currentValue,
      setValue,
      editing: isEditing,
      setEditing,
      disabled,
      readOnly,
      placeholder,
      triggerMode,
      submitOnBlur,
      submit,
      cancel,
      edit,
    }),
    [
      currentValue,
      setValue,
      isEditing,
      setEditing,
      disabled,
      readOnly,
      placeholder,
      triggerMode,
      submitOnBlur,
      submit,
      cancel,
      edit,
    ],
  );

  const sxProps = stylex.props(styles.root, sx);

  return (
    <EditableContext.Provider value={contextValue}>
      <div
        data-slot="editable"
        data-editing={isEditing ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </div>
    </EditableContext.Provider>
  );
}

export interface EditableAreaProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function EditableArea({ className, sx, children, ...props }: EditableAreaProps) {
  const sxProps = stylex.props(styles.area, sx);
  return (
    <div
      data-slot="editable-area"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface EditablePreviewProps extends React.ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function EditablePreview({
  className,
  onClick,
  onDoubleClick,
  sx,
  ...props
}: EditablePreviewProps) {
  const { value, editing, placeholder, disabled, readOnly, triggerMode, edit } =
    useEditableContext('EditablePreview');

  if (editing) return null;

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (triggerMode === 'click') {
      edit();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    onDoubleClick?.(e);
    if (e.defaultPrevented) return;
    if (triggerMode === 'dblclick') {
      edit();
    }
  };

  const isEmpty = !value;
  const sxProps = stylex.props(
    styles.preview,
    isEmpty && styles.previewPlaceholder,
    (disabled || readOnly) && styles.previewDisabled,
    sx,
  );

  return (
    <Text
      as="span"
      data-slot="editable-preview"
      type="inherit"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {isEmpty ? placeholder : value}
    </Text>
  );
}

export interface EditableInputProps extends React.ComponentProps<'input'> {
  sx?: stylex.StyleXStyles;
}

function EditableInput({
  className,
  onKeyDown,
  onBlur,
  onChange,
  sx,
  ...props
}: EditableInputProps) {
  const {
    value,
    setValue,
    editing,
    submitOnBlur,
    submit,
    cancel,
    disabled,
    readOnly,
    placeholder,
  } = useEditableContext('EditableInput');
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (!editing) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    if (e.defaultPrevented) return;
    if (submitOnBlur) {
      submit();
    } else {
      cancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (e.defaultPrevented) return;
    setValue(e.target.value);
  };

  const sxProps = stylex.props(styles.input, sx);

  return (
    <input
      ref={inputRef}
      type="text"
      data-slot="editable-input"
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onChange={handleChange}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface EditableToolbarProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function EditableToolbar({ className, sx, children, ...props }: EditableToolbarProps) {
  const sxProps = stylex.props(styles.toolbar, sx);
  return (
    <div
      role="toolbar"
      data-slot="editable-toolbar"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface EditableTriggerProps extends ButtonProps {
  sx?: stylex.StyleXStyles;
}

function EditableTrigger({
  onClick,
  variant = 'ghost',
  size = 'xs',
  children,
  ...props
}: EditableTriggerProps) {
  const { edit, editing, disabled, readOnly } = useEditableContext('EditableTrigger');

  if (editing || disabled || readOnly) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    edit();
  };

  return (
    <Button
      type="button"
      data-slot="editable-trigger"
      variant={variant}
      size={size}
      onClick={handleClick}
      {...props}
    >
      {children ?? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
      )}
    </Button>
  );
}

export interface EditableSubmitProps extends ButtonProps {
  sx?: stylex.StyleXStyles;
}

function EditableSubmit({
  onClick,
  variant = 'ghost',
  size = 'xs',
  children,
  ...props
}: EditableSubmitProps) {
  const { submit, editing } = useEditableContext('EditableSubmit');

  if (!editing) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    submit();
  };

  return (
    <Button
      type="button"
      data-slot="editable-submit"
      variant={variant}
      size={size}
      onClick={handleClick}
      {...props}
    >
      {children ?? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </Button>
  );
}

export interface EditableCancelProps extends ButtonProps {
  sx?: stylex.StyleXStyles;
}

function EditableCancel({
  onClick,
  variant = 'ghost',
  size = 'xs',
  children,
  ...props
}: EditableCancelProps) {
  const { cancel, editing } = useEditableContext('EditableCancel');

  if (!editing) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    cancel();
  };

  return (
    <Button
      type="button"
      data-slot="editable-cancel"
      variant={variant}
      size={size}
      onClick={handleClick}
      {...props}
    >
      {children ?? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </Button>
  );
}

export {
  Editable,
  EditableArea,
  EditablePreview,
  EditableInput,
  EditableToolbar,
  EditableTrigger,
  EditableSubmit,
  EditableCancel,
};
