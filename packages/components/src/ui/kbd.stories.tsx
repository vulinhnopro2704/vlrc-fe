import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, KbdGroup } from './kbd';
import { Flex } from './flex';

const meta: Meta<typeof Kbd> = {
  title: 'UI/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  args: {
    children: '⌘K',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'ESC',
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex align="center" gap="sm">
      <Kbd size="xs">XS</Kbd>
      <Kbd size="sm">SM</Kbd>
      <Kbd size="md">MD</Kbd>
      <Kbd size="lg">LG</Kbd>
    </Flex>
  ),
};

export const Group: Story = {
  render: () => (
    <Flex vertical gap="sm">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd variant="outline">Ctrl</Kbd>
        <Kbd variant="outline">Alt</Kbd>
        <Kbd variant="outline">Del</Kbd>
      </KbdGroup>
    </Flex>
  ),
};
