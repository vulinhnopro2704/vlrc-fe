# Translation Key Examples

This document provides practical examples for creating, reusing, and distinguishing translation keys.

# 1. Same Meaning, Different Locations

Always reuse the same key when the meaning is equivalent, regardless of where it appears.

| Location           | Displayed text | Key    |
| ------------------ | -------------- | ------ |
| User Management    | Name           | `name` |
| Product Management | Name           | `name` |
| Profile            | Name           | `name` |
| Registration Form  | Name           | `name` |

Correct:

```json
{
  "name": "Name"
}
```

Incorrect:

```json
{
  "user_name": "Name",
  "product_name": "Name",
  "profile_name": "Name",
  "registration_name": "Name"
}
```

# 2. Reuse Generic Actions

Actions should be shared across the application.

Correct:

```json
{
  "save": "Save",
  "cancel": "Cancel",
  "delete": "Delete",
  "edit": "Edit",
  "create": "Create",
  "search": "Search",
  "confirm": "Confirm",
  "close": "Close"
}
```

Incorrect:

```json
{
  "save_button": "Save",
  "save_action": "Save",
  "user_save": "Save",
  "product_save": "Save",
  "dialog_cancel": "Cancel"
}
```

# 3. Reuse Generic Labels

Use generic keys when the translated meaning is identical.

Correct:

```json
{
  "name": "Name",
  "email": "Email",
  "password": "Password",
  "description": "Description",
  "status": "Status",
  "created_at": "Created at",
  "updated_at": "Updated at"
}
```

Incorrect:

```json
{
  "user_email": "Email",
  "customer_email": "Email",
  "account_email": "Email",
  "product_status": "Status",
  "order_status": "Status"
}
```

# 4. Reuse Generic Messages

Prefer reusable messages over entity-specific messages.

Correct:

```json
{
  "required": "This field is required",
  "not_found": "Not found",
  "loading": "Loading...",
  "no_data": "No data available",
  "success": "Success",
  "failed": "Failed"
}
```

Create specific keys only when the actual message contains different information or has a genuinely different meaning.

For example:

```json
{
  "user_not_found": "User not found",
  "file_not_found": "File not found"
}
```

These are justified when the UI needs to explicitly identify which entity was not found.

# 5. Distinguish Different Meanings

Do not merge keys just because their English words look similar.

| Key        | Meaning                                  |
| ---------- | ---------------------------------------- |
| `close`    | An action to close something             |
| `closed`   | A state indicating something is closed   |
| `closing`  | The process of closing                   |
| `delete`   | An action to delete                      |
| `deleted`  | A state indicating something was deleted |
| `deletion` | The act or process of deleting           |

# 6. Distinguish Different Messages

Different sentences should have different keys when their meanings or grammatical structures differ.

Correct:

```json
{
  "delete": "Delete",
  "confirm_delete": "Are you sure you want to delete this item?",
  "delete_success": "Item deleted successfully",
  "delete_failed": "Failed to delete item"
}
```

Do not force an entire sentence into a generic word key.

# 7. English snake_case Naming

Good:

```json
{
  "first_name": "First name",
  "last_name": "Last name",
  "phone_number": "Phone number",
  "date_of_birth": "Date of birth",
  "no_results": "No results found"
}
```

Bad:

```json
{
  "firstName": "First name",
  "LastName": "Last name",
  "phone-number": "Phone number",
  "user_date_of_birth": "Date of birth"
}
```

# 8. Flat Structure Only

Correct:

```json
{
  "save": "Save",
  "cancel": "Cancel",
  "name": "Name",
  "email": "Email",
  "no_data": "No data available"
}
```

Incorrect:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "user": {
    "name": "Name",
    "email": "Email"
  }
}
```

# 9. Reuse Decision Checklist

Before creating a new key, ask:

1. Does an existing key already represent this meaning?
2. Can the existing translation be reused naturally in this location?
3. Is the difference only the screen, component, domain, or UI element?
4. Is a new key genuinely necessary to preserve meaning or grammar?

If the meaning is equivalent and the translation works naturally, reuse the existing key.

**Default rule: Reuse first, create only when necessary.**
