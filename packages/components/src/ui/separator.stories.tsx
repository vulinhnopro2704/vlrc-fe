import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <h4 style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>Radix UI & StyleX</h4>
      <p
        style={{
          margin: '0.25rem 0 0.5rem 0',
          fontSize: '0.8125rem',
          color: 'var(--muted-foreground)',
        }}
      >
        An open-source design system foundation.
      </p>
      <Separator />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '1.25rem',
          gap: '0.75rem',
          marginTop: '0.5rem',
          fontSize: '0.8125rem',
        }}
      >
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
        <Separator orientation="vertical" />
        <span>Changelog</span>
      </div>
    </div>
  ),
};
