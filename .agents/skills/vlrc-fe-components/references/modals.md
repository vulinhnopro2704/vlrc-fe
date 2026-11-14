# Modals & useModalState Data Binding Reference

Decoupling modal triggers from dialog panels is a core architectural convention. This reference details `ConfirmModal`, `Modal`, and how to wire them cleanly using the `useModalState` hook from `@vlrc-fe/hooks` and layout primitives from `@vlrc-fe/components`.

---

## 1. Modal Control Hook (`useModalState`)

The `useModalState` hook from `@vlrc-fe/hooks` manages multiple independent modals from a single call using a typed key list. It provides two-phase unmounting (`load` → `open`) to ensure smooth exit animations before DOM removal.

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
                   →  { load: false, open: false }  // unmount from DOM
```

Use `modal.key.load` to conditionally render the modal container, and `modal.key.open` for the dialog's `open` prop.

---

## 2. Modal Core Components

### 2.1 Standard Overlay Wrapper (`<Modal>`)

Generic dialog overlay wrapper built on Astryx modal primitives.

### 2.2 Confirmation Alert Dialogue (`<ConfirmModal>`)

| Prop          | Type                          | Default      | Description                   |
| :------------ | :---------------------------- | :----------- | :---------------------------- |
| `open`        | `boolean`                     | `false`      | Visibility indicator.         |
| `title`       | `ReactNode`                   | -            | Header title text.            |
| `description` | `ReactNode`                   | -            | Body description text.        |
| `confirmText` | `string`                      | `'Xác nhận'` | Submit action label.          |
| `cancelText`  | `string`                      | `'Hủy'`      | Cancel action label.          |
| `variant`     | `'default' \| 'destructive'`  | `'default'`  | Destructive or primary theme. |
| `onConfirm`   | `() => void \| Promise<void>` | -            | Submit event handler.         |
| `onCancel`    | `() => void`                  | -            | Cancel event handler.         |

---

## 3. Composition Example (Zero Raw `<div>` & Zero Magic Values)

```tsx
import { Button, ConfirmModal, HStack, VStack, Text, Title, Icons } from '@vlrc-fe/components';
import { useModalState } from '@vlrc-fe/hooks';

export const CourseActionPanel = ({
  courseTitle,
  onDeleteCourse,
}: {
  courseTitle: string;
  onDeleteCourse: () => Promise<void>;
}) => {
  const { modal, openModal, closeModal } = useModalState(['edit', 'delete'] as const);

  return (
    <VStack gap="md">
      <HStack gap="sm">
        <Button variant="outline" onClick={() => openModal('edit')}>
          <Icons.Edit /> Chỉnh sửa
        </Button>
        <Button variant="destructive" onClick={() => openModal('delete')}>
          <Icons.Trash /> Xóa khóa học
        </Button>
      </HStack>

      {modal.delete.load && (
        <ConfirmModal
          open={modal.delete.open}
          title={<Title level={3}>Xác nhận xóa khóa học</Title>}
          description={
            <Text type="secondary">
              Bạn có chắc chắn muốn xóa khóa học <strong>{courseTitle}</strong>? Thao tác này không
              thể hoàn tác.
            </Text>
          }
          variant="destructive"
          confirmText="Xóa vĩnh viễn"
          cancelText="Hủy bỏ"
          onConfirm={async () => {
            await onDeleteCourse();
            closeModal('delete');
          }}
          onCancel={() => closeModal('delete')}
        />
      )}
    </VStack>
  );
};
```
