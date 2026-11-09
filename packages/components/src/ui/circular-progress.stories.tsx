import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '../layout';
import { CircularProgress } from './circular-progress';

const meta: Meta<typeof CircularProgress> = {
  title: 'Components/Feedback/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'warning', 'success'],
    },
    showValue: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: {
    value: 65,
    showValue: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex align="center" gap="lg">
      <CircularProgress size="xs" value={40} />
      <CircularProgress size="sm" value={50} showValue />
      <CircularProgress size="md" value={65} showValue />
      <CircularProgress size="lg" value={80} showValue />
      <CircularProgress size="xl" value={95} showValue />
    </Flex>
  ),
};

export const Variants: Story = {
  render: () => (
    <Flex align="center" gap="md">
      <CircularProgress value={70} variant="primary" showValue />
      <CircularProgress value={70} variant="success" showValue />
      <CircularProgress value={70} variant="warning" showValue />
      <CircularProgress value={70} variant="destructive" showValue />
      <CircularProgress value={70} variant="secondary" showValue />
    </Flex>
  ),
};
