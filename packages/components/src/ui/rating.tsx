import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { Star } from 'lucide-react';
import { colors, spacing } from '../theme/tokens.stylex';
import { Flex } from './flex';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xxs,
    userSelect: 'none',
    outline: 'none',
  },
  rootDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  item: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transitionProperty: 'transform, color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  itemReadOnly: {
    cursor: 'default',
    ':hover': {
      transform: 'none',
    },
  },
  itemDisabled: {
    cursor: 'not-allowed',
    ':hover': {
      transform: 'none',
    },
  },
  iconSm: {
    width: '1rem',
    height: '1rem',
  },
  iconMd: {
    width: '1.25rem',
    height: '1.25rem',
  },
  iconLg: {
    width: '1.75rem',
    height: '1.75rem',
  },
  emptyStar: {
    color: colors.mutedForeground,
    opacity: 0.4,
  },
  filledStarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  filledStar: {
    color: 'var(--rating-color, #f59e0b)',
  },
  hitAreaLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    zIndex: 1,
    cursor: 'pointer',
  },
  hitAreaRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    zIndex: 1,
    cursor: 'pointer',
  },
  hitAreaFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    cursor: 'pointer',
  },
});

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  size?: RatingSize;
  sx?: stylex.StyleXStyles;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      max = 5,
      allowHalf = false,
      readOnly = false,
      disabled = false,
      size = 'md',
      sx,
      className,
      tabIndex,
      'aria-label': ariaLabel = 'Rating',
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    const currentValue = isControlled ? controlledValue : internalValue;
    const activeDisplayValue = hoverValue !== null ? hoverValue : currentValue;

    const handleRatingChange = React.useCallback(
      (nextValue: number) => {
        if (readOnly || disabled) return;
        const clamped = Math.max(0, Math.min(nextValue, max));
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onValueChange?.(clamped);
      },
      [readOnly, disabled, max, isControlled, onValueChange],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || disabled) return;
      const step = allowHalf ? 0.5 : 1;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          handleRatingChange(Math.min(max, currentValue + step));
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          handleRatingChange(Math.max(0, currentValue - step));
          break;
        case 'Home':
          e.preventDefault();
          handleRatingChange(0);
          break;
        case 'End':
          e.preventDefault();
          handleRatingChange(max);
          break;
        default:
          break;
      }
    };

    const sizeStyle = size === 'sm' ? styles.iconSm : size === 'lg' ? styles.iconLg : styles.iconMd;

    const items = Array.from({ length: max }, (_, index) => {
      const itemScore = index + 1;
      const halfScore = itemScore - 0.5;

      let fillPercentage = 0;
      if (activeDisplayValue >= itemScore) {
        fillPercentage = 100;
      } else if (allowHalf && activeDisplayValue >= halfScore) {
        fillPercentage = 50;
      }

      const itemSx = stylex.props(
        styles.item,
        sizeStyle,
        readOnly && styles.itemReadOnly,
        disabled && styles.itemDisabled,
      );

      return (
        <span key={itemScore} data-slot="rating-item" data-score={itemScore} {...itemSx}>
          {/* Base Empty Star */}
          <Star
            data-slot="rating-empty-star"
            stroke="currentColor"
            fill="none"
            {...stylex.props(styles.emptyStar, sizeStyle)}
          />

          {/* Filled Star Overlay with clipping width */}
          <span
            data-slot="rating-filled-wrapper"
            {...stylex.props(styles.filledStarWrapper)}
            style={{ width: `${fillPercentage}%` }}
          >
            <Star
              data-slot="rating-filled-star"
              stroke="currentColor"
              fill="currentColor"
              {...stylex.props(styles.filledStar, sizeStyle)}
            />
          </span>

          {/* Hit areas for interaction */}
          {!readOnly &&
            !disabled &&
            (allowHalf ? (
              <>
                <span
                  data-slot="rating-hit-left"
                  data-testid={`rating-hit-${halfScore}`}
                  {...stylex.props(styles.hitAreaLeft)}
                  onMouseEnter={() => setHoverValue(halfScore)}
                  onClick={() => handleRatingChange(halfScore)}
                />
                <span
                  data-slot="rating-hit-right"
                  data-testid={`rating-hit-${itemScore}`}
                  {...stylex.props(styles.hitAreaRight)}
                  onMouseEnter={() => setHoverValue(itemScore)}
                  onClick={() => handleRatingChange(itemScore)}
                />
              </>
            ) : (
              <span
                data-slot="rating-hit-full"
                data-testid={`rating-hit-${itemScore}`}
                {...stylex.props(styles.hitAreaFull)}
                onMouseEnter={() => setHoverValue(itemScore)}
                onClick={() => handleRatingChange(itemScore)}
              />
            ))}
        </span>
      );
    });

    return (
      <Flex
        ref={ref}
        inline
        align="center"
        gap="xxs"
        data-slot="rating"
        role="slider"
        aria-valuenow={currentValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : (tabIndex ?? (readOnly ? -1 : 0))}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHoverValue(null)}
        sx={[styles.root, disabled && styles.rootDisabled, sx]}
        className={className}
        {...props}
      >
        {items}
      </Flex>
    );
  },
);

Rating.displayName = 'Rating';
