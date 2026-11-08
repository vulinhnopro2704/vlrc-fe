import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Write your thoughts here...',
    size: 'md',
  },
};

export const SevenSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 380 }}>
      <Textarea size="xxs" placeholder="xxs size textarea" />
      <Textarea size="xs" placeholder="xs size textarea" />
      <Textarea size="sm" placeholder="sm size textarea" />
      <Textarea size="md" placeholder="md size textarea (default)" />
      <Textarea size="lg" placeholder="lg size textarea" />
      <Textarea size="xl" placeholder="xl size textarea" />
      <Textarea size="xxl" placeholder="xxl size textarea" />
    </div>
  ),
};

export const InvalidAndDisabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 380 }}>
      <Textarea aria-invalid="true" defaultValue="Invalid input value" />
      <Textarea disabled defaultValue="Disabled content cannot be edited" />
    </div>
  ),
};
