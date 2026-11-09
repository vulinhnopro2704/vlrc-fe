import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LayoutGrid, List, Table } from 'lucide-react';
import { Flex } from '../layout';
import { Text } from '../Typography';
import { Segmented, type SegmentedOption } from './segmented';

const meta: Meta<typeof Segmented> = {
  title: 'Components/Navigation/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    block: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Segmented>;

const VIEW_OPTIONS: SegmentedOption[] = [
  { label: 'Grid', value: 'grid', icon: <LayoutGrid size={15} /> },
  { label: 'List', value: 'list', icon: <List size={15} /> },
  { label: 'Table', value: 'table', icon: <Table size={15} /> },
];

export const Default: Story = {
  args: {
    options: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    defaultValue: 'Weekly',
  },
};

export const WithIcons: Story = {
  args: {
    options: VIEW_OPTIONS,
    defaultValue: 'grid',
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex vertical gap="md">
      <Segmented size="sm" options={['Map', 'Transit', 'Satellite']} />
      <Segmented size="md" options={['Map', 'Transit', 'Satellite']} />
      <Segmented size="lg" options={['Map', 'Transit', 'Satellite']} />
    </Flex>
  ),
};

export const Block: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Segmented block options={['Overview', 'Activity', 'Settings']} />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [view, setView] = useState<string | number>('list');

    return (
      <Flex vertical gap="sm">
        <Segmented options={VIEW_OPTIONS} value={view} onValueChange={setView} />
        <Text type="secondary">Current view: {view}</Text>
      </Flex>
    );
  },
};
