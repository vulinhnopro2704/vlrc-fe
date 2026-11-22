# @vlrc-fe/store

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/store.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/store)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../../LICENSE)

Enterprise Zustand v5 store wrapper with automated selector generation, SSR-safe partial persistence, and devtools integration.

## Features

- ⚡ **Auto-generated Selectors**: Automatically creates type-safe `.use.<key>()` selectors with zero boilerplate, preventing unnecessary component re-renders.
- 💾 **Safe Partial Persistence**: Easily specify which state slices to persist to `localStorage` or custom storage with automatic SSR fallbacks.
- 🛠️ **Devtools Support**: Integrates out-of-the-box with Redux DevTools for time-travel debugging.
- 🔒 **Type-Safe**: Complete TypeScript strict mode compliance and re-exported Zustand types (`StateCreator`, `StoreApi`, `UseBoundStore`).

## Installation

```bash
pnpm add @vlrc-fe/store zustand
```

## Usage

### 1. Define and Create a Store

```typescript
import { createStore, generateSelectors } from '@vlrc-fe/store';

interface UserState {
  name: string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUserStore = generateSelectors(
  createStore<UserState>({
    name: 'user-store',
    persist: ['theme'], // Only persist the 'theme' field
  })((set) => ({
    name: 'Alex',
    theme: 'light',
    setTheme: (theme) => set({ theme }),
  })),
);
```

### 2. Fine-grained React Subscriptions

```tsx
export function ThemeToggle() {
  // Only re-renders when `theme` changes, NOT when `name` changes!
  const theme = useUserStore.use.theme();
  const setTheme = useUserStore.use.setTheme();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current Theme: {theme}
    </button>
  );
}
```

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
