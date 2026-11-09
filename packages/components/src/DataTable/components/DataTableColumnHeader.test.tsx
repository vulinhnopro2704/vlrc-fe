import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Column } from '@tanstack/react-table';
import { DataTableColumnHeader } from './DataTableColumnHeader';

const COLUMN_TITLE = 'Email Address';

function createMockColumn(
  overrides: Partial<Column<unknown, unknown>> = {},
): Column<unknown, unknown> {
  return {
    getCanSort: () => true,
    getIsSorted: () => false,
    toggleSorting: vi.fn(),
    getCanHide: () => true,
    toggleVisibility: vi.fn(),
    ...overrides,
  } as unknown as Column<unknown, unknown>;
}

describe('DataTableColumnHeader', () => {
  describe('UI', () => {
    it('should match snapshot when sorting is disabled', () => {
      const column = createMockColumn({ getCanSort: () => false });
      const { asFragment } = render(<DataTableColumnHeader column={column} title={COLUMN_TITLE} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with sortable column in default state', () => {
      const column = createMockColumn({ getCanSort: () => true, getIsSorted: () => false });
      const { asFragment } = render(<DataTableColumnHeader column={column} title={COLUMN_TITLE} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when column is sorted descending', () => {
      const column = createMockColumn({ getCanSort: () => true, getIsSorted: () => 'desc' });
      const { asFragment } = render(<DataTableColumnHeader column={column} title={COLUMN_TITLE} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should open dropdown menu and trigger asc sorting', () => {
      const toggleSorting = vi.fn();
      const column = createMockColumn({
        getCanSort: () => true,
        toggleSorting,
      });

      render(<DataTableColumnHeader column={column} title={COLUMN_TITLE} />);

      const trigger = screen.getByRole('button', { name: new RegExp(COLUMN_TITLE, 'i') });
      fireEvent.pointerDown(trigger);

      const ascOption = screen.getByText('Asc');
      fireEvent.click(ascOption);

      expect(toggleSorting).toHaveBeenCalledWith(false);
    });

    it('should open dropdown menu and trigger desc sorting', () => {
      const toggleSorting = vi.fn();
      const column = createMockColumn({
        getCanSort: () => true,
        toggleSorting,
      });

      render(<DataTableColumnHeader column={column} title={COLUMN_TITLE} />);

      const trigger = screen.getByRole('button', { name: new RegExp(COLUMN_TITLE, 'i') });
      fireEvent.pointerDown(trigger);

      const descOption = screen.getByText('Desc');
      fireEvent.click(descOption);

      expect(toggleSorting).toHaveBeenCalledWith(true);
    });

    it('should trigger hide column visibility when hide option is clicked', () => {
      const toggleVisibility = vi.fn();
      const column = createMockColumn({
        getCanSort: () => true,
        getCanHide: () => true,
        toggleVisibility,
      });

      render(<DataTableColumnHeader column={column} title={COLUMN_TITLE} />);

      const trigger = screen.getByRole('button', { name: new RegExp(COLUMN_TITLE, 'i') });
      fireEvent.pointerDown(trigger);

      const hideOption = screen.getByText('Hide');
      fireEvent.click(hideOption);

      expect(toggleVisibility).toHaveBeenCalledWith(false);
    });
  });
});
