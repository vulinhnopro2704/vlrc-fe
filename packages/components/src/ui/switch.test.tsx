import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Switch, type SwitchProps } from './switch';

const createDefaultProps = (overrides?: Partial<SwitchProps>): SwitchProps => ({
  'aria-label': 'Airplane mode',
  ...overrides,
});

describe('Switch', () => {
  describe('UI', () => {
    it('should match snapshot in unchecked state', () => {
      const { asFragment } = render(<Switch {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in checked state', () => {
      const { asFragment } = render(<Switch {...createDefaultProps({ checked: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Switch {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Interactions', () => {
    it('should toggle state and fire onCheckedChange when clicked', () => {
      const onCheckedChange = vi.fn();
      render(<Switch {...createDefaultProps({ onCheckedChange })} />);

      const switchEl = screen.getByRole('switch', { name: 'Airplane mode' });
      expect(switchEl).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(switchEl);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
      expect(switchEl).toHaveAttribute('aria-checked', 'true');

      fireEvent.click(switchEl);
      expect(onCheckedChange).toHaveBeenCalledWith(false);
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });

    it('should not toggle when disabled', () => {
      const onCheckedChange = vi.fn();
      render(<Switch {...createDefaultProps({ disabled: true, onCheckedChange })} />);

      const switchEl = screen.getByRole('switch', { name: 'Airplane mode' });
      expect(switchEl).toBeDisabled();

      fireEvent.click(switchEl);
      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });
  });
});
