'use client';

import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { colors } from '../theme/tokens.stylex';
import { cn } from '../utils';
import { Label } from './label';
import { resolveWidth, type ComponentWidth } from '../theme/width';
import { Paragraph } from '../Typography';

const styles = stylex.create({
  item: {
    display: 'grid',
    gap: '0.5rem',
  },
  labelError: {
    color: colors.destructive,
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.mutedForeground,
  },
  message: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: colors.destructive,
  },
});

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const formContext = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });
  const fieldState = formContext?.getFieldState
    ? formContext.getFieldState(fieldContext.name, formState)
    : undefined;

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

export interface FormItemProps extends React.ComponentProps<'div'> {
  /** Configurable component width (presets: 'full', 'auto', 'md', px number, or custom CSS string) */
  width?: ComponentWidth;
  sx?: stylex.StyleXStyles;
}

function FormItem({ className, width, style, sx, ...props }: FormItemProps) {
  const id = React.useId();
  const resolvedWidth = resolveWidth(width);
  const styleProps = stylex.props(styles.item, sx);

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        data-width={width}
        {...styleProps}
        style={{
          ...styleProps.style,
          ...style,
          ...(resolvedWidth ? { width: resolvedWidth } : {}),
        }}
        className={cn(styleProps.className, className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

export interface FormLabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function FormLabel({ className, sx, ...props }: FormLabelProps) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      sx={[error ? styles.labelError : undefined, sx]}
      className={className}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

export interface FormDescriptionProps extends React.ComponentProps<'p'> {
  sx?: stylex.StyleXStyles;
}

function FormDescription({ className, sx, ...props }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField();
  const styleProps = stylex.props(styles.description, sx);

  return (
    <Paragraph
      as="p"
      data-slot="form-description"
      id={formDescriptionId}
      size="sm"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface FormMessageProps extends React.ComponentProps<'p'> {
  sx?: stylex.StyleXStyles;
}

function FormMessage({ className, sx, ...props }: FormMessageProps) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) {
    return null;
  }

  const styleProps = stylex.props(styles.message, sx);

  return (
    <Paragraph
      as="p"
      data-slot="form-message"
      id={formMessageId}
      size="sm"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {body}
    </Paragraph>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
