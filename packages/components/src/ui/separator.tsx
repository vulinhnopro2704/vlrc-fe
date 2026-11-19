import { type ComponentProps } from 'react';
import { Root as SeparatorPrimitiveRoot } from '@radix-ui/react-separator';
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

export interface SeparatorProps extends ComponentProps<typeof SeparatorPrimitiveRoot> {
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
    sx,
  );

  return (
    <SeparatorPrimitiveRoot
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

export { Divider } from '@astryxdesign/core';
export type { DividerProps, DividerVariant, DividerVariantMap } from '@astryxdesign/core';
