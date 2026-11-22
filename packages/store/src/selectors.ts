import type { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const generateSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
): WithSelectors<S> => {
  const store = _store as WithSelectors<S>;
  const selectors: Record<string, () => unknown> = {};

  for (const k of Object.keys(store.getState())) {
    selectors[k] = () => store((s) => (s as Record<string, unknown>)[k]);
  }

  store.use = selectors as WithSelectors<S>['use'];
  return store;
};
