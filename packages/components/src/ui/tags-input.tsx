import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ChangeEvent as ReactChangeEvent,
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow, spacing } from '../theme/tokens.stylex';
import { Text } from '../Typography';

export type TagsInputSize = 'sm' | 'md' | 'lg';

interface TagsInputContextValue {
  value: string[];
  addTag: (tag: string) => boolean;
  removeTag: (index: number) => void;
  clearAll: () => void;
  disabled: boolean;
  size: TagsInputSize;
  inputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (val: string) => void;
}

const TagsInputContext = createContext<TagsInputContextValue | null>(null);

function useTagsInputContext(component: string): TagsInputContextValue {
  const context = useContext(TagsInputContext);
  if (!context) {
    throw new Error(`${component} must be used within a TagsInput`);
  }
  return context;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    width: '100%',
    minWidth: 0,
    flexWrap: 'wrap',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: colors.background,
    boxShadow: shadow.xs,
    transitionProperty: 'color, box-shadow, border-color',
    transitionDuration: '150ms',
    cursor: 'text',
    ':focus-within': {
      borderColor: colors.ring,
      boxShadow: shadow.ring,
    },
  },
  sizeSm: {
    minHeight: '2rem',
    paddingInline: spacing.xs,
    paddingBlock: '0.125rem',
    gap: spacing.xxs,
    fontSize: '0.75rem',
  },
  sizeMd: {
    minHeight: '2.5rem',
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    gap: spacing.xs,
    fontSize: '0.875rem',
  },
  sizeLg: {
    minHeight: '2.75rem',
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    gap: spacing.xs,
    fontSize: '1rem',
  },
  disabled: {
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  invalid: {
    borderColor: colors.destructive,
    ':focus-within': {
      borderColor: colors.destructive,
      boxShadow: shadow.ringDestructive,
    },
  },

  // Item chip
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    borderRadius: radius.sm,
    backgroundColor: colors.muted,
    color: colors.foreground,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    paddingInline: spacing.xs,
    paddingBlock: '0.0625rem',
    lineHeight: 1.25,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  itemText: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
  itemDelete: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    cursor: 'pointer',
    borderRadius: radius.full,
    lineHeight: 1,
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: colors.foreground,
    },
  },

  // Inner Input
  input: {
    flex: 1,
    minWidth: '4rem',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.foreground,
    padding: 0,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    outline: 'none',
    boxShadow: shadow.none,
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':disabled': {
      cursor: 'not-allowed',
    },
  },

  // Clear button
  clear: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    cursor: 'pointer',
    borderRadius: radius.full,
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: colors.foreground,
    },
  },
});

const sizeStyles: Record<TagsInputSize, stylex.StyleXStyles> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export interface TagsInputProps extends Omit<ComponentProps<'div'>, 'defaultValue'> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  max?: number;
  disabled?: boolean;
  invalid?: boolean;
  size?: TagsInputSize;
  allowDuplicates?: boolean;
  delimiters?: string[];
  validateTag?: (tag: string) => boolean;
  sx?: stylex.StyleXStyles;
}

function TagsInput({
  className,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  max,
  disabled = false,
  invalid = false,
  size = 'md',
  allowDuplicates = false,
  delimiters = ['Enter', ','],
  validateTag,
  sx,
  children,
  onClick,
  ...props
}: TagsInputProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const tags = controlledValue !== undefined ? controlledValue : internalValue;

  const updateTags = useCallback(
    (nextTags: string[]) => {
      if (controlledValue === undefined) {
        setInternalValue(nextTags);
      }
      onValueChange?.(nextTags);
    },
    [controlledValue, onValueChange],
  );

  const addTag = useCallback(
    (rawTag: string): boolean => {
      const trimmed = rawTag.trim();
      if (!trimmed) return false;
      if (max !== undefined && tags.length >= max) return false;
      if (!allowDuplicates && tags.includes(trimmed)) return false;
      if (validateTag && !validateTag(trimmed)) return false;

      updateTags([...tags, trimmed]);
      setInputValue('');
      return true;
    },
    [tags, max, allowDuplicates, validateTag, updateTags],
  );

  const removeTag = useCallback(
    (index: number) => {
      if (disabled) return;
      updateTags(tags.filter((_, i) => i !== index));
    },
    [disabled, tags, updateTags],
  );

  const clearAll = useCallback(() => {
    if (disabled) return;
    updateTags([]);
    setInputValue('');
  }, [disabled, updateTags]);

  const handleContainerClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if ((e.target as HTMLElement).closest('button')) return;
    inputRef.current?.focus();
  };

  const contextValue = useMemo<TagsInputContextValue>(
    () => ({
      value: tags,
      addTag,
      removeTag,
      clearAll,
      disabled,
      size,
      inputRef,
      inputValue,
      setInputValue,
    }),
    [tags, addTag, removeTag, clearAll, disabled, size, inputValue],
  );

  const sxProps = stylex.props(
    styles.root,
    sizeStyles[size],
    disabled && styles.disabled,
    invalid && styles.invalid,
    sx,
  );

  return (
    <TagsInputContext.Provider value={contextValue}>
      <div
        role="group"
        data-slot="tags-input"
        data-size={size}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        onClick={handleContainerClick}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </div>
    </TagsInputContext.Provider>
  );
}

export interface TagsInputItemProps extends ComponentProps<'span'> {
  index: number;
  value: string;
  sx?: stylex.StyleXStyles;
}

function TagsInputItem({
  className,
  index,
  value: itemValue,
  sx,
  children,
  ...props
}: TagsInputItemProps) {
  const { disabled } = useTagsInputContext('TagsInputItem');
  const sxProps = stylex.props(styles.item, sx);

  return (
    <span
      data-slot="tags-input-item"
      data-value={itemValue}
      data-disabled={disabled ? '' : undefined}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </span>
  );
}

export interface TagsInputItemTextProps extends ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function TagsInputItemText({ className, sx, children, ...props }: TagsInputItemTextProps) {
  const sxProps = stylex.props(styles.itemText, sx);
  return (
    <Text
      size="sm"
      data-slot="tags-input-item-text"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface TagsInputItemDeleteProps extends ComponentProps<'button'> {
  index: number;
  sx?: stylex.StyleXStyles;
}

function TagsInputItemDelete({
  className,
  index,
  onClick,
  sx,
  children,
  ...props
}: TagsInputItemDeleteProps) {
  const { removeTag, disabled } = useTagsInputContext('TagsInputItemDelete');

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    e.stopPropagation();
    removeTag(index);
  };

  const sxProps = stylex.props(styles.itemDelete, sx);

  return (
    <button
      type="button"
      aria-label="Remove tag"
      data-slot="tags-input-item-delete"
      disabled={disabled}
      onClick={handleClick}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children ?? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  );
}

export interface TagsInputInputProps extends ComponentProps<'input'> {
  delimiters?: string[];
  sx?: stylex.StyleXStyles;
}

function TagsInputInput({
  className,
  delimiters = ['Enter', ','],
  onKeyDown,
  onChange,
  sx,
  ...props
}: TagsInputInputProps) {
  const {
    inputRef,
    inputValue,
    setInputValue,
    addTag,
    removeTag,
    value: tags,
    disabled,
  } = useTagsInputContext('TagsInputInput');

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;

    if (delimiters.includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (e.defaultPrevented) return;
    setInputValue(e.target.value);
  };

  const sxProps = stylex.props(styles.input, sx);

  return (
    <input
      ref={inputRef}
      type="text"
      data-slot="tags-input-input"
      value={inputValue}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface TagsInputClearProps extends ComponentProps<'button'> {
  sx?: stylex.StyleXStyles;
}

function TagsInputClear({ className, onClick, sx, children, ...props }: TagsInputClearProps) {
  const { clearAll, disabled, value: tags } = useTagsInputContext('TagsInputClear');

  if (tags.length === 0) return null;

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    e.stopPropagation();
    clearAll();
  };

  const sxProps = stylex.props(styles.clear, sx);

  return (
    <button
      type="button"
      aria-label="Clear all tags"
      data-slot="tags-input-clear"
      disabled={disabled}
      onClick={handleClick}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children ?? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  );
}

export {
  TagsInput,
  TagsInputItem,
  TagsInputItemText,
  TagsInputItemDelete,
  TagsInputInput,
  TagsInputClear,
};
