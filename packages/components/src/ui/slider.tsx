import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    touchAction: 'none',
    userSelect: 'none',
    alignItems: 'center',
  },
  track: {
    backgroundColor: colors.secondary,
    position: 'relative',
    flexGrow: 1,
    overflow: 'hidden',
    borderRadius: radii.full,
    height: '0.375rem',
  },
  range: {
    position: 'absolute',
    backgroundColor: colors.primary,
    height: '100%',
  },
  thumb: {
    display: 'block',
    height: '1rem',
    width: '1rem',
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.primary,
    backgroundColor: colors.background,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'box-shadow',
    transitionDuration: '150ms',
    outline: 'none',
    cursor: 'pointer',
    ':focus-visible': {
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
});

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  sx?: stylex.StyleXStyles;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  sx,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  const sxProps = stylex.props(styles.root, sx);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        {...stylex.props(styles.track)}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          {...stylex.props(styles.range)}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          {...stylex.props(styles.thumb)}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
