import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from './calendar';

describe('Calendar', () => {
  it('should render calendar root and month elements', () => {
    const { container } = render(<Calendar mode="single" />);
    expect(container.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
  });

  it('should render navigation buttons with aria-label', () => {
    render(<Calendar mode="single" />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('should render dropdown selects when captionLayout is dropdown', () => {
    render(
      <Calendar
        mode="single"
        captionLayout="dropdown"
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
      />,
    );
    expect(screen.getByRole('combobox', { name: /month/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /year/i })).toBeInTheDocument();
  });

  it('should trigger onSelect when clicking a day button', () => {
    const onSelect = vi.fn();
    const testDate = new Date(2026, 10, 15);
    render(<Calendar mode="single" selected={testDate} onSelect={onSelect} month={testDate} />);

    const dayButton = screen.getByRole('button', { name: /November 15th/i });
    expect(dayButton).toBeInTheDocument();
    fireEvent.click(dayButton);
    expect(onSelect).toHaveBeenCalled();
  });

  it('should include future years by default in year dropdown', () => {
    render(<Calendar mode="single" captionLayout="dropdown" />);
    const yearSelect = screen.getByRole('combobox', { name: /year/i });
    expect(yearSelect).toBeInTheDocument();
    const currentYear = new Date().getFullYear();
    const futureYearOption = screen.getByRole('option', { name: String(currentYear + 10) });
    expect(futureYearOption).toBeInTheDocument();
  });
});
