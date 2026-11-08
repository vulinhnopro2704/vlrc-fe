import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import type { ComponentSize } from '../theme/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
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
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{ width: 440 }} size="md">
      <TabsList style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Your account details and preferences are managed here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Ensure your account uses a secure password.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const SevenSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: 440 }}>
      {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as ComponentSize[]).map((size) => (
        <div key={size}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
            }}
          >
            Size: {size}
          </div>
          <Tabs defaultValue="overview" size={size}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Tabs defaultValue="tab-1" style={{ width: 440 }} size="md">
      <TabsList style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
        <TabsTrigger value="tab-1">First Panel</TabsTrigger>
        <TabsTrigger value="tab-2">Second Panel</TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
        <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
          First tab content is actively displayed.
        </div>
      </TabsContent>
      <TabsContent value="tab-2">
        <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
          Second tab content is actively displayed.
        </div>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tab1 = canvas.getByRole('tab', { name: /First Panel/i });
    const tab2 = canvas.getByRole('tab', { name: /Second Panel/i });

    await expect(tab1).toHaveAttribute('data-state', 'active');
    await expect(tab2).toHaveAttribute('data-state', 'inactive');

    await userEvent.click(tab2);
    await expect(tab1).toHaveAttribute('data-state', 'inactive');
    await expect(tab2).toHaveAttribute('data-state', 'active');
  },
};
