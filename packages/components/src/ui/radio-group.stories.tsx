import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import type { ComponentSize } from '../theme/types';
import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier sizing scale (xxs to xxl, default md)',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" size="md">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const SevenSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as ComponentSize[]).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            style={{
              width: 50,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
            }}
          >
            {size}
          </span>
          <RadioGroup defaultValue="opt-1" size={size} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RadioGroupItem value="opt-1" id={`radio-${size}-1`} />
              <Label htmlFor={`radio-${size}-1`}>Active</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RadioGroupItem value="opt-2" id={`radio-${size}-2`} />
              <Label htmlFor={`radio-${size}-2`}>Option</Label>
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <RadioGroup defaultValue="apple" size="md">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <RadioGroupItem value="apple" id="int-1" />
        <Label htmlFor="int-1">Apple</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <RadioGroupItem value="orange" id="int-2" />
        <Label htmlFor="int-2">Orange</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const apple = canvas.getByRole('radio', { name: /Apple/i });
    const orange = canvas.getByRole('radio', { name: /Orange/i });

    await expect(apple).toHaveAttribute('data-state', 'checked');
    await expect(orange).toHaveAttribute('data-state', 'unchecked');

    await userEvent.click(orange);
    await expect(apple).toHaveAttribute('data-state', 'unchecked');
    await expect(orange).toHaveAttribute('data-state', 'checked');
  },
};
