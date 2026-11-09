import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TagsInput,
  TagsInputItem,
  TagsInputItemText,
  TagsInputItemDelete,
  TagsInputInput,
  TagsInputClear,
} from './tags-input';
import { Flex } from './flex';

const meta: Meta<typeof TagsInput> = {
  title: 'UI/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    max: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof TagsInput>;

export const Default: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['React', 'TypeScript', 'StyleX']);
    return (
      <div style={{ maxWidth: 450 }}>
        <TagsInput value={tags} onValueChange={setTags}>
          {tags.map((tag, index) => (
            <TagsInputItem key={tag} index={index} value={tag}>
              <TagsInputItemText>{tag}</TagsInputItemText>
              <TagsInputItemDelete index={index} />
            </TagsInputItem>
          ))}
          <TagsInputInput placeholder="Add a framework..." />
          <TagsInputClear />
        </TagsInput>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex vertical gap="md" style={{ maxWidth: 450 }}>
      <TagsInput size="sm" defaultValue={['Small', 'Tag']}>
        {['Small', 'Tag'].map((tag, i) => (
          <TagsInputItem key={tag} index={i} value={tag}>
            <TagsInputItemText>{tag}</TagsInputItemText>
            <TagsInputItemDelete index={i} />
          </TagsInputItem>
        ))}
        <TagsInputInput placeholder="Small..." />
      </TagsInput>

      <TagsInput size="md" defaultValue={['Medium', 'Tag']}>
        {['Medium', 'Tag'].map((tag, i) => (
          <TagsInputItem key={tag} index={i} value={tag}>
            <TagsInputItemText>{tag}</TagsInputItemText>
            <TagsInputItemDelete index={i} />
          </TagsInputItem>
        ))}
        <TagsInputInput placeholder="Medium..." />
      </TagsInput>

      <TagsInput size="lg" defaultValue={['Large', 'Tag']}>
        {['Large', 'Tag'].map((tag, i) => (
          <TagsInputItem key={tag} index={i} value={tag}>
            <TagsInputItemText>{tag}</TagsInputItemText>
            <TagsInputItemDelete index={i} />
          </TagsInputItem>
        ))}
        <TagsInputInput placeholder="Large..." />
      </TagsInput>
    </Flex>
  ),
};
