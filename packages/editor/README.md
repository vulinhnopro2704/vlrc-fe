# @vlrc-fe/editor

Enterprise Notion-like Markdown and Rich-Text Editor built on **Meta Lexical**, **Meta StyleX**, and **Astryx Design Tokens**.

## Features

- 📝 **Markdown-First**: Type standard markdown shortcuts (`#`, `##`, `*`, `1.`, `[ ]`, `>`, ````) with real-time bidirectional Markdown serialization.
- ⚡ **Notion-Style Slash Commands (`/`)**: Instant block picker menu for Headings, Lists, Quotes, Code Blocks, Callouts, and Dividers with keyboard navigation.
- 🔽 **Notion Toggle Headings**: Collapsible heading blocks (H1, H2, H3 toggles) with smooth chevron expansion, nested content blocks, keyboard navigation, and Enter / Backspace boundary handling.
- 💬 **Floating Bubble Format Toolbar**: Appears on text selection with Bold, Italic, Strikethrough, Code, Highlight, and Link triggers.
- 🪟 **Draggable Block Handles (`⋮⋮`)**: Visual hover handle allowing block reordering, duplication, and deletion.
- 🎨 **Meta StyleX Theming**: Zero magic values, bound directly to unified Astryx design tokens (`colors.*`, `spacing.*`, `radius.*`, `shadow.*`).
- ♿ **Accessible**: WCAG 2.1 AA compliant keyboard navigation and ARIA landmarks.

## Installation

```bash
pnpm add @vlrc-fe/editor
```

### Peer Dependencies

Consumer apps must supply `@vlrc-fe/components`, `@stylexjs/stylex`, `react`, and `react-dom`:

```bash
pnpm add @vlrc-fe/components @stylexjs/stylex react react-dom
```

## Basic Usage

```tsx
import { useState } from 'react';
import { NotionEditor } from '@vlrc-fe/editor';
import '@vlrc-fe/components/theme.css';

export function DocumentPage() {
  const [markdown, setMarkdown] = React.useState('# Initial Doc');

  return (
    <NotionEditor
      defaultValue={markdown}
      onChange={(newMarkdown) => setMarkdown(newMarkdown)}
      showSlashMenu
      showFloatingToolbar
      showToolbar
    />
  );
}
```
