# @vlrc-fe/components

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/components.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/components)
[![React 19](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![StyleX](https://img.shields.io/badge/Styling-Meta%20StyleX-purple.svg?style=flat-square)](https://stylexjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../../LICENSE)

Accessible, performant React UI component library built with **Meta StyleX**, **Radix UI**, and **React Hook Form**. Ships compile-time atomic CSS with zero runtime style injection.

- **npm**: [npmjs.com/package/@vlrc-fe/components](https://www.npmjs.com/package/@vlrc-fe/components)

---

## Features

- **Meta StyleX** — compile-time atomic CSS-in-JS with deterministic specificity and zero runtime cost
- **Dynamic Theming** — design tokens (`colors`, `radii`, `textColors`) mapped to CSS custom properties, supporting light, dark, and custom themes
- **Accessible by Default** — built on WAI-ARIA compliant Radix UI primitives with keyboard navigation and screen reader support
- **Form System** — complete suite of form controls (`FormInput`, `FormSelect`, `FormMultiSelect`, `FormDatePicker`, `FormFileUpload`, `FormNumberInput`) integrated with React Hook Form
- **Data Table** — powerful `DataTable` component with selection, expander, and row actions column helpers via TanStack Table
- **Tree-Shakable** — full ESM and CJS support with TypeScript declaration maps and granular subpath exports

---

## Installation

```bash
pnpm add @vlrc-fe/components @stylexjs/stylex
pnpm add -D @stylexjs/unplugin
```

---

## Setup

### 1. Configure Bundler Plugin (Vite)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      dev: process.env.NODE_ENV === 'development',
      runtimeInjection: false,
    }),
    react(),
  ],
});
```

### 2. Import Stylesheet

Import the compiled StyleX CSS in your entry file:

```ts
import '@vlrc-fe/components/stylex.css';
```

---

## Design Tokens

Theme tokens are available via `@vlrc-fe/components/theme`:

```ts
import { colors, radii, textColors } from '@vlrc-fe/components/theme';
```

| Token                | CSS Variable    | Description                   |
| :------------------- | :-------------- | :---------------------------- |
| `colors.primary`     | `--primary`     | Brand and action color        |
| `colors.background`  | `--background`  | Page background               |
| `colors.foreground`  | `--foreground`  | Default text color            |
| `colors.card`        | `--card`        | Card surface background       |
| `colors.border`      | `--border`      | Dividers and borders          |
| `colors.destructive` | `--destructive` | Error and destructive actions |
| `radii.md`           | `--radius`      | Base corner radius            |

---

## Usage Examples

### UI Primitives

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@vlrc-fe/components';

const styles = stylex.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export function UserSummaryCard({ user }) {
  return (
    <Card variant="glass">
      <CardHeader>
        <div {...stylex.props(styles.header)}>
          <CardTitle>{user.name}</CardTitle>
          <Badge variant="secondary">Pro Member</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="default" size="sm">
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Custom Styling with `sx` Prop

All components accept `sx?: stylex.StyleXStyles` for type-safe overrides:

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button } from '@vlrc-fe/components';

const styles = stylex.create({
  fullWidth: {
    width: '100%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
});

export function CheckoutButton() {
  return <Button sx={styles.fullWidth}>Proceed to Payment</Button>;
}
```

### Form Controls (React Hook Form)

```tsx
import * as stylex from '@stylexjs/stylex';
import { useForm } from 'react-hook-form';
import { Form, FormInput, FormSelect, FormDatePicker, Button } from '@vlrc-fe/components';

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
});

export function LessonForm() {
  const form = useForm({
    defaultValues: { title: '', level: 'A1', schedule: null },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} {...stylex.props(styles.form)}>
        <FormInput
          control={form.control}
          name="title"
          label="Lesson Title"
          placeholder="e.g. Daily Vocabulary"
          rules={{ required: 'Title is required' }}
        />
        <FormSelect
          control={form.control}
          name="level"
          label="Proficiency Level"
          options={[
            { value: 'A1', label: 'Beginner (A1)' },
            { value: 'B2', label: 'Upper Intermediate (B2)' },
          ]}
        />
        <FormDatePicker control={form.control} name="schedule" label="Start Date" />
        <Button type="submit">Create Lesson</Button>
      </form>
    </Form>
  );
}
```

### DataTable

```tsx
import { useMemo } from 'react';
import {
  DataTable,
  createSelectionColumn,
  createRowActionsColumn,
  Button,
} from '@vlrc-fe/components';

export function UserList({ users, isLoading }) {
  const columns = useMemo(
    () => [
      createSelectionColumn(),
      { accessorKey: 'name', header: 'Full Name' },
      { accessorKey: 'email', header: 'Email Address' },
      createRowActionsColumn({
        renderActions: ({ row }) => (
          <Button variant="ghost" size="icon-sm" onClick={() => editUser(row.original.id)}>
            Edit
          </Button>
        ),
      }),
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      searchKey="name"
      searchPlaceholder="Filter users..."
      pageSize={10}
    />
  );
}
```

### Icons

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icons } from '@vlrc-fe/components/Icons';

const styles = stylex.create({
  status: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
});

export function StatusIndicator() {
  return (
    <div {...stylex.props(styles.status)}>
      <Icons.CheckCircle2 style={{ color: 'green' }} />
      <span>All systems operational</span>
    </div>
  );
}
```

---

## Subpath Exports

| Export Path                      | Contents                                        |
| :------------------------------- | :---------------------------------------------- |
| `@vlrc-fe/components`            | All UI primitives, form controls, and DataTable |
| `@vlrc-fe/components/ui/*`       | Granular primitive components                   |
| `@vlrc-fe/components/DataTable`  | DataTable core and column utilities             |
| `@vlrc-fe/components/Icons`      | Centralized SVG icon registry                   |
| `@vlrc-fe/components/theme`      | StyleX design tokens                            |
| `@vlrc-fe/components/stylex.css` | Pre-compiled atomic CSS stylesheet              |

---

## Scripts

```bash
pnpm build   # Vite library build + tsc declarations
pnpm lint    # Oxlint
pnpm format  # Oxfmt
```

---

## License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
