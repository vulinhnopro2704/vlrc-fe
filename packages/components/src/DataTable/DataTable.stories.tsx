import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { DataTable } from './DataTable';
import { createRowActionsColumn, createSelectionColumn } from './render/createColumns';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending' | 'Suspended';
  lastActive: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2026-11-05',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2026-11-04',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'Viewer',
    status: 'Pending',
    lastActive: '2026-10-30',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2026-11-06',
  },
  {
    id: '5',
    name: 'Evan Wright',
    email: 'evan.wright@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastActive: '2026-09-12',
  },
];

const columns: ColumnDef<User, unknown>[] = [
  createSelectionColumn<User>(),
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === 'Active' ? 'default' : status === 'Pending' ? 'secondary' : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'lastActive',
    header: 'Last Active',
  },
];

const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Advanced data table built on TanStack Table v8, Meta StyleX, and Radix primitives. Supports sorting, pagination, global search, column visibility, row selection, and row expansion.',
      },
    },
  },
} satisfies Meta<typeof DataTable<User>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockUsers,
    columns,
    search: {
      placeholder: 'Search users...',
      debounceMs: 300,
    },
    pagination: {
      pageSizeOptions: [5, 10, 20],
    },
  },
};

const columnsWithActions: ColumnDef<User, unknown>[] = [...columns, createRowActionsColumn<User>()];

export const WithRowActions: Story = {
  args: {
    data: mockUsers,
    columns: columnsWithActions,
    actions: {
      getRowActions: (row: Row<User>) => [
        {
          id: 'view',
          label: `View ${row.original.name}`,
          disabled: false,
          onSelect: () => alert(`Viewing ${row.original.name}`),
        },
        {
          id: 'edit',
          label: 'Edit details',
          disabled: false,
          onSelect: () => alert(`Editing ${row.original.name}`),
        },
        {
          id: 'delete',
          label: 'Delete user',
          disabled: row.original.role === 'Admin',
          onSelect: () => alert(`Deleting ${row.original.name}`),
        },
      ],
    },
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns,
    empty: {
      render: () => (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
          No users match your criteria.
        </div>
      ),
    },
  },
};
