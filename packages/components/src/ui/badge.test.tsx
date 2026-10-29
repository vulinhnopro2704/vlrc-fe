import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './badge';
import type { BadgeProps } from './badge';

const DEFAULT_BADGE_TEXT = 'Status Badge';

const createDefaultProps = (overrides?: Partial<BadgeProps>): BadgeProps => ({
  children: DEFAULT_BADGE_TEXT,
  ...overrides,
});

describe('Badge', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Badge {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['default' as const],
      ['secondary' as const],
      ['destructive' as const],
      ['outline' as const],
    ])('should match snapshot for %s variant', (variant) => {
      const { asFragment } = render(<Badge {...createDefaultProps({ variant })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
