import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Marker, MarkerIcon, MarkerContent } from './marker';
import { Box, VStack } from '../layout';

const meta: Meta<typeof Marker> = {
  title: 'Feedback/Marker',
  component: Marker,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'border', 'separator'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Marker>;

export const Default: Story = {
  render: (args) => (
    <Marker {...args}>
      <MarkerIcon>
        <CheckCircle2 size={16} />
      </MarkerIcon>
      <MarkerContent>Build succeeded in 4.2 seconds</MarkerContent>
    </Marker>
  ),
  args: {
    variant: 'default',
    size: 'default',
  },
};

export const BorderVariant: Story = {
  render: () => (
    <VStack gap={0} style={{ width: 450 }}>
      <Marker variant="border">
        <MarkerIcon>
          <CheckCircle2 size={16} color="var(--color-success, #16a34a)" />
        </MarkerIcon>
        <MarkerContent>packages/components/src/ui/marker.tsx (added)</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <CheckCircle2 size={16} color="var(--color-success, #16a34a)" />
        </MarkerIcon>
        <MarkerContent>packages/components/src/ui/marker.test.tsx (added)</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <AlertCircle size={16} color="var(--color-warning, #eab308)" />
        </MarkerIcon>
        <MarkerContent>Warning: 1 unused import removed</MarkerContent>
      </Marker>
    </VStack>
  ),
};

export const SeparatorVariant: Story = {
  render: () => (
    <Box style={{ width: 500 }}>
      <Marker variant="separator">
        <MarkerIcon>
          <Sparkles size={14} />
        </MarkerIcon>
        <MarkerContent>Autonomous Planning Phase</MarkerContent>
      </Marker>
    </Box>
  ),
};

export const AgentRunLog: Story = {
  render: () => (
    <VStack gap="xs" style={{ width: 450 }}>
      <Marker variant="separator">
        <MarkerContent>Workflow Started</MarkerContent>
      </Marker>
      <Marker variant="default">
        <MarkerIcon>
          <CheckCircle2 size={14} color="var(--color-success, #16a34a)" />
        </MarkerIcon>
        <MarkerContent>Repository index loaded</MarkerContent>
      </Marker>
      <Marker variant="default">
        <MarkerIcon>
          <Loader2 size={14} className="animate-spin" />
        </MarkerIcon>
        <MarkerContent>Synthesizing code components...</MarkerContent>
      </Marker>
    </VStack>
  ),
};
