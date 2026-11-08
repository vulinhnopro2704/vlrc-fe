import type { Meta, StoryObj } from '@storybook/react';
import Icons from '../Icons';
import { Button } from './button';
import { Input } from './input';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input component with full 7-tier sizing (xxs - xxl), prefix/suffix icons, prefix/suffix buttons, and independent buttonSize/iconSize overrides.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Input size tier',
    },
    buttonSize: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Override size of inner button independently of input size',
    },
    iconSize: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Override size of prefix/suffix icon independently of input size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your name...',
    size: 'md',
  },
};

export const SevenSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 340 }}>
      <Input size="xxs" placeholder="xxs (24px height)" />
      <Input size="xs" placeholder="xs (28px height)" />
      <Input size="sm" placeholder="sm (32px height)" />
      <Input size="md" placeholder="md / default (36px height)" />
      <Input size="lg" placeholder="lg (40px height)" />
      <Input size="xl" placeholder="xl (44px height)" />
      <Input size="xxl" placeholder="xxl (52px height)" />
    </div>
  ),
};

export const WithPrefixAndSuffixIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 340 }}>
      <Input prefixIcon={<Icons.Search />} placeholder="Search projects..." />
      <Input prefixIcon={<Icons.Mail />} suffixIcon={<Icons.Check />} defaultValue="user@vlrc.vn" />
      <Input
        prefixIcon={<Icons.Lock />}
        suffixIcon={<Icons.Eye />}
        type="password"
        defaultValue="secretpassword"
      />
    </div>
  ),
};

export const WithInteractiveButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 380 }}>
      <Input
        prefixIcon={<Icons.Search />}
        suffixButton={
          <Button size="icon-sm" variant="ghost" aria-label="Clear">
            <Icons.X />
          </Button>
        }
        placeholder="Type to search..."
      />

      <Input
        placeholder="https://vlrc.vn/invite/abc-123"
        suffixButton={
          <Button size="xs" variant="secondary">
            Copy
          </Button>
        }
      />

      <Input
        prefixButton={
          <Button size="xs" variant="outline">
            https://
          </Button>
        }
        suffixButton={
          <Button size="xs" variant="default">
            Verify
          </Button>
        }
        placeholder="domain.com"
      />
    </div>
  ),
};

export const IndependentButtonSizeOverride: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 420 }}>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
        Large input (<strong>lg</strong>) with compact button (<strong>xs</strong>) and icon (
        <strong>sm</strong>):
      </p>
      <Input
        size="lg"
        buttonSize="xs"
        iconSize="sm"
        prefixIcon={<Icons.Search />}
        suffixButton={
          <Button size="xs" variant="default">
            Search
          </Button>
        }
        placeholder="Global search across all resources..."
      />

      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
        XXL input (<strong>xxl</strong>) with medium button (<strong>md</strong>):
      </p>
      <Input
        size="xxl"
        buttonSize="md"
        prefixIcon={<Icons.Mail />}
        suffixButton={
          <Button size="md" variant="default">
            Subscribe
          </Button>
        }
        placeholder="Enter your email address..."
      />
    </div>
  ),
};

export const InvalidState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 340 }}>
      <Input aria-invalid="true" defaultValue="invalid-email-format" prefixIcon={<Icons.Mail />} />
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 340 }}>
      <Input disabled defaultValue="Readonly or disabled content" prefixIcon={<Icons.Lock />} />
    </div>
  ),
};
