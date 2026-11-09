import { render, screen, fireEvent, within } from '@testing-library/react';
import { beforeAll, describe, it, expect, vi } from 'vitest';
import {
  DataTableFacetedFilter,
  type DataTableFacetedFilterOption,
} from './DataTableFacetedFilter';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

const FILTER_TITLE = 'Status';
const OPTION_ACTIVE = 'Active';
const OPTION_PENDING = 'Pending';
const OPTION_ARCHIVED = 'Archived';

const TEST_OPTIONS: DataTableFacetedFilterOption[] = [
  { label: OPTION_ACTIVE, value: 'active', count: 12 },
  { label: OPTION_PENDING, value: 'pending', count: 4 },
  { label: OPTION_ARCHIVED, value: 'archived', count: 2 },
];

describe('DataTableFacetedFilter', () => {
  describe('UI', () => {
    it('should match snapshot in default state without selection', () => {
      const { asFragment } = render(
        <DataTableFacetedFilter title={FILTER_TITLE} options={TEST_OPTIONS} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with single selected option', () => {
      const { asFragment } = render(
        <DataTableFacetedFilter
          title={FILTER_TITLE}
          options={TEST_OPTIONS}
          selectedValues={['active']}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with multiple selected options', () => {
      const { asFragment } = render(
        <DataTableFacetedFilter
          title={FILTER_TITLE}
          options={TEST_OPTIONS}
          selectedValues={['active', 'pending', 'archived']}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should toggle selection on option click', () => {
      const onValueChange = vi.fn();

      render(
        <DataTableFacetedFilter
          title={FILTER_TITLE}
          options={TEST_OPTIONS}
          selectedValues={['active']}
          onValueChange={onValueChange}
        />,
      );

      const trigger = screen.getByRole('button', { name: new RegExp(FILTER_TITLE, 'i') });
      fireEvent.click(trigger);

      const pendingOption = screen.getByText(OPTION_PENDING);
      fireEvent.click(pendingOption);

      expect(onValueChange).toHaveBeenCalledWith(['active', 'pending']);
    });

    it('should deselect item when clicking an already selected option', () => {
      const onValueChange = vi.fn();

      render(
        <DataTableFacetedFilter
          title={FILTER_TITLE}
          options={TEST_OPTIONS}
          selectedValues={['active']}
          onValueChange={onValueChange}
        />,
      );

      const trigger = screen.getByRole('button', { name: new RegExp(FILTER_TITLE, 'i') });
      fireEvent.click(trigger);

      const popover = screen.getByRole('dialog');
      const activeOption = within(popover).getByText(OPTION_ACTIVE);
      fireEvent.click(activeOption);

      expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it('should clear all filters on clear button click', () => {
      const onValueChange = vi.fn();

      render(
        <DataTableFacetedFilter
          title={FILTER_TITLE}
          options={TEST_OPTIONS}
          selectedValues={['active', 'pending']}
          onValueChange={onValueChange}
        />,
      );

      const trigger = screen.getByRole('button', { name: new RegExp(FILTER_TITLE, 'i') });
      fireEvent.click(trigger);

      const clearBtn = screen.getByText(/clear filters/i);
      fireEvent.click(clearBtn);

      expect(onValueChange).toHaveBeenCalledWith([]);
    });
  });
});
