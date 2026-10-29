import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CircleIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const styles = stylex.create({
  root: {
    display: 'grid',
    gap: '0.75rem',
  },
  item: {
    aspectRatio: '1 / 1',
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'transparent',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '150ms',
    outline: 'none',
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
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  icon: {
    width: '0.5rem',
    height: '0.5rem',
    fill: colors.primary,
    color: colors.primary,
  },
});

export interface RadioGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function RadioGroup({
  className,
  sx,
  ...props
}: RadioGroupProps) {
  const sxProps = stylex.props(styles.root, sx);
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  sx?: stylex.StyleXStyles;
}

function RadioGroupItem({
  className,
  sx,
  ...props
}: RadioGroupItemProps) {
  const sxProps = stylex.props(styles.item, sx);
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        {...stylex.props(styles.indicator)}
      >
        <CircleIcon {...stylex.props(styles.icon)} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
