import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Separator, type SeparatorProps } from './separator';

const createDefaultProps = (overrides?: Partial<SeparatorProps>): SeparatorProps => ({
  ...overrides,
});

describe('Separator', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Separator {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['horizontal' as const],
      ['vertical' as const],
    ])('should match snapshot for %s orientation', (orientation) => {
      const { asFragment } = render(<Separator {...createDefaultProps({ orientation })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
