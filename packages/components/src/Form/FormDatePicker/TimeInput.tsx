import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Input } from '../../ui/input';
import { cn } from '../../utils';
import type { TimeConfig } from './types';

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  timeField: {
    width: '3.5rem',
    textAlign: 'center',
  },
});

interface TimeInputProps {
  value?: Date;
  onChange?: (date: Date) => void;
  timeConfig?: TimeConfig;
  className?: string;
}

export function TimeInput({ value, onChange, timeConfig, className }: TimeInputProps) {
  const [hourInput, setHourInput] = useState('');
  const [minuteInput, setMinuteInput] = useState('');
  const [secondInput, setSecondInput] = useState('');

  const format = timeConfig?.format || 'HH:mm:ss';
  const showHour = format.includes('H') || format.includes('h');
  const showMinute = format.includes('m');
  const showSecond = format.includes('s');

  useEffect(() => {
    if (value) {
      setHourInput(value.getHours().toString().padStart(2, '0'));
      setMinuteInput(value.getMinutes().toString().padStart(2, '0'));
      setSecondInput(value.getSeconds().toString().padStart(2, '0'));
    }
  }, [value]);

  const handleInputChange = (type: 'hour' | 'minute' | 'second', val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return;

    const newDate = new Date(value || new Date());
    if (type === 'hour') newDate.setHours(Math.min(Math.max(num, 0), 23));
    if (type === 'minute') newDate.setMinutes(Math.min(Math.max(num, 0), 59));
    if (type === 'second') newDate.setSeconds(Math.min(Math.max(num, 0), 59));

    onChange?.(newDate);
  };

  const containerStyleProps = stylex.props(styles.container);

  return (
    <div {...containerStyleProps} className={cn(containerStyleProps.className, className)}>
      {showHour && (
        <>
          <Input
            type="number"
            min={0}
            max={23}
            value={hourInput}
            onChange={(e) => setHourInput(e.target.value)}
            onBlur={(e) => handleInputChange('hour', e.target.value)}
            sx={styles.timeField}
          />
          {(showMinute || showSecond) && <span>:</span>}
        </>
      )}
      {showMinute && (
        <>
          <Input
            type="number"
            min={0}
            max={59}
            value={minuteInput}
            onChange={(e) => setMinuteInput(e.target.value)}
            onBlur={(e) => handleInputChange('minute', e.target.value)}
            sx={styles.timeField}
          />
          {showSecond && <span>:</span>}
        </>
      )}
      {showSecond && (
        <Input
          type="number"
          min={0}
          max={59}
          value={secondInput}
          onChange={(e) => setSecondInput(e.target.value)}
          onBlur={(e) => handleInputChange('second', e.target.value)}
          sx={styles.timeField}
        />
      )}
    </div>
  );
}

export default TimeInput;
