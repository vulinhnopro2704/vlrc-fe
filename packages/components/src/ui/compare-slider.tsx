import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { ChevronsLeftRight } from 'lucide-react';
import { colors, radii, spacing } from '../theme/tokens.stylex';
import { Badge } from './badge';

const styles = stylex.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    touchAction: 'none',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    display: 'inline-block',
    width: '100%',
  },
  layerOne: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  layerTwo: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
  dividerHorizontal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#ffffff',
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.4)',
    cursor: 'ew-resize',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
  dividerVertical: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ffffff',
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.4)',
    cursor: 'ns-resize',
    transform: 'translateY(-50%)',
    zIndex: 10,
  },
  handle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: radii.full,
    backgroundColor: colors.background,
    color: colors.foreground,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    cursor: 'grab',
    ':focus-visible': {
      boxShadow: '0 0 0 3px var(--ring)',
    },
  },
  handleDragging: {
    cursor: 'grabbing',
    transform: 'translate(-50%, -50%) scale(1.05)',
  },
  labelLeft: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 5,
    pointerEvents: 'none',
  },
  labelRight: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 5,
    pointerEvents: 'none',
  },
});

export type CompareSliderOrientation = 'horizontal' | 'vertical';

export interface CompareSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  itemOne: React.ReactNode;
  itemTwo: React.ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  orientation?: CompareSliderOrientation;
  showLabels?: boolean;
  labelOne?: React.ReactNode;
  labelTwo?: React.ReactNode;
  disabled?: boolean;
  sx?: stylex.StyleXStyles;
}

export const CompareSlider = React.forwardRef<HTMLDivElement, CompareSliderProps>(
  (
    {
      itemOne,
      itemTwo,
      value: controlledValue,
      defaultValue = 50,
      onValueChange,
      orientation = 'horizontal',
      showLabels = false,
      labelOne = 'Before',
      labelTwo = 'After',
      disabled = false,
      sx,
      className,
      'aria-label': ariaLabel = 'Comparison slider',
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const position = isControlled ? controlledValue : internalValue;

    const setPosition = React.useCallback(
      (nextPos: number) => {
        if (disabled) return;
        const clamped = Math.max(0, Math.min(100, Math.round(nextPos)));
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onValueChange?.(clamped);
      },
      [disabled, isControlled, onValueChange],
    );

    const handlePointerMove = React.useCallback(
      (clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        if (orientation === 'horizontal') {
          const offsetX = clientX - rect.left;
          const nextPercent = (offsetX / rect.width) * 100;
          setPosition(nextPercent);
        } else {
          const offsetY = clientY - rect.top;
          const nextPercent = (offsetY / rect.height) * 100;
          setPosition(nextPercent);
        }
      },
      [orientation, setPosition],
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      handlePointerMove(e.clientX, e.clientY);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || disabled) return;
      handlePointerMove(e.clientX, e.clientY);
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const step = e.shiftKey ? 10 : 2;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setPosition(position - step);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPosition(position + step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPosition(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setPosition(100);
      }
    };

    const isHorizontal = orientation === 'horizontal';

    const clipStyle: React.CSSProperties = isHorizontal
      ? { clipPath: `inset(0 ${100 - position}% 0 0)` }
      : { clipPath: `inset(0 0 ${100 - position}% 0)` };

    const dividerStyle: React.CSSProperties = isHorizontal
      ? { left: `${position}%` }
      : { top: `${position}%` };

    const rootSx = stylex.props(styles.root, sx);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="compare-slider"
        data-orientation={orientation}
        onPointerDown={handlePointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        {...rootSx}
        className={className ? `${rootSx.className || ''} ${className}`.trim() : rootSx.className}
        {...props}
      >
        {/* Layer Two (Base / After item) */}
        <div data-slot="compare-layer-two" {...stylex.props(styles.layerTwo)}>
          {itemTwo}
        </div>

        {/* Layer One (Foreground / Before item with dynamic clip-path) */}
        <div data-slot="compare-layer-one" {...stylex.props(styles.layerOne)} style={clipStyle}>
          {itemOne}
        </div>

        {/* Labels */}
        {showLabels && (
          <>
            <Badge variant="secondary" data-slot="compare-label-one" sx={[styles.labelLeft]}>
              {labelOne}
            </Badge>
            <Badge variant="secondary" data-slot="compare-label-two" sx={[styles.labelRight]}>
              {labelTwo}
            </Badge>
          </>
        )}

        {/* Divider and Draggable Handle */}
        <div
          data-slot="compare-divider"
          {...stylex.props(isHorizontal ? styles.dividerHorizontal : styles.dividerVertical)}
          style={dividerStyle}
        >
          <div
            role="slider"
            aria-valuenow={position}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            data-slot="compare-handle"
            {...stylex.props(styles.handle, isDragging && styles.handleDragging)}
          >
            <ChevronsLeftRight size={16} />
          </div>
        </div>
      </div>
    );
  },
);

CompareSlider.displayName = 'CompareSlider';
