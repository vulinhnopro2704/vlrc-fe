import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useModalState } from './useModalState';

const MODAL_KEYS = ['login', 'register'] as const;
const DESTROY_DELAY_MS = 200;

describe('useModalState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Behavior', () => {
    it('should initialize with closed and unloaded states', () => {
      const { result } = renderHook(() => useModalState(MODAL_KEYS));

      expect(result.current.modal.login).toEqual({ load: false, open: false });
      expect(result.current.modal.register).toEqual({ load: false, open: false });
    });

    it('should open modal and set load and open to true', () => {
      const { result } = renderHook(() => useModalState(MODAL_KEYS));

      act(() => {
        result.current.openModal('login');
      });

      expect(result.current.modal.login).toEqual({ load: true, open: true });
    });

    it('should close modal immediately and unload after delay', () => {
      const { result } = renderHook(() =>
        useModalState(MODAL_KEYS, { destroyDelay: DESTROY_DELAY_MS })
      );

      act(() => {
        result.current.openModal('login');
      });
      expect(result.current.modal.login).toEqual({ load: true, open: true });

      act(() => {
        result.current.closeModal('login');
      });
      expect(result.current.modal.login.open).toBe(false);
      expect(result.current.modal.login.load).toBe(true);

      act(() => {
        vi.advanceTimersByTime(DESTROY_DELAY_MS);
      });
      expect(result.current.modal.login.load).toBe(false);
    });
  });
});
