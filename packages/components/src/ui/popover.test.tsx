import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const TRIGGER_TEXT = 'Open Popover';
const CONTENT_TEXT = 'Popover body content';

describe('Popover', () => {
  describe('UI', () => {
    it('should match snapshot when open', () => {
      const { asFragment } = render(
        <Popover open>
          <PopoverTrigger>{TRIGGER_TEXT}</PopoverTrigger>
          <PopoverContent>{CONTENT_TEXT}</PopoverContent>
        </Popover>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should open popover content when trigger is clicked', () => {
      render(
        <Popover>
          <PopoverTrigger>{TRIGGER_TEXT}</PopoverTrigger>
          <PopoverContent>{CONTENT_TEXT}</PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });
      expect(trigger).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
    });
  });
});
