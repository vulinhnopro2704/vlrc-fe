import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import type { ComponentSize } from './theme/types';
import { Button } from './ui/button';
import { Modal } from './Modal';

const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modal dialog built on top of Radix UI Dialog and Meta StyleX. Supports consistent props aligned with ConfirmModal, 7-tier sizing scale (xxs - xxl), and built-in loading states.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the modal is visible (open or isOpen)',
    },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier sizing preset (maxWidth 320px to 960px)',
    },
    title: {
      control: 'text',
      description: 'Modal header title',
    },
    description: {
      control: 'text',
      description: 'Optional descriptive subtitle (description or message)',
    },
    width: {
      control: 'text',
      description: 'Explicit max-width override (overrides size preset)',
    },
    confirmText: {
      control: 'text',
      description: 'Label of the primary confirmation button',
    },
    cancelText: {
      control: 'text',
      description: 'Label of the secondary cancel button',
    },
    isLoading: {
      control: 'boolean',
      description: 'Puts the modal in loading state',
    },
    onCancel: { action: 'onCancel / onClose' },
    onConfirm: { action: 'onConfirm / onOk' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    size: 'md',
    title: 'Edit User Profile',
    description: 'Update your account settings and personal details.',
    confirmText: 'Save Changes',
    cancelText: 'Cancel',
    isLoading: false,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
        <p style={{ margin: 0 }}>Modal body content with custom form or informational display.</p>
        <input
          placeholder="Display Name"
          defaultValue="John Doe"
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          }}
        />
      </div>
    ),
  },
};

function SizesDemo() {
  const [activeSize, setActiveSize] = useState<ComponentSize | null>(null);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((s) => (
          <Button key={s} variant="outline" onClick={() => setActiveSize(s)}>
            Size {s.toUpperCase()}
          </Button>
        ))}
      </div>

      {activeSize && (
        <Modal
          open={Boolean(activeSize)}
          size={activeSize}
          onClose={() => setActiveSize(null)}
          onConfirm={() => setActiveSize(null)}
          title={`Modal Size: ${activeSize.toUpperCase()}`}
          description={`This modal demonstrates the standard "${activeSize}" sizing preset.`}
        >
          <p style={{ margin: 0 }}>
            Responsive width configured via design system 7-tier scale tokens.
          </p>
        </Modal>
      )}
    </div>
  );
}

export const SevenSizesDemo: Story = {
  render: () => <SizesDemo />,
};

function InteractiveModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: '2rem' }}>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Interactive Preview"
        description="Click Cancel or Save to close this modal."
        size="md"
      >
        <p>This modal can be toggled open and closed directly in the canvas.</p>
      </Modal>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveModalDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Open Modal/i });
    await expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeInTheDocument();
  },
};

export const LoadingState: Story = {
  args: {
    open: true,
    title: 'Processing Order',
    description: 'Please wait while we process your transaction.',
    size: 'md',
    isLoading: true,
    loadingText: 'Saving...',
    children: <p>Order details are being submitted to the server...</p>,
  },
};
