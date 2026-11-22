import { useMemo, type ComponentProps } from 'react';
import {
  Range as SliderPrimitiveRange,
  Root as SliderPrimitiveRoot,
  Thumb as SliderPrimitiveThumb,
  Track as SliderPrimitiveTrack,
} from '@radix-ui/react-slider';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';

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
    borderRadius: radius.full,
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
    borderRadius: radius.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.primary,
    backgroundColor: colors.background,
    boxShadow: shadow.xs,
    transitionProperty: 'box-shadow',
    transitionDuration: '150ms',
    outline: 'none',
    cursor: 'pointer',
    ':focus-visible': {
      boxShadow: shadow.ring,
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
});

export interface SliderProps extends ComponentProps<typeof SliderPrimitiveRoot> {
  sx?: stylex.StyleXStyles;
}

function Slider({ className, defaultValue, value, min = 0, max = 100, sx, ...props }: SliderProps) {
  const _values = useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );

  const sxProps = stylex.props(styles.root, sx);

  return (
    <SliderPrimitiveRoot
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <SliderPrimitiveTrack data-slot="slider-track" {...stylex.props(styles.track)}>
        <SliderPrimitiveRange data-slot="slider-range" {...stylex.props(styles.range)} />
      </SliderPrimitiveTrack>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitiveThumb
          data-slot="slider-thumb"
          key={index}
          {...stylex.props(styles.thumb)}
        />
      ))}
    </SliderPrimitiveRoot>
  );
}

export { Slider };
