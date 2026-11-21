# VLRC Design System Anti-Pattern Prevention & Code Review Runbook

This guide documents recurring code smells, anti-patterns, and strict review standards across the `@vlrc-fe` monorepo. All AI agents and human contributors must verify their work against these rules before submitting code or opening pull requests.

---

## 1. Typography & Polymorphic Component Anti-Patterns

### 1.1 Redundant `as="span"` on `<Text>`

- **Anti-Pattern**:
  ```tsx
  // ❌ WRONG: as="span" is 100% redundant
  <Text as="span" type="secondary">
    Label
  </Text>
  ```
- **Why it is harmful**:
  In `@vlrc-fe/components/Typography/Text.tsx`, `<Text>` already defaults to `span` (`let defaultComponent = 'span'`). Passing `as="span"` adds clutter and creates confusion about component defaults.
- **Correct Pattern**:
  ```tsx
  // ✅ CORRECT
  <Text type="secondary">Label</Text>
  ```

---

### 1.2 Using `<Box as="span">` Instead of `<Text>`

- **Anti-Pattern**:
  ```tsx
  // ❌ WRONG: Using a layout container as an inline text element
  <Box as="span" sx={styles.badge}>
    {content}
  </Box>
  ```
- **Why it is harmful**:
  `<Box>` is an Astryx polymorphic layout container (defaulting to `<div>`). Using `<Box as="span">` bypasses the typography system (font size scaling, line height, text colors, truncation).
- **Correct Pattern**:
  ```tsx
  // ✅ CORRECT: Use the Typography primitive
  <Text sx={styles.badge}>{content}</Text>
  ```

---

### 1.3 Coercing `<Text>` Into Paragraphs or Headings

- **Anti-Pattern**:
  ```tsx
  // ❌ WRONG: Forcing Text to render paragraph or heading
  <Text as="p" size="sm">Description text</Text>
  <Text as="h4" size="md">Section Heading</Text>
  ```
- **Why it is harmful**:
  `@vlrc-fe/components` provides specialized primitives with correct typography defaults, margins, and semantics:
  - `<Paragraph>`: Automatically renders `<p>` with paragraph line-height and spacing.
  - `<Title level={1-6}>`: Automatically renders `<h1>`-`<h6>` with proper weights and letter-spacing.
- **Correct Pattern**:
  ```tsx
  // ✅ CORRECT
  <Paragraph size="sm">Description text</Paragraph>
  <Title level={4} size="md">Section Heading</Title>
  ```

---

## 2. Interactive Controls & DOM Nesting Violations

### 2.1 Raw `<button>`, `<span role="button">`, or `<div role="button">`

- **Anti-Pattern**:
  ```tsx
  // ❌ WRONG: Raw HTML button or fake button span
  <button onClick={handleClick}>Click me</button>
  <span role="button" tabIndex={0} onClick={handleClick}>Click me</span>
  ```
- **Why it is harmful**:
  Bypasses VLRC design tokens, Astryx focus-visible rings, keyboard handling, and touch target standards.
- **Correct Pattern**:
  ```tsx
  // ✅ CORRECT
  <Button variant="ghost" size="sm" onClick={handleClick}>
    Click me
  </Button>
  ```

---

### 2.2 DOM Nesting Violations (`<button>` inside `<button>`)

- **Anti-Pattern**:
  ```tsx
  // ❌ WRONG: Popover/DatePicker trigger Button contains another Button
  <PopoverTrigger asChild>
    <Button variant="outline">
      <span>{selectedDate}</span>
      <Button variant="ghost" size="icon" onClick={clearDate}>
        ✕
      </Button>
    </Button>
  </PopoverTrigger>
  ```
- **Why it is harmful**:
  HTML5 forbids nesting interactive elements (`<button>` inside `<button>` or `<a>` inside `<a>`). Browsers will distort the DOM tree, causing React hydration mismatches and unpreventable click bubbling bugs.
- **Correct Pattern**:
  ```tsx
  // ✅ CORRECT: Wrapper is a layout primitive (<Flex>), interactive buttons are siblings
  <Flex align="center" justify="between" sx={styles.triggerWrapper}>
    <PopoverTrigger asChild>
      <Button variant="ghost" sx={styles.triggerButton}>
        {selectedDate}
      </Button>
    </PopoverTrigger>
    {clearable && (
      <Button variant="ghost" size="icon-xs" onClick={clearDate} aria-label="Clear date">
        <Icons.X />
      </Button>
    )}
  </Flex>
  ```

---

## 3. Accessibility & Modern CSS Standards

### 3.1 Modern `srOnly` / Visually Hidden

- **Anti-Pattern**:
  ```tsx
  // ❌ WRONG: Deprecated rect clipping
  srOnly: {
    clip: 'rect(0, 0, 0, 0)',
  }
  ```
- **Correct Pattern**:
  ```tsx
  // ✅ CORRECT: Modern CSS clip-path inset
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  }
  ```

---

### 3.2 Keyboard Navigation with Roving Index

- **Pattern**:
  For composite keyboard navigation across tabs, segmented buttons, and steppers, always use the unified helper:
  ```tsx
  import { getNextRovingIndex } from '../../utils';

  const nextIndex = getNextRovingIndex(
    currentIndex,
    totalCount,
    event.key === 'ArrowLeft' ? 'prev' : 'next',
    true, // loop
  );
  ```

---

## 4. Automated Verification Commands

Always run the full suite before pushing:

```bash
# 1. Automated design system anti-pattern & convention check
pnpm test -- check-design-system-conventions.test.ts

# 2. Strict typecheck
pnpm typecheck

# 3. All Vitest tests
pnpm test

# 4. Lint and Format check
pnpm lint
pnpm format:check

# 5. Full package build
pnpm build
```
