import type { Meta, StoryObj } from '@storybook/react';
import type { Column } from '@tanstack/react-table';
import { Flex } from '../../layout';
import { DataTableColumnHeader } from './DataTableColumnHeader';

const meta: Meta<typeof DataTableColumnHeader> = {
  title: 'Components/DataTable/DataTableColumnHeader',
  component: DataTableColumnHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTableColumnHeader>;

function createStoryMockColumn(isSorted: false | 'asc' | 'desc' = false): Column<unknown, unknown> {
  return {
    getCanSort: () => true,
    getIsSorted: () => isSorted,
    toggleSorting: () => {},
    getCanHide: () => true,
    toggleVisibility: () => {},
  } as unknown as Column<unknown, unknown>;
}

export const Unsorted: Story = {
  render: () => {
    const col = createStoryMockColumn(false);
    return (
      <Flex gap="md">
        <DataTableColumnHeader column={col} title="Full Name" />
      </Flex>
    );
  },
};

export const SortedAscending: Story = {
  render: () => {
    const col = createStoryMockColumn('asc');
    return (
      <Flex gap="md">
        <DataTableColumnHeader column={col} title="Created Date" />
      </Flex>
    );
  },
};

export const SortedDescending: Story = {
  render: () => {
    const col = createStoryMockColumn('desc');
    return (
      <Flex gap="md">
        <DataTableColumnHeader column={col} title="Amount" />
      </Flex>
    );
  },
};
