import type { Meta, StoryObj } from '@storybook/react';
import Icons from '../Icons';
import { Button } from './button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive button primitive supporting 10 visual variants, the 7-tier sizing scale (xxs - xxl), dedicated icon sizes, prefix/suffix icons, independent icon size overrides, and built-in loading states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'accent',
        'accent-cta',
        'gradient',
        'gradient-success',
      ],
      description: 'Visual appearance variant',
    },
    size: {
      control: 'select',
      options: [
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        'xxl',
        'icon-xxs',
        'icon-xs',
        'icon-sm',
        'icon-md',
        'icon-lg',
        'icon-xl',
        'icon-xxl',
      ],
      description: '7-tier sizing scale',
    },
    iconSize: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Override prefix/suffix icon size independently of button text/size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether button is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether button is in loading state',
    },
    children: {
      control: 'text',
      description: 'Content rendered inside the button',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Primary Action',
    variant: 'default',
    size: 'md',
  },
};

export const SevenSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
      <Button size="xxs">xxs (24px)</Button>
      <Button size="xs">xs (28px)</Button>
      <Button size="sm">sm (32px)</Button>
      <Button size="md">md / default (36px)</Button>
      <Button size="lg">lg (40px)</Button>
      <Button size="xl">xl (44px)</Button>
      <Button size="xxl">xxl (52px)</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="accent-cta">Accent CTA</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="gradient-success">Success</Button>
    </div>
  ),
};

export const WithPrefixAndSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <Button prefix={<Icons.Search />} variant="outline">
        Search
      </Button>
      <Button suffix={<Icons.ChevronRight />}>Continue</Button>
      <Button prefix={<Icons.FileText />} suffix={<Icons.Check />} variant="secondary">
        Export Document
      </Button>
    </div>
  ),
};

export const IndependentIconSizeOverride: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
        Button is <strong>sm</strong>, but icon is overridden to <strong>xl</strong>:
      </p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button size="sm" iconSize="xl" prefix={<Icons.Info />} variant="outline">
          Large Icon in Small Button
        </Button>
        <Button size="xxl" iconSize="xxs" prefix={<Icons.Lock />}>
          Tiny Icon in XXL Button
        </Button>
      </div>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Button size="icon-xxs" variant="outline" aria-label="xxs">
        <Icons.Plus />
      </Button>
      <Button size="icon-xs" variant="outline" aria-label="xs">
        <Icons.Plus />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="sm">
        <Icons.Plus />
      </Button>
      <Button size="icon-md" variant="outline" aria-label="md">
        <Icons.Plus />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="lg">
        <Icons.Plus />
      </Button>
      <Button size="icon-xl" variant="outline" aria-label="xl">
        <Icons.Plus />
      </Button>
      <Button size="icon-xxl" variant="outline" aria-label="xxl">
        <Icons.Plus />
      </Button>
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button isLoading size="sm">
        Saving...
      </Button>
      <Button isLoading size="md" variant="outline">
        Processing
      </Button>
      <Button isLoading size="lg" variant="secondary">
        Exporting
      </Button>
    </div>
  ),
};
