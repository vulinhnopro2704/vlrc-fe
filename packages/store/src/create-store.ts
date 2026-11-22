import { create, type StateCreator } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

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
              (typeof window !== 'undefined' ? window.localStorage : ({} as Storage)),
          ),
          partialize: (state) => {
            const persistedEntries = options.persist!.map((key) => [key, state[key]]);
            return Object.fromEntries(persistedEntries) as Partial<T>;
          },
        }) as any;
      }

      storeCreator = devtools(storeCreator, { name: options.name }) as any;
    }

    return create<T>()(storeCreator);
  };
};
