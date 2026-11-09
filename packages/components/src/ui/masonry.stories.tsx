import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';
import { Title, Text } from '../Typography';
import { Masonry } from './masonry';

const meta: Meta<typeof Masonry> = {
  title: 'Components/Layout/Masonry',
  component: Masonry,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'number' },
    gap: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Masonry>;

const HEIGHTS = [140, 220, 180, 260, 160, 200, 130, 240, 170];

export const Default: Story = {
  render: () => (
    <Masonry columns={3} gap="md">
      {HEIGHTS.map((height, i) => (
        <Card key={i} style={{ height, padding: '1rem' }}>
          <Title level={5} size="sm">
            Item #{i + 1}
          </Title>
          <Text type="secondary" size="xs">
            Dynamic content with height {height}px
          </Text>
        </Card>
      ))}
    </Masonry>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
      {HEIGHTS.map((height, i) => (
        <Card key={i} style={{ height, padding: '1rem' }}>
          <Title level={5} size="sm">
            Card #{i + 1}
          </Title>
          <Text type="secondary" size="xs">
            Adapts column count from 1 (mobile) to 4 (desktop).
          </Text>
        </Card>
      ))}
    </Masonry>
  ),
};
