import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Slider } from './slider';

describe('Slider', () => {
  describe('UI', () => {
    it('should match snapshot with default bare slider', () => {
      const { asFragment } = render(<Slider />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with range slider', () => {
      const { asFragment } = render(<Slider defaultValue={[20, 80]} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render exactly one thumb for bare uncontrolled slider', () => {
      render(<Slider />);
      const thumbs = screen.getAllByRole('slider');
      expect(thumbs).toHaveLength(1);
      expect(thumbs[0]).toHaveAttribute('aria-valuenow', '0');
    });

    it('should render two thumbs when defaultValue is a range array', () => {
      render(<Slider defaultValue={[25, 75]} />);
      const thumbs = screen.getAllByRole('slider');
      expect(thumbs).toHaveLength(2);
      expect(thumbs[0]).toHaveAttribute('aria-valuenow', '25');
      expect(thumbs[1]).toHaveAttribute('aria-valuenow', '75');
    });

    it('should render two thumbs when value is a range array', () => {
      render(<Slider value={[10, 90]} />);
      const thumbs = screen.getAllByRole('slider');
      expect(thumbs).toHaveLength(2);
      expect(thumbs[0]).toHaveAttribute('aria-valuenow', '10');
      expect(thumbs[1]).toHaveAttribute('aria-valuenow', '90');
    });
  });
});
