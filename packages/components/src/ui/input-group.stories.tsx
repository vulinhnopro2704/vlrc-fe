import type { Meta, StoryObj } from '@storybook/react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from './input-group';
import { Flex } from './flex';
import { Kbd } from './kbd';

const meta: Meta<typeof InputGroup> = {
  title: 'UI/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="vlrc.io" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="secondary" size="xs">
          Copy
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithKbdShortcut: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="Search documentation..." />
      <InputGroupAddon align="inline-end">
        <Kbd size="xs">⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex vertical gap="md" style={{ width: '100%', maxWidth: 400 }}>
      <InputGroup size="sm">
        <InputGroupAddon align="inline-start">
          <InputGroupText>SM</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Small input" />
      </InputGroup>
      <InputGroup size="md">
        <InputGroupAddon align="inline-start">
          <InputGroupText>MD</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Medium input" />
      </InputGroup>
      <InputGroup size="lg">
        <InputGroupAddon align="inline-start">
          <InputGroupText>LG</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Large input" />
      </InputGroup>
    </Flex>
  ),
};

export const TextareaWithAction: Story = {
  render: () => (
    <InputGroup style={{ maxWidth: 500 }}>
      <InputGroupTextarea placeholder="Ask AI something..." rows={3} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="default" size="sm">
          Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};
