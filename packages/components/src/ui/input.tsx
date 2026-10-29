import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const styles = stylex.create({
  base: {
    height: '2.25rem',
    width: '100%',
    minWidth: 0,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    fontSize: '0.875rem',
    color: colors.foreground,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    '::file-selector-button': {
      display: 'inline-flex',
      height: '1.75rem',
      borderWidth: 0,
      backgroundColor: 'transparent',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: colors.foreground,
      cursor: 'pointer',
    },
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  invalid: {
    borderColor: colors.destructive,
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--destructive) 20%, transparent)',
  },
});

export interface InputProps extends React.ComponentProps<'input'> {
  sx?: stylex.StyleXStyles;
}

function Input({ className, type, sx, ...props }: InputProps) {
  const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true';
  const sxProps = stylex.props(
    styles.base,
    isInvalid && styles.invalid,
    sx
  );

  return (
    <input
      type={type}
      data-slot="input"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Input };
