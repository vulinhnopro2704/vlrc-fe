---
name: i18n-flat-key-management
description: Use when adding, editing, or refactoring translations. Enforces a shared, flat translation dictionary with concise English snake_case keys, maximum semantic reuse, minimal translation entries, and locale key parity.
---

# Objective

Maintain a minimal, reusable translation dictionary across all locales.

Translation keys represent the meaning of translated words or phrases, NOT their usage context, domain, screen, component, feature, or location in the application.

The dictionary must be:

- **Semantic-based:** Keys describe translation meanings.
- **Reusable:** The same key can be used anywhere when the meaning is equivalent.
- **Minimal:** Maximize key reuse and minimize translation entries.
- **Flat:** All keys must exist at the root level. No nested objects.

# Key Naming Convention

1. Keys MUST be English.
2. Keys MUST use concise `snake_case`.
3. Keys MUST describe semantic meaning.
4. Keys MUST NOT contain domain, feature, page, component, screen, or usage-context prefixes or suffixes.
5. Keys MUST NOT be unnecessarily specific.
6. All keys MUST be root-level key-value pairs.
7. Prefer existing keys over creating new ones whenever their meanings are equivalent.

# Key Design Principles

## 1. Meaning over Context

A key represents what a translation means, not where it is used.

## 2. Maximize Reusability

Before creating a new key:

1. Search the entire translation dictionary for an existing key with equivalent meaning.
2. Reuse that key whenever possible.
3. Never create separate keys just because translations appear in different screens, components, or domains.
4. Never create separate keys based on UI element types such as buttons, labels, placeholders, tooltips, or titles.

## 3. Minimize Translation Entries

Prefer the smallest possible dictionary without sacrificing semantic correctness.

Avoid entity-specific or context-specific keys unless the actual translated text or meaning requires them.

## 4. Preserve Semantic Differences

Do not reuse keys when the underlying meanings are genuinely different, even if their translations look similar.

Consider differences in:

- Meaning
- Grammatical form
- Tense or state
- Singular and plural
- Sentence structure
- Context-dependent translation

Never sacrifice grammatical correctness or natural translations just to reduce key count.

## 5. Flat Structure Only

All locale files MUST contain flat key-value pairs.

- No nested objects.
- No namespaces.
- No domain-based grouping.
- No screen-based grouping.
- No component-based grouping.

# Workflow

1. Inspect all active locale files and identify their existing keys.
2. Identify the translations required by the task.
3. Search existing keys for equivalent meanings.
4. Reuse existing keys whenever possible.
5. Create new concise English `snake_case` keys only when necessary.
6. Add or update translations in every active locale.
7. Update application references to use the exact flat keys.
8. Validate all locale files and application references.

# Validation

Ensure that:

- All active locales have identical key sets.
- Every key is a root-level string.
- No nested objects exist.
- Keys use concise English `snake_case`.
- No unnecessary semantic duplicates exist.
- Existing reusable keys are not duplicated.
- No obsolete translation references remain.
- No hardcoded UI translations are introduced.

# Constraints

1. Never organize keys by domain, module, feature, screen, component, or usage location.
2. Never create namespaces or nested translation objects.
3. Never duplicate keys solely because they are used in different places.
4. Never use translated text or non-English words as keys.
5. Never use PascalCase, camelCase, kebab-case, or arbitrary naming conventions.
6. Never create overly descriptive keys when a shorter semantic key is sufficient.
7. Preserve existing keys unless renaming is necessary.
8. Do not hardcode project-specific locale paths.
9. Maintain exact key parity across all active locales.
10. Keep translations natural and grammatically correct.

# References

See `references/examples.md` for naming conventions, semantic reuse, and edge cases.
