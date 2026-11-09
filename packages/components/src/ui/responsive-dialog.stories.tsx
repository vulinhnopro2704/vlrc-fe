import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './button';
import { Flex } from '../layout';
import { Text } from '../Typography';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
} from './responsive-dialog';

const meta: Meta<typeof ResponsiveDialog> = {
  title: 'Components/Feedback/ResponsiveDialog',
  component: ResponsiveDialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResponsiveDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <ResponsiveDialogTrigger asChild>
          <Button>Open Responsive Dialog</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Responsive Dialog</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Resizes seamlessly between a center modal on desktop and a bottom drawer sheet on
              mobile devices.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <Flex vertical gap="sm" style={{ padding: '1rem 0' }}>
            <Text>Resize your viewport to test the automatic layout shift!</Text>
          </Flex>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </ResponsiveDialogClose>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  },
};

export const ForcedMobileSheet: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ResponsiveDialog open={open} onOpenChange={setOpen} forceMode="mobile">
        <ResponsiveDialogTrigger asChild>
          <Button variant="outline">Open Drawer (Forced Mobile)</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Mobile Drawer View</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              This variant forces the mobile drawer presentation regardless of screen size.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="outline">Close</Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  },
};
