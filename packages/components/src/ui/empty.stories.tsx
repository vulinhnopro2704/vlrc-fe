import type { Meta, StoryObj } from '@storybook/react';
import { SearchX, FolderPlus } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Empty, EmptyImage, EmptyTitle, EmptyDescription, EmptyActions } from './empty';

const meta: Meta<typeof Empty> = {
  title: 'Components/Feedback/Empty',
  component: Empty,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Empty>;

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'You have not created any items yet. Start by clicking the button below.',
    action: <Button>Create Item</Button>,
  },
};

export const InCard: Story = {
  render: () => (
    <Card style={{ maxWidth: 500, margin: '0 auto' }}>
      <Empty
        image={<SearchX size={48} />}
        title="No search results"
        description="We couldn't find anything matching your search. Try different keywords or filters."
        action={<Button variant="outline">Clear Search</Button>}
      />
    </Card>
  ),
};

export const CompoundComposition: Story = {
  render: () => (
    <Empty>
      <EmptyImage>
        <FolderPlus size={52} />
      </EmptyImage>
      <EmptyTitle>No documents in this folder</EmptyTitle>
      <EmptyDescription>
        Upload documents or create subfolders to organize your files.
      </EmptyDescription>
      <EmptyActions>
        <Button variant="outline">Import Files</Button>
        <Button>New Document</Button>
      </EmptyActions>
    </Empty>
  ),
};
