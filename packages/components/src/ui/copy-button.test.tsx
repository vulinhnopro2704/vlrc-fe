import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CopyButton } from './copy-button';

const COPY_VALUE = 'https://vlrc.example.com/api/v1/resource';
const TIMEOUT_MS = 2000;
const CUSTOM_LABEL_COPY = 'Sao chép';
const CUSTOM_LABEL_COPIED = 'Đã sao chép';

describe('CopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<CopyButton value={COPY_VALUE} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with showLabel enabled', () => {
      const { asFragment } = render(
        <CopyButton
          value={COPY_VALUE}
          showLabel
          copyLabel={CUSTOM_LABEL_COPY}
          copiedLabel={CUSTOM_LABEL_COPIED}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should write text to clipboard and switch to check icon on click', async () => {
      const onCopy = vi.fn();
      render(
        <CopyButton
          value={COPY_VALUE}
          timeout={TIMEOUT_MS}
          onCopy={onCopy}
          showLabel
          copyLabel={CUSTOM_LABEL_COPY}
          copiedLabel={CUSTOM_LABEL_COPIED}
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-copied', 'false');
      expect(screen.getByText(CUSTOM_LABEL_COPY)).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(button);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(COPY_VALUE);
      expect(onCopy).toHaveBeenCalledWith(COPY_VALUE);
      expect(button).toHaveAttribute('data-copied', 'true');
      expect(screen.getByText(CUSTOM_LABEL_COPIED)).toBeInTheDocument();

      // Advance timers past timeout to reset
      act(() => {
        vi.advanceTimersByTime(TIMEOUT_MS);
      });

      expect(button).toHaveAttribute('data-copied', 'false');
      expect(screen.getByText(CUSTOM_LABEL_COPY)).toBeInTheDocument();
    });
  });
});
