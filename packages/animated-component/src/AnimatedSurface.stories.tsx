import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Text } from '@vlrc-fe/components';
import { GlassSurface } from './GlassSurface';
import { SlideIn } from './SlideIn';

const meta = {
  title: 'Animated/SlideIn',
  component: SlideIn,
  args: {
    children: (
      <GlassSurface>
        <Box p="md">
          <Text>Work item details</Text>
        </Box>
      </GlassSurface>
    ),
  },
} satisfies Meta<typeof SlideIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FromBottom: Story = { args: { from: 'bottom' } };
