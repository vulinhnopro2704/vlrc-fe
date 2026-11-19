import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Marker, MarkerIcon, MarkerContent } from './marker';
import type { MarkerProps, MarkerVariant, MarkerSize } from './marker';

// Test constants
const STATUS_MESSAGE = 'Optimization complete in 2.4s';
const STEP_HEADING = 'Planning Phase';
const ICON_LABEL = 'status-icon';

const createDefaultProps = (overrides?: Partial<MarkerProps>): MarkerProps => ({
  variant: 'default',
  size: 'default',
  ...overrides,
});

describe('Marker', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(
        <Marker {...createDefaultProps()}>
          <MarkerIcon>
            <span data-testid={ICON_LABEL}>✓</span>
          </MarkerIcon>
          <MarkerContent>{STATUS_MESSAGE}</MarkerContent>
        </Marker>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['default' as MarkerVariant],
      ['border' as MarkerVariant],
      ['separator' as MarkerVariant],
    ])('should match snapshot for %s variant', (variant) => {
      const { asFragment } = render(
        <Marker {...createDefaultProps({ variant })}>
          <MarkerIcon>
            <span data-testid={ICON_LABEL}>•</span>
          </MarkerIcon>
          <MarkerContent>{variant === 'separator' ? STEP_HEADING : STATUS_MESSAGE}</MarkerContent>
        </Marker>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([['sm' as MarkerSize], ['default' as MarkerSize], ['lg' as MarkerSize]])(
      'should match snapshot for %s size',
      (size) => {
        const { asFragment } = render(
          <Marker {...createDefaultProps({ size })}>
            <MarkerIcon>
              <span data-testid={ICON_LABEL}>•</span>
            </MarkerIcon>
            <MarkerContent>{STATUS_MESSAGE}</MarkerContent>
          </Marker>,
        );
        expect(asFragment()).toMatchSnapshot();
      },
    );
  });

  describe('Behavior', () => {
    it('should assign correct data attributes to slots', () => {
      render(
        <Marker variant="border" size="lg">
          <MarkerIcon>
            <span data-testid={ICON_LABEL}>!</span>
          </MarkerIcon>
          <MarkerContent>{STATUS_MESSAGE}</MarkerContent>
        </Marker>,
      );

      const marker = screen.getByText(STATUS_MESSAGE).closest('[data-slot="marker"]');
      expect(marker).toBeInTheDocument();
      expect(marker).toHaveAttribute('data-variant', 'border');
      expect(marker).toHaveAttribute('data-size', 'lg');

      const iconSlot = screen.getByTestId(ICON_LABEL).parentElement;
      expect(iconSlot).toHaveAttribute('data-slot', 'marker-icon');
      expect(iconSlot).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render left and right rules when variant is separator', () => {
      const { container } = render(
        <Marker variant="separator">
          <MarkerContent>{STEP_HEADING}</MarkerContent>
        </Marker>,
      );

      const leftRule = container.querySelector('[data-slot="marker-rule-left"]');
      const rightRule = container.querySelector('[data-slot="marker-rule-right"]');

      expect(leftRule).toBeInTheDocument();
      expect(rightRule).toBeInTheDocument();
      expect(leftRule).toHaveAttribute('aria-hidden', 'true');
      expect(rightRule).toHaveAttribute('aria-hidden', 'true');
    });

    it('should support custom className and element props', () => {
      const CUSTOM_CLASS = 'custom-marker-class';
      render(
        <Marker className={CUSTOM_CLASS} data-testid="custom-marker">
          <MarkerContent>{STATUS_MESSAGE}</MarkerContent>
        </Marker>,
      );

      const marker = screen.getByTestId('custom-marker');
      expect(marker.className).toContain(CUSTOM_CLASS);
    });
  });
});
