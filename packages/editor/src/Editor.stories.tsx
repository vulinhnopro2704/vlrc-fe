import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, VStack, Text } from '@vlrc-fe/components';
import { NotionEditor } from './Editor';

const meta: Meta<typeof NotionEditor> = {
  title: 'Editor/NotionEditor',
  component: NotionEditor,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    showToolbar: { control: 'boolean' },
    showFloatingToolbar: { control: 'boolean' },
    showSlashMenu: { control: 'boolean' },
    showDraggableBlocks: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NotionEditor>;

const INITIAL_DOC = `# Project Roadmap

Welcome to the **VLRC Enterprise Editor**!

- [x] Integrate Meta Lexical Core
- [x] Support Notion-style Slash command (\`/\`)
- [x] Bubble formatting toolbar on selection
- [ ] Connect Realtime Collaboration

> Fast, statically styled with Meta StyleX, and zero magic CSS values.`;

export const Default: Story = {
  render: (args) => (
    <Box style={{ width: 680, minHeight: 350 }}>
      <NotionEditor {...args} defaultValue={INITIAL_DOC} />
    </Box>
  ),
  args: {
    placeholder: "Type '/' for commands or write markdown...",
    showToolbar: true,
    showFloatingToolbar: true,
    showSlashMenu: true,
    showDraggableBlocks: true,
  },
};

export const ControlledWithMarkdownPreview: Story = {
  render: () => {
    const [markdown, setMarkdown] = useState(INITIAL_DOC);

    return (
      <VStack gap="md" style={{ width: 750 }}>
        <NotionEditor
          defaultValue={INITIAL_DOC}
          onChange={(nextMarkdown) => setMarkdown(nextMarkdown)}
        />

        <VStack gap="xs">
          <Text size="sm" weight="semibold">
            Live Serialized Markdown Output:
          </Text>
          <Box
            as="pre"
            style={{
              padding: '1rem',
              borderRadius: '6px',
              backgroundColor: 'var(--muted)',
              fontSize: '0.8125rem',
              overflowX: 'auto',
              border: '1px solid var(--border)',
            }}
          >
            {markdown}
          </Box>
        </VStack>
      </VStack>
    );
  },
};

export const MinimalNoToolbar: Story = {
  render: () => (
    <Box style={{ width: 680 }}>
      <NotionEditor
        showToolbar={false}
        placeholder="Type '/' to browse blocks, or select text for formatting..."
        defaultValue="Type '/' anywhere on a new line to see the block menu."
      />
    </Box>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Box style={{ width: 680 }}>
      <NotionEditor
        readOnly
        showToolbar={false}
        defaultValue="# Read-Only Document\n\nThis document cannot be modified."
      />
    </Box>
  ),
};

const PLAYGROUND_DOC = `# Welcome to the playground

> In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.

The playground is a demo environment built with **@lexical/react** and **Meta StyleX**. Try typing in **some text** with *different formats*.
Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!

If you'd like to find out more about Lexical, you can:
- Visit the **Lexical website** for documentation and more information.
- Check out the code on our **GitHub repository**.
- Playground code can be found here.
- Join our **Discord Server** and chat with the team.
  - Multi-level nested lists with **Tab** and **Shift + Tab**
    - Second tier nesting level (circle bullet)
      - Third tier nesting level (square bullet)

\`\`\`javascript
// Prism syntax highlighting in action
function greet(user) {
  console.log(\`Welcome to Meta Lexical Playground, \${user}!\`);
  return { status: 200, active: true };
}
\`\`\`

---

Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance!`;

export const LexicalPlayground: Story = {
  render: () => (
    <Box style={{ width: 780, maxWidth: '100%' }}>
      <NotionEditor
        defaultValue={PLAYGROUND_DOC}
        showToolbar={true}
        showFloatingToolbar={true}
        showSlashMenu={true}
        showDraggableBlocks={true}
        showTreeView={true}
        enableTabIndentation={true}
      />
    </Box>
  ),
};

export const NestedListsAndIndentation: Story = {
  render: () => (
    <VStack gap="md" style={{ width: 700 }}>
      <Box style={{ padding: '0.75rem 1rem', background: '#f1f5f9', borderRadius: '6px' }}>
        <Text size="sm" weight="semibold">
          💡 Keyboard Shortcuts for Lists:
        </Text>
        <Text size="xs" type="secondary">
          • Press <b>Tab</b> on any list item to increase indent / nest deeper.
          <br />• Press <b>Shift + Tab</b> to decrease indent / un-nest.
          <br />• Bullet shapes change dynamically per depth: Level 1 (● disc), Level 2 (○ circle),
          Level 3+ (■ square).
        </Text>
      </Box>
      <NotionEditor
        defaultValue={`- Main Goal 1\n  - Subtask 1.1 (Circle)\n    - Detail 1.1.1 (Square)\n- Main Goal 2\n  - Subtask 2.1\n\n1. Step 1 (1.)\n   1. Step 1a (a.)\n      1. Step 1a-i (i.)\n2. Step 2`}
        showToolbar={true}
        enableTabIndentation={true}
        showTreeView={false}
      />
    </VStack>
  ),
};

const TABLE_DOC = `# Table Management Demo

Below is an interactive Table. Hover or click inside any cell to see:
- 🔽 **Cell Action Menu**: Insert/delete rows and columns, toggle headers, set cell background colors.
- ↔️ **Column & Row Resizer**: Drag cell borders to resize width and height.
- ➕ **Hover Quick Add**: Quick "+" buttons on table borders.

| Feature | Status | Description |
| :--- | :---: | :--- |
| Insert Modal | ✅ | Custom rows & cols configuration |
| Action Menu | ✅ | Add/delete rows/cols, background colors |
| Resizer | ✅ | Drag cell borders interactively |
| Quick-Add | ✅ | Single-click row/column insertion |
`;

export const TableFeatures: Story = {
  render: () => (
    <Box style={{ width: 780, maxWidth: '100%' }}>
      <NotionEditor
        defaultValue={TABLE_DOC}
        showToolbar={true}
        showFloatingToolbar={true}
        showSlashMenu={true}
        showDraggableBlocks={true}
      />
    </Box>
  ),
};
