import {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow, spacing } from '../theme/tokens.stylex';
import { Flex } from './flex';
import { Text } from '../Typography/Text';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem',
    borderRadius: radius.lg,
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
    borderRadius: radius.md,
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
      boxShadow: shadow.ringFocus,
    },
  },
  itemBlock: {
    flex: 1,
  },
  itemActive: {
    backgroundColor: colors.background,
    color: colors.foreground,
    fontWeight: 600,
    boxShadow: shadow.sm,
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
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
  icon?: ReactNode;
}

export type SegmentedOption = string | number | SegmentedOptionObject;

export interface SegmentedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[];
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  size?: SegmentedSize;
  block?: boolean;
  disabled?: boolean;
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

function normalizeOption(option: SegmentedOption): SegmentedOptionObject {
  if (typeof option === 'string' || typeof option === 'number') {
    return { label: String(option), value: option };
  }
  return option;
}

export function Segmented({
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
  ref,
  ...props
}: SegmentedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options]);

  const initialValue = defaultValue ?? normalizedOptions[0]?.value ?? '';
  const [internalValue, setInternalValue] = useState<string | number>(initialValue);

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleSelect = (val: string | number) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(val);
    }
    onValueChange?.(val);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const enabledOptions = normalizedOptions.filter((opt) => !opt.disabled);
    if (enabledOptions.length === 0) return;
    const currentIndex = enabledOptions.findIndex((opt) => opt.value === activeValue);

    let targetOption: SegmentedOptionObject | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % enabledOptions.length;
      targetOption = enabledOptions[nextIndex];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
      targetOption = enabledOptions[prevIndex];
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetOption = enabledOptions[0];
    } else if (e.key === 'End') {
      e.preventDefault();
      targetOption = enabledOptions[enabledOptions.length - 1];
    }

    if (targetOption) {
      handleSelect(targetOption.value);
      const btn = containerRef.current?.querySelector<HTMLButtonElement>(
        `button[data-value="${CSS.escape(String(targetOption.value))}"]`,
      );
      btn?.focus();
    }
  };

  const sizeStyle = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const enabledOptions = normalizedOptions.filter((opt) => !opt.disabled);

  return (
    <Flex
      ref={containerRef}
      inline={!block}
      align="center"
      role="radiogroup"
      aria-label={ariaLabel}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      data-slot="segmented"
      sx={[styles.root, block && styles.block, disabled && styles.disabled, sx]}
      className={className}
      {...props}
    >
      {normalizedOptions.map((option) => {
        const isSelected = activeValue === option.value;
        const isItemDisabled = disabled || Boolean(option.disabled);
        const isTabbable =
          !isItemDisabled &&
          (isSelected ||
            (!enabledOptions.some((o) => o.value === activeValue) &&
              option.value === enabledOptions[0]?.value));

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
            tabIndex={isTabbable ? 0 : -1}
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
}
