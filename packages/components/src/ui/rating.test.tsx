import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Rating } from './rating';

const ARIA_LABEL = 'Product Rating';
const DEFAULT_MAX = 5;

describe('Rating', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Rating aria-label={ARIA_LABEL} defaultValue={3} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Rating aria-label={ARIA_LABEL} defaultValue={4} disabled />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when readOnly with half score', () => {
      const { asFragment } = render(
        <Rating aria-label={ARIA_LABEL} defaultValue={3.5} allowHalf readOnly />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render correct number of star items based on max prop', () => {
      const customMax = 10;
      render(<Rating aria-label={ARIA_LABEL} max={customMax} />);
      const items = screen.getAllByTestId(/rating-hit-/);
      expect(items).toHaveLength(customMax);
    });
  });

  describe('Behavior', () => {
    it('should change value when a star item is clicked', () => {
      const onValueChange = vi.fn();
      render(<Rating aria-label={ARIA_LABEL} onValueChange={onValueChange} defaultValue={0} />);

      const thirdStar = screen.getByTestId('rating-hit-3');
      fireEvent.click(thirdStar);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(3);
    });

    it('should select half star when allowHalf is true and left half clicked', () => {
      const onValueChange = vi.fn();
      render(
        <Rating aria-label={ARIA_LABEL} allowHalf onValueChange={onValueChange} defaultValue={0} />,
      );

      const halfStar = screen.getByTestId('rating-hit-2.5');
      fireEvent.click(halfStar);

      expect(onValueChange).toHaveBeenCalledWith(2.5);
    });

    it('should navigate and update value via keyboard arrows', () => {
      const onValueChange = vi.fn();
      render(<Rating aria-label={ARIA_LABEL} defaultValue={2} onValueChange={onValueChange} />);

      const slider = screen.getByRole('slider');

      // ArrowRight increases value from 2 to 3
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      expect(onValueChange).toHaveBeenLastCalledWith(3);

      // ArrowLeft decreases value from 3 back to 2
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });
      expect(onValueChange).toHaveBeenLastCalledWith(2);

      // End sets to max
      fireEvent.keyDown(slider, { key: 'End' });
      expect(onValueChange).toHaveBeenLastCalledWith(DEFAULT_MAX);

      // Home sets to 0
      fireEvent.keyDown(slider, { key: 'Home' });
      expect(onValueChange).toHaveBeenLastCalledWith(0);
    });

    it('should not change value when readOnly or disabled', () => {
      const onValueChange = vi.fn();
      const { rerender } = render(
        <Rating aria-label={ARIA_LABEL} defaultValue={2} readOnly onValueChange={onValueChange} />,
      );

      expect(screen.queryByTestId('rating-hit-3')).toBeNull();

      rerender(
        <Rating aria-label={ARIA_LABEL} defaultValue={2} disabled onValueChange={onValueChange} />,
      );

      expect(screen.queryByTestId('rating-hit-3')).toBeNull();
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
