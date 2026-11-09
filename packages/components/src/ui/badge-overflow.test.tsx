import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BadgeOverflow } from './badge-overflow';

const TAG_1 = 'Frontend';
const TAG_2 = 'Backend';
const TAG_3 = 'DevOps';
const TAG_4 = 'Database';
const TAG_5 = 'Security';
const ALL_TAGS = [TAG_1, TAG_2, TAG_3, TAG_4, TAG_5];
const OVERFLOW_LABEL = '+2';

describe('BadgeOverflow', () => {
  describe('UI', () => {
    it('should match snapshot with default max of 3 items', () => {
      const { asFragment } = render(<BadgeOverflow items={ALL_TAGS} max={3} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when items do not exceed max', () => {
      const { asFragment } = render(<BadgeOverflow items={[TAG_1, TAG_2]} max={3} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with showPopover disabled', () => {
      const { asFragment } = render(<BadgeOverflow items={ALL_TAGS} max={3} showPopover={false} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should show correct visible items and overflow badge count', () => {
      render(<BadgeOverflow items={ALL_TAGS} max={3} />);

      expect(screen.getByText(TAG_1)).toBeInTheDocument();
      expect(screen.getByText(TAG_2)).toBeInTheDocument();
      expect(screen.getByText(TAG_3)).toBeInTheDocument();
      expect(screen.queryByText(TAG_4)).not.toBeInTheDocument();
      expect(screen.queryByText(TAG_5)).not.toBeInTheDocument();
      expect(screen.getByText(OVERFLOW_LABEL)).toBeInTheDocument();
    });

    it('should open popover displaying hidden items on overflow badge click', () => {
      render(<BadgeOverflow items={ALL_TAGS} max={3} showPopover />);

      const trigger = screen.getByText(OVERFLOW_LABEL);
      fireEvent.click(trigger);

      expect(screen.getByText(TAG_4)).toBeInTheDocument();
      expect(screen.getByText(TAG_5)).toBeInTheDocument();
    });
  });
});
