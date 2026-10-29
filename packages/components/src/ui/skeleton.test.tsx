import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton, type SkeletonProps } from './skeleton';

const createDefaultProps = (overrides?: Partial<SkeletonProps>): SkeletonProps => ({
  style: { width: 100, height: 20 },
  ...overrides,
});

describe('Skeleton', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Skeleton {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with custom className', () => {
      const { asFragment } = render(
        <Skeleton {...createDefaultProps({ className: 'custom-skeleton-class' })} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
