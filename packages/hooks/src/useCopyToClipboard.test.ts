import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCopyToClipboard } from './useCopyToClipboard';

const TEST_TEXT = 'https://vlrc.example.com/share/token123';
const DEFAULT_TIMEOUT = 2000;

describe('useCopyToClipboard', () => {
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

  it('should initialize with copied = false', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
  });

  it('should copy text successfully and reset after timeout', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useCopyToClipboard({ timeout: DEFAULT_TIMEOUT, onSuccess }),
    );

    let success = false;
    await act(async () => {
      success = await result.current.copy(TEST_TEXT);
    });

    expect(success).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(TEST_TEXT);
    expect(result.current.copied).toBe(true);
    expect(onSuccess).toHaveBeenCalledWith(TEST_TEXT);

    // Fast-forward timer past timeout
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should handle clipboard error gracefully and trigger onError', async () => {
    const errorMock = new Error('Permission denied');
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(errorMock);

    const onError = vi.fn();
    const { result } = renderHook(() => useCopyToClipboard({ onError }));

    let success = false;
    await act(async () => {
      success = await result.current.copy(TEST_TEXT);
    });

    expect(success).toBe(false);
    expect(result.current.copied).toBe(false);
    expect(onError).toHaveBeenCalledWith(errorMock);
  });

  it('should manually reset copied state when reset is called', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy(TEST_TEXT);
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      result.current.reset();
    });
    expect(result.current.copied).toBe(false);
  });
});
