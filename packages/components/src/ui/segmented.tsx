import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii, spacing } from '../theme/tokens.stylex';
import { Flex } from './flex';
import { Text } from '../Typography/Text';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem',
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    userSelect: 'none',
    boxSizing: 'border-box',
    gap: '0.125rem',
  },
  block: {
    display: 'flex',
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  item: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    fontWeight: 500,
    cursor: 'pointer',
    transitionProperty: 'background-color, color, box-shadow, transform',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    ':hover': {
      color: colors.foreground,
    },
    ':focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
  itemBlock: {
    flex: 1,
  },
  itemActive: {
    backgroundColor: colors.background,
    color: colors.foreground,
    fontWeight: 600,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  },
  itemDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    ':hover': {
      color: colors.mutedForeground,
    },
  },
  sizeSm: {
    height: '1.75rem',
    paddingInline: '0.5rem',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  sizeMd: {
    height: '2.25rem',
    paddingInline: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  sizeLg: {
    height: '2.75rem',
    paddingInline: '1rem',
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});

export type SegmentedSize = 'sm' | 'md' | 'lg';

export interface SegmentedOptionObject {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export type SegmentedOption = string | number | SegmentedOptionObject;

export interface SegmentedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[];
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  size?: SegmentedSize;
  block?: boolean;
  disabled?: boolean;
  sx?: stylex.StyleXStyles;
}

function normalizeOption(option: SegmentedOption): SegmentedOptionObject {
  if (typeof option === 'string' || typeof option === 'number') {
    return { label: String(option), value: option };
  }
  return option;
}

export const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      size = 'md',
      block = false,
      disabled = false,
      sx,
      className,
      'aria-label': ariaLabel = 'Segmented options',
      ...props
    },
    ref,
  ) => {
    const normalizedOptions = React.useMemo(() => options.map(normalizeOption), [options]);

    const initialValue = defaultValue ?? normalizedOptions[0]?.value ?? '';
    const [internalValue, setInternalValue] = React.useState<string | number>(initialValue);

    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const handleSelect = (val: string | number) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalValue(val);
      }
      onValueChange?.(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const enabledOptions = normalizedOptions.filter((opt) => !opt.disabled);
      const currentIndex = enabledOptions.findIndex((opt) => opt.value === activeValue);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % enabledOptions.length;
        const nextOption = enabledOptions[nextIndex];
        if (nextOption) handleSelect(nextOption.value);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
        const prevOption = enabledOptions[prevIndex];
        if (prevOption) handleSelect(prevOption.value);
      }
    };

    const sizeStyle = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

    return (
      <Flex
        ref={ref}
        inline={!block}
        align="center"
        role="radiogroup"
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        data-slot="segmented"
        sx={[styles.root, block && styles.block, disabled && styles.disabled, sx]}
        className={className}
        {...props}
      >
        {normalizedOptions.map((option) => {
          const isSelected = activeValue === option.value;
          const isItemDisabled = disabled || Boolean(option.disabled);

          const itemSx = stylex.props(
            styles.item,
            sizeStyle,
            block && styles.itemBlock,
            isSelected && styles.itemActive,
            isItemDisabled && styles.itemDisabled,
          );

          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isItemDisabled}
              data-slot="segmented-item"
              data-value={String(option.value)}
              data-state={isSelected ? 'active' : 'inactive'}
              onClick={() => handleSelect(option.value)}
              {...itemSx}
            >
              {option.icon && <span {...stylex.props(styles.icon)}>{option.icon}</span>}
              <Text
                as="span"
                size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
                weight={isSelected ? 'semibold' : 'medium'}
              >
                {option.label}
              </Text>
            </button>
          );
        })}
      </Flex>
    );
  },
);

Segmented.displayName = 'Segmented';
