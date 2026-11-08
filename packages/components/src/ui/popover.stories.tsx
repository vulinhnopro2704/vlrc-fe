import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: 280, padding: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Dimensions</h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          Set the dimensions for the layer.
        </p>
      </PopoverContent>
    </Popover>
  ),
};
