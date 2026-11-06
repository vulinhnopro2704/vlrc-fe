# DataTable (Shadcn + TanStack Table) Composition Reference

The `DataTable` component from `@vlrc-fe/components` is a high-level wrapper built on top of **Shadcn UI** table primitives and **TanStack Table v8**. It unifies pagination, row selection, row actions, expandable rows, search filtering, and loading states into a highly declarative API.

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

---

## 2. Standard Column Creation Helpers

To maintain design systems and avoid boilerplate, use these pre-packaged column helpers:

### 2.1 selection checkbox column

- **Helper**: `createSelectionColumn<T>()`
- **Output**: Returns a `ColumnDef<T>` rendering a header-level and row-level selection checkbox.

### 2.2 Expandable Row Trigger

- **Helper**: `createExpanderColumn<T>()`
- **Output**: Returns a `ColumnDef<T>` rendering a caret button that toggles nested child row visibility.

### 2.3 Row Actions Column

- **Helper**: `createRowActionsColumn<T>({ renderActions })`
- **Arguments**:
  - `renderActions`: `(helpers: { row: Row<T> }) => ReactNode` - Function to display interactive buttons (edit, delete, etc.).

---

## 3. Fully Integrated Query-Bound DataTable Example

This copy-pasteable example shows how to connect `DataTable` with a TanStack Query hook, define typed columns, and render custom row action controls safely.

```tsx
import * as stylex from '@stylexjs/stylex';
import type { ColumnDef } from '@tanstack/react-table';

interface CourseRow {
  id: number;
  title: string;
  order: number;
  wordCount: number;
  isActive: boolean;
}

const styles = stylex.create({
  cellBold: {
    fontWeight: 600,
    color: 'var(--foreground)',
  },
  cellMuted: {
    color: 'var(--muted-foreground)',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: 'rgb(22, 101, 52)',
  },
  statusDraft: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    color: 'rgb(113, 63, 18)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  container: {
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    backgroundColor: 'var(--card)',
    padding: '1rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
});

const CourseTableSection = () => {
  const { t } = useTranslation();

  const coursesQuery = useCoursesQuery({ take: 50 });
  const data = coursesQuery.data?.data ?? [];

  const columns = useMemo(
    (): ColumnDef<CourseRow>[] => [
      createSelectionColumn<CourseRow>(),
      {
        accessorKey: 'title',
        header: t('course_title', 'Course Title'),
        cell: ({ row }) => <span {...stylex.props(styles.cellBold)}>{row.original.title}</span>,
      },
      {
        accessorKey: 'wordCount',
        header: t('course_words', 'Word Count'),
        cell: ({ row }) => (
          <span {...stylex.props(styles.cellMuted)}>{row.original.wordCount} words</span>
        ),
      },
      {
        accessorKey: 'isActive',
        header: t('status', 'Status'),
        cell: ({ row }) => (
          <span
            {...stylex.props(
              styles.statusBadge,
              row.original.isActive ? styles.statusActive : styles.statusDraft,
            )}
          >
            {row.original.isActive ? 'Active' : 'Draft'}
          </span>
        ),
      },
      createRowActionsColumn<CourseRow>({
        renderActions: ({ row }) => (
          <div {...stylex.props(styles.actions)}>
            <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(row.original)}>
              <Icons.Edit />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(row.original)}>
              <Icons.Trash />
            </Button>
          </div>
        ),
      }),
    ],
    [t],
  );

  return (
    <div {...stylex.props(styles.container)}>
      <DataTable
        columns={columns}
        data={data}
        isLoading={coursesQuery.isLoading}
        pageSize={10}
        searchPlaceholder="Search courses..."
        searchKey="title"
      />
    </div>
  );
};
```
