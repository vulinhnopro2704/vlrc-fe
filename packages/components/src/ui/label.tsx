import { type ComponentProps } from 'react';
import { Root as LabelPrimitiveRoot } from '@radix-ui/react-label';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.125rem',
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

export interface LabelProps extends ComponentProps<typeof LabelPrimitiveRoot> {
  sx?: stylex.StyleXStyles;
}

function Label({ className, sx, ...props }: LabelProps) {
  const sxProps = stylex.props(styles.base, sx);
  return (
    <LabelPrimitiveRoot
      data-slot="label"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Label };
