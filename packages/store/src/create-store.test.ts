import { describe, it, expect } from 'vitest';
import { createStore } from './create-store';
import { generateSelectors } from './selectors';

interface TestState {
  count: number;
  name: string;
  inc: () => void;
}

describe('Store', () => {
  describe('Behavior', () => {
    it('should create a standard store with state and actions', () => {
      const useStore = createStore<TestState>()((set) => ({
        count: 0,
        name: 'test',
        inc: () => set((state) => ({ count: state.count + 1 })),
      }));

      expect(useStore.getState().count).toBe(0);
      useStore.getState().inc();
      expect(useStore.getState().count).toBe(1);
    });

    it('should support persistence and devtools without throw in SSR/noop environment', () => {
      const useStore = createStore<TestState>({
        name: 'persisted-test',
        persist: ['count'],
      })((set) => ({
        count: 10,
        name: 'ssr-safe',
        inc: () => set((state) => ({ count: state.count + 1 })),
      }));

      expect(useStore.getState().count).toBe(10);
    });

    it('should generate automatic selectors for state properties', () => {
      const useStore = generateSelectors(
        createStore<TestState>()((set) => ({
          count: 42,
          name: 'selected',
          inc: () => set((state) => ({ count: state.count + 1 })),
        })),
      );

      expect(typeof useStore.use.count).toBe('function');
      expect(typeof useStore.use.name).toBe('function');
    });
  });
});
