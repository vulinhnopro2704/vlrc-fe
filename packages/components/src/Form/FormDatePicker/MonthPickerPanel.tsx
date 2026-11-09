import React, { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import Icons from '../../Icons';
import { colors, radii, spacing } from '../../theme/tokens.stylex';
import { Text } from '../../Typography';

const MONTH_LABELS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const styles = stylex.create({
  panel: {
    width: 280,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    userSelect: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  navButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: 'transparent',
    color: colors.foreground,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  yearTitleBtn: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: `${spacing.xxs} ${spacing.xs}`,
    borderRadius: radii.sm,
    transition: 'background-color 0.15s ease',
    ':hover': {
      backgroundColor: colors.accent,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.xs,
  },
  monthCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: radii.md,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.foreground,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  monthCellActive: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    fontWeight: 600,
    ':hover': {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
  },
  monthCellDisabled: {
    color: colors.mutedForeground,
    opacity: 0.35,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
});

export interface MonthPickerPanelProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabledDate?: (date: Date) => boolean;
  onYearClick?: (year: number) => void;
}

export function MonthPickerPanel({
  value,
  onChange,
  disabledDate,
  onYearClick,
}: MonthPickerPanelProps) {
  const initialYear = value ? value.getFullYear() : new Date().getFullYear();
  const [viewYear, setViewYear] = useState<number>(initialYear);

  const selectedYear = value?.getFullYear();
  const selectedMonth = value?.getMonth();

  const handlePrevYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewYear((prev) => prev - 1);
  };

  const handleNextYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewYear((prev) => prev + 1);
  };

  const handleSelectMonth = (monthIndex: number) => {
    const newDate = new Date(viewYear, monthIndex, 1);
    onChange(newDate);
  };

  return (
    <div data-slot="month-picker-panel" {...stylex.props(styles.panel)}>
      <div {...stylex.props(styles.header)}>
        <button
          type="button"
          onClick={handlePrevYear}
          aria-label="Previous Year"
          {...stylex.props(styles.navButton)}
        >
          <Icons.ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => onYearClick?.(viewYear)}
          {...stylex.props(styles.yearTitleBtn)}
        >
          <Text weight="semibold" size="sm">
            Năm {viewYear}
          </Text>
        </button>

        <button
          type="button"
          onClick={handleNextYear}
          aria-label="Next Year"
          {...stylex.props(styles.navButton)}
        >
          <Icons.ChevronRight size={16} />
        </button>
      </div>

      <div {...stylex.props(styles.grid)}>
        {MONTH_LABELS.map((label, index) => {
          const isSelected = selectedYear === viewYear && selectedMonth === index;
          const monthDate = new Date(viewYear, index, 1);
          const isDisabled = disabledDate ? disabledDate(monthDate) : false;

          return (
            <button
              key={label}
              type="button"
              disabled={isDisabled}
              onClick={() => handleSelectMonth(index)}
              {...stylex.props(
                styles.monthCell,
                isSelected && styles.monthCellActive,
                isDisabled && styles.monthCellDisabled,
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MonthPickerPanel;
