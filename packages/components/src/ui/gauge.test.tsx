import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Gauge } from './gauge';

const TEST_VALUE = 72;
const TEST_MIN = 0;
const TEST_MAX = 100;
const TEST_LABEL = 'CPU Load';
const ARIA_LABEL = 'Server Health';

describe('Gauge', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Gauge value={TEST_VALUE} aria-label={ARIA_LABEL} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with label and min/max row', () => {
      const { asFragment } = render(
        <Gauge
          value={TEST_VALUE}
          min={TEST_MIN}
          max={TEST_MAX}
          label={TEST_LABEL}
          showMinMax
          variant="success"
          aria-label={ARIA_LABEL}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with custom children content', () => {
      const { asFragment } = render(
        <Gauge value={TEST_VALUE} aria-label={ARIA_LABEL}>
          <span data-testid="custom-gauge-text">Optimal</span>
        </Gauge>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render correct meter role and ARIA attributes', () => {
      render(<Gauge value={TEST_VALUE} min={TEST_MIN} max={TEST_MAX} aria-label={ARIA_LABEL} />);

      const meter = screen.getByRole('meter', { name: ARIA_LABEL });
      expect(meter).toHaveAttribute('aria-valuenow', `${TEST_VALUE}`);
      expect(meter).toHaveAttribute('aria-valuemin', `${TEST_MIN}`);
      expect(meter).toHaveAttribute('aria-valuemax', `${TEST_MAX}`);
    });

    it('should clamp value to min and max bounds', () => {
      const { rerender } = render(
        <Gauge value={150} min={TEST_MIN} max={TEST_MAX} aria-label={ARIA_LABEL} />,
      );

      const meter = screen.getByRole('meter', { name: ARIA_LABEL });
      expect(meter).toHaveAttribute('aria-valuenow', `${TEST_MAX}`);

      rerender(<Gauge value={-50} min={TEST_MIN} max={TEST_MAX} aria-label={ARIA_LABEL} />);
      expect(meter).toHaveAttribute('aria-valuenow', `${TEST_MIN}`);
    });

    it('should display custom formatted value when formatValue is provided', () => {
      render(
        <Gauge value={TEST_VALUE} formatValue={(val) => `${val} km/h`} aria-label={ARIA_LABEL} />,
      );

      expect(screen.getByText(`${TEST_VALUE} km/h`)).toBeInTheDocument();
    });
  });
});
