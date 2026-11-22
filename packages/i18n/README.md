# @vlrc-fe/i18n

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/i18n.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/i18n)
[![React 19](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../../LICENSE)

Standardized i18next instance factory and react-i18next re-exports for the VLRC Frontend ecosystem.

## Features

- 🌐 **Standardized Instance Factory**: Creates clean, isolated `i18n` instances with `react-i18next` integration.
- 🔄 **Flat & Multi-Namespace Support**: Full support for single and multiple namespace configurations with flexible fallback languages.
- 📦 **Re-exported Hooks & Components**: Direct access to `useTranslation`, `Trans`, and `I18nInstance` types without extra dependencies.

## Installation

```bash
pnpm add @vlrc-fe/i18n
```

### Peer Dependencies

```bash
pnpm add react react-dom
```

## Usage

### 1. Initialize i18n Instance

```typescript
import { createI18nInstance } from '@vlrc-fe/i18n';

const resources = {
  en: {
    common: {
      welcome: 'Welcome, {{name}}!',
      save: 'Save',
    },
  },
  vi: {
    common: {
      welcome: 'Xin chào, {{name}}!',
      save: 'Lưu',
    },
  },
};

export const i18n = createI18nInstance({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
});
```

### 2. Translate in React Components

```tsx
import { useTranslation, Trans } from '@vlrc-fe/i18n';

export function WelcomeBadge({ username }: { username: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome', { name: username })}</h1>
      <button>{t('save')}</button>
    </div>
  );
}
```

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
