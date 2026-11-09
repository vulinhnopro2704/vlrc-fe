import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dropdown, PopupMenu } from './Dropdown';
import { Button } from '../ui/button';
import { Flex } from '../layout';
import { Text } from '../Typography';
import { Modal } from '../Modal';
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  FolderPlus,
  Share2,
  Trash2,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

/**
 * Standard usage passing a declarative items array.
 * Eliminates 20+ lines of Radix primitive boilerplate.
 */
export const Basic: Story = {
  render: () => (
    <Dropdown
      items={[
        { type: 'label', label: 'My Account' },
        {
          key: 'profile',
          label: 'Profile Settings',
          icon: <User size={15} />,
          shortcut: '⇧⌘P',
          onClick: () => alert('Navigating to profile...'),
        },
        {
          key: 'billing',
          label: 'Billing & Plan',
          icon: <CreditCard size={15} />,
          shortcut: '⌘B',
        },
        {
          key: 'settings',
          label: 'General Settings',
          icon: <Settings size={15} />,
          shortcut: '⌘S',
        },
        { type: 'separator' },
        {
          key: 'logout',
          label: 'Log out',
          icon: <LogOut size={15} />,
          danger: true,
          shortcut: '⇧⌘Q',
          onClick: () => alert('Logged out!'),
        },
      ]}
    >
      <Button variant="outline">Click for Account Menu ▾</Button>
    </Dropdown>
  ),
};

/**
 * 3 Sizing Tiers: 'sm', 'md', 'lg' using VLRC design tokens.
 */
export const Sizes: Story = {
  render: () => {
    const demoItems = [
      { key: 'edit', label: 'Edit Document', icon: <FileText size={14} /> },
      { key: 'share', label: 'Share', icon: <Share2 size={14} /> },
      { type: 'separator' as const },
      { key: 'delete', label: 'Delete', danger: true, icon: <Trash2 size={14} /> },
    ];

    return (
      <Flex gap="lg" align="center">
        <Dropdown size="sm" items={demoItems}>
          <Button size="sm" variant="outline">
            Small Dropdown (sm) ▾
          </Button>
        </Dropdown>

        <Dropdown size="md" items={demoItems}>
          <Button size="default" variant="outline">
            Medium Dropdown (md) ▾
          </Button>
        </Dropdown>

        <Dropdown size="lg" items={demoItems}>
          <Button size="lg" variant="outline">
            Large Dropdown (lg) ▾
          </Button>
        </Dropdown>
      </Flex>
    );
  },
};

/**
 * Declarative menu object API: `menu={{ items, onClick }}` + `placement`.
 */
export const MenuConfigApi: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState<string | number>('none');

    return (
      <Flex vertical gap="md" align="center">
        <Text type="muted">
          Last selected key: <b>{selectedKey}</b>
        </Text>

        <Dropdown
          placement="bottomRight"
          menu={{
            items: [
              { key: 'new-folder', label: 'New Folder', icon: <FolderPlus size={15} /> },
              { key: 'share', label: 'Share Link', icon: <Share2 size={15} /> },
              { type: 'divider' },
              { key: 'delete', label: 'Delete Item', danger: true, icon: <Trash2 size={15} /> },
            ],
            onClick: ({ key }) => setSelectedKey(key),
          }}
        >
          <Button>Declarative Menu ▾</Button>
        </Dropdown>
      </Flex>
    );
  },
};

/**
 * Deep nested submenus rendered automatically via recursive item children.
 */
export const NestedSubmenus: Story = {
  render: () => (
    <Dropdown
      items={[
        { key: 'new', label: 'New Document', icon: <FileText size={15} /> },
        {
          key: 'export',
          label: 'Export Document As...',
          icon: <Share2 size={15} />,
          children: [
            { key: 'pdf', label: 'Portable Document Format (.pdf)' },
            {
              key: 'sheets',
              label: 'Spreadsheet Formats',
              icon: <FileSpreadsheet size={15} />,
              children: [
                { key: 'xlsx', label: 'Microsoft Excel (.xlsx)' },
                { key: 'csv', label: 'Comma Separated Values (.csv)' },
              ],
            },
          ],
        },
        { type: 'separator' },
        { key: 'print', label: 'Print File', shortcut: '⌘P' },
      ]}
    >
      <Button variant="outline">File Menu (Multi-level Submenu) ▾</Button>
    </Dropdown>
  ),
};

/**
 * Checkbox items inside dropdown menu.
 */
export const CheckboxMenu: Story = {
  render: () => {
    const [showToolbar, setShowToolbar] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);

    return (
      <Dropdown
        items={[
          { type: 'label', label: 'View Preferences' },
          {
            type: 'checkbox',
            key: 'toolbar',
            label: 'Show Top Toolbar',
            checked: showToolbar,
            onCheckedChange: setShowToolbar,
          },
          {
            type: 'checkbox',
            key: 'sidebar',
            label: 'Show Navigation Sidebar',
            checked: showSidebar,
            onCheckedChange: setShowSidebar,
          },
        ]}
      >
        <Button variant="outline">Toggle Views ▾</Button>
      </Dropdown>
    );
  },
};

/**
 * Used inside a Modal. Proves automatic ZIndexContext dynamic stacking
 * with zero manual z-index configuration!
 */
export const InsideModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal to Test Dropdown</Button>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Dropdown inside Modal"
          description="Notice how the Dropdown popup automatically stacks above the modal without any z-index conflicts!"
        >
          <Flex vertical gap="lg" style={{ padding: '1rem 0' }}>
            <Text>
              Clicking this button opens a declarative Dropdown. Thanks to ZIndexContext, it
              inherits the modal context and receives an incremented z-index automatically.
            </Text>

            <Dropdown
              items={[
                { key: 'option-1', label: 'First Action', onClick: () => alert('Action 1') },
                { key: 'option-2', label: 'Second Action', onClick: () => alert('Action 2') },
                { type: 'separator' },
                { key: 'option-3', label: 'Critical Action', danger: true },
              ]}
            >
              <Button variant="primary">Open Dropdown Inside Modal ▾</Button>
            </Dropdown>
          </Flex>
        </Modal>
      </>
    );
  },
};
