# @vlrc-fe/types

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/types.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/types)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../../LICENSE)

Common TypeScript definitions, models, HTTP pagination contracts, and enums for the VLRC Frontend ecosystem.

## Features

- 🏗️ **Base Entities**: Standardized `TypeBase` with `id`, `createdAt`, `updatedAt`, `deletedAt`, as well as `Employee` and `Project` domain models.
- 📡 **HTTP Contracts**: Standardized pagination interfaces (`ListItem<T>`, `ListItemRequestParams`) and structured API error responses (`ResponseError`).
- 🎨 **UI Models**: Common types for dialogs (`ModalProps`) and option pickers (`SelectItem<T>`).
- 🏷️ **Standard Enums**: Centralized enums including `ActivityStatusEnum`, `ManagementToolEnum`, `RefFileTypeEnum`, and `ProjectStageEnum`.

## Installation

```bash
pnpm add @vlrc-fe/types
```

## Usage

```typescript
import type { TypeBase, ListItem, SelectItem, ResponseError } from '@vlrc-fe/types';
import { ActivityStatusEnum, ManagementToolEnum } from '@vlrc-fe/types';

interface Task extends TypeBase {
  title: string;
  status: ActivityStatusEnum;
}

export type TaskListResponse = ListItem<Task>;

export const toolOptions: SelectItem<ManagementToolEnum>[] = [
  { label: 'Planix', value: ManagementToolEnum.PLANIX },
  { label: 'Jira', value: ManagementToolEnum.JIRA },
];
```

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
