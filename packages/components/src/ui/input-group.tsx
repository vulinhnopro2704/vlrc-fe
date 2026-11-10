import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii, spacing } from '../theme/tokens.stylex';
import { Button, type ButtonProps } from './button';
import { Text } from '../Typography';

export type InputGroupSize = 'sm' | 'md' | 'lg';
export type InputGroupAlign = 'inline-start' | 'inline-end';

const styles = stylex.create({
  group: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    minWidth: 0,
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: colors.background,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    overflow: 'hidden',
    ':focus-within': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
  },
  sizeSm: {
    minHeight: '2rem',
    fontSize: '0.8125rem',
  },
  sizeMd: {
    minHeight: '2.5rem',
    fontSize: '0.875rem',
  },
  sizeLg: {
    minHeight: '2.75rem',
    fontSize: '1rem',
  },
  disabled: {
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  invalid: {
    borderColor: colors.destructive,
    ':focus-within': {
      borderColor: colors.destructive,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--destructive) 40%, transparent)',
    },
  },

  // Addon
  addon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    flexShrink: 0,
    paddingInline: spacing.sm,
    color: colors.mutedForeground,
  },
  addonStart: {
    order: -1,
  },
  addonEnd: {
    order: 10,
  },

  // Inner Input
  innerInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.foreground,
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    outline: 'none',
    boxShadow: 'none',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':disabled': {
      cursor: 'not-allowed',
    },
  },

  // Inner Textarea
  innerTextarea: {
    flex: 1,
    minWidth: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.foreground,
    paddingInline: spacing.sm,
    paddingBlock: spacing.sm,
    fontSize: 'inherit',
    lineHeight: 1.5,
    outline: 'none',
    boxShadow: 'none',
    resize: 'none',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':disabled': {
      cursor: 'not-allowed',
    },
  },

  // Addon text
  text: {
    display: 'inline-flex',
    alignItems: 'center',
    color: colors.mutedForeground,
    whiteSpace: 'nowrap',
    fontSize: 'inherit',
  },

  // Button within group
  button: {
    marginInline: '0.125rem',
    boxShadow: 'none',
  },
});

const sizeStyles: Record<InputGroupSize, stylex.StyleXStyles> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export interface InputGroupProps extends React.ComponentProps<'div'> {
  size?: InputGroupSize;
  disabled?: boolean;
  invalid?: boolean;
  sx?: stylex.StyleXStyles;
}

function InputGroup({
  className,
  size = 'md',
  disabled = false,
  invalid = false,
  sx,
  children,
  ...props
}: InputGroupProps) {
  const sxProps = stylex.props(
    styles.group,
    sizeStyles[size],
    disabled && styles.disabled,
    invalid && styles.invalid,
    sx,
  );

  return (
    <div
      role="group"
      data-slot="input-group"
      data-size={size}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface InputGroupAddonProps extends React.ComponentProps<'div'> {
  align?: InputGroupAlign;
  sx?: stylex.StyleXStyles;
}

function InputGroupAddon({
  className,
  align = 'inline-start',
  onClick,
  sx,
  children,
  ...props
}: InputGroupAddonProps) {
  const alignStyle = align === 'inline-start' ? styles.addonStart : styles.addonEnd;
  const sxProps = stylex.props(styles.addon, alignStyle, sx);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) {
      return;
    }
    const container = e.currentTarget.parentElement;
    const input = container?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      'input, textarea',
    );
    input?.focus();
  };

  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      onClick={handleClick}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface InputGroupTextProps extends React.ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function InputGroupText({ className, sx, children, ...props }: InputGroupTextProps) {
  const sxProps = stylex.props(styles.text, sx);
  return (
    <Text
      as="span"
      size="sm"
      type="secondary"
      data-slot="input-group-text"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface InputGroupButtonProps extends ButtonProps {
  sx?: stylex.StyleXStyles;
}

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  sx,
  ...props
}: InputGroupButtonProps) {
  const sxProps = stylex.props(styles.button, sx);
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      data-slot="input-group-button"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface InputGroupInputProps extends React.ComponentProps<'input'> {
  sx?: stylex.StyleXStyles;
}

const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, sx, ...props }, ref) => {
    const sxProps = stylex.props(styles.innerInput, sx);
    return (
      <input
        ref={ref}
        data-slot="input-group-control"
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    );
  },
);
InputGroupInput.displayName = 'InputGroupInput';

export interface InputGroupTextareaProps extends React.ComponentProps<'textarea'> {
  sx?: stylex.StyleXStyles;
}

const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, InputGroupTextareaProps>(
  ({ className, sx, ...props }, ref) => {
    const sxProps = stylex.props(styles.innerTextarea, sx);
    return (
      <textarea
        ref={ref}
        data-slot="input-group-control"
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    );
  },
);
InputGroupTextarea.displayName = 'InputGroupTextarea';

export {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
};
