import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Masonry } from './masonry';

const TEST_ITEMS = [
  <div key="1" data-testid="item-1">
    Card 1
  </div>,
  <div key="2" data-testid="item-2">
    Card 2
  </div>,
  <div key="3" data-testid="item-3">
    Card 3
  </div>,
  <div key="4" data-testid="item-4">
    Card 4
  </div>,
  <div key="5" data-testid="item-5">
    Card 5
  </div>,
];

describe('Masonry', () => {
  describe('UI', () => {
    it('should match snapshot with fixed columns count', () => {
      const { asFragment } = render(
        <Masonry columns={3} gap="md">
          {TEST_ITEMS}
        </Masonry>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with responsive columns config', () => {
      const { asFragment } = render(
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} gap="lg">
          {TEST_ITEMS}
        </Masonry>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should distribute items across the specified number of columns', () => {
      const columnCount = 3;
      render(
        <Masonry columns={columnCount} gap="sm">
          {TEST_ITEMS}
        </Masonry>,
      );

      const columns = screen.getAllByTestId
        ? document.querySelectorAll('[data-slot="masonry-column"]')
        : [];
      expect(columns).toHaveLength(columnCount);

      // Verify all items are rendered
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-5')).toBeInTheDocument();
    });

    it('should render single column when columns is 1', () => {
      render(<Masonry columns={1}>{TEST_ITEMS}</Masonry>);

      const columns = document.querySelectorAll('[data-slot="masonry-column"]');
      expect(columns).toHaveLength(1);
    });
  });
});
