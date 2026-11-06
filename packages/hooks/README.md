# @vlrc-fe/hooks

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/hooks.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/hooks)
[![React 19](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../../LICENSE)

Reusable, type-safe React hooks for modal state management, UI coordination, and animations.

- **npm**: [npmjs.com/package/@vlrc-fe/hooks](https://www.npmjs.com/package/@vlrc-fe/hooks)

---

## Installation

```bash
pnpm add @vlrc-fe/hooks
```

---

## Hooks

### `useModalState`

Multi-key modal lifecycle manager that coordinates **open/close state**, **lazy DOM mounting**, and **graceful exit animations**. Manage multiple modals from a single hook call.

#### Signature

```typescript
function useModalState<const T extends ReadonlyArray<string>>(
  keyList: T,
  options?: { destroyDelay?: number },
): {
  modal: Record<T[number], { load: boolean; open: boolean }>;
  openModal: (name: T[number]) => void;
  closeModal: (name: T[number]) => void;
};
```

#### Parameters

| Parameter              | Type                    | Default | Description                                                                                         |
| :--------------------- | :---------------------- | :------ | :-------------------------------------------------------------------------------------------------- |
| `keyList`              | `ReadonlyArray<string>` | —       | Tuple of string keys identifying each modal, e.g. `['edit', 'delete'] as const`.                    |
| `options.destroyDelay` | `number`                | `300`   | Milliseconds to wait after closing before unmounting the modal DOM. Set to `0` for instant unmount. |

#### Return Value

| Field        | Type                                            | Description                                                                        |
| :----------- | :---------------------------------------------- | :--------------------------------------------------------------------------------- |
| `modal`      | `Record<Key, { load: boolean; open: boolean }>` | State map per modal key. `load` controls DOM mounting; `open` controls visibility. |
| `openModal`  | `(name: Key) => void`                           | Sets `load: true` and `open: true`. Cancels any pending unmount timer.             |
| `closeModal` | `(name: Key) => void`                           | Sets `open: false` immediately, then sets `load: false` after `destroyDelay` ms.   |

#### Lifecycle

```text
openModal('edit')  -->  { load: true, open: true }   (mount + enter animation)
closeModal('edit') -->  { load: true, open: false }  (exit animation, e.g. 300ms)
                   -->  { load: false, open: false } (unmount from DOM)
```

#### Example

```tsx
import { useModalState } from '@vlrc-fe/hooks';
import { Button, Modal, ConfirmModal } from '@vlrc-fe/components';

export function CourseManagement() {
  const { modal, openModal, closeModal } = useModalState(['edit', 'delete'] as const);

  return (
    <>
      <Button onClick={() => openModal('edit')}>Edit Course</Button>
      <Button variant="destructive" onClick={() => openModal('delete')}>
        Delete
      </Button>

      {modal.edit.load && (
        <Modal open={modal.edit.open} onOpenChange={() => closeModal('edit')}>
          <h3>Edit Course Details</h3>
          {/* Form content */}
        </Modal>
      )}

      {modal.delete.load && (
        <ConfirmModal
          open={modal.delete.open}
          title="Delete Course?"
          description="This action cannot be undone."
          variant="destructive"
          onCancel={() => closeModal('delete')}
          onConfirm={async () => {
            await deleteCourseApi();
            closeModal('delete');
          }}
        />
      )}
    </>
  );
}
```

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
