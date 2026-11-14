import { useMemo, type ReactNode } from 'react';
import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';
import { Label } from './label';
import { Separator } from './separator';
import { resolveWidth, type ComponentWidth } from '../theme/width';
import { Paragraph, Text } from '../Typography';

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

const styles = stylex.create({
  set: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  legend: {
    marginBottom: '0.75rem',
    fontWeight: 500,
    fontSize: '1rem',
    color: colors.foreground,
  },
  legendLabel: {
    fontSize: '0.875rem',
  },
  group: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  fieldBase: {
    display: 'flex',
    width: '100%',
    gap: '0.375rem',
  },
  vertical: {
    flexDirection: 'column',
    gap: '0.375rem',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
  },
  responsive: {
    flexDirection: 'column',
    gap: '0.375rem',
  },
  content: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    gap: '0.25rem',
    lineHeight: 1.375,
  },
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    gap: '0.125rem',
    lineHeight: 1.375,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.foreground,
  },
  title: {
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: 1.375,
    fontWeight: 500,
    color: colors.foreground,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  separator: {
    position: 'relative',
    marginBlock: '-0.5rem',
    height: '1.25rem',
    fontSize: '0.875rem',
  },
  separatorLine: {
    position: 'absolute',
    inset: 0,
    top: '50%',
  },
  separatorContent: {
    backgroundColor: colors.background,
    color: colors.mutedForeground,
    position: 'relative',
    marginInline: 'auto',
    display: 'block',
    width: 'fit-content',
    paddingInline: '0.5rem',
  },
  error: {
    color: colors.destructive,
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  errorList: {
    marginLeft: '1rem',
    display: 'flex',
    listStyleType: 'disc',
    flexDirection: 'column',
    gap: '0.25rem',
  },
});

function FieldSet({
  className,
  sx,
  ...props
}: React.ComponentProps<'fieldset'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.set, sx);
  return (
    <fieldset
      data-slot="field-set"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  sx,
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label'; sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.legend, variant === 'label' && styles.legendLabel, sx);
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function FieldGroup({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.group, sx);
  return (
    <div
      data-slot="field-group"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

const orientationStyles: Record<FieldOrientation, stylex.StyleXStyles> = {
  vertical: styles.vertical,
  horizontal: styles.horizontal,
  responsive: styles.responsive,
};

export interface FieldProps extends React.ComponentProps<'div'> {
  orientation?: FieldOrientation;
  sx?: stylex.StyleXStyles;
  /** Configurable component width (presets: 'full', 'auto', 'md', px number, or custom CSS string) */
  width?: ComponentWidth;
}

function Field({ className, orientation = 'vertical', sx, width, style, ...props }: FieldProps) {
  const resolvedWidth = resolveWidth(width);
  const sxProps = stylex.props(styles.fieldBase, orientationStyles[orientation], sx);
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      data-width={width}
      {...sxProps}
      style={{ ...sxProps.style, ...style, ...(resolvedWidth ? { width: resolvedWidth } : {}) }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function FieldContent({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.content, sx);
  return (
    <div
      data-slot="field-content"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  sx,
  ...props
}: React.ComponentProps<typeof Label> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.label, sx);
  return (
    <Label
      data-slot="field-label"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function FieldTitle({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <div
      data-slot="field-label"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  sx,
  ...props
}: React.ComponentProps<'p'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <Paragraph
      as="p"
      data-slot="field-description"
      size="xs"
      type="secondary"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & {
  children?: ReactNode;
  sx?: stylex.StyleXStyles;
}) {
  const sxProps = stylex.props(styles.separator, sx);
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <Separator sx={styles.separatorLine} />
      {children && (
        <Text
          as="span"
          size="xs"
          type="secondary"
          {...stylex.props(styles.separatorContent)}
          data-slot="field-separator-content"
        >
          {children}
        </Text>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  sx,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
  sx?: stylex.StyleXStyles;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul {...stylex.props(styles.errorList)}>
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  const sxProps = stylex.props(styles.error, sx);

  return (
    <div
      role="alert"
      data-slot="field-error"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};

export {
  Field as AstryxField,
  FieldLabel as AstryxFieldLabel,
  FieldStatus as AstryxFieldStatus,
  InputClearButton,
} from '@astryxdesign/core';

export type {
  FieldProps as AstryxFieldProps,
  FieldLabelProps as AstryxFieldLabelProps,
  FieldStatusProps as AstryxFieldStatusProps,
  AutoCapitalize,
  EnterKeyHint,
  InputMode,
} from '@astryxdesign/core';
