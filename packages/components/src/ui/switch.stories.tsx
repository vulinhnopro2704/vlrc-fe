import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from './switch';

const meta = {
  title: 'Primitives/Switch',
  component: Switch,
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    defaultChecked: true,
  },
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
          Active / Checked (7 Sizes)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Switch size="xxs" defaultChecked aria-label="Size XXS" />
          <Switch size="xs" defaultChecked aria-label="Size XS" />
          <Switch size="sm" defaultChecked aria-label="Size SM" />
          <Switch size="md" defaultChecked aria-label="Size MD" />
          <Switch size="lg" defaultChecked aria-label="Size LG" />
          <Switch size="xl" defaultChecked aria-label="Size XL" />
          <Switch size="xxl" defaultChecked aria-label="Size XXL" />
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
          Inactive / Unchecked (7 Sizes)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Switch size="xxs" aria-label="Size XXS" />
          <Switch size="xs" aria-label="Size XS" />
          <Switch size="sm" aria-label="Size SM" />
          <Switch size="md" aria-label="Size MD" />
          <Switch size="lg" aria-label="Size LG" />
          <Switch size="xl" aria-label="Size XL" />
          <Switch size="xxl" aria-label="Size XXL" />
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Switch size="md" aria-label="Unchecked" />
      <Switch size="md" defaultChecked aria-label="Checked" />
      <Switch size="md" disabled aria-label="Disabled Unchecked" />
      <Switch size="md" disabled defaultChecked aria-label="Disabled Checked" />
    </div>
  ),
};

function InteractiveSwitchDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        size="md"
        aria-label="Toggle notifications"
      />
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        Notifications: {checked ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveSwitchDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByRole('switch');
    await expect(switchEl).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(switchEl);
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(switchEl);
    await expect(switchEl).toHaveAttribute('aria-checked', 'false');
  },
};
