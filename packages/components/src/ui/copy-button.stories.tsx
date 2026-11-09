import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '../layout';
import { Input } from './input';
import { InputGroup, InputGroupAddon } from './input-group';
import { CopyButton } from './copy-button';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/Action/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    showLabel: { control: 'boolean' },
    timeout: { control: 'number' },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: 'npm install @vlrc-fe/components',
  },
};

export const WithLabel: Story = {
  args: {
    value: 'git clone https://github.com/vlrc/repo.git',
    showLabel: true,
    copyLabel: 'Copy Command',
    copiedLabel: 'Copied!',
    variant: 'outline',
    size: 'default',
  },
};

export const InInputGroup: Story = {
  render: () => {
    const shareUrl = 'https://vlrc.example.com/share/token-xyz-123456';
    return (
      <Flex vertical gap="md" style={{ maxWidth: 450 }}>
        <InputGroup>
          <Input readOnly value={shareUrl} />
          <InputGroupAddon align="inline-end">
            <CopyButton value={shareUrl} variant="ghost" size="icon" />
          </InputGroupAddon>
        </InputGroup>
      </Flex>
    );
  },
};
