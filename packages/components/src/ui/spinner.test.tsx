import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner, type SpinnerProps } from './spinner';

const createDefaultProps = (overrides?: Partial<SpinnerProps>): SpinnerProps => ({
  ...overrides,
});

describe('Spinner', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Spinner {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with custom className', () => {
      const { asFragment } = render(
        <Spinner {...createDefaultProps({ className: 'custom-spinner-class' })} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
