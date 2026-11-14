import React, { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import Icons from '../../Icons';
import { colors, radius, spacing } from '../../theme/tokens.stylex';
import { Text } from '../../Typography';

const styles = stylex.create({
  panel: {
    width: 280,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.md,
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
    borderRadius: radius.md,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.xs,
  },
  yearCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: radius.md,
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
  yearCellActive: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    fontWeight: 600,
    ':hover': {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
  },
  yearCellOutside: {
    color: colors.mutedForeground,
    opacity: 0.5,
  },
  yearCellDisabled: {
    color: colors.mutedForeground,
    opacity: 0.35,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
});

export interface YearPickerPanelProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabledDate?: (date: Date) => boolean;
}

export function YearPickerPanel({ value, onChange, disabledDate }: YearPickerPanelProps) {
  const initialYear = value ? value.getFullYear() : new Date().getFullYear();
  const [viewDecadeStart, setViewDecadeStart] = useState<number>(Math.floor(initialYear / 10) * 10);

  const selectedYear = value?.getFullYear();
  const decadeEnd = viewDecadeStart + 9;

  const handlePrevDecade = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDecadeStart((prev) => prev - 10);
  };

  const handleNextDecade = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDecadeStart((prev) => prev + 10);
  };

  // Generate 12 years: 1 before decade start, 10 within decade, 1 after decade end
  const years: number[] = [];
  for (let y = viewDecadeStart - 1; y <= decadeEnd + 1; y++) {
    years.push(y);
  }

  const handleSelectYear = (year: number) => {
    const currentMonth = value ? value.getMonth() : 0;
    const newDate = new Date(year, currentMonth, 1);
    onChange(newDate);
  };

  return (
    <div data-slot="year-picker-panel" {...stylex.props(styles.panel)}>
      <div {...stylex.props(styles.header)}>
        <button
          type="button"
          onClick={handlePrevDecade}
          aria-label="Previous Decade"
          {...stylex.props(styles.navButton)}
        >
          <Icons.ChevronLeft size={16} />
        </button>

        <Text weight="semibold" size="sm">
          {viewDecadeStart} - {decadeEnd}
        </Text>

        <button
          type="button"
          onClick={handleNextDecade}
          aria-label="Next Decade"
          {...stylex.props(styles.navButton)}
        >
          <Icons.ChevronRight size={16} />
        </button>
      </div>

      <div {...stylex.props(styles.grid)}>
        {years.map((year) => {
          const isSelected = selectedYear === year;
          const isOutside = year < viewDecadeStart || year > decadeEnd;
          const yearDate = new Date(year, 0, 1);
          const isDisabled = disabledDate ? disabledDate(yearDate) : false;

          return (
            <button
              key={year}
              type="button"
              disabled={isDisabled}
              onClick={() => handleSelectYear(year)}
              {...stylex.props(
                styles.yearCell,
                isSelected && styles.yearCellActive,
                isOutside && !isSelected && styles.yearCellOutside,
                isDisabled && styles.yearCellDisabled,
              )}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default YearPickerPanel;
