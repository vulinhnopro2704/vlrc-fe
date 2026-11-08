import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './checkbox';
import { Label } from './label';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
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
    defaultChecked: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Checkbox id="terms" defaultChecked size="md" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const SevenSizes: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}
    >
      <div>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
            color: 'var(--muted-foreground)',
          }}
        >
          Checked (7 Sizes)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Checkbox size="xxs" defaultChecked aria-label="Size XXS" />
          <Checkbox size="xs" defaultChecked aria-label="Size XS" />
          <Checkbox size="sm" defaultChecked aria-label="Size SM" />
          <Checkbox size="md" defaultChecked aria-label="Size MD" />
          <Checkbox size="lg" defaultChecked aria-label="Size LG" />
          <Checkbox size="xl" defaultChecked aria-label="Size XL" />
          <Checkbox size="xxl" defaultChecked aria-label="Size XXL" />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
            color: 'var(--muted-foreground)',
          }}
        >
          Unchecked (7 Sizes)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Checkbox size="xxs" aria-label="Size XXS" />
          <Checkbox size="xs" aria-label="Size XS" />
          <Checkbox size="sm" aria-label="Size SM" />
          <Checkbox size="md" aria-label="Size MD" />
          <Checkbox size="lg" aria-label="Size LG" />
          <Checkbox size="xl" aria-label="Size XL" />
          <Checkbox size="xxl" aria-label="Size XXL" />
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Checkbox id="c1" size="md" />
        <Label htmlFor="c1">Unchecked</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Checkbox id="c2" defaultChecked size="md" />
        <Label htmlFor="c2">Checked</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Checkbox id="c3" disabled size="md" />
        <Label htmlFor="c3">Disabled unchecked</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Checkbox id="c4" disabled defaultChecked size="md" />
        <Label htmlFor="c4">Disabled checked</Label>
      </div>
    </div>
  ),
};

function InteractiveCheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Checkbox
        id="interactive-cb"
        checked={checked}
        onCheckedChange={(val) => setChecked(Boolean(val))}
        size="md"
      />
      <Label htmlFor="interactive-cb">Remember me ({checked ? 'Checked' : 'Unchecked'})</Label>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveCheckboxDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cb = canvas.getByRole('checkbox');
    await expect(cb).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(cb);
    await expect(cb).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(cb);
    await expect(cb).toHaveAttribute('aria-checked', 'false');
  },
};
