import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import type { ComponentSize } from './theme/types';
import { Button } from './ui/button';
import { ConfirmModal } from './ConfirmModal';

const meta = {
  title: 'Feedback/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Confirmation dialog for warning users before critical operations. Aligned with Modal props, supporting 7-tier sizing scale (xxs - xxl), semantic types, and loading state.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls dialog visibility (open or isOpen)',
    },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier sizing scale',
    },
    type: {
      control: 'select',
      options: ['warning', 'danger', 'info', 'success'],
      description: 'Semantic action type determining theme accent and icon',
    },
    title: {
      control: 'text',
      description: 'Heading title',
    },
    message: {
      control: 'text',
      description: 'Explanatory message describing consequences (message or description)',
    },
    confirmText: {
      control: 'text',
      description: 'Confirmation button label',
    },
    cancelText: {
      control: 'text',
      description: 'Cancel button label',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the confirmation async action is pending',
    },
    onClose: { action: 'onClose / onCancel' },
    onConfirm: { action: 'onConfirm / onOk' },
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    open: true,
    type: 'danger',
    title: 'Delete Organization',
    message:
      'Are you sure you want to delete this organization? All associated projects, memberships, and billing information will be permanently purged.',
    confirmText: 'Delete Permanently',
    cancelText: 'Cancel',
    size: 'md',
  },
};

export const Warning: Story = {
  args: {
    open: true,
    type: 'warning',
    title: 'Unsaved Changes',
    message:
      'You have unsaved changes in this form. If you navigate away, all your input will be lost.',
    confirmText: 'Leave Page',
    cancelText: 'Stay',
    size: 'md',
  },
};

export const Success: Story = {
  args: {
    open: true,
    type: 'success',
    title: 'Publish Deployment',
    message:
      'Your build is ready. Publishing now will immediately direct production traffic to release v2.4.0.',
    confirmText: 'Publish Now',
    cancelText: 'Cancel',
    size: 'md',
  },
};

export const Info: Story = {
  args: {
    open: true,
    type: 'info',
    title: 'Archive Workspace',
    message: 'Archived workspaces are placed in read-only mode and can be restored at any time.',
    confirmText: 'Archive',
    cancelText: 'Cancel',
    size: 'md',
  },
};

function ConfirmSizesDemo() {
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
        <ConfirmModal
          open={Boolean(activeSize)}
          size={activeSize}
          type="warning"
          title={`Confirm Size: ${activeSize.toUpperCase()}`}
          message={`This dialog demonstrates the standard ConfirmModal "${activeSize}" sizing preset.`}
          confirmText="Confirm"
          cancelText="Cancel"
          onClose={() => setActiveSize(null)}
          onConfirm={() => setActiveSize(null)}
        />
      )}
    </div>
  );
}

export const SevenSizesDemo: Story = {
  render: () => <ConfirmSizesDemo />,
};

function InteractiveConfirmModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: '2rem' }}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Trigger Delete Confirmation
      </Button>
      <ConfirmModal
        open={open}
        type="danger"
        title="Delete Workspace?"
        message="This action cannot be undone. Are you sure you want to proceed?"
        confirmText="Yes, delete"
        cancelText="Cancel"
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveConfirmModalDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /Trigger Delete Confirmation/i });
    await expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeInTheDocument();
  },
};
