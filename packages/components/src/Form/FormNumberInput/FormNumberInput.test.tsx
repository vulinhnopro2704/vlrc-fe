import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { FormNumberInput } from './FormNumberInput';

interface FormValues {
  quantity?: number;
}

function TestForm({
  min,
  max,
  minValue,
  maxValue,
  defaultValue = 5,
}: {
  min?: string | number;
  max?: string | number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
}) {
  const methods = useForm<FormValues>({
    defaultValues: { quantity: defaultValue },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <FormNumberInput
          name="quantity"
          control={methods.control}
          label="Quantity"
          min={min}
          max={max}
          minValue={minValue}
          maxValue={maxValue}
          stepper={1}
        />
      </form>
    </FormProvider>
  );
}

describe('FormNumberInput', () => {
  describe('UI', () => {
    it('should render label and number input', () => {
      render(<TestForm />);
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    });
  });

  describe('Behavior', () => {
    it('should disable increment when value reaches max bound', () => {
      render(<TestForm min={0} max={5} defaultValue={5} />);
      const incrementBtn = screen.getByRole('button', { name: /increase/i });
      expect(incrementBtn).toBeDisabled();
    });

    it('should disable decrement when value reaches min bound', () => {
      render(<TestForm min={5} max={10} defaultValue={5} />);
      const decrementBtn = screen.getByRole('button', { name: /decrease/i });
      expect(decrementBtn).toBeDisabled();
    });

    it('should increment and decrement when within bounds', () => {
      render(<TestForm min={0} max={10} defaultValue={5} />);
      const incrementBtn = screen.getByRole('button', { name: /increase/i });
      const decrementBtn = screen.getByRole('button', { name: /decrease/i });
      expect(incrementBtn).not.toBeDisabled();
      expect(decrementBtn).not.toBeDisabled();

      fireEvent.click(incrementBtn);
      const input = screen.getByLabelText(/quantity/i) as HTMLInputElement;
      expect(input.value).toBe('6');
    });
  });
});
