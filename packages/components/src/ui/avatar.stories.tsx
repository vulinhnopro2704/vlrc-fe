import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from './avatar';
import { Flex } from './flex';

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar size="md">
      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
      <AvatarFallback>VT</AvatarFallback>
    </Avatar>
  ),
};

export const SevenSizes: Story = {
  render: () => (
    <Flex align="center" gap="md" wrap>
      <Avatar size="xxs">
        <AvatarFallback>XX</AvatarFallback>
      </Avatar>
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
      <Avatar size="xxl">
        <AvatarFallback>2X</AvatarFallback>
      </Avatar>
    </Flex>
  ),
};

export const Group: Story = {
  render: () => (
    <Flex vertical gap="lg">
      <AvatarGroup max={3} size="md">
        <Avatar>
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>LT</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>KP</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>HN</AvatarFallback>
        </Avatar>
      </AvatarGroup>

      <AvatarGroup size="lg">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </Flex>
  ),
};
