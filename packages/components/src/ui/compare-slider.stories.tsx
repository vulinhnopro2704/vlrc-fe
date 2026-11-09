import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '../layout';
import { Text } from '../Typography';
import { CompareSlider } from './compare-slider';

const meta: Meta<typeof CompareSlider> = {
  title: 'Components/DataDisplay/CompareSlider',
  component: CompareSlider,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: { type: 'range', min: 0, max: 100 } },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    showLabels: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CompareSlider>;

export const Default: Story = {
  render: () => {
    const itemBefore = (
      <div
        style={{
          width: '100%',
          height: 280,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
      >
        Light Theme Version
      </div>
    );

    const itemAfter = (
      <div
        style={{
          width: '100%',
          height: 280,
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f9fafb',
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
      >
        Dark Theme Version
      </div>
    );

    return (
      <Flex vertical gap="sm" style={{ maxWidth: 600 }}>
        <CompareSlider
          itemOne={itemBefore}
          itemTwo={itemAfter}
          showLabels
          labelOne="Light Theme"
          labelTwo="Dark Theme"
        />
        <Text type="secondary" size="xs">
          Drag the handle or use arrow keys when focused.
        </Text>
      </Flex>
    );
  },
};
