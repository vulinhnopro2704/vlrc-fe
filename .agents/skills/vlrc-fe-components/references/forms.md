# Form Primitives & FormBase Architecture Reference

`@vlrc-fe/components` provides enterprise form integration built on top of **React Hook Form** combined with the Astryx-compatible **`FormBase`** layout system. All field validation is managed through RHF's standard `rules` prop with zero magic values and clean accessibility.

---

## 1. The `<Form>` Component = `FormProvider`

The `<Form>` component exported from `@vlrc-fe/components` is **`FormProvider`** from `react-hook-form`. It broadcasts form state down the component tree.

### Standard Usage Pattern

```tsx
import { useForm } from 'react-hook-form';
import { Form, FormInput, Button, VStack, HStack } from '@vlrc-fe/components';

interface UserFormData {
  fullName: string;
  email: string;
}

export function UserProfileForm() {
  const form = useForm<UserFormData>({
    defaultValues: { fullName: '', email: '' },
  });

  const onSubmit = (data: UserFormData) => {
    console.log('Submitted data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <VStack gap="md">
          <FormInput
            control={form.control}
            name="fullName"
            label="Họ và tên"
            rules={{ required: 'Vui lòng nhập họ và tên' }}
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            htmlType="email"
            rules={{ required: 'Vui lòng nhập email' }}
          />
          <HStack justify="end">
            <Button type="submit" variant="default">
              Lưu thay đổi
            </Button>
          </HStack>
        </VStack>
      </form>
    </Form>
  );
}
```

> [!IMPORTANT]
>
> - **Never use raw `<div>` for form layouts**: Always wrap fields in `<VStack gap="md">` or `<Grid>`.
> - **`rules` prop handles validation**: Standard React Hook Form `RegisterOptions` (`required`, `min`, `max`, `pattern`, `validate`).
> - **`control`** connects the field wrapper to the form instance.

---

## 2. `FormBase` Layout Architecture

All specialized form field wrappers (`FormInput`, `FormTextarea`, `FormCheckbox`, `FormSimpleSelect`, `FormSelect`, `FormMultiSelect`, `FormDatePicker`, `FormNumberInput`, `FormRadioGroup`, `FormFileUpload`) build on `FormBase`.

`FormBase` provides:

1. **Field Label & Indicator**: Auto-renders `<FieldLabel>` with a red asterisk indicator when `required` is present in `rules`.
2. **Accessible ID Binding**: Connects labels, descriptions, and error messages via `aria-describedby` and `aria-invalid`.
3. **Automated Error Display**: Reads field error states from RHF and displays `<FieldError>` with token-driven destructive coloration.
4. **Layout Flexibility**: Supports standard vertical layout, `horizontal` layout (for settings pages), and `controlFirst` (for checkboxes and switches).

---

## 3. Real-World Mutation Pattern

Here is the standard production pattern used across the VLRC platform:

```tsx
import { useForm } from 'react-hook-form';
import {
  Form,
  FormInput,
  FormSelect,
  FormDatePicker,
  Button,
  VStack,
  HStack,
  Modal,
} from '@vlrc-fe/components';

interface CourseFormValues {
  title: string;
  category: string;
  startDate: string;
}

interface CourseModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmitCourse: (data: CourseFormValues) => Promise<void>;
}

export function CourseModal({ open, onCancel, onSubmitCourse }: CourseModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CourseFormValues>();

  const onSubmit = handleSubmit(async (data) => {
    await onSubmitCourse(data);
    reset();
    onCancel();
  });

  return (
    <Modal open={open} onOpenChange={onCancel}>
      <Form {...{ control, handleSubmit, reset }}>
        <form onSubmit={onSubmit}>
          <VStack gap="lg">
            <FormInput
              control={control}
              name="title"
              label="Tên khóa học"
              rules={{ required: 'Tên khóa học là bắt buộc' }}
            />
            <FormSelect
              control={control}
              name="category"
              label="Danh mục"
              options={[
                { label: 'Frontend', value: 'fe' },
                { label: 'Backend', value: 'be' },
              ]}
              rules={{ required: 'Chọn danh mục' }}
            />
            <FormDatePicker
              control={control}
              name="startDate"
              label="Ngày bắt đầu"
              rules={{ required: 'Chọn ngày bắt đầu' }}
            />
            <HStack justify="end" gap="sm">
              <Button variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Lưu khóa học
              </Button>
            </HStack>
          </VStack>
        </form>
      </Form>
    </Modal>
  );
}
```
