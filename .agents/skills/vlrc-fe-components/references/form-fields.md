# Custom Form Fields API Reference

This manual provides prop definitions and copy-pasteable snippets for all 10 specialized form field wrappers in `@vlrc-fe/components`. All of these automatically wire up inside a `<Form>` container using `control` and `name` attributes, with full Astryx token integration and zero magic values.

---

## Table of Contents

1. [FormInput (Text, Email, Phone, Password)](#1-forminput-text-email-phone-password)
2. [FormTextarea (Multiline Text Box)](#2-formtextarea-multiline-text-box)
3. [FormCheckbox (Single Boolean Toggle)](#3-formcheckbox-single-boolean-toggle)
4. [FormSimpleSelect (Direct Inline Dropdown)](#4-formsimpleselect-direct-inline-dropdown)
5. [FormSelect (Advanced Single & Multi-Select)](#5-formselect-advanced-single-multi-select)
6. [FormMultiSelect (Popover Tag List Selection)](#6-formmultiselect-popover-tag-list-selection)
7. [FormDatePicker (Calendars & DateTime Selectors)](#7-formdatepicker-calendars-datetime-selectors)
8. [FormNumberInput (Numeric Format with Steppers)](#8-formnumberinput-numeric-format-with-steppers)
9. [FormRadioGroup (Radio Option List)](#9-formradiogroup-radio-option-list)
10. [FormFileUpload (Avatar & File Drag & Drop)](#10-formfileupload-avatar-file-drag--drop)

---

## 1. `<FormInput>` (Text, Email, Phone, Password)

Unifies standard text, email, phone, and password inputs.

- **Automatic Password Toggle**: Renders `<Icons.Eye>` / `<Icons.EyeOff>` visibility toggle button automatically when `htmlType="password"`.
- **Regex Validations**: Automatically validates phone numbers and email formats when `htmlType="tel"` or `"email"` is declared.

| Prop          | Type                                                | Default  | Description                               |
| :------------ | :-------------------------------------------------- | :------- | :---------------------------------------- |
| `htmlType`    | `'text' \| 'password' \| 'email' \| 'tel' \| 'url'` | `'text'` | Directs input format behavior.            |
| `leftIcon`    | `ReactNode`                                         | -        | Prefix icon aligned inside the input box. |
| `rightIcon`   | `ReactNode`                                         | -        | Suffix icon aligned inside the input box. |
| `placeholder` | `string`                                            | -        | Input placeholder text.                   |
| `disabled`    | `boolean`                                           | `false`  | Disable state toggle.                     |
| `sx`          | `stylex.StyleXStyles`                               | -        | StyleX overrides.                         |

```tsx
<FormInput
  control={control}
  name="email"
  label="Email đăng nhập"
  htmlType="email"
  leftIcon={<Icons.Mail />}
  rules={{ required: 'Bắt buộc nhập email' }}
/>

<FormInput
  control={control}
  name="password"
  label="Mật khẩu"
  htmlType="password"
  leftIcon={<Icons.Lock />}
  rules={{ required: 'Bắt buộc nhập mật khẩu' }}
/>
```

---

## 2. `<FormTextarea>` (Multiline Text Box)

Renders a token-styled multiline text area input box.

| Prop          | Type                  | Default | Description                |
| :------------ | :-------------------- | :------ | :------------------------- |
| `disabled`    | `boolean`             | `false` | Disable interactions.      |
| `placeholder` | `string`              | -       | Textarea placeholder text. |
| `rows`        | `number`              | `4`     | Default row count.         |
| `sx`          | `stylex.StyleXStyles` | -       | StyleX overrides.          |

```tsx
<FormTextarea
  control={control}
  name="notes"
  label="Ghi chú thêm"
  placeholder="Ghi chú thông tin bổ sung cho giáo viên..."
/>
```

---

## 3. `<FormCheckbox>` (Single Boolean Toggle)

Renders an accessible checkbox wrapped with `FormBase`.

| Prop          | Type                  | Default | Description           |
| :------------ | :-------------------- | :------ | :-------------------- |
| `label`       | `ReactNode`           | -       | Accompanying label.   |
| `description` | `ReactNode`           | -       | Subtitle description. |
| `disabled`    | `boolean`             | `false` | Disable checkbox.     |
| `sx`          | `stylex.StyleXStyles` | -       | StyleX overrides.     |

```tsx
<FormCheckbox
  control={control}
  name="agreeTerms"
  label="Tôi đồng ý với các điều khoản sử dụng"
  rules={{ required: 'Bạn cần đồng ý với điều khoản' }}
/>
```

---

## 4. `<FormSimpleSelect>` (Direct Inline Dropdown)

Lightweight native-like select wrapper for simple option choices.

```tsx
<FormSimpleSelect
  control={control}
  name="role"
  label="Vai trò tài khoản"
  placeholder="Chọn vai trò..."
  options={[
    { label: 'Học viên', value: 'student' },
    { label: 'Giáo viên', value: 'teacher' },
    { label: 'Quản trị viên', value: 'admin' },
  ]}
  rules={{ required: 'Vui lòng chọn vai trò' }}
/>
```

---

## 5. `<FormSelect>` (Advanced Single & Multi-Select)

Full-featured dropdown selector with search, clear button, and badge options.

```tsx
<FormSelect
  control={control}
  name="courseId"
  label="Khóa học"
  placeholder="Tìm kiếm và chọn khóa học..."
  options={courseOptions}
  isSearchable
  isClearable
  rules={{ required: 'Vui lòng chọn một khóa học' }}
/>
```

---

## 6. `<FormMultiSelect>` (Popover Tag List Selection)

Allows picking multiple options displayed as compact badge tags.

```tsx
<FormMultiSelect
  control={control}
  name="tagIds"
  label="Thẻ phân loại"
  placeholder="Chọn các thẻ liên quan..."
  options={allTags}
/>
```

---

## 7. `<FormDatePicker>` (Calendars & DateTime Selectors)

Astryx-powered internationalized date and range selector with multi-calendar support.

```tsx
<FormDatePicker
  control={control}
  name="publishedAt"
  label="Ngày phát hành"
  placeholder="Chọn ngày..."
  rules={{ required: 'Ngày phát hành là bắt buộc' }}
/>
```

---

## 8. `<FormNumberInput>` (Numeric Format with Steppers)

Numeric input supporting step controls, minimums, maximums, and currency/percentage formatting.

```tsx
<FormNumberInput
  control={control}
  name="price"
  label="Giá khóa học (VNĐ)"
  min={0}
  step={10000}
  rules={{ required: 'Vui lòng nhập giá khóa học' }}
/>
```

---

## 9. `<FormRadioGroup>` (Radio Option List)

Renders mutually exclusive radio lists with token-based focus rings.

```tsx
<FormRadioGroup
  control={control}
  name="gender"
  label="Giới tính"
  options={[
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Khác', value: 'other' },
  ]}
/>
```

---

## 10. `<FormFileUpload>` (Avatar & File Drag & Drop)

Handles file upload workflows with preview cards, progress indicators, and storage adapters.

```tsx
<FormFileUpload
  control={control}
  name="avatarUrl"
  label="Ảnh đại diện"
  layout="avatar"
  accept={['image/jpeg', 'image/png']}
  maxSizeMb={5}
/>
```
