import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow, spacing } from '../theme/tokens.stylex';
import { getNextRovingIndex } from '../utils';
import { Box, Flex } from '../layout';
import { Button, type ButtonProps } from './button';
import { Text } from '../Typography';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepStatus = 'inactive' | 'active' | 'completed';

interface StepperContextValue {
  value: string;
  setValue: (nextValue: string) => Promise<boolean>;
  orientation: StepperOrientation;
  linear: boolean;
  stepKeys: string[];
  registerStep: (key: string) => void;
  unregisterStep: (key: string) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepperContext(component: string): StepperContextValue {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error(`${component} must be used within a Stepper`);
  }
  return context;
}

interface StepperItemContextValue {
  value: string;
  stepIndex: number;
  status: StepStatus;
  disabled: boolean;
}

const StepperItemContext = createContext<StepperItemContextValue | null>(null);

function useStepperItemContext(component: string): StepperItemContextValue {
  const context = useContext(StepperItemContext);
  if (!context) {
    throw new Error(`${component} must be used within a StepperItem`);
  }
  return context;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    width: '100%',
  },
  rootVertical: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  rootHorizontal: {
    flexDirection: 'column',
    gap: spacing.lg,
  },

  // List
  list: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  listHorizontal: {
    flexDirection: 'row',
  },
  listVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 0,
  },

  // Item
  item: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  itemHorizontal: {
    flex: 1,
    flexDirection: 'row',
  },
  itemVertical: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  // Trigger
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: spacing.xs,
    borderRadius: radius.md,
    cursor: 'pointer',
    outline: 'none',
    textAlign: 'left',
    transitionProperty: 'opacity, background-color',
    transitionDuration: '150ms',
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
    },
  },
  triggerDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  // Indicator
  indicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: radius.full,
    fontSize: '0.875rem',
    fontWeight: 600,
    flexShrink: 0,
    borderWidth: 2,
    borderStyle: 'solid',
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '150ms',
  },
  indicatorInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.mutedForeground,
  },
  indicatorActive: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    color: colors.primary,
    boxShadow: shadow.ring,
  },
  indicatorCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.primaryForeground,
  },

  // Separator
  separator: {
    backgroundColor: colors.border,
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
  },
  separatorCompleted: {
    backgroundColor: colors.primary,
  },
  separatorHorizontal: {
    flex: 1,
    height: 2,
    marginInline: spacing.sm,
    minWidth: '1rem',
  },
  separatorVertical: {
    width: 2,
    minHeight: '2rem',
    height: '100%',
    marginLeft: 19,
    marginVertical: 0,
  },

  // Content
  content: {
    width: '100%',
    paddingBlock: spacing.md,
  },

  // Title & Description
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  title: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.25,
    color: colors.foreground,
  },
  titleInactive: {
    color: colors.mutedForeground,
  },
  description: {
    display: 'block',
    fontSize: '0.75rem',
    lineHeight: 1.25,
    marginTop: 2,
    color: colors.mutedForeground,
  },
});

export interface StepperProps extends ComponentProps<'div'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: StepperOrientation;
  linear?: boolean;
  onValidateStep?: (currentStep: string, targetStep: string) => boolean | Promise<boolean>;
  sx?: stylex.StyleXStyles;
}

function Stepper({
  className,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  linear = true,
  onValidateStep,
  sx,
  children,
  ...props
}: StepperProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [stepKeys, setStepKeys] = useState<string[]>([]);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const registerStep = useCallback((key: string) => {
    setStepKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  const unregisterStep = useCallback((key: string) => {
    setStepKeys((prev) => prev.filter((k) => k !== key));
  }, []);

  const setValue = useCallback(
    async (nextValue: string): Promise<boolean> => {
      if (nextValue === currentValue) return true;

      if (onValidateStep) {
        const isValid = await onValidateStep(currentValue, nextValue);
        if (!isValid) return false;
      }

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      return true;
    },
    [currentValue, controlledValue, onValidateStep, onValueChange],
  );

  // Auto-select first registered step if none selected
  useEffect(() => {
    if (!currentValue && stepKeys.length > 0 && stepKeys[0]) {
      setValue(stepKeys[0]);
    }
  }, [currentValue, stepKeys, setValue]);

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      value: currentValue,
      setValue,
      orientation,
      linear,
      stepKeys,
      registerStep,
      unregisterStep,
    }),
    [currentValue, setValue, orientation, linear, stepKeys, registerStep, unregisterStep],
  );

  const orientationStyle = orientation === 'vertical' ? styles.rootVertical : styles.rootHorizontal;
  const sxProps = stylex.props(styles.root, orientationStyle, sx);

  return (
    <StepperContext.Provider value={contextValue}>
      <Flex
        data-slot="stepper"
        data-orientation={orientation}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </Flex>
    </StepperContext.Provider>
  );
}

export interface StepperListProps extends ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function StepperList({ className, sx, children, ...props }: StepperListProps) {
  const { orientation } = useStepperContext('StepperList');
  const orientationStyle = orientation === 'vertical' ? styles.listVertical : styles.listHorizontal;
  const sxProps = stylex.props(styles.list, orientationStyle, sx);

  return (
    <Flex
      role="tablist"
      aria-orientation={orientation}
      data-slot="stepper-list"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Flex>
  );
}

export interface StepperItemProps extends ComponentProps<'div'> {
  value: string;
  completed?: boolean;
  disabled?: boolean;
  sx?: stylex.StyleXStyles;
}

function StepperItem({
  className,
  value: itemValue,
  completed: completedProp,
  disabled: disabledProp = false,
  sx,
  children,
  ...props
}: StepperItemProps) {
  const { value, stepKeys, registerStep, unregisterStep, linear, orientation } =
    useStepperContext('StepperItem');

  useEffect(() => {
    registerStep(itemValue);
    return () => unregisterStep(itemValue);
  }, [itemValue, registerStep, unregisterStep]);

  const stepIndex = stepKeys.indexOf(itemValue);
  const activeIndex = stepKeys.indexOf(value);

  const status: StepStatus = useMemo(() => {
    if (completedProp) return 'completed';
    if (itemValue === value) return 'active';
    if (activeIndex > stepIndex && activeIndex !== -1) return 'completed';
    return 'inactive';
  }, [completedProp, itemValue, value, activeIndex, stepIndex]);

  const disabled = disabledProp || (linear && status === 'inactive' && stepIndex > activeIndex + 1);

  const itemContextValue = useMemo<StepperItemContextValue>(
    () => ({
      value: itemValue,
      stepIndex,
      status,
      disabled,
    }),
    [itemValue, stepIndex, status, disabled],
  );

  const itemOrientationStyle =
    orientation === 'vertical' ? styles.itemVertical : styles.itemHorizontal;
  const sxProps = stylex.props(styles.item, itemOrientationStyle, sx);

  return (
    <StepperItemContext.Provider value={itemContextValue}>
      <Flex
        data-slot="stepper-item"
        data-status={status}
        data-disabled={disabled ? '' : undefined}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </Flex>
    </StepperItemContext.Provider>
  );
}

export interface StepperTriggerProps extends ComponentProps<typeof Button> {
  sx?: stylex.StyleXStyles;
}

function StepperTrigger({
  className,
  onClick,
  onKeyDown,
  sx,
  children,
  ...props
}: StepperTriggerProps) {
  const { setValue, stepKeys, orientation } = useStepperContext('StepperTrigger');
  const { value, status, disabled, stepIndex } = useStepperItemContext('StepperTrigger');

  const handleClick = async (e: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    await setValue(value);
  };

  const handleKeyDown = async (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    const targetIndex = getNextRovingIndex(e.key, stepIndex, stepKeys.length, {
      orientation,
      loop: false,
    });

    if (targetIndex !== null && stepKeys[targetIndex]) {
      e.preventDefault();
      const nextKey = stepKeys[targetIndex];
      await setValue(nextKey);
      const nextButton = document.getElementById(`stepper-tab-${nextKey}`);
      nextButton?.focus();
    }
  };

  const sxProps = stylex.props(styles.trigger, disabled && styles.triggerDisabled, sx);

  return (
    <Button
      variant="ghost"
      type="button"
      role="tab"
      id={props.id ?? `stepper-tab-${value}`}
      aria-controls={`stepper-panel-${value}`}
      aria-selected={status === 'active'}
      tabIndex={status === 'active' ? 0 : -1}
      data-slot="stepper-trigger"
      data-status={status}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface StepperIndicatorProps extends ComponentProps<'div'> {
  children?: ReactNode;
  sx?: stylex.StyleXStyles;
}

function StepperIndicator({ className, sx, children, ...props }: StepperIndicatorProps) {
  const { status, stepIndex } = useStepperItemContext('StepperIndicator');

  const statusStyle =
    status === 'completed'
      ? styles.indicatorCompleted
      : status === 'active'
        ? styles.indicatorActive
        : styles.indicatorInactive;

  const sxProps = stylex.props(styles.indicator, statusStyle, sx);

  const defaultContent = () => {
    if (children) return children;
    if (status === 'completed') {
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }
    return stepIndex + 1;
  };

  return (
    <Flex
      align="center"
      justify="center"
      aria-hidden="true"
      data-slot="stepper-indicator"
      data-status={status}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {defaultContent()}
    </Flex>
  );
}

export interface StepperSeparatorProps extends ComponentProps<'div'> {
  forceMount?: boolean;
  sx?: stylex.StyleXStyles;
}

function StepperSeparator({ className, forceMount = false, sx, ...props }: StepperSeparatorProps) {
  const { orientation, stepKeys } = useStepperContext('StepperSeparator');
  const { status, stepIndex } = useStepperItemContext('StepperSeparator');

  const isLast = stepIndex >= stepKeys.length - 1;
  if (isLast && !forceMount) return null;

  const isCompleted = status === 'completed';
  const orientationStyle =
    orientation === 'vertical' ? styles.separatorVertical : styles.separatorHorizontal;

  const sxProps = stylex.props(
    styles.separator,
    orientationStyle,
    isCompleted && styles.separatorCompleted,
    sx,
  );

  return (
    <Box
      aria-hidden="true"
      data-slot="stepper-separator"
      data-completed={isCompleted ? '' : undefined}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface StepperTitleProps extends ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function StepperTitle({ className, sx, children, ...props }: StepperTitleProps) {
  const { status } = useStepperItemContext('StepperTitle');
  const sxProps = stylex.props(styles.title, status === 'inactive' && styles.titleInactive, sx);

  return (
    <Text
      strong
      data-slot="stepper-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface StepperDescriptionProps extends ComponentProps<'span'> {
  sx?: stylex.StyleXStyles;
}

function StepperDescription({ className, sx, children, ...props }: StepperDescriptionProps) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <Text
      type="secondary"
      size="xs"
      data-slot="stepper-description"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface StepperContentProps extends ComponentProps<'div'> {
  value: string;
  forceMount?: boolean;
  sx?: stylex.StyleXStyles;
}

function StepperContent({
  className,
  value: contentValue,
  forceMount = false,
  sx,
  children,
  ...props
}: StepperContentProps) {
  const { value } = useStepperContext('StepperContent');
  const isHidden = value !== contentValue;

  if (isHidden && !forceMount) {
    return null;
  }

  const sxProps = stylex.props(styles.content, sx);

  return (
    <Box
      role="tabpanel"
      id={props.id ?? `stepper-panel-${contentValue}`}
      aria-labelledby={`stepper-tab-${contentValue}`}
      hidden={isHidden}
      data-slot="stepper-content"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Box>
  );
}

export interface StepperNextProps extends ButtonProps {
  sx?: stylex.StyleXStyles;
}

function StepperNext({
  children = 'Next',
  onClick,
  disabled: disabledProp,
  ...props
}: StepperNextProps) {
  const { value, stepKeys, setValue } = useStepperContext('StepperNext');
  const currentIndex = stepKeys.indexOf(value);
  const isLast = currentIndex >= stepKeys.length - 1;
  const disabled = disabledProp || isLast;

  const handleClick = async (e: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    const nextKey = stepKeys[currentIndex + 1];
    if (nextKey) {
      await setValue(nextKey);
    }
  };

  return (
    <Button
      type="button"
      data-slot="stepper-next"
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface StepperPrevProps extends ButtonProps {
  sx?: stylex.StyleXStyles;
}

function StepperPrev({
  children = 'Previous',
  onClick,
  disabled: disabledProp,
  ...props
}: StepperPrevProps) {
  const { value, stepKeys, setValue } = useStepperContext('StepperPrev');
  const currentIndex = stepKeys.indexOf(value);
  const isFirst = currentIndex <= 0;
  const disabled = disabledProp || isFirst;

  const handleClick = async (e: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    const prevKey = stepKeys[currentIndex - 1];
    if (prevKey) {
      await setValue(prevKey);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      data-slot="stepper-prev"
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface StepperTextProps extends ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function StepperText({ className, sx, children, ...props }: StepperTextProps) {
  const sxProps = stylex.props(styles.textWrapper, sx);
  return (
    <Box
      data-slot="stepper-text"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Box>
  );
}

export {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperText,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperNext,
  StepperPrev,
};
