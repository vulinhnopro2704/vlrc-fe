import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActionBar,
  ActionBarSelection,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSeparator,
  ActionBarClose,
} from './action-bar';
import { Badge } from './badge';
import { Button } from './button';

const meta: Meta<typeof ActionBar> = {
  title: 'UI/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [count, setCount] = React.useState(4);

    return (
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Simulate Row Selection ({count})
        </Button>

        <ActionBar open={open} onOpenChange={setOpen}>
          <ActionBarSelection>
            <Badge variant="secondary">{count}</Badge>
            <span>items selected</span>
          </ActionBarSelection>
          <ActionBarSeparator />
          <ActionBarGroup>
            <ActionBarItem variant="destructive" onClick={() => alert('Delete')}>
              Delete
            </ActionBarItem>
            <ActionBarItem variant="secondary" onClick={() => alert('Export')}>
              Export
            </ActionBarItem>
          </ActionBarGroup>
          <ActionBarSeparator />
          <ActionBarClose onClick={() => setCount(0)}>Clear</ActionBarClose>
        </ActionBar>
      </div>
    );
  },
};
