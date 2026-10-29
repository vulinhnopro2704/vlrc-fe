import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const styles = stylex.create({
  root: {
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'box-shadow, border-color, background-color',
    transitionDuration: '150ms',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  indicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primaryForeground,
    backgroundColor: colors.primary,
    width: '100%',
    height: '100%',
    borderRadius: radii.sm,
  },
  icon: {
    width: '0.875rem',
    height: '0.875rem',
  },
});

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function Checkbox({
  className,
  sx,
  ...props
}: CheckboxProps) {
  const sxProps = stylex.props(styles.root, sx);

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        {...stylex.props(styles.indicator)}
      >
        <CheckIcon {...stylex.props(styles.icon)} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
