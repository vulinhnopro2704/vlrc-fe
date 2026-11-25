import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterPopup } from './FilterPopup';
import type { FilterPopupSelection } from './types';

const meta = {
  title: 'Components/FilterPopup',
  component: FilterPopup,
  args: {
    items: [
      {
        key: 'version',
        label: 'Fix version',
        options: [
          { value: 'none', label: 'No version' },
          ...Array.from({ length: 12 }, (_, index) => ({
            value: `1.0.${index + 1}`,
            label: `1.0.${index + 1}`,
          })),
        ],
      },
      ...[
        'Parent',
        'Sprint',
        'Assignee',
        'Work type',
        'Labels',
        'Status',
        'Priority',
        'Reporter',
      ].map((label) => ({ key: label.toLowerCase(), label, options: [] })),
    ],
  },
} satisfies Meta<typeof FilterPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Preselected: Story = { args: { defaultValue: { version: ['1.0.2', '1.0.6'] } } };
export const Controlled: Story = {
  render: function ControlledFilter(args) {
    const [value, setValue] = useState<FilterPopupSelection>({ version: ['1.0.2'] });
    return <FilterPopup {...args} value={value} onChange={setValue} />;
  },
};
