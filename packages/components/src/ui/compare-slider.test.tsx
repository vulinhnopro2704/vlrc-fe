import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CompareSlider } from './compare-slider';

const ARIA_LABEL = 'Photo comparison';
const LABEL_BEFORE = 'Original';
const LABEL_AFTER = 'Processed';
const ITEM_ONE = <div data-testid="item-before">Before View</div>;
const ITEM_TWO = <div data-testid="item-after">After View</div>;

describe('CompareSlider', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(
        <CompareSlider itemOne={ITEM_ONE} itemTwo={ITEM_TWO} aria-label={ARIA_LABEL} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with labels displayed', () => {
      const { asFragment } = render(
        <CompareSlider
          itemOne={ITEM_ONE}
          itemTwo={ITEM_TWO}
          showLabels
          labelOne={LABEL_BEFORE}
          labelTwo={LABEL_AFTER}
          aria-label={ARIA_LABEL}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render slider handle with correct ARIA attributes', () => {
      render(
        <CompareSlider
          itemOne={ITEM_ONE}
          itemTwo={ITEM_TWO}
          defaultValue={40}
          aria-label={ARIA_LABEL}
        />,
      );

      const slider = screen.getByRole('slider', { name: ARIA_LABEL });
      expect(slider).toHaveAttribute('aria-valuenow', '40');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('should adjust position on arrow keydown', () => {
      const onValueChange = vi.fn();
      render(
        <CompareSlider
          itemOne={ITEM_ONE}
          itemTwo={ITEM_TWO}
          defaultValue={50}
          onValueChange={onValueChange}
          aria-label={ARIA_LABEL}
        />,
      );

      const slider = screen.getByRole('slider', { name: ARIA_LABEL });

      // ArrowRight increases by 2 (from 50 to 52)
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      expect(onValueChange).toHaveBeenLastCalledWith(52);

      // ArrowLeft decreases by 2 (from 52 back to 50)
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });
      expect(onValueChange).toHaveBeenLastCalledWith(50);

      // End sets to 100
      fireEvent.keyDown(slider, { key: 'End' });
      expect(onValueChange).toHaveBeenLastCalledWith(100);

      // Home sets to 0
      fireEvent.keyDown(slider, { key: 'Home' });
      expect(onValueChange).toHaveBeenLastCalledWith(0);
    });

    it('should render both before and after items', () => {
      render(<CompareSlider itemOne={ITEM_ONE} itemTwo={ITEM_TWO} aria-label={ARIA_LABEL} />);

      expect(screen.getByTestId('item-before')).toBeInTheDocument();
      expect(screen.getByTestId('item-after')).toBeInTheDocument();
    });
  });
});
