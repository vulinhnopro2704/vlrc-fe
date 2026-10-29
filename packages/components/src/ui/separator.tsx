import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';

const styles = stylex.create({
  base: {
    backgroundColor: colors.border,
    flexShrink: 0,
    borderWidth: 0,
  },
  horizontal: {
    height: '1px',
    width: '100%',
  },
  vertical: {
    height: '100%',
    width: '1px',
  },
});

export interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  sx,
  ...props
}: SeparatorProps) {
  const sxProps = stylex.props(
    styles.base,
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
    sx
  );

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Separator };
