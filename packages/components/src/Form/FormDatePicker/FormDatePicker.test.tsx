import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import {
  FormDatePicker,
  DatePicker,
  DateRangePicker,
  MonthPickerPanel,
  YearPickerPanel,
} from './index';

interface FormValues {
  date?: Date;
  range: [Date | undefined, Date | undefined];
}

function TestFormComponent({
  onSubmit = vi.fn(),
  required = false,
}: {
  onSubmit?: (data: FormValues) => void;
  required?: boolean;
}) {
  const methods = useForm<FormValues>({
    defaultValues: {
      date: undefined,
      range: [undefined, undefined],
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormDatePicker
          name="date"
          control={methods.control}
          label="Test Date Label"
          placeholder="Select test date"
          allowClear
          rules={required ? { required: 'Date is required' } : undefined}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe('DatePicker', () => {
  describe('Standalone DatePicker', () => {
    it('should render trigger button with placeholder', () => {
      render(<DatePicker placeholder="Pick a date" />);
      expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('should render selected date value when provided', () => {
      const date = new Date(2026, 10, 8);
      render(<DatePicker value={date} dateFormat="dd/MM/yyyy" />);
      expect(screen.getByText('08/11/2026')).toBeInTheDocument();
    });

    it('should trigger onChange when cleared', () => {
      const onChange = vi.fn();
      const date = new Date(2026, 10, 8);
      render(<DatePicker value={date} allowClear onChange={onChange} />);

      const clearBtn = screen.getByText('×');
      fireEvent.click(clearBtn);
      expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it('should disable trigger when disabled prop is true', () => {
      render(<DatePicker placeholder="Pick a date" disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Standalone DateRangePicker', () => {
    it('should render range placeholder by default', () => {
      render(<DateRangePicker placeholder="Select Range" />);
      expect(screen.getByText('Select Range')).toBeInTheDocument();
    });

    it('should format range display value when dates are set', () => {
      const from = new Date(2026, 10, 5);
      const to = new Date(2026, 10, 15);
      render(<DateRangePicker value={[from, to]} dateFormat="dd/MM/yyyy" />);
      expect(screen.getByText('05/11/2026 ~ 15/11/2026')).toBeInTheDocument();
    });

    it('should require two clicks to complete range selection and close popover', () => {
      const handleChange = vi.fn();
      render(<DateRangePicker placeholder="Pick range" onChange={handleChange} />);

      // Open popover
      const trigger = screen.getByText('Pick range');
      fireEvent.click(trigger);

      // Calendar should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click first date: start of range
      const dayButtons = screen.getAllByRole('button');
      const startDayBtn = dayButtons.find((btn) => btn.textContent === '10');
      expect(startDayBtn).toBeDefined();
      fireEvent.click(startDayBtn!);

      // After 1st click, popover MUST REMAIN OPEN!
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(handleChange).toHaveBeenCalledWith([expect.any(Date), undefined]);

      // Click second date: end of range
      const updatedButtons = screen.getAllByRole('button');
      const endDayBtn = updatedButtons.find((btn) => btn.textContent === '20');
      expect(endDayBtn).toBeDefined();
      fireEvent.click(endDayBtn!);

      // After 2nd click, range is completed and onChange is called with both endpoints
      expect(handleChange).toHaveBeenLastCalledWith([expect.any(Date), expect.any(Date)]);
    });

    it('should reset and start a new range on 3rd click after completing a range', () => {
      const handleChange = vi.fn();
      render(<DateRangePicker placeholder="Pick range" onChange={handleChange} />);

      // Open popover
      const trigger = screen.getByText('Pick range');
      fireEvent.click(trigger);

      // Click 1: start of range (day 10)
      const dayButtons1 = screen.getAllByRole('button');
      const day10 = dayButtons1.find((btn) => btn.textContent === '10');
      fireEvent.click(day10!);
      expect(handleChange).toHaveBeenCalledWith([expect.any(Date), undefined]);

      // Click 2: end of range (day 20)
      const dayButtons2 = screen.getAllByRole('button');
      const day20 = dayButtons2.find((btn) => btn.textContent === '20');
      fireEvent.click(day20!);
      expect(handleChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)]);

      // Click 3: should start a fresh range starting at day 25 (not extend the old range!)
      const dayButtons3 = screen.getAllByRole('button');
      const day25 = dayButtons3.find((btn) => btn.textContent === '25');
      fireEvent.click(day25!);
      expect(handleChange).toHaveBeenLastCalledWith([expect.any(Date), undefined]);
      const lastCall = handleChange.mock.calls.at(-1)?.[0];
      expect(lastCall[0].getDate()).toBe(25);
      expect(lastCall[1]).toBeUndefined();
    });
  });

  describe('Month and Year Picker Panels', () => {
    it('should render MonthPickerPanel with 12 months and trigger onChange on click', () => {
      const handleChange = vi.fn();
      render(<MonthPickerPanel value={new Date(2026, 5, 1)} onChange={handleChange} />);

      expect(screen.getByText('2026')).toBeInTheDocument();
      expect(screen.getByText('Jan')).toBeInTheDocument();
      expect(screen.getByText('Dec')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Aug'));
      expect(handleChange).toHaveBeenCalledTimes(1);
      const selected = handleChange.mock.calls[0][0] as Date;
      expect(selected.getFullYear()).toBe(2026);
      expect(selected.getMonth()).toBe(7); // Month index 7 is August
    });

    it('should render YearPickerPanel with decade range and trigger onChange on click', () => {
      const handleChange = vi.fn();
      render(<YearPickerPanel value={new Date(2026, 0, 1)} onChange={handleChange} />);

      expect(screen.getByText('2020 - 2029')).toBeInTheDocument();
      expect(screen.getByText('2026')).toBeInTheDocument();

      fireEvent.click(screen.getByText('2028'));
      expect(handleChange).toHaveBeenCalledTimes(1);
      const selected = handleChange.mock.calls[0][0] as Date;
      expect(selected.getFullYear()).toBe(2028);
    });

    it('should render month panel when DatePicker has pickerType="month"', () => {
      render(
        <DatePicker pickerType="month" value={new Date(2026, 10, 1)} placeholder="Pick month" />,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.getByText('2026')).toBeInTheDocument();
      expect(screen.getByText('Nov')).toBeInTheDocument();
    });

    it('should render year panel when DatePicker has pickerType="year"', () => {
      render(<DatePicker pickerType="year" value={new Date(2026, 0, 1)} placeholder="Pick year" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.getByText('2020 - 2029')).toBeInTheDocument();
    });
  });

  describe('FormDatePicker integration', () => {
    it('should render field label and placeholder in form context', () => {
      render(<TestFormComponent />);
      expect(screen.getByText('Test Date Label')).toBeInTheDocument();
      expect(screen.getByText('Select test date')).toBeInTheDocument();
    });

    it('should show error message when required field is empty on submit', async () => {
      render(<TestFormComponent required />);
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText('Date is required')).toBeInTheDocument();
      });
    });
  });
});
