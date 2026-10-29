import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    height: '1.25rem',
    width: '2.25rem',
    flexShrink: 0,
    cursor: 'pointer',
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    backgroundColor: colors.input,
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: '200ms',
    outline: 'none',
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  thumb: {
    pointerEvents: 'none',
    display: 'block',
    height: '1rem',
    width: '1rem',
    borderRadius: radii.full,
    backgroundColor: colors.background,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
    transitionProperty: 'transform',
    transitionDuration: '200ms',
  },
});

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function Switch({
  className,
  sx,
  ...props
}: SwitchProps) {
  const sxProps = stylex.props(styles.root, sx);

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        {...stylex.props(styles.thumb)}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
