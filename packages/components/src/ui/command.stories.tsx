import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import Icons from '../Icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';

const meta = {
  title: 'Primitives/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 400,
        borderRadius: 8,
        border: '1px solid var(--border)',
        backgroundColor: 'var(--popover)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Icons.Calendar style={{ marginRight: 8, width: 16, height: 16 }} />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Icons.Smile style={{ marginRight: 8, width: 16, height: 16 }} />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Icons.Calculator style={{ marginRight: 8, width: 16, height: 16 }} />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <Icons.User style={{ marginRight: 8, width: 16, height: 16 }} />
              <span>Profile</span>
            </CommandItem>
            <CommandItem>
              <Icons.CreditCard style={{ marginRight: 8, width: 16, height: 16 }} />
              <span>Billing</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

function InteractiveCommandDemo() {
  const [selectedAction, setSelectedAction] = useState<string>('None');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        Last selected command: <strong>{selectedAction}</strong>
      </div>
      <div
        style={{
          width: 420,
          borderRadius: 8,
          border: '1px solid var(--border)',
          backgroundColor: 'var(--popover)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Command>
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandEmpty>No commands match your query.</CommandEmpty>
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => setSelectedAction('New File')}>
                <Icons.FileText style={{ marginRight: 8, width: 16, height: 16 }} />
                <span>New File</span>
              </CommandItem>
              <CommandItem onSelect={() => setSelectedAction('Search Projects')}>
                <Icons.Search style={{ marginRight: 8, width: 16, height: 16 }} />
                <span>Search Projects</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Preferences">
              <CommandItem onSelect={() => setSelectedAction('Settings')}>
                <Icons.Settings style={{ marginRight: 8, width: 16, height: 16 }} />
                <span>Open Settings</span>
              </CommandItem>
              <CommandItem onSelect={() => setSelectedAction('Sign Out')}>
                <Icons.LogOut style={{ marginRight: 8, width: 16, height: 16 }} />
                <span>Sign Out</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveCommandDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search commands...');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'New');
    const item = await canvas.findByText('New File');
    await expect(item).toBeInTheDocument();
  },
};
