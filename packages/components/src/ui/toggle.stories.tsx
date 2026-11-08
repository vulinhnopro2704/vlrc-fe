import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import Icons from '../Icons';
import { Toggle } from './toggle';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
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
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Visual styling variant',
    },
    pressed: {
      control: 'boolean',
      description: 'Controlled active state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Icons.Italic style={{ width: 16, height: 16 }} />
    </Toggle>
  ),
};

export const OutlineVariant: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Toggle variant="outline" aria-label="Toggle bold">
        <Icons.Bold style={{ width: 16, height: 16 }} />
      </Toggle>
      <Toggle variant="outline" defaultPressed aria-label="Toggle italic (active)">
        <Icons.Italic style={{ width: 16, height: 16 }} />
      </Toggle>
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
          Default Variant (7 Sizes)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Toggle size="xxs" aria-label="Size XXS">
            <Icons.Bold style={{ width: 12, height: 12 }} />
          </Toggle>
          <Toggle size="xs" aria-label="Size XS">
            <Icons.Bold style={{ width: 14, height: 14 }} />
          </Toggle>
          <Toggle size="sm" aria-label="Size SM">
            <Icons.Bold style={{ width: 14, height: 14 }} />
          </Toggle>
          <Toggle size="md" aria-label="Size MD">
            <Icons.Bold style={{ width: 16, height: 16 }} />
          </Toggle>
          <Toggle size="lg" aria-label="Size LG">
            <Icons.Bold style={{ width: 18, height: 18 }} />
          </Toggle>
          <Toggle size="xl" aria-label="Size XL">
            <Icons.Bold style={{ width: 20, height: 20 }} />
          </Toggle>
          <Toggle size="xxl" aria-label="Size XXL">
            <Icons.Bold style={{ width: 22, height: 22 }} />
          </Toggle>
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
          Outline Variant (7 Sizes)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Toggle variant="outline" size="xxs" aria-label="Outline XXS">
            <Icons.Italic style={{ width: 12, height: 12 }} />
          </Toggle>
          <Toggle variant="outline" size="xs" aria-label="Outline XS">
            <Icons.Italic style={{ width: 14, height: 14 }} />
          </Toggle>
          <Toggle variant="outline" size="sm" aria-label="Outline SM">
            <Icons.Italic style={{ width: 14, height: 14 }} />
          </Toggle>
          <Toggle variant="outline" size="md" aria-label="Outline MD">
            <Icons.Italic style={{ width: 16, height: 16 }} />
          </Toggle>
          <Toggle variant="outline" size="lg" aria-label="Outline LG">
            <Icons.Italic style={{ width: 18, height: 18 }} />
          </Toggle>
          <Toggle variant="outline" size="xl" aria-label="Outline XL">
            <Icons.Italic style={{ width: 20, height: 20 }} />
          </Toggle>
          <Toggle variant="outline" size="xxl" aria-label="Outline XXL">
            <Icons.Italic style={{ width: 22, height: 22 }} />
          </Toggle>
        </div>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToggleGroup type="multiple" variant="default" size="md">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <Icons.Bold style={{ width: 16, height: 16 }} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <Icons.Italic style={{ width: 16, height: 16 }} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <Icons.Underline style={{ width: 16, height: 16 }} />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup type="multiple" variant="outline" size="md">
        <ToggleGroupItem value="bold" aria-label="Toggle bold outline">
          <Icons.Bold style={{ width: 16, height: 16 }} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic outline">
          <Icons.Italic style={{ width: 16, height: 16 }} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline outline">
          <Icons.Underline style={{ width: 16, height: 16 }} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

function InteractiveToggleDemo() {
  const [pressed, setPressed] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Toggle
        pressed={pressed}
        onPressedChange={setPressed}
        variant="outline"
        aria-label="Format bold text"
      >
        <Icons.Bold style={{ width: 16, height: 16 }} />
      </Toggle>
      <span style={{ fontSize: '0.875rem' }}>Bold: {pressed ? 'ON' : 'OFF'}</span>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveToggleDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /Format bold text/i });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};
