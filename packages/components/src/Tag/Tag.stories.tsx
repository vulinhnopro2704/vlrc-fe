import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';
import { HStack, VStack } from '../layout';
import Icons from '../Icons';

const meta = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    categoryColor: {
      control: 'select',
      options: ['default', 'geekblue', 'success'],
    },
    color: {
      control: 'select',
      options: [
        'default',
        'red',
        'orange',
        'yellow',
        'green',
        'teal',
        'cyan',
        'blue',
        'purple',
        'pink',
        'gray',
      ],
    },
    closable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Tag',
    closable: false,
  },
};

export const CategoryColors: Story = {
  render: () => (
    <HStack gap="sm">
      <Tag categoryColor="default">Default</Tag>
      <Tag categoryColor="geekblue">Geekblue</Tag>
      <Tag categoryColor="success">Success</Tag>
    </HStack>
  ),
};

export const ClosableTags: Story = {
  render: () => (
    <HStack gap="sm">
      <Tag categoryColor="default" closable onClose={() => alert('Closed default')}>
        Closable Default
      </Tag>
      <Tag categoryColor="geekblue" closable onClose={() => alert('Closed geekblue')}>
        Closable Geekblue
      </Tag>
      <Tag categoryColor="success" closable onClose={() => alert('Closed success')}>
        Closable Success
      </Tag>
    </HStack>
  ),
};

export const InteractiveClickable: Story = {
  render: () => (
    <VStack gap="sm">
      <HStack gap="sm">
        <Tag categoryColor="geekblue" onClick={() => alert('Clicked tag')}>
          Clickable Only
        </Tag>
        <Tag
          categoryColor="success"
          onClick={() => alert('Clicked content')}
          closable
          onClose={() => alert('Closed tag')}
        >
          Clickable Content & Close
        </Tag>
      </HStack>
    </VStack>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <HStack gap="sm">
      <Tag categoryColor="geekblue" icon={<Icons.Check size={12} />}>
        Verified
      </Tag>
      <Tag categoryColor="success" icon={<Icons.CheckCircle size={12} />} closable>
        Completed
      </Tag>
    </HStack>
  ),
};
