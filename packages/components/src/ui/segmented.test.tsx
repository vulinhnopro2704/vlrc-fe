import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Segmented, type SegmentedOption } from './segmented';

const OPTIONS: SegmentedOption[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly', disabled: true },
];

describe('Segmented', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Segmented options={OPTIONS} defaultValue="daily" />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in block mode', () => {
      const { asFragment } = render(<Segmented options={OPTIONS} defaultValue="weekly" block />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should change selected option on item click', () => {
      const onValueChange = vi.fn();
      render(<Segmented options={OPTIONS} defaultValue="daily" onValueChange={onValueChange} />);

      const weeklyButton = screen.getByRole('radio', { name: 'Weekly' });
      fireEvent.click(weeklyButton);

      expect(onValueChange).toHaveBeenCalledWith('weekly');
    });

    it('should not select a disabled option when clicked', () => {
      const onValueChange = vi.fn();
      render(<Segmented options={OPTIONS} defaultValue="daily" onValueChange={onValueChange} />);

      const yearlyButton = screen.getByRole('radio', { name: 'Yearly' });
      fireEvent.click(yearlyButton);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should navigate between options with arrow keys', () => {
      const onValueChange = vi.fn();
      render(<Segmented options={OPTIONS} defaultValue="daily" onValueChange={onValueChange} />);

      const radiogroup = screen.getByRole('radiogroup');

      // ArrowRight goes to weekly
      fireEvent.keyDown(radiogroup, { key: 'ArrowRight' });
      expect(onValueChange).toHaveBeenCalledWith('weekly');
    });
  });
});
