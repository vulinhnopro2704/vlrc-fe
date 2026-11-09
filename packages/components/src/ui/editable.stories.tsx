import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Editable,
  EditableArea,
  EditablePreview,
  EditableInput,
  EditableToolbar,
  EditableTrigger,
  EditableSubmit,
  EditableCancel,
} from './editable';
import { Flex } from './flex';

const meta: Meta<typeof Editable> = {
  title: 'UI/Editable',
  component: Editable,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    triggerMode: {
      control: 'select',
      options: ['click', 'dblclick'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Editable>;

export const Default: Story = {
  render: () => {
    const [title, setTitle] = React.useState('Customer Onboarding Workflow');
    return (
      <Flex vertical gap="sm" style={{ maxWidth: 400 }}>
        <span>Project Title:</span>
        <Editable value={title} onValueChange={setTitle}>
          <EditableArea>
            <EditablePreview />
            <EditableInput />
            <EditableToolbar>
              <EditableTrigger />
              <EditableSubmit />
              <EditableCancel />
            </EditableToolbar>
          </EditableArea>
        </Editable>
      </Flex>
    );
  },
};

export const DoubleClickMode: Story = {
  render: () => (
    <Editable defaultValue="Double click this text to edit" triggerMode="dblclick">
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
    </Editable>
  ),
};
