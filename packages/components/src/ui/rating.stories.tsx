import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Flex } from '../layout';
import { Text } from '../Typography';
import { Rating } from './rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Feedback/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    allowHalf: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    max: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    defaultValue: 3,
  },
};

export const WithHalfStars: Story = {
  args: {
    defaultValue: 3.5,
    allowHalf: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex vertical gap="md">
      <Flex align="center" gap="sm">
        <Text size="sm">Small:</Text>
        <Rating size="sm" defaultValue={4} />
      </Flex>
      <Flex align="center" gap="sm">
        <Text size="sm">Medium (default):</Text>
        <Rating size="md" defaultValue={4} />
      </Flex>
      <Flex align="center" gap="sm">
        <Text size="sm">Large:</Text>
        <Rating size="lg" defaultValue={4} />
      </Flex>
    </Flex>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [rating, setRating] = useState<number>(4);

    return (
      <Flex vertical gap="sm">
        <Rating value={rating} onValueChange={setRating} allowHalf />
        <Text type="secondary">Selected rating: {rating} / 5</Text>
      </Flex>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    value: 4.5,
    allowHalf: true,
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    value: 3,
    disabled: true,
  },
};
