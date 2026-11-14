# DataTable (TanStack Table + Astryx) Composition Reference

The `DataTable` component from `@vlrc-fe/components` is an enterprise data grid built on top of **Astryx table foundations** and **TanStack Table v8**. It unifies pagination, row selection, row actions, expandable rows, faceted filtering, and loading states into a declarative, token-driven API.

---

## 1. DataTable API Reference

| Prop                | Type             | Default         | Description                                                        |
| :------------------ | :--------------- | :-------------- | :----------------------------------------------------------------- |
| `columns`           | `ColumnDef<T>[]` | -               | **(Required)** Column definitions following TanStack Table schema. |
| `data`              | `T[]`            | -               | **(Required)** Row data array.                                     |
| `isLoading`         | `boolean`        | `false`         | Renders a centralized dynamic loader overlay when active.          |
| `pageSize`          | `number`         | `10`            | Default quantity of rows displayed per pagination page.            |
| `searchPlaceholder` | `string`         | `'Tìm kiếm...'` | Descriptive text inside the filter search bar.                     |
| `searchKey`         | `string`         | -               | The column key used for search filtering.                          |
| `sx`                | `StyleXStyles`   | -               | StyleX overrides.                                                  |

---

## 2. Standard Column Creation Helpers

To maintain design consistency and avoid boilerplate, use these pre-packaged column helpers:

### 2.1 Selection Checkbox Column

- **Helper**: `createSelectionColumn<T>()`
- **Output**: Returns a `ColumnDef<T>` rendering a header-level and row-level selection checkbox with design-token focus rings.

### 2.2 Expandable Row Trigger

- **Helper**: `createExpanderColumn<T>()`
- **Output**: Returns a `ColumnDef<T>` rendering a caret button that toggles nested child row visibility.

### 2.3 Row Actions Column

- **Helper**: `createRowActionsColumn<T>({ renderActions })`
- **Arguments**:
  - `renderActions`: `(helpers: { row: Row<T> }) => ReactNode` - Function to display action buttons (edit, delete, view).

---

## 3. Fully Integrated Query-Bound DataTable Example

This example demonstrates how to connect `DataTable` with typed columns, layout primitives, and Astryx tokens:

```tsx
import * as stylex from '@stylexjs/stylex';
import type { ColumnDef } from '@tanstack/react-table';
import {
  DataTable,
  Badge,
  Text,
  HStack,
  Button,
  Icons,
  createSelectionColumn,
  createRowActionsColumn,
} from '@vlrc-fe/components';
import { colors, spacing } from '@vlrc-fe/components/theme';

interface CourseRow {
  id: number;
  title: string;
  order: number;
  wordCount: number;
  isActive: boolean;
}

const styles = stylex.create({
  titleText: {
    fontWeight: 600,
    color: colors.foreground,
  },
  actionStack: {
    gap: spacing.xs,
  },
});

export function CourseTable({
  courses,
  isLoading,
  onEdit,
  onDelete,
}: {
  courses: CourseRow[];
  isLoading: boolean;
  onEdit: (course: CourseRow) => void;
  onDelete: (course: CourseRow) => void;
}) {
  const columns: ColumnDef<CourseRow>[] = [
    createSelectionColumn<CourseRow>(),
    {
      accessorKey: 'title',
      header: 'Tiêu đề khóa học',
      cell: ({ row }) => <Text sx={styles.titleText}>{row.original.title}</Text>,
    },
    {
      accessorKey: 'wordCount',
      header: 'Số từ',
      cell: ({ row }) => <Text type="secondary">{row.original.wordCount}</Text>,
    },
    {
      accessorKey: 'isActive',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Đang hoạt động' : 'Bản nháp'}
        </Badge>
      ),
    },
    createRowActionsColumn<CourseRow>({
      renderActions: ({ row }) => (
        <HStack sx={styles.actionStack}>
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
            <Icons.Edit />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.original)}>
            <Icons.Trash />
          </Button>
        </HStack>
      ),
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={courses}
      isLoading={isLoading}
      searchKey="title"
      searchPlaceholder="Tìm kiếm theo tiêu đề..."
    />
  );
}
```
