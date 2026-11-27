import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoxMascot } from './FoxMascot';

const meta = {
  title: 'Animated/FoxMascot',
  component: FoxMascot,
  args: { label: 'Pet the fox' },
} satisfies Meta<typeof FoxMascot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Happy: Story = { args: { happy: true } };
export const Small: Story = { args: { size: 'small' } };
