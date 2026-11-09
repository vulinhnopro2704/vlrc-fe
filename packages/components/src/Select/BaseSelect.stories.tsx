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
    const searchInput = await within(document.body).findByPlaceholderText(/Search/i);
    await expect(searchInput).toBeInTheDocument();
  },
};

const longTextOptions: BaseSelectOption<string>[] = [
  {
    value: 'opt-1',
    label:
      'Option with an exceptionally long descriptive text that exceeds typical container boundaries and requires ellipsis truncation with tooltip on hover',
  },
  {
    value: 'opt-2',
    label:
      'Another very lengthy title describing a complex system feature or configuration setting with many details',
  },
  { value: 'opt-3', label: 'Standard short label' },
];

function LongTextSelectDemo() {
  const [value, setValue] = useState<string | null>('opt-1');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: 280 }}>
      <div>
        <p
          style={{
            margin: '0 0 0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
          }}
        >
          SINGLE SELECT WITH ULTRA-LONG TEXT (WIDTH 280px)
        </p>
        <BaseSelect
          options={longTextOptions}
          value={value}
          onChange={(val) => setValue(val as string | null)}
          placeholder="Choose an option..."
          isSearchable
        />
      </div>
    </div>
  );
}

export const LongTextOptions: Story = {
  render: () => <LongTextSelectDemo />,
};

function InteractiveLongTextDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div style={{ width: 280 }}>
      <BaseSelect
        options={longTextOptions}
        value={value}
        onChange={(val) => setValue(val as string | null)}
        placeholder="Select long option..."
        isSearchable
      />
    </div>
  );
}

export const InteractiveLongTextAndTooltip: Story = {
  render: () => <InteractiveLongTextDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText(/Select long option.../i);
    await expect(trigger).toBeInTheDocument();

    // 1. Open the dropdown
    await userEvent.click(trigger);

    // 2. Locate the long option and hover over it to verify option tooltip
    const longOption = await within(document.body).findByText(
      /Option with an exceptionally long descriptive text/i,
    );
    await expect(longOption).toBeInTheDocument();
    await userEvent.hover(longOption);

    const optionTooltip = await within(document.body).findByText(
      /Option with an exceptionally long descriptive text/i,
      { selector: '[data-slot="tooltip-content"]' },
    );
    await expect(optionTooltip).toBeInTheDocument();

    // 3. Select the long option
    await userEvent.click(longOption);

    // 4. Verify the selected text is shown on the trigger and hover over trigger to verify trigger tooltip
    const triggerText = await canvas.findByText(
      /Option with an exceptionally long descriptive text/i,
    );
    await expect(triggerText).toBeInTheDocument();
    await userEvent.hover(triggerText);

    const triggerTooltip = await within(document.body).findByText(
      /Option with an exceptionally long descriptive text/i,
      { selector: '[data-slot="tooltip-content"]' },
    );
    await expect(triggerTooltip).toBeInTheDocument();
  },
};
