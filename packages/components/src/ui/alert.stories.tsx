import type { Meta, StoryObj } from '@storybook/react';
import Icons from '../Icons';
import { Alert, AlertDescription, AlertTitle } from './alert';

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 450, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert>
        <Icons.Info style={{ width: 16, height: 16 }} />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <Icons.AlertCircle style={{ width: 16, height: 16 }} />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </Alert>
    </div>
  ),
};
