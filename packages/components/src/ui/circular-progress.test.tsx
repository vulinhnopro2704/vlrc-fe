import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CircularProgress } from './circular-progress';

const ARIA_LABEL = 'Upload status';
const TEST_VALUE = 75;

describe('CircularProgress', () => {
  describe('UI', () => {
    it('should match snapshot in determinate state', () => {
      const { asFragment } = render(
        <CircularProgress aria-label={ARIA_LABEL} value={TEST_VALUE} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in indeterminate state', () => {
      const { asFragment } = render(<CircularProgress aria-label={ARIA_LABEL} indeterminate />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with showValue enabled', () => {
      const { asFragment } = render(
        <CircularProgress aria-label={ARIA_LABEL} value={TEST_VALUE} showValue />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot across variant colors', () => {
      const { asFragment } = render(
        <CircularProgress aria-label={ARIA_LABEL} value={TEST_VALUE} variant="success" />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should set appropriate aria attributes in determinate mode', () => {
      render(<CircularProgress aria-label={ARIA_LABEL} value={TEST_VALUE} min={0} max={100} />);

      const progressbar = screen.getByRole('progressbar', {
        name: ARIA_LABEL,
      });

      expect(progressbar).toHaveAttribute('aria-valuenow', `${TEST_VALUE}`);
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
      expect(progressbar).toHaveAttribute('data-state', 'determinate');
    });

    it('should omit aria-valuenow and mark indeterminate when value is undefined', () => {
      render(<CircularProgress aria-label={ARIA_LABEL} />);

      const progressbar = screen.getByRole('progressbar', {
        name: ARIA_LABEL,
      });

      expect(progressbar).not.toHaveAttribute('aria-valuenow');
      expect(progressbar).toHaveAttribute('data-state', 'indeterminate');
    });

    it('should render formatted value text when formatValue is provided', () => {
      render(
        <CircularProgress
          aria-label={ARIA_LABEL}
          value={TEST_VALUE}
          showValue
          formatValue={(val) => `${val} of 100 tasks`}
        />,
      );

      expect(screen.getByText(`${TEST_VALUE} of 100 tasks`)).toBeInTheDocument();
    });

    it('should render custom children in center if provided', () => {
      render(
        <CircularProgress aria-label={ARIA_LABEL} value={TEST_VALUE}>
          <span data-testid="custom-center">Center Icon</span>
        </CircularProgress>,
      );

      expect(screen.getByTestId('custom-center')).toBeInTheDocument();
    });
  });
});
