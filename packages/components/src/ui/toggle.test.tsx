import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toggle, type ToggleProps } from './toggle';

const createDefaultProps = (overrides?: Partial<ToggleProps>): ToggleProps => ({
  'aria-label': 'Toggle italic',
  children: 'B',
  ...overrides,
});

describe('Toggle', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Toggle {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in outline variant', () => {
      const { asFragment } = render(<Toggle {...createDefaultProps({ variant: 'outline' })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when pressed', () => {
      const { asFragment } = render(<Toggle {...createDefaultProps({ pressed: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Toggle {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Interactions', () => {
    it('should toggle pressed state and call onPressedChange when clicked', () => {
      const onPressedChange = vi.fn();
      render(<Toggle {...createDefaultProps({ onPressedChange })} />);

      const btn = screen.getByRole('button', { name: 'Toggle italic' });
      expect(btn).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(btn);
      expect(onPressedChange).toHaveBeenCalledWith(true);
      expect(btn).toHaveAttribute('aria-pressed', 'true');

      fireEvent.click(btn);
      expect(onPressedChange).toHaveBeenCalledWith(false);
      expect(btn).toHaveAttribute('aria-pressed', 'false');
    });

    it('should not fire onPressedChange when disabled', () => {
      const onPressedChange = vi.fn();
      render(<Toggle {...createDefaultProps({ disabled: true, onPressedChange })} />);

      const btn = screen.getByRole('button', { name: 'Toggle italic' });
      expect(btn).toBeDisabled();

      fireEvent.click(btn);
      expect(onPressedChange).not.toHaveBeenCalled();
    });
  });
});
