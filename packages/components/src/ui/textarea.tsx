import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const styles = stylex.create({
  base: {
    display: 'flex',
    minHeight: '4rem',
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    color: colors.foreground,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  invalid: {
    borderColor: colors.destructive,
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--destructive) 20%, transparent)',
  },
});

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  sx?: stylex.StyleXStyles;
}

function Textarea({ className, sx, ...props }: TextareaProps) {
  const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true';
  const sxProps = stylex.props(
    styles.base,
    isInvalid && styles.invalid,
    sx
  );

  return (
    <textarea
      data-slot="textarea"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Textarea };
