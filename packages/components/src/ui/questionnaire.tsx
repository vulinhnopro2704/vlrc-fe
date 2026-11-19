import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent as ReactFormEvent,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { colors, radius, spacing } from '../theme/tokens.stylex';
import { Box } from '../layout/Box';
import { HStack } from '../layout/Stack';
import { Text } from '../Typography/Text';
import { Title } from '../Typography/Title';
import { Button, type ButtonProps } from './button';
import { cn } from '../utils';

export interface QuestionnaireStatus {
  currentStep: number;
  currentStepName: string;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  isComplete: boolean;
  values: Record<string, unknown>;
}

export interface QuestionnaireContextValue {
  currentStep: number;
  currentStepName: string;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  isComplete: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (indexOrName: number | string) => void;
  skipStep: () => void;
  values: Record<string, unknown>;
  setValue: (name: string, value: unknown) => void;
  getValue: (name: string) => unknown;
  items: Array<{ name: string; required?: boolean }>;
  registerItem: (name: string, required?: boolean) => void;
  unregisterItem: (name: string) => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(null);

export function useQuestionnaire(): QuestionnaireContextValue {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a Questionnaire');
  }
  return context;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    gap: spacing.md,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    gap: spacing.sm,
  },
  itemHidden: {
    display: 'none',
  },
  title: {
    padding: 0,
    margin: 0,
    marginBottom: spacing.xs,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: spacing.sm,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.borderDefault,
  },
  // Progress
  progressRoot: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['1'],
  },
  progressBarTrack: {
    width: '100%',
    height: '0.375rem',
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarIndicator: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    transitionProperty: 'width',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-in-out',
  },
  segmentedTrack: {
    display: 'flex',
    width: '100%',
    gap: spacing['1'],
    alignItems: 'center',
  },
  segmentedBar: {
    flex: '1 1 0%',
    height: '0.375rem',
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
  },
  segmentedBarActive: {
    backgroundColor: colors.primary,
  },
});

export interface QuestionnaireProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'defaultValue'
> {
  currentStep?: number | string;
  defaultStep?: number | string;
  onStepChange?: (stepIndex: number, stepName: string) => void;
  onSubmit?: (values: Record<string, unknown>, event: ReactFormEvent<HTMLFormElement>) => void;
  onStatusChange?: (status: QuestionnaireStatus) => void;
  values?: Record<string, unknown>;
  defaultValues?: Record<string, unknown>;
  onValuesChange?: (values: Record<string, unknown>) => void;
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const Questionnaire = forwardRef<HTMLFormElement, QuestionnaireProps>(
  (
    {
      currentStep: controlledStep,
      defaultStep = 0,
      onStepChange,
      onSubmit,
      onStatusChange,
      values: controlledValues,
      defaultValues = {},
      onValuesChange,
      sx,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [items, setItems] = useState<Array<{ name: string; required?: boolean }>>([]);
    const [uncontrolledStep, setUncontrolledStep] = useState<number>(
      typeof defaultStep === 'number' ? defaultStep : 0,
    );
    const [uncontrolledValues, setUncontrolledValues] =
      useState<Record<string, unknown>>(defaultValues);
    const [isComplete, setIsComplete] = useState(false);

    const isStepControlled = controlledStep !== undefined;
    const isValuesControlled = controlledValues !== undefined;

    const values = isValuesControlled ? controlledValues : uncontrolledValues;

    // Resolve step index
    const currentStepIndex = useMemo(() => {
      if (!isStepControlled) return uncontrolledStep;
      if (typeof controlledStep === 'number') return controlledStep;
      const foundIdx = items.findIndex((it) => it.name === controlledStep);
      return foundIdx !== -1 ? foundIdx : 0;
    }, [isStepControlled, controlledStep, uncontrolledStep, items]);

    const registerItem = useCallback((name: string, required?: boolean) => {
      setItems((prev) => {
        if (prev.some((it) => it.name === name)) {
          return prev.map((it) => (it.name === name ? { name, required } : it));
        }
        return [...prev, { name, required }];
      });
    }, []);

    const unregisterItem = useCallback((name: string) => {
      setItems((prev) => prev.filter((it) => it.name !== name));
    }, []);

    const totalSteps = items.length;
    const isFirst = currentStepIndex <= 0;
    const isLast = totalSteps > 0 && currentStepIndex >= totalSteps - 1;
    const currentStepName = items[currentStepIndex]?.name || '';

    const setValue = useCallback(
      (name: string, val: unknown) => {
        const next = { ...values, [name]: val };
        if (!isValuesControlled) {
          setUncontrolledValues(next);
        }
        onValuesChange?.(next);
      },
      [values, isValuesControlled, onValuesChange],
    );

    const getValue = useCallback((name: string) => values[name], [values]);

    const goToStep = useCallback(
      (target: number | string) => {
        let nextIdx = 0;
        if (typeof target === 'number') {
          nextIdx = Math.max(0, Math.min(totalSteps - 1, target));
        } else {
          const found = items.findIndex((it) => it.name === target);
          if (found !== -1) nextIdx = found;
        }

        if (!isStepControlled) {
          setUncontrolledStep(nextIdx);
        }
        const nextName = items[nextIdx]?.name || '';
        onStepChange?.(nextIdx, nextName);
      },
      [totalSteps, items, isStepControlled, onStepChange],
    );

    const nextStep = useCallback(() => {
      if (isLast) {
        setIsComplete(true);
      } else {
        goToStep(currentStepIndex + 1);
      }
    }, [isLast, goToStep, currentStepIndex]);

    const prevStep = useCallback(() => {
      if (!isFirst) {
        setIsComplete(false);
        goToStep(currentStepIndex - 1);
      }
    }, [isFirst, goToStep, currentStepIndex]);

    const skipStep = useCallback(() => {
      nextStep();
    }, [nextStep]);

    // Notify status change
    useEffect(() => {
      onStatusChange?.({
        currentStep: currentStepIndex,
        currentStepName,
        totalSteps,
        isFirst,
        isLast,
        isComplete,
        values,
      });
    }, [
      currentStepIndex,
      currentStepName,
      totalSteps,
      isFirst,
      isLast,
      isComplete,
      values,
      onStatusChange,
    ]);

    const handleSubmit = (e: ReactFormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isLast) {
        nextStep();
      } else {
        setIsComplete(true);
        onSubmit?.(values, e);
      }
    };

    const contextValue: QuestionnaireContextValue = {
      currentStep: currentStepIndex,
      currentStepName,
      totalSteps,
      isFirst,
      isLast,
      isComplete,
      canGoNext: totalSteps > 0,
      canGoPrev: !isFirst,
      nextStep,
      prevStep,
      goToStep,
      skipStep,
      values,
      setValue,
      getValue,
      items,
      registerItem,
      unregisterItem,
    };

    const sxProps = stylex.props(styles.root, sx);

    return (
      <QuestionnaireContext.Provider value={contextValue}>
        <Box
          as="form"
          ref={ref as any}
          data-slot="questionnaire"
          onSubmit={handleSubmit}
          className={cn(sxProps.className, className)}
          style={sxProps.style}
          {...props}
        >
          {children}
        </Box>
      </QuestionnaireContext.Provider>
    );
  },
);

Questionnaire.displayName = 'Questionnaire';

export interface QuestionnaireItemProps extends HTMLAttributes<HTMLFieldSetElement> {
  name: string;
  required?: boolean;
  title?: string;
  description?: string;
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const QuestionnaireItem = forwardRef<HTMLFieldSetElement, QuestionnaireItemProps>(
  ({ name, required = false, title, description, sx, className, children, ...props }, ref) => {
    const { currentStepName, registerItem, unregisterItem } = useQuestionnaire();

    useEffect(() => {
      registerItem(name, required);
      return () => unregisterItem(name);
    }, [name, required, registerItem, unregisterItem]);

    const isActive = currentStepName === name;
    const sxProps = stylex.props(styles.item, !isActive && styles.itemHidden, sx);

    return (
      <Box
        as="fieldset"
        ref={ref as any}
        data-slot="questionnaire-item"
        data-step-name={name}
        data-active={isActive ? 'true' : 'false'}
        aria-hidden={!isActive ? 'true' : undefined}
        tabIndex={!isActive ? -1 : undefined}
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {title && <QuestionnaireTitle>{title}</QuestionnaireTitle>}
        {description && <QuestionnaireDescription>{description}</QuestionnaireDescription>}
        {children}
      </Box>
    );
  },
);

QuestionnaireItem.displayName = 'QuestionnaireItem';

export interface QuestionnaireTitleProps extends HTMLAttributes<HTMLLegendElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const QuestionnaireTitle = forwardRef<HTMLLegendElement, QuestionnaireTitleProps>(
  ({ sx, className, children, ...props }, ref) => {
    const sxProps = stylex.props(styles.title, sx);

    return (
      <Box
        as="legend"
        ref={ref as any}
        data-slot="questionnaire-title"
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {typeof children === 'string' ? (
          <Title level={4} m={0}>
            {children}
          </Title>
        ) : (
          children
        )}
      </Box>
    );
  },
);

QuestionnaireTitle.displayName = 'QuestionnaireTitle';

export interface QuestionnaireDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const QuestionnaireDescription = forwardRef<
  HTMLParagraphElement,
  QuestionnaireDescriptionProps
>(({ sx, className, children, ...props }, ref) => {
  return (
    <Box ref={ref as any} data-slot="questionnaire-description" className={className} {...props}>
      {typeof children === 'string' ? (
        <Text type="secondary" size="sm">
          {children}
        </Text>
      ) : (
        children
      )}
    </Box>
  );
});

QuestionnaireDescription.displayName = 'QuestionnaireDescription';

export interface QuestionnaireContentProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const QuestionnaireContent = forwardRef<HTMLDivElement, QuestionnaireContentProps>(
  ({ sx, className, children, ...props }, ref) => {
    const sxProps = stylex.props(styles.content, sx);
    return (
      <Box
        ref={ref}
        data-slot="questionnaire-content"
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

QuestionnaireContent.displayName = 'QuestionnaireContent';

export type QuestionnaireProgressVariant = 'bar' | 'segmented' | 'text';

export interface QuestionnaireProgressProps extends HTMLAttributes<HTMLDivElement> {
  variant?: QuestionnaireProgressVariant;
  formatText?: (current: number, total: number) => string;
  sx?: stylex.StyleXStyles;
}

export const QuestionnaireProgress = forwardRef<HTMLDivElement, QuestionnaireProgressProps>(
  (
    {
      variant = 'segmented',
      formatText = (cur, tot) => `Question ${cur + 1} of ${tot}`,
      sx,
      className,
      ...props
    },
    ref,
  ) => {
    const { currentStep, totalSteps } = useQuestionnaire();
    const percent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
    const sxProps = stylex.props(styles.progressRoot, sx);

    return (
      <Box
        ref={ref}
        data-slot="questionnaire-progress"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuetext={formatText(currentStep, totalSteps)}
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        <Text size="xs" type="secondary" weight="medium">
          {formatText(currentStep, totalSteps)}
        </Text>

        {variant === 'bar' && (
          <Box sx={styles.progressBarTrack}>
            <Box
              sx={styles.progressBarIndicator}
              style={{ width: `${percent}%` }}
              aria-hidden="true"
            />
          </Box>
        )}

        {variant === 'segmented' && (
          <Box sx={styles.segmentedTrack} aria-hidden="true">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <Box
                key={idx}
                sx={[styles.segmentedBar, idx <= currentStep && styles.segmentedBarActive]}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  },
);

QuestionnaireProgress.displayName = 'QuestionnaireProgress';

export interface QuestionnaireActionsProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
}

export const QuestionnaireActions = forwardRef<HTMLDivElement, QuestionnaireActionsProps>(
  ({ sx, className, children, ...props }, ref) => {
    const sxProps = stylex.props(styles.actions, sx);

    return (
      <Box
        ref={ref}
        data-slot="questionnaire-actions"
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

QuestionnaireActions.displayName = 'QuestionnaireActions';

export interface QuestionnairePreviousProps extends Omit<ButtonProps, 'onClick'> {
  sx?: stylex.StyleXStyles;
}

export const QuestionnairePrevious = forwardRef<HTMLButtonElement, QuestionnairePreviousProps>(
  ({ variant = 'ghost', size = 'default', children, disabled: buttonDisabled, ...props }, ref) => {
    const { prevStep, isFirst } = useQuestionnaire();
    const isButtonDisabled = buttonDisabled ?? isFirst;

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        disabled={isButtonDisabled}
        onClick={prevStep}
        data-slot="questionnaire-previous"
        {...props}
      >
        {children || (
          <HStack gap="xxs">
            <ChevronLeft size={16} />
            <Text size="sm">Back</Text>
          </HStack>
        )}
      </Button>
    );
  },
);

QuestionnairePrevious.displayName = 'QuestionnairePrevious';

export interface QuestionnaireNextProps extends Omit<ButtonProps, 'onClick'> {
  completeLabel?: string;
  nextLabel?: string;
  sx?: stylex.StyleXStyles;
}

export const QuestionnaireNext = forwardRef<HTMLButtonElement, QuestionnaireNextProps>(
  (
    {
      variant = 'default',
      size = 'default',
      completeLabel = 'Submit',
      nextLabel = 'Next',
      children,
      disabled: buttonDisabled,
      ...props
    },
    ref,
  ) => {
    const { isLast, items, currentStepName, getValue } = useQuestionnaire();
    const currentItem = items.find((it) => it.name === currentStepName);
    const currentValue = getValue(currentStepName);

    // If step is required and value is empty/undefined, optionally disable next
    const isRequiredEmpty =
      currentItem?.required &&
      (currentValue === undefined ||
        currentValue === '' ||
        (Array.isArray(currentValue) && currentValue.length === 0));

    const isButtonDisabled = buttonDisabled ?? isRequiredEmpty;

    return (
      <Button
        ref={ref}
        type="submit"
        variant={variant}
        size={size}
        disabled={isButtonDisabled}
        data-slot="questionnaire-next"
        {...props}
      >
        {children || (
          <HStack gap="xxs">
            <Text size="sm" style={{ color: 'inherit' }}>
              {isLast ? completeLabel : nextLabel}
            </Text>
            {isLast ? <Check size={16} /> : <ChevronRight size={16} />}
          </HStack>
        )}
      </Button>
    );
  },
);

QuestionnaireNext.displayName = 'QuestionnaireNext';

export interface QuestionnaireSkipProps extends Omit<ButtonProps, 'onClick'> {
  label?: string;
  sx?: stylex.StyleXStyles;
}

export const QuestionnaireSkip = forwardRef<HTMLButtonElement, QuestionnaireSkipProps>(
  (
    {
      variant = 'ghost',
      size = 'default',
      label = 'Skip',
      children,
      disabled: buttonDisabled,
      ...props
    },
    ref,
  ) => {
    const { skipStep, items, currentStepName } = useQuestionnaire();
    const currentItem = items.find((it) => it.name === currentStepName);

    // Cannot skip if required
    const isButtonDisabled = buttonDisabled ?? currentItem?.required;

    if (currentItem?.required) {
      return null;
    }

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        disabled={isButtonDisabled}
        onClick={skipStep}
        data-slot="questionnaire-skip"
        {...props}
      >
        {children || <Text size="sm">{label}</Text>}
      </Button>
    );
  },
);

QuestionnaireSkip.displayName = 'QuestionnaireSkip';
