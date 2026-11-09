import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '../layout';
import { Gauge } from './gauge';

const meta: Meta<typeof Gauge> = {
  title: 'Components/Feedback/Gauge',
  component: Gauge,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'destructive', 'secondary'],
    },
    showMinMax: { control: 'boolean' },
    showValue: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Gauge>;

export const Default: Story = {
  args: {
    value: 68,
    label: 'Efficiency',
    showMinMax: true,
  },
};

export const Variants: Story = {
  render: () => (
    <Flex align="center" gap="xl" wrap="wrap">
      <Gauge value={88} variant="success" label="Health Score" showMinMax />
      <Gauge value={62} variant="warning" label="Storage Used" showMinMax />
      <Gauge value={94} variant="destructive" label="CPU Load" showMinMax />
      <Gauge value={45} variant="primary" label="Progress" showMinMax />
    </Flex>
  ),
};

export const CustomFormatting: Story = {
  args: {
    value: 82,
    min: 0,
    max: 120,
    label: 'Network Speed',
    formatValue: (val) => `${val} Mbps`,
    showMinMax: true,
    variant: 'success',
  },
};
