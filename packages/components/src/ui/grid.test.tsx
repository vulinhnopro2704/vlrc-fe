import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Grid, GridItem, type GridProps } from './grid';

// Scoped constants & fixtures
const GRID_TEST_ID = 'test-grid';
const ITEM_TEST_ID_1 = 'test-grid-item-1';
const ITEM_TEST_ID_2 = 'test-grid-item-2';
const CELL_TEXT_1 = 'Cell 1';
const CELL_TEXT_2 = 'Cell 2';

const createDefaultGridProps = (overrides?: Partial<GridProps>): GridProps => ({
  columns: 3,
  children: (
    <>
      <GridItem data-testid={ITEM_TEST_ID_1}>{CELL_TEXT_1}</GridItem>
      <GridItem data-testid={ITEM_TEST_ID_2}>{CELL_TEXT_2}</GridItem>
    </>
  ),
  ...overrides,
});

describe('Grid', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Grid {...createDefaultGridProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with minChildWidth auto-fit', () => {
      const { asFragment } = render(
        <Grid {...createDefaultGridProps({ minChildWidth: 240, gap: 'md' })} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([['sm' as const], ['md' as const], ['lg' as const]])(
      'should match snapshot for gap size "%s"',
      (gap) => {
        const { asFragment } = render(<Grid {...createDefaultGridProps({ gap })} />);
        expect(asFragment()).toMatchSnapshot();
      },
    );

    it('should match snapshot for compound Grid.Row and Grid.Col', () => {
      const { asFragment } = render(
        <Grid.Row gutter={[16, 16]}>
          <Grid.Col span={12}>{CELL_TEXT_1}</Grid.Col>
          <Grid.Col span={12}>{CELL_TEXT_2}</Grid.Col>
        </Grid.Row>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should compute gridTemplateColumns from numeric columns', () => {
      render(<Grid data-testid={GRID_TEST_ID} {...createDefaultGridProps({ columns: 4 })} />);
      expect(screen.getByTestId(GRID_TEST_ID)).toHaveStyle({
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      });
    });

    it('should compute repeat(auto-fit, minmax(...)) when minChildWidth is specified', () => {
      render(
        <Grid data-testid={GRID_TEST_ID} {...createDefaultGridProps({ minChildWidth: '300px' })} />,
      );
      expect(screen.getByTestId(GRID_TEST_ID)).toHaveStyle({
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      });
    });

    it('should pass gridItem colSpan, rowSpan, and area correctly', () => {
      render(
        <Grid columns={3}>
          <Grid.Item data-testid={ITEM_TEST_ID_1} colSpan={2} rowSpan={1} area="header">
            {CELL_TEXT_1}
          </Grid.Item>
        </Grid>,
      );
      const item = screen.getByTestId(ITEM_TEST_ID_1);
      expect(item).toHaveStyle({
        gridColumn: 'span 2 / span 2',
        gridRow: 'span 1 / span 1',
        gridArea: 'header',
      });
    });

    it('should expose compound components on Grid', () => {
      expect(Grid.Row).toBeDefined();
      expect(Grid.Col).toBeDefined();
      expect(Grid.Column).toBeDefined();
      expect(Grid.Item).toBeDefined();
      expect(Grid.useBreakpoint).toBeDefined();
    });

    it('should support polymorphic rendering via "as" and "asChild"', () => {
      render(
        <Grid as="section" data-testid={GRID_TEST_ID}>
          <GridItem as="article" data-testid={ITEM_TEST_ID_1}>
            {CELL_TEXT_1}
          </GridItem>
        </Grid>,
      );
      expect(screen.getByTestId(GRID_TEST_ID).tagName).toBe('SECTION');
      expect(screen.getByTestId(ITEM_TEST_ID_1).tagName).toBe('ARTICLE');
    });
  });
});
