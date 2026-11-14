'use client';

import * as React from 'react';
import { DayPicker, getDefaultClassNames, type DayButton } from 'react-day-picker';
import * as stylex from '@stylexjs/stylex';

import Icons from '../Icons';
import { colors, radius } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import { Text } from '../Typography';
import { cn } from '../utils';
import { Button } from './button';
import { resolveDatePickerSize, type DatePickerSize } from '../Form/FormDatePicker/types';

const styles = stylex.create({
  rootContainer: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  root: {
    width: 'fit-content',
  },
  months: {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'row',
    position: 'relative',
  },
  month: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '0.75rem',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    width: '100%',
    position: 'absolute',
    top: 0,
    insetInline: 0,
    justifyContent: 'space-between',
    pointerEvents: 'none',
    zIndex: 1,
  },
  navBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    userSelect: 'none',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.foreground,
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
    ':disabled': {
      opacity: 0.3,
      pointerEvents: 'none',
      cursor: 'not-allowed',
    },
  },
  monthCaption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  dropdowns: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: 500,
    justifyContent: 'center',
    gap: '0.375rem',
    zIndex: 2,
  },
  dropdownRoot: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    ':hover': {
      backgroundColor: colors.accent,
    },
  },
  dropdown: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    zIndex: 3,
  },
  captionLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    userSelect: 'none',
    fontWeight: 500,
    color: colors.foreground,
  },
  monthGrid: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  weekdays: {
    display: 'flex',
    width: '100%',
  },
  weekday: {
    color: colors.mutedForeground,
    flex: 1,
    fontWeight: 500,
    userSelect: 'none',
    textAlign: 'center',
    padding: '0.25rem 0',
  },
  week: {
    display: 'flex',
    width: '100%',
    marginTop: '0.25rem',
  },
  weekNumberHeader: {
    userSelect: 'none',
    width: '2rem',
  },
  weekNumber: {
    fontSize: '0.8rem',
    userSelect: 'none',
    color: colors.mutedForeground,
  },
  day: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    textAlign: 'center',
    userSelect: 'none',
  },
  rangeStart: {
    borderTopLeftRadius: radius.md,
    borderBottomLeftRadius: radius.md,
    backgroundColor: colors.accent,
  },
  rangeMiddle: {
    borderRadius: 0,
  },
  rangeEnd: {
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
    backgroundColor: colors.accent,
  },
  today: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    borderRadius: radius.md,
  },
  outside: {
    color: colors.mutedForeground,
  },
  disabled: {
    color: colors.mutedForeground,
    opacity: 0.5,
  },
  hidden: {
    visibility: 'hidden',
  },
  weekNumberCell: {
    display: 'flex',
    width: '2rem',
    height: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  dayButton: {
    display: 'flex',
    aspectRatio: '1 / 1',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: 1,
    fontWeight: 400,
    borderRadius: radius.md,
    color: colors.foreground,
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  dayButtonOutside: {
    color: colors.mutedForeground,
    opacity: 0.4,
  },
  dayButtonToday: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    fontWeight: 600,
  },
  dayButtonDisabled: {
    color: colors.mutedForeground,
    opacity: 0.35,
    pointerEvents: 'none',
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    fontWeight: 600,
    ':hover': {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
  },
  dayButtonRangeMiddle: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    borderRadius: 0,
  },
  dayButtonRangeStart: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    borderTopLeftRadius: radius.md,
    borderBottomLeftRadius: radius.md,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  dayButtonRangeEnd: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
});

const rootSizeStyles = stylex.create({
  xxs: { padding: '0.375rem' },
  xs: { padding: '0.5rem' },
  sm: { padding: '0.5rem' },
  md: { padding: '0.75rem' },
  lg: { padding: '1rem' },
  xl: { padding: '1.25rem' },
  xxl: { padding: '1.5rem' },
});

const navBtnSizeStyles = stylex.create({
  xxs: { width: '1.5rem', height: '1.5rem' },
  xs: { width: '1.75rem', height: '1.75rem' },
  sm: { width: '1.875rem', height: '1.875rem' },
  md: { width: '2rem', height: '2rem' },
  lg: { width: '2.25rem', height: '2.25rem' },
  xl: { width: '2.5rem', height: '2.5rem' },
  xxl: { width: '2.75rem', height: '2.75rem' },
});

const dropdownRootSizeStyles = stylex.create({
  xxs: { height: '1.5rem', paddingInline: '0.375rem' },
  xs: { height: '1.75rem', paddingInline: '0.4375rem' },
  sm: { height: '1.875rem', paddingInline: '0.5rem' },
  md: { height: '2rem', paddingInline: '0.5rem' },
  lg: { height: '2.25rem', paddingInline: '0.625rem' },
  xl: { height: '2.5rem', paddingInline: '0.75rem' },
  xxl: { height: '2.75rem', paddingInline: '0.875rem' },
});

const captionSizeStyles = stylex.create({
  xxs: { height: '1.5rem' },
  xs: { height: '1.75rem' },
  sm: { height: '1.875rem' },
  md: { height: '2rem' },
  lg: { height: '2.25rem' },
  xl: { height: '2.5rem' },
  xxl: { height: '2.75rem' },
});

const dayButtonSizeStyles = stylex.create({
  xxs: { minWidth: '1.5rem', height: '1.5rem', fontSize: '0.6875rem' },
  xs: { minWidth: '1.75rem', height: '1.75rem', fontSize: '0.75rem' },
  sm: { minWidth: '1.875rem', height: '1.875rem', fontSize: '0.8125rem' },
  md: { minWidth: '2rem', height: '2rem', fontSize: '0.875rem' },
  lg: { minWidth: '2.375rem', height: '2.375rem', fontSize: '0.9375rem' },
  xl: { minWidth: '2.625rem', height: '2.625rem', fontSize: '1rem' },
  xxl: { minWidth: '3rem', height: '3rem', fontSize: '1.125rem' },
});

const iconSizeStyles = stylex.create({
  xxs: { width: '0.75rem', height: '0.75rem' },
  xs: { width: '0.8125rem', height: '0.8125rem' },
  sm: { width: '0.875rem', height: '0.875rem' },
  md: { width: '1rem', height: '1rem' },
  lg: { width: '1.125rem', height: '1.125rem' },
  xl: { width: '1.25rem', height: '1.25rem' },
  xxl: { width: '1.375rem', height: '1.375rem' },
});

const weekdaySizeStyles = stylex.create({
  xxs: { fontSize: '0.6875rem' },
  xs: { fontSize: '0.75rem' },
  sm: { fontSize: '0.75rem' },
  md: { fontSize: '0.8rem' },
  lg: { fontSize: '0.875rem' },
  xl: { fontSize: '0.9375rem' },
  xxl: { fontSize: '1rem' },
});

interface CalendarContextValue {
  size: ComponentSize;
}
const CalendarContext = React.createContext<CalendarContextValue>({ size: 'md' });

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  size?: DatePickerSize;
  sx?: stylex.StyleXStyles;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant: _buttonVariant = 'ghost',
  formatters,
  components,
  size = 'md',
  sx,
  startMonth,
  endMonth,
  ...props
}: CalendarProps) {
  const resolvedSize = resolveDatePickerSize(size);
  const defaultClassNames = getDefaultClassNames();
  const rootStyleProps = stylex.props(styles.rootContainer, rootSizeStyles[resolvedSize], sx);

  const currentYear = new Date().getFullYear();
  const resolvedStartMonth = startMonth ?? new Date(currentYear - 100, 0, 1);
  const resolvedEndMonth = endMonth ?? new Date(currentYear + 50, 11, 31);

  return (
    <CalendarContext.Provider value={{ size: resolvedSize }}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(rootStyleProps.className, className)}
        captionLayout={captionLayout}
        startMonth={resolvedStartMonth}
        endMonth={resolvedEndMonth}
        formatters={{
          formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
          ...formatters,
        }}
        classNames={{
          root: cn(stylex.props(styles.root).className, defaultClassNames.root),
          months: cn(stylex.props(styles.months).className, defaultClassNames.months),
          month: cn(stylex.props(styles.month).className, defaultClassNames.month),
          nav: cn(stylex.props(styles.nav).className, defaultClassNames.nav),
          button_previous: cn(
            stylex.props(styles.navBtn, navBtnSizeStyles[resolvedSize]).className,
            defaultClassNames.button_previous,
          ),
          button_next: cn(
            stylex.props(styles.navBtn, navBtnSizeStyles[resolvedSize]).className,
            defaultClassNames.button_next,
          ),
          month_caption: cn(
            stylex.props(styles.monthCaption, captionSizeStyles[resolvedSize]).className,
            defaultClassNames.month_caption,
          ),
          dropdowns: cn(
            stylex.props(styles.dropdowns, captionSizeStyles[resolvedSize]).className,
            defaultClassNames.dropdowns,
          ),
          dropdown_root: cn(
            stylex.props(styles.dropdownRoot, dropdownRootSizeStyles[resolvedSize]).className,
            defaultClassNames.dropdown_root,
          ),
          dropdown: cn(stylex.props(styles.dropdown).className, defaultClassNames.dropdown),
          caption_label: cn(
            stylex.props(styles.captionLabel).className,
            defaultClassNames.caption_label,
          ),
          month_grid: cn(stylex.props(styles.monthGrid).className, defaultClassNames.month_grid),
          weekdays: cn(stylex.props(styles.weekdays).className, defaultClassNames.weekdays),
          weekday: cn(
            stylex.props(styles.weekday, weekdaySizeStyles[resolvedSize]).className,
            defaultClassNames.weekday,
          ),
          week: cn(stylex.props(styles.week).className, defaultClassNames.week),
          week_number_header: cn(
            stylex.props(styles.weekNumberHeader).className,
            defaultClassNames.week_number_header,
          ),
          week_number: cn(stylex.props(styles.weekNumber).className, defaultClassNames.week_number),
          day: cn(stylex.props(styles.day).className, defaultClassNames.day),
          range_start: cn(stylex.props(styles.rangeStart).className, defaultClassNames.range_start),
          range_middle: cn(
            stylex.props(styles.rangeMiddle).className,
            defaultClassNames.range_middle,
          ),
          range_end: cn(stylex.props(styles.rangeEnd).className, defaultClassNames.range_end),
          today: cn(stylex.props(styles.today).className, defaultClassNames.today),
          outside: cn(stylex.props(styles.outside).className, defaultClassNames.outside),
          disabled: cn(stylex.props(styles.disabled).className, defaultClassNames.disabled),
          hidden: cn(stylex.props(styles.hidden).className, defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: ({ className, rootRef, ...rootProps }) => {
            return <div data-slot="calendar" ref={rootRef} className={className} {...rootProps} />;
          },
          Chevron: ({ className, orientation, ...chevronProps }) => {
            const iconProps = stylex.props(iconSizeStyles[resolvedSize]);
            if (orientation === 'left') {
              return (
                <Icons.ChevronLeft
                  {...iconProps}
                  className={cn(iconProps.className, className)}
                  {...chevronProps}
                />
              );
            }

            if (orientation === 'right') {
              return (
                <Icons.ChevronRight
                  {...iconProps}
                  className={cn(iconProps.className, className)}
                  {...chevronProps}
                />
              );
            }

            return (
              <Icons.ChevronDown
                {...iconProps}
                className={cn(iconProps.className, className)}
                {...chevronProps}
              />
            );
          },
          DayButton: CalendarDayButton,
          WeekNumber: ({ children, ...weekProps }) => {
            return (
              <td {...weekProps}>
                <div {...stylex.props(styles.weekNumberCell)}>
                  <Text size="xs" type="muted">
                    {children}
                  </Text>
                </div>
              </td>
            );
          },
          ...components,
        }}
        {...props}
      />
    </CalendarContext.Provider>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const { size } = React.useContext(CalendarContext);

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelected =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSelected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      sx={[
        styles.dayButton,
        dayButtonSizeStyles[size],
        modifiers.outside ? styles.dayButtonOutside : undefined,
        modifiers.today && !isSelected && !modifiers.range_start && !modifiers.range_end
          ? styles.dayButtonToday
          : undefined,
        modifiers.disabled ? styles.dayButtonDisabled : undefined,
        isSelected ? styles.dayButtonSelected : undefined,
        modifiers.range_start ? styles.dayButtonRangeStart : undefined,
        modifiers.range_end ? styles.dayButtonRangeEnd : undefined,
        modifiers.range_middle ? styles.dayButtonRangeMiddle : undefined,
      ]}
      className={cn(defaultClassNames.day_button, className)}
      {...props}
    >
      <Text
        size={
          size === 'xxs' || size === 'xs' ? 'xs' : size === 'xl' || size === 'xxl' ? 'md' : 'sm'
        }
        weight={isSelected || modifiers.today ? 'medium' : 'normal'}
        style={{ color: 'inherit' }}
      >
        {day.date.getDate()}
      </Text>
    </Button>
  );
}

export { Calendar, CalendarDayButton };
