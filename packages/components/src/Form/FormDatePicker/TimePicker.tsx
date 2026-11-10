import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../../theme/tokens.stylex';
import { ScrollArea } from '../../ui/scroll-area';
import { Text } from '../../Typography';
import type { DisabledTime, TimeConfig } from './types';

const styles = stylex.create({
  picker: {
    display: 'flex',
    gap: '0.25rem',
    padding: '0.25rem',
  },
  headerGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  scrollArea: {
    height: '15rem',
    width: '4rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemBtn: {
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    textAlign: 'center',
    borderRadius: radii.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.foreground,
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    outline: 'none',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  itemActive: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    ':hover': {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
  },
  itemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
});

interface TimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  timeConfig?: TimeConfig;
  disabledTime?: DisabledTime;
}

export function TimePicker({
  value,
  onChange,
  timeConfig = {},
  disabledTime = {},
}: TimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const {
    format = 'HH:mm:ss',
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    hideDisabledOptions = false,
  } = timeConfig;

  const showHour = format.includes('H') || format.includes('h');
  const showMinute = format.includes('m');
  const showSecond = format.includes('s');

  const hours = selectedDate.getHours();
  const minutes = selectedDate.getMinutes();
  const seconds = selectedDate.getSeconds();

  const disabledHours = disabledTime.disabledHours?.() || [];
  const disabledMinutes = disabledTime.disabledMinutes?.(hours) || [];
  const disabledSeconds = disabledTime.disabledSeconds?.(hours, minutes) || [];

  const handleTimeChange = (type: 'hour' | 'minute' | 'second', val: number) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') newDate.setHours(val);
    if (type === 'minute') newDate.setMinutes(val);
    if (type === 'second') newDate.setSeconds(val);

    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const renderTimeColumn = (
    type: 'hour' | 'minute' | 'second',
    max: number,
    step: number,
    current: number,
    disabledValues: number[],
  ) => {
    const values = [];
    for (let i = 0; i < max; i += step) {
      if (!hideDisabledOptions || !disabledValues.includes(i)) {
        values.push(i);
      }
    }

    return (
      <ScrollArea sx={styles.scrollArea}>
        <div {...stylex.props(styles.column)}>
          {values.map((val) => {
            const isDisabled = disabledValues.includes(val);
            const isActive = current === val;
            return (
              <button
                key={val}
                type="button"
                disabled={isDisabled}
                onClick={() => handleTimeChange(type, val)}
                {...stylex.props(
                  styles.itemBtn,
                  isActive && styles.itemActive,
                  isDisabled && styles.itemDisabled,
                )}
              >
                {val.toString().padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div {...stylex.props(styles.picker)}>
      {showHour && (
        <div {...stylex.props(styles.headerGroup)}>
          <Text as="span" size="xs" weight="medium" sx={styles.headerLabel}>
            Hour
          </Text>
          {renderTimeColumn('hour', 24, hourStep, hours, disabledHours)}
        </div>
      )}
      {showMinute && (
        <div {...stylex.props(styles.headerGroup)}>
          <Text as="span" size="xs" weight="medium" sx={styles.headerLabel}>
            Minute
          </Text>
          {renderTimeColumn('minute', 60, minuteStep, minutes, disabledMinutes)}
        </div>
      )}
      {showSecond && (
        <div {...stylex.props(styles.headerGroup)}>
          <Text as="span" size="xs" weight="medium" sx={styles.headerLabel}>
            Second
          </Text>
          {renderTimeColumn('second', 60, secondStep, seconds, disabledSeconds)}
        </div>
      )}
    </div>
  );
}

export default TimePicker;
