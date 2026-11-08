import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { FormDatePicker, DatePicker, DateRangePicker } from './index';

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
