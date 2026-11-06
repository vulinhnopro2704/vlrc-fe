# Changesets

Hello and welcome! This folder has been configured to use Changesets for managing versions and changelogs across the packages in this monorepo.

## Adding a Changeset

When you make a change that warrants a version bump, run:

```bash
pnpm changeset
```

Follow the prompts to choose the packages to bump, specify whether the change is a `major`, `minor`, or `patch`, and add a concise summary.

## Versioning & Publishing

- **Version packages**:
  ```bash
  pnpm changeset version
  ```
- **Publish packages to npm**:
  ```bash
  pnpm changeset publish
  ```
