# @vlrc-fe/components

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/components.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/components)
[![React 19](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![StyleX](https://img.shields.io/badge/Styling-Meta%20StyleX-purple.svg?style=flat-square)](https://stylexjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

Modern, performant, and accessible React UI component library for the **VLRC** platform. Built from the ground up with **React 19**, **Meta StyleX** (compile-time atomic CSS-in-JS), and **Radix UI** headless primitives.

---

## ✨ Features

- **🚀 Meta StyleX Engine**: Fully compile-time atomic CSS-in-JS. Zero runtime style injections, deterministic class resolution, and collision-free specificity.
- **🎨 Dynamic Multi-Theming**: Design tokens (`colors`, `radii`, `textColors`) map directly to CSS custom properties, providing seamless support for `light`, `dark`, `pink`, `lavender`, and custom themes.
- **♿ Accessible by Default**: Built on top of WAI-ARIA compliant Radix UI primitives with full keyboard navigation and screen-reader support.
- **📋 RHF-Integrated Form System**: Complete suite of form controls (`FormInput`, `FormSelect`, `FormMultiSelect`, `FormDatePicker`, `FormFileUpload`, `FormNumberInput`) unified under `FormBase` with automatic validation indicators.
- **📊 TanStack Table Data Grid**: Powerful `DataTable` component with preset selection, expander, and row actions column creators.
- **📦 Tree-Shakable & Typed**: Full ES Module and CommonJS support with TypeScript declaration source maps and granular subpath exports.

---

## 📦 Installation

```bash
pnpm add @vlrc-fe/components @stylexjs/stylex
pnpm add -D @stylexjs/unplugin
```

---

## ⚙️ Setup & Configuration

### 1. Configure Bundler Plugin (Vite Example)

Install and configure `@stylexjs/unplugin` in your `vite.config.ts`:

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

### 2. Import Atomic Stylesheet

Import the generated StyleX CSS layer in your application's entry file (`main.tsx` or `App.tsx`):

```ts
import '@vlrc-fe/components/stylex.css';
```

---

## 🎨 Design Tokens & Theming

Theme design tokens are available via `@vlrc-fe/components/theme`:

```ts
import { colors, radii, textColors } from '@vlrc-fe/components/theme';
```

### Supported CSS Variables
The component styles bind directly to your application's CSS variables:

| Token | CSS Variable | Description |
| :--- | :--- | :--- |
| `colors.primary` | `--primary` | Main brand and action color |
| `colors.background` | `--background` | Page and container background |
| `colors.foreground` | `--foreground` | Default text and content color |
| `colors.card` | `--card` | Card and surface background |
| `colors.border` | `--border` | Dividers and border outlines |
| `colors.destructive` | `--destructive` | Error states and destructive actions |
| `radii.md` | `--radius` | Base corner radius |

---

## 🧩 Component Usage Examples

### 1. UI Primitives (`Button`, `Card`, `Badge`)

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@vlrc-fe/components';

export function UserSummaryCard({ user }) {
  return (
    <Card variant="glass">
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>{user.name}</CardTitle>
          <Badge variant="secondary">Pro Member</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="default" size="sm">View Profile</Button>
      </CardContent>
    </Card>
  );
}
```

### 2. Custom Styling with `sx` Prop

All components accept an `sx?: stylex.StyleXStyles` prop for type-safe overrides without specificity bugs:

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

### 3. Integrated Form Controls (`react-hook-form`)

```tsx
import { useForm } from 'react-hook-form';
import {
  Form,
  FormInput,
  FormSelect,
  FormDatePicker,
  Button
} from '@vlrc-fe/components';

export function LessonForm() {
  const form = useForm({
    defaultValues: { title: '', level: 'A1', schedule: null },
  });

  const onSubmit = (data) => console.log('Saved:', data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        <FormDatePicker
          control={form.control}
          name="schedule"
          label="Start Date"
        />
        <Button type="submit">Create Lesson</Button>
      </form>
    </Form>
  );
}
```

### 4. Advanced DataTable

```tsx
import { useMemo } from 'react';
import {
  DataTable,
  createSelectionColumn,
  createRowActionsColumn,
  Button
} from '@vlrc-fe/components';

export function UserList({ users, isLoading }) {
  const columns = useMemo(() => [
    createSelectionColumn(),
    {
      accessorKey: 'name',
      header: 'Full Name',
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
    },
    createRowActionsColumn({
      renderActions: ({ row }) => (
        <Button variant="ghost" size="icon-sm" onClick={() => editUser(row.original.id)}>
          Edit
        </Button>
      ),
    }),
  ], []);

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

### 5. Unified Graphic Icons

```tsx
import { Icons } from '@vlrc-fe/components/Icons';

export function StatusIndicator() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Icons.CheckCircle2 style={{ color: 'green' }} />
      <span>All systems operational</span>
    </div>
  );
}
```

---

## 📁 Subpath Exports

| Export Path | Contents |
| :--- | :--- |
| `@vlrc-fe/components` | All UI primitives, form controls, and DataTable components |
| `@vlrc-fe/components/ui/*` | Granular primitive components (`button`, `dialog`, `badge`, etc.) |
| `@vlrc-fe/components/DataTable` | DataTable core and column creator utilities |
| `@vlrc-fe/components/Icons` | Centralized SVG Icons registry |
| `@vlrc-fe/components/theme` | Meta StyleX design tokens (`colors`, `radii`, `textColors`) |
| `@vlrc-fe/components/stylex.css` | Pre-compiled atomic CSS stylesheet with CSS layers |

---

## 🛠 Package Scripts

```bash
# Build package (Vite library mode + tsc declaration emission)
pnpm build

# Lint package codebase
pnpm lint
```

---

## 📖 Further Reading

- [CHANGELOG.md](./CHANGELOG.md): Detailed release notes and breaking change migration details.
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md): Step-by-step guide for migrating from Tailwind CSS to Meta StyleX.

---

## 📄 License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
