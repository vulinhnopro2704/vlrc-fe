import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MultiSelect from './MultiSelect';
import type { MultiSelectOption } from './type';

const frameworks: MultiSelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
];

const meta = {
  title: 'Forms/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Comprehensive multi-selection combobox featuring tag badges, animated transitions, max-count overflow, responsive compact mode, and keyboard navigation.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', description: 'Trigger placeholder label' },
    disabled: { control: 'boolean', description: 'Disables user interactions' },
    maxCount: { control: 'number', description: 'Maximum visible badge tags before collapsing' },
    searchable: { control: 'boolean', description: 'Enables quick search input' },
    hideSelectAll: { control: 'boolean', description: 'Hides select all action' },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultMultiSelectDemo(props: Record<string, unknown>) {
  const [selected, setSelected] = useState<string[]>(['react', 'nextjs']);
  return (
    <div style={{ width: 400 }}>
      <MultiSelect
        {...props}
        options={frameworks}
        defaultValue={selected}
        onValueChange={setSelected}
        placeholder="Select frameworks..."
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <DefaultMultiSelectDemo {...args} />,
  args: {
    maxCount: 3,
    searchable: true,
  },
};

function MaxCountOverflowDemo() {
  const [selected, setSelected] = useState<string[]>([
    'react',
    'vue',
    'svelte',
    'angular',
    'nextjs',
  ]);
  return (
    <div style={{ width: 400 }}>
      <MultiSelect
        options={frameworks}
        defaultValue={selected}
        onValueChange={setSelected}
        maxCount={2}
        placeholder="Select frameworks..."
      />
    </div>
  );
}

export const MaxCountOverflow: Story = {
  render: () => <MaxCountOverflowDemo />,
};

function SingleLineScrollDemo() {
  const [selected, setSelected] = useState<string[]>([
    'react',
    'vue',
    'svelte',
    'angular',
    'nextjs',
  ]);
  return (
    <div style={{ width: 350 }}>
      <MultiSelect
        options={frameworks}
        defaultValue={selected}
        onValueChange={setSelected}
        singleLine
        placeholder="Select frameworks..."
      />
    </div>
  );
}

export const SingleLineScroll: Story = {
  render: () => <SingleLineScrollDemo />,
};
