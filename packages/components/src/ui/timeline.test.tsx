import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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

const STEP_ONE_TITLE = 'Order Placed';
const STEP_TWO_TITLE = 'Processing Payment';
const STEP_THREE_TITLE = 'Delivered';
const STEP_ONE_TIME = '10:00 AM';
const STEP_TWO_TIME = '10:15 AM';
const STEP_THREE_TIME = '11:00 AM';
const STEP_DESCRIPTION = 'Details regarding this event status.';

describe('Timeline', () => {
  describe('UI', () => {
    it('should match snapshot in default vertical state', () => {
      const { asFragment } = render(
        <Timeline activeIndex={1}>
          <TimelineItem step={0}>
            <TimelineTrack>
              <TimelineDot />
              <TimelineConnector />
            </TimelineTrack>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{STEP_ONE_TITLE}</TimelineTitle>
                <TimelineTime>{STEP_ONE_TIME}</TimelineTime>
              </TimelineHeader>
              <TimelineDescription>{STEP_DESCRIPTION}</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem step={1} isLast>
            <TimelineTrack>
              <TimelineDot />
              <TimelineConnector />
            </TimelineTrack>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{STEP_TWO_TITLE}</TimelineTitle>
                <TimelineTime>{STEP_TWO_TIME}</TimelineTime>
              </TimelineHeader>
            </TimelineContent>
          </TimelineItem>
        </Timeline>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in horizontal state', () => {
      const { asFragment } = render(
        <Timeline orientation="horizontal" activeIndex={0}>
          <TimelineItem step={0}>
            <TimelineTrack>
              <TimelineDot />
              <TimelineConnector />
            </TimelineTrack>
            <TimelineContent>
              <TimelineTitle>{STEP_ONE_TITLE}</TimelineTitle>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem step={1} isLast>
            <TimelineTrack>
              <TimelineDot />
              <TimelineConnector />
            </TimelineTrack>
            <TimelineContent>
              <TimelineTitle>{STEP_TWO_TITLE}</TimelineTitle>
            </TimelineContent>
          </TimelineItem>
        </Timeline>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([['sm' as const], ['md' as const], ['lg' as const]])(
      'should match snapshot for dot size %s',
      (size) => {
        const { asFragment } = render(
          <Timeline>
            <TimelineItem step={0} isLast>
              <TimelineTrack>
                <TimelineDot size={size} status="completed" />
              </TimelineTrack>
              <TimelineContent>
                <TimelineTitle>{STEP_ONE_TITLE}</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>,
        );
        expect(asFragment()).toMatchSnapshot();
      },
    );
  });

  describe('Behavior', () => {
    it('should compute status correctly based on step and activeIndex', () => {
      render(
        <Timeline activeIndex={1}>
          <TimelineItem data-testid="step-0" step={0}>
            <TimelineTrack>
              <TimelineDot data-testid="dot-0" />
            </TimelineTrack>
          </TimelineItem>
          <TimelineItem data-testid="step-1" step={1}>
            <TimelineTrack>
              <TimelineDot data-testid="dot-1" />
            </TimelineTrack>
          </TimelineItem>
          <TimelineItem data-testid="step-2" step={2} isLast>
            <TimelineTrack>
              <TimelineDot data-testid="dot-2" />
            </TimelineTrack>
          </TimelineItem>
        </Timeline>,
      );

      const step0 = screen.getByTestId('step-0');
      const dot0 = screen.getByTestId('dot-0');
      expect(step0).toHaveAttribute('data-status', 'completed');
      expect(dot0).toHaveAttribute('data-status', 'completed');

      const step1 = screen.getByTestId('step-1');
      const dot1 = screen.getByTestId('dot-1');
      expect(step1).toHaveAttribute('data-status', 'active');
      expect(dot1).toHaveAttribute('data-status', 'active');

      const step2 = screen.getByTestId('step-2');
      const dot2 = screen.getByTestId('dot-2');
      expect(step2).toHaveAttribute('data-status', 'pending');
      expect(dot2).toHaveAttribute('data-status', 'pending');
    });

    it('should render custom icon inside dot when supplied', () => {
      render(
        <Timeline>
          <TimelineItem step={0} isLast>
            <TimelineTrack>
              <TimelineDot
                data-testid="dot"
                customIcon={<span data-testid="custom-icon">★</span>}
              />
            </TimelineTrack>
          </TimelineItem>
        </Timeline>,
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should respect explicit status override on TimelineItem', () => {
      render(
        <Timeline activeIndex={0}>
          <TimelineItem data-testid="item-override" step={0} status="pending" isLast>
            <TimelineTrack>
              <TimelineDot data-testid="dot-override" />
            </TimelineTrack>
          </TimelineItem>
        </Timeline>,
      );

      expect(screen.getByTestId('item-override')).toHaveAttribute('data-status', 'pending');
      expect(screen.getByTestId('dot-override')).toHaveAttribute('data-status', 'pending');
    });
  });
});
