import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import BaseSelect from './BaseSelect';
import type { BaseSelectOption } from './type';

const sampleOptions: BaseSelectOption<string>[] = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
];

const meta = {
  title: 'Forms/BaseSelect',
  component: BaseSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Unified select dropdown component supporting single-select, multi-select, search filtering, Select All, and infinite scrolling.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder label when empty' },
    disabled: { control: 'boolean', description: 'Disables select trigger' },
    isClearable: { control: 'boolean', description: 'Allows clearing selected value' },
    isSearchable: { control: 'boolean', description: 'Enables filter search input' },
    showSelectAll: { control: 'boolean', description: 'Shows "Select All" toggle in multi-select' },
  },
} satisfies Meta<typeof BaseSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

function SingleSelectDemo() {
  const [value, setValue] = useState<string | null>('react');
  return (
    <div style={{ width: 320 }}>
      <BaseSelect
        options={sampleOptions}
        value={value}
        onChange={(val) => setValue(val as string | null)}
        placeholder="Choose a framework..."
        isSearchable
        isClearable
      />
    </div>
  );
}

export const SingleSelect: Story = {
  render: () => <SingleSelectDemo />,
};

function MultiSelectDemo() {
  const [value, setValue] = useState<string[]>(['react', 'nextjs']);
  return (
    <div style={{ width: 360 }}>
      <BaseSelect
        isMulti
        options={sampleOptions}
        value={value}
        onChange={(val) => setValue(val as string[])}
        placeholder="Select multiple technologies..."
        isSearchable
        showSelectAll
      />
    </div>
  );
}

export const MultiSelectMode: Story = {
  render: () => <MultiSelectDemo />,
};

function InteractiveSearchDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div style={{ width: 320 }}>
      <BaseSelect
        options={sampleOptions}
        value={value}
        onChange={(val) => setValue(val as string | null)}
        placeholder="Search and pick..."
        isSearchable
      />
    </div>
  );
}

export const InteractiveSearchAndSelect: Story = {
  render: () => <InteractiveSearchDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText(/Search and pick/i);
    await expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
    const searchInput = await within(document.body).findByPlaceholderText(/Tìm kiếm/i);
    await expect(searchInput).toBeInTheDocument();
  },
};
