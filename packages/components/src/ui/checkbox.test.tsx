import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox, type CheckboxProps } from './checkbox';

const createDefaultProps = (overrides?: Partial<CheckboxProps>): CheckboxProps => ({
  'aria-label': 'Accept terms',
  ...overrides,
});

describe('Checkbox', () => {
  describe('UI', () => {
    it('should match snapshot in unchecked state', () => {
      const { asFragment } = render(<Checkbox {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in checked state', () => {
      const { asFragment } = render(<Checkbox {...createDefaultProps({ checked: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Checkbox {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Interactions', () => {
    it('should toggle state and fire onCheckedChange when clicked', () => {
      const onCheckedChange = vi.fn();
      render(<Checkbox {...createDefaultProps({ onCheckedChange })} />);

      const checkboxEl = screen.getByRole('checkbox', { name: 'Accept terms' });
      expect(checkboxEl).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(checkboxEl);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
      expect(checkboxEl).toHaveAttribute('aria-checked', 'true');

      fireEvent.click(checkboxEl);
      expect(onCheckedChange).toHaveBeenCalledWith(false);
      expect(checkboxEl).toHaveAttribute('aria-checked', 'false');
    });

    it('should not toggle when disabled', () => {
      const onCheckedChange = vi.fn();
      render(<Checkbox {...createDefaultProps({ disabled: true, onCheckedChange })} />);

      const checkboxEl = screen.getByRole('checkbox', { name: 'Accept terms' });
      expect(checkboxEl).toBeDisabled();

      fireEvent.click(checkboxEl);
      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(checkboxEl).toHaveAttribute('aria-checked', 'false');
    });
  });
});
