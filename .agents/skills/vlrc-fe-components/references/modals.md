# Modals & useModalState Data Binding Reference

Decoupling modal triggers from dialog panels is a core architectural convention. This reference details `ConfirmModal`, `Modal`, and how to wire them using the `useModalState` hook from `@vlrc-fe/hooks`.

---

## 1. Modal Control Hook (`useModalState`)

The `useModalState` hook manages multiple independent modals from a single call using a typed key list. It provides two-phase unmounting (`load` → `open`) to allow smooth exit animations before DOM removal.

### Hook Signature

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

### Lifecycle

```
openModal('edit')  →  { load: true, open: true }   // mount + animate in
closeModal('edit') →  { load: true, open: false }   // animate out (300ms default)
                   →  { load: false, open: false }   // unmount from DOM
```

Use `modal.key.load` to conditionally render, and `modal.key.open` for the dialog's `open` prop.

---

## 2. Modal Core Components

### 2.1 Standard Overlay Wrapper (`<Modal>`)

A simple overlay wrapper requiring `open` and `onOpenChange` controls.

### 2.2 Confirmation Alert Dialogue (`<ConfirmModal>`)

| Prop          | Type                          | Default      | Description            |
| :------------ | :---------------------------- | :----------- | :--------------------- |
| `open`        | `boolean`                     | `false`      | Visibility indicator.  |
| `title`       | `ReactNode`                   | -            | Header text.           |
| `description` | `ReactNode`                   | -            | Body description text. |
| `confirmText` | `string`                      | `'Xác nhận'` | Submit button string.  |
| `cancelText`  | `string`                      | `'Hủy'`      | Cancel button string.  |
| `variant`     | `'default' \| 'destructive'`  | `'default'`  | Theme coloration.      |
| `onConfirm`   | `() => void \| Promise<void>` | -            | Submit event handler.  |
| `onCancel`    | `() => void`                  | -            | Cancel event handler.  |

---

## 3. Composition Example

```tsx
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  actions: { display: 'flex', gap: '1rem' },
  modalBody: { padding: '1.5rem' },
  modalTitle: { fontSize: '1.125rem', fontWeight: 700 },
});

const CoursePanel = () => {
  const { t } = useTranslation();
  const { modal, openModal, closeModal } = useModalState(['edit', 'delete'] as const);

  return (
    <div {...stylex.props(styles.actions)}>
      <Button onClick={() => openModal('edit')}>
        <Icons.Edit /> Edit
      </Button>
      <Button variant="destructive" onClick={() => openModal('delete')}>
        <Icons.Trash /> Delete
      </Button>

      {modal.edit.load && (
        <Modal open={modal.edit.open} onOpenChange={() => closeModal('edit')}>
          <div {...stylex.props(styles.modalBody)}>
            <h3 {...stylex.props(styles.modalTitle)}>Edit Course</h3>
            {/* form content here */}
            <Button onClick={() => closeModal('edit')}>Close</Button>
          </div>
        </Modal>
      )}

      {modal.delete.load && (
        <ConfirmModal
          open={modal.delete.open}
          title="Delete course?"
          description="This action cannot be undone. The course will be permanently removed."
          confirmText="Delete permanently"
          variant="destructive"
          onCancel={() => closeModal('delete')}
          onConfirm={async () => {
            await deleteCourseMutation.mutateAsync(courseId);
            closeModal('delete');
          }}
        />
      )}
    </div>
  );
};
```
