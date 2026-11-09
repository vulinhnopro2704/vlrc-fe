import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Flex } from '../../layout';
import {
  DataTableFacetedFilter,
  type DataTableFacetedFilterOption,
} from './DataTableFacetedFilter';

const meta: Meta<typeof DataTableFacetedFilter> = {
  title: 'Components/DataTable/DataTableFacetedFilter',
  component: DataTableFacetedFilter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTableFacetedFilter>;

const STATUS_OPTIONS: DataTableFacetedFilterOption[] = [
  { label: 'Active', value: 'active', count: 24 },
  { label: 'Pending', value: 'pending', count: 8 },
  { label: 'Suspended', value: 'suspended', count: 3 },
  { label: 'Archived', value: 'archived', count: 12 },
];

const PRIORITY_OPTIONS: DataTableFacetedFilterOption[] = [
  { label: 'High', value: 'high', count: 5 },
  { label: 'Medium', value: 'medium', count: 18 },
  { label: 'Low', value: 'low', count: 21 },
];

export const Standalone: Story = {
  render: () => {
    const [selectedStatus, setSelectedStatus] = useState<string[]>(['active']);
    const [selectedPriority, setSelectedPriority] = useState<string[]>([]);

    return (
      <Flex gap="md" align="center" wrap="wrap">
        <DataTableFacetedFilter
          title="Status"
          options={STATUS_OPTIONS}
          selectedValues={selectedStatus}
          onValueChange={setSelectedStatus}
        />
        <DataTableFacetedFilter
          title="Priority"
          options={PRIORITY_OPTIONS}
          selectedValues={selectedPriority}
          onValueChange={setSelectedPriority}
        />
      </Flex>
    );
  },
};

export const PreselectedMultiple: Story = {
  render: () => {
    const [selectedStatus, setSelectedStatus] = useState<string[]>([
      'active',
      'pending',
      'suspended',
    ]);

    return (
      <DataTableFacetedFilter
        title="Status"
        options={STATUS_OPTIONS}
        selectedValues={selectedStatus}
        onValueChange={setSelectedStatus}
      />
    );
  },
};
