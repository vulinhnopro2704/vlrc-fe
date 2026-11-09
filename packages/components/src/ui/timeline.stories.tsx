import type { Meta, StoryObj } from '@storybook/react';
import {
  Timeline,
  TimelineItem,
  TimelineTrack,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from './timeline';
import { Flex } from './flex';

const meta: Meta<typeof Timeline> = {
  title: 'UI/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    activeIndex: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => (
    <Timeline activeIndex={1} style={{ maxWidth: 500 }}>
      <TimelineItem step={0}>
        <TimelineTrack>
          <TimelineDot />
          <TimelineConnector />
        </TimelineTrack>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Order Received</TimelineTitle>
            <TimelineTime>09:20 AM</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Your order #VLRC-9821 has been placed successfully.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem step={1}>
        <TimelineTrack>
          <TimelineDot />
          <TimelineConnector />
        </TimelineTrack>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Warehouse Processing</TimelineTitle>
            <TimelineTime>10:45 AM</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Items are being picked and packed at the central hub.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem step={2} isLast>
        <TimelineTrack>
          <TimelineDot />
          <TimelineConnector />
        </TimelineTrack>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Out for Delivery</TimelineTitle>
            <TimelineTime>Estimated 03:00 PM</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Package is on its way with the local courier driver.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Timeline orientation="horizontal" activeIndex={1} style={{ width: '100%', maxWidth: 700 }}>
      <TimelineItem step={0}>
        <TimelineTrack>
          <TimelineDot />
          <TimelineConnector />
        </TimelineTrack>
        <TimelineContent>
          <TimelineTitle>Initiated</TimelineTitle>
          <TimelineDescription>Step 1</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem step={1}>
        <TimelineTrack>
          <TimelineDot />
          <TimelineConnector />
        </TimelineTrack>
        <TimelineContent>
          <TimelineTitle>In Progress</TimelineTitle>
          <TimelineDescription>Step 2</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem step={2} isLast>
        <TimelineTrack>
          <TimelineDot />
          <TimelineConnector />
        </TimelineTrack>
        <TimelineContent>
          <TimelineTitle>Completed</TimelineTitle>
          <TimelineDescription>Step 3</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};
