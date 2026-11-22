# @vlrc-fe/http

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/http.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/http)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../../LICENSE)

Standardized, type-safe HTTP client for the VLRC Frontend ecosystem powered by [ky](https://github.com/sindresorhus/ky).

## Features

- 🚀 **Pre-configured Ky Instance**: Includes automatic retries for transient errors (408, 413, 429, 500, 502, 503, 504) with exponential backoff.
- 🔐 **Dynamic Bearer Token Injection**: Easily inject auth tokens via `getAuthToken` callback before every request.
- ⚙️ **Configurable Timeout & Prefix**: Set `prefixUrl` and customized `timeout` (defaults to 30,000ms).
- 📦 **Re-exported Types**: Direct access to `KyOptions` and full TypeScript type inference.

## Installation

```bash
pnpm add @vlrc-fe/http
```

## Usage

### Default Client

```typescript
import { httpClient } from '@vlrc-fe/http';

interface User {
  id: string;
  name: string;
}

// Perform a GET request
const users = await httpClient.get('users').json<User[]>();

// Perform a POST request
const newUser = await httpClient.post('users', { json: { name: 'Alice' } }).json<User>();
```

### Custom Client Factory

```typescript
import { createHttpClient } from '@vlrc-fe/http';

export const apiClient = createHttpClient({
  prefixUrl: 'https://api.example.com/v1',
  timeout: 15000,
  getAuthToken: () => localStorage.getItem('token'),
});
```

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
