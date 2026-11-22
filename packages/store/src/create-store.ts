import { create, type StateCreator } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
};

export interface CreateStoreOptions<T> {
  name?: string;
  persist?: (keyof T)[];
  storage?: Storage;
}

export const createStore = <T extends object>(options?: CreateStoreOptions<T>) => {
  return (initializer: StateCreator<T>) => {
    let storeCreator = initializer;

    if (options?.name) {
      if (options?.persist && options.persist.length > 0) {
        storeCreator = persist(storeCreator, {
          name: options.name,
          storage: createJSONStorage(
            () =>
              options.storage ||
              (typeof window !== 'undefined' ? window.localStorage : noopStorage),
          ),
          partialize: (state) => {
            const persistedEntries = options.persist!.map((key) => [key, state[key]]);
            return Object.fromEntries(persistedEntries) as Partial<T>;
          },
        }) as unknown as StateCreator<T>;
      }

      storeCreator = devtools(storeCreator, {
        name: options.name,
      }) as unknown as StateCreator<T>;
    }

    return create<T>()(storeCreator);
  };
};
