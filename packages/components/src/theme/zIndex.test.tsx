import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Z_INDEX_LAYERS, ZIndexProvider, useZIndex } from './zIndex';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

function TestConsumer({
  layer,
  step,
  testId = 'consumer',
}: {
  layer: keyof typeof Z_INDEX_LAYERS | number;
  step?: number;
  testId?: string;
}) {
  const zIndex = useZIndex(layer, step);
  return (
    <div data-testid={testId} data-zindex={zIndex}>
      {zIndex}
    </div>
  );
}

const MODAL_TRIGGER = 'Open Dialog';
const MODAL_CONTENT = 'Dialog Body Content';
const POPOVER_TRIGGER = 'Open Popover';
const POPOVER_CONTENT = 'Popover Body Content';

describe('zIndex', () => {
  describe('Behavior', () => {
    it('should return default layer z-index when outside ZIndexProvider', () => {
      render(<TestConsumer layer="popover" />);
      const consumer = screen.getByTestId('consumer');
      expect(consumer).toHaveAttribute('data-zindex', String(Z_INDEX_LAYERS.popover));
    });

    it('should return numeric fallback when layer is a number', () => {
      const CUSTOM_Z_INDEX = 1234;
      render(<TestConsumer layer={CUSTOM_Z_INDEX} />);
      const consumer = screen.getByTestId('consumer');
      expect(consumer).toHaveAttribute('data-zindex', String(CUSTOM_Z_INDEX));
    });

    it('should respect custom step offset', () => {
      const STEP_OFFSET = 5;
      render(<TestConsumer layer="popover" step={STEP_OFFSET} />);
      const consumer = screen.getByTestId('consumer');
      expect(consumer).toHaveAttribute('data-zindex', String(Z_INDEX_LAYERS.popover + STEP_OFFSET));
    });

    it('should inherit context z-index from ZIndexProvider', () => {
      const CONTEXT_VALUE = 750;
      render(
        <ZIndexProvider value={CONTEXT_VALUE}>
          <TestConsumer layer="popover" />
        </ZIndexProvider>,
      );
      const consumer = screen.getByTestId('consumer');
      expect(consumer).toHaveAttribute('data-zindex', String(CONTEXT_VALUE));
    });

    it('should handle nested ZIndexProviders with progressive increments', () => {
      const ROOT_LEVEL = 1000;
      const CHILD_LEVEL = 1010;

      render(
        <ZIndexProvider value={ROOT_LEVEL}>
          <TestConsumer layer="popover" testId="root-consumer" />
          <ZIndexProvider value={CHILD_LEVEL}>
            <TestConsumer layer="popover" testId="child-consumer" />
          </ZIndexProvider>
        </ZIndexProvider>,
      );

      expect(screen.getByTestId('root-consumer')).toHaveAttribute(
        'data-zindex',
        String(ROOT_LEVEL),
      );
      expect(screen.getByTestId('child-consumer')).toHaveAttribute(
        'data-zindex',
        String(CHILD_LEVEL),
      );
    });

    it('should automatically give Popover higher z-index when rendered inside Dialog', () => {
      const { container } = render(
        <Dialog open>
          <DialogTrigger>{MODAL_TRIGGER}</DialogTrigger>
          <DialogContent>
            <div>{MODAL_CONTENT}</div>
            <Popover open>
              <PopoverTrigger>{POPOVER_TRIGGER}</PopoverTrigger>
              <PopoverContent>{POPOVER_CONTENT}</PopoverContent>
            </Popover>
          </DialogContent>
        </Dialog>,
      );

      const dialogContent = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;
      expect(dialogContent).toBeInTheDocument();

      const popoverContent = document.querySelector('[data-slot="popover-content"]') as HTMLElement;
      expect(popoverContent).toBeInTheDocument();

      const popperWrapper = document.querySelector(
        '[data-radix-popper-content-wrapper]',
      ) as HTMLElement;
      expect(popperWrapper).toBeInTheDocument();

      const dialogZIndex = Number(window.getComputedStyle(dialogContent).zIndex);
      const popoverZIndex = Number(window.getComputedStyle(popoverContent).zIndex);
      const popperWrapperZIndex = Number(window.getComputedStyle(popperWrapper).zIndex);

      // Popover and its popper wrapper inside modal MUST strictly stack above the dialog content!
      expect(popoverZIndex).toBeGreaterThan(dialogZIndex);
      expect(popperWrapperZIndex).toBeGreaterThan(dialogZIndex);
    });

    it('should correctly stack nested Dialogs with higher z-index for inner dialog', () => {
      render(
        <Dialog open>
          <DialogContent>
            <div data-testid="outer-dialog">Outer Dialog</div>
            <Dialog open>
              <DialogContent>
                <div data-testid="inner-dialog">Inner Dialog</div>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>,
      );

      const dialogContents = document.querySelectorAll('[data-slot="dialog-content"]');
      expect(dialogContents).toHaveLength(2);

      const outerZIndex = Number(window.getComputedStyle(dialogContents[0]).zIndex);
      const innerZIndex = Number(window.getComputedStyle(dialogContents[1]).zIndex);

      // Inner dialog MUST stack strictly above the outer dialog
      expect(innerZIndex).toBeGreaterThan(outerZIndex);
    });
  });
});
