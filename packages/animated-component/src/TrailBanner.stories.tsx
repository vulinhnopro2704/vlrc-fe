import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoxMascot } from './FoxMascot';
import { TrailBanner } from './TrailBanner';

const meta = {
  title: 'Animated/TrailBanner',
  component: TrailBanner,
  args: { title: 'Forest trail', artwork: new URL('./fox/friend.webp', import.meta.url).href },
} satisfies Meta<typeof TrailBanner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithCompanion: Story = {
  args: { detail: 'Follow the trail.', companion: <FoxMascot label="Pet Fox" happy /> },
};
