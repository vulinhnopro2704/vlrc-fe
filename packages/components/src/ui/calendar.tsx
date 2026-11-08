'use client';

import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, getDefaultClassNames, type DayButton } from 'react-day-picker';
import * as stylex from '@stylexjs/stylex';

import { colors, radii } from '../theme/tokens.stylex';
import { cn } from '../utils';
import { Button } from './button';

const styles = stylex.create({
  rootContainer: {
    backgroundColor: colors.background,
    padding: '0.75rem',
    borderRadius: radii.md,
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
    gap: '1rem',
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
  },
  navBtn: {
    width: '2rem',
    height: '2rem',
    padding: 0,
    userSelect: 'none',
  },
  monthCaption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '2rem',
    width: '100%',
  },
  dropdowns: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: 500,
    justifyContent: 'center',
    height: '2rem',
    gap: '0.375rem',
  },
  dropdownRoot: {
    position: 'relative',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    borderRadius: radii.md,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.popover,
    inset: 0,
    opacity: 0,
  },
  captionLabel: {
    userSelect: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  weekdays: {
    display: 'flex',
  },
  weekday: {
    color: colors.mutedForeground,
    borderRadius: radii.md,
    flex: 1,
    fontWeight: 400,
    fontSize: '0.8rem',
    userSelect: 'none',
    textAlign: 'center',
  },
  week: {
    display: 'flex',
    width: '100%',
    marginTop: '0.5rem',
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
    width: '100%',
    height: '100%',
    padding: 0,
    textAlign: 'center',
    aspectRatio: '1 / 1',
    userSelect: 'none',
  },
  rangeStart: {
    borderTopLeftRadius: radii.md,
    borderBottomLeftRadius: radii.md,
    backgroundColor: colors.accent,
  },
  rangeMiddle: {
    borderRadius: 0,
  },
  rangeEnd: {
    borderTopRightRadius: radii.md,
    borderBottomRightRadius: radii.md,
    backgroundColor: colors.accent,
  },
  today: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    borderRadius: radii.md,
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
  icon: {
    width: '1rem',
    height: '1rem',
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
    minWidth: '2rem',
    flexDirection: 'column',
    gap: '0.25rem',
    lineHeight: 1,
    fontWeight: 400,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  dayButtonRangeMiddle: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
    borderRadius: 0,
  },
  dayButtonRangeStart: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    borderTopLeftRadius: radii.md,
    borderBottomLeftRadius: radii.md,
  },
  dayButtonRangeEnd: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    borderTopRightRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
});

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
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
  sx,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const rootStyleProps = stylex.props(styles.rootContainer, sx);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(rootStyleProps.className, className)}
      captionLayout={captionLayout}
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
          stylex.props(styles.navBtn).className,
          defaultClassNames.button_previous,
        ),
        button_next: cn(stylex.props(styles.navBtn).className, defaultClassNames.button_next),
        month_caption: cn(
          stylex.props(styles.monthCaption).className,
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(stylex.props(styles.dropdowns).className, defaultClassNames.dropdowns),
        dropdown_root: cn(
          stylex.props(styles.dropdownRoot).className,
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(stylex.props(styles.dropdown).className, defaultClassNames.dropdown),
        caption_label: cn(
          stylex.props(styles.captionLabel).className,
          defaultClassNames.caption_label,
        ),
        weekdays: cn(stylex.props(styles.weekdays).className, defaultClassNames.weekdays),
        weekday: cn(stylex.props(styles.weekday).className, defaultClassNames.weekday),
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
          const iconProps = stylex.props(styles.icon);
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                {...iconProps}
                className={cn(iconProps.className, className)}
                {...chevronProps}
              />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                {...iconProps}
                className={cn(iconProps.className, className)}
                {...chevronProps}
              />
            );
          }

          return (
            <ChevronDownIcon
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
              <div {...stylex.props(styles.weekNumberCell)}>{children}</div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

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
        isSelected ? styles.dayButtonSelected : undefined,
        modifiers.range_start ? styles.dayButtonRangeStart : undefined,
        modifiers.range_end ? styles.dayButtonRangeEnd : undefined,
        modifiers.range_middle ? styles.dayButtonRangeMiddle : undefined,
      ]}
      className={cn(defaultClassNames.day, className)}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
