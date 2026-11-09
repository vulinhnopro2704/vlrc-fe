import type { Meta, StoryObj } from '@storybook/react';
import { BadgeOverflow } from './badge-overflow';
import { Flex } from './flex';

const meta: Meta<typeof BadgeOverflow> = {
  title: 'UI/BadgeOverflow',
  component: BadgeOverflow,
  tags: ['autodocs'],
  argTypes: {
    max: { control: 'number' },
    showPopover: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof BadgeOverflow>;

const SAMPLE_TAGS = [
  'React 19',
  'Meta StyleX',
  'TypeScript 7',
  'Radix UI',
  'Vitest',
  'Storybook',
  'Vite',
];

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 350 }}>
      <BadgeOverflow items={SAMPLE_TAGS} max={3} />
    </div>
  ),
};

export const CustomMax: Story = {
  render: () => (
    <Flex vertical gap="md" style={{ maxWidth: 400 }}>
      <div>
        <span>Max 2:</span>
        <BadgeOverflow items={SAMPLE_TAGS} max={2} />
      </div>
      <div>
        <span>Max 4:</span>
        <BadgeOverflow items={SAMPLE_TAGS} max={4} />
      </div>
    </Flex>
  ),
};
