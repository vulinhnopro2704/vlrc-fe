# @vlrc-fe/hooks

[![npm version](https://img.shields.io/npm/v/@vlrc-fe/hooks.svg?style=flat-square)](https://www.npmjs.com/package/@vlrc-fe/hooks)
[![React 19](https://img.shields.io/badge/React-19.3-blue.svg?style=flat-square)](https://react.dev/)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7.0-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

Collection of reusable, performant, and type-safe React utility hooks for the **VLRC** platform.

- **npm package:** [https://www.npmjs.com/package/@vlrc-fe/hooks](https://www.npmjs.com/package/@vlrc-fe/hooks)

---

## 📦 Installation

```bash
pnpm add @vlrc-fe/hooks
```

---

## 🪝 Available Hooks

### `useModalState`

A multi-key modal lifecycle manager that coordinates **open/close state**, **lazy DOM mounting** (`load` flag), and **graceful exit animations** (`destroyDelay`). Manage multiple modals from a single hook call with zero boilerplate.

#### Signature

```typescript
function useModalState<const T extends ReadonlyArray<string>>(
  keyList: T,
  options?: { destroyDelay?: number }
): {
  modal: Record<T[number], { load: boolean; open: boolean }>;
  openModal: (name: T[number]) => void;
  closeModal: (name: T[number]) => void;
}
```

#### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `keyList` | `ReadonlyArray<string>` | - | **(Required)** A tuple of string keys identifying each modal, e.g. `['edit', 'delete', 'detail'] as const`. |
| `options.destroyDelay` | `number` | `300` | Milliseconds to wait after closing before unmounting the modal DOM (`load: false`). Set to `0` for instant unmounting. |

#### Return Value

| Field | Type | Description |
| :--- | :--- | :--- |
| `modal` | `Record<Key, { load: boolean; open: boolean }>` | State map per modal key. `load` controls whether the modal is mounted in DOM; `open` controls visibility/CSS animations. |
| `openModal` | `(name: Key) => void` | Sets both `load: true` and `open: true` for the given key. Cancels any pending unmount timer. |
| `closeModal` | `(name: Key) => void` | Sets `open: false` immediately, then unmounts (`load: false`) after `destroyDelay` ms. |

#### Lifecycle & Exit Animation Flow

```text
openModal('edit')  ──>  { load: true, open: true }   (mount DOM & trigger enter animation)
closeModal('edit') ──>  { load: true, open: false }  (start exit animation, e.g. 300ms)
                   ──>  { load: false, open: false } (unmount from DOM cleanly)
```

#### Example Usage

```tsx
import { useModalState } from '@vlrc-fe/hooks';
import { Button, Modal, ConfirmModal } from '@vlrc-fe/components';

export function CourseManagement() {
  const { modal, openModal, closeModal } = useModalState(['edit', 'delete'] as const);

  return (
    <>
      <Button onClick={() => openModal('edit')}>Edit Course</Button>
      <Button variant="destructive" onClick={() => openModal('delete')}>Delete Course</Button>

      {/* Lazy-mounted edit dialog */}
      {modal.edit.load && (
        <Modal open={modal.edit.open} onOpenChange={() => closeModal('edit')}>
          <div style={{ padding: '1.5rem' }}>
            <h3>Edit Course Details</h3>
            {/* Form content */}
          </div>
        </Modal>
      )}

      {/* Confirmation alert dialog */}
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

## 🛠 Package Scripts

```bash
# Build package (Vite library mode + tsc declaration emission)
pnpm build

# Lint package codebase
pnpm lint
```

---

## 📄 License

MIT © [VLRC Platform Team](https://github.com/vulinhnopro2704/vlrc-fe)
