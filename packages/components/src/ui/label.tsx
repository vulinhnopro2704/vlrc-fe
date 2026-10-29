import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';

const styles = stylex.create({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: 1,
    fontWeight: 500,
    userSelect: 'none',
    color: colors.foreground,
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
});

export interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function Label({ className, sx, ...props }: LabelProps) {
  const sxProps = stylex.props(styles.base, sx);
  return (
    <LabelPrimitive.Root
      data-slot="label"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Label };
