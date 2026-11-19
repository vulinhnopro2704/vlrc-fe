import type { Meta, StoryObj } from '@storybook/react';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockLanguage,
  CodeBlockCopyButton,
  CodeBlockWrapButton,
} from './code-block';
import { Box, VStack } from '../layout';

const meta: Meta<typeof CodeBlock> = {
  title: 'Content/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    language: { control: 'text' },
    showLineNumbers: { control: 'boolean' },
    wrap: { control: 'boolean' },
    maxLines: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const SNIPPET_TS = `import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@vlrc-fe/components/theme';

export function Banner({ title }: { title: string }) {
  return (
    <div {...stylex.props(styles.root)}>
      <h3>{title}</h3>
    </div>
  );
}

const styles = stylex.create({
  root: {
    backgroundColor: colors.surfaceDefault,
    color: colors.fgDefault,
  },
});`;

export const Default: Story = {
  render: (args) => (
    <Box style={{ width: 550 }}>
      <CodeBlock {...args}>
        <CodeBlockHeader>
          <CodeBlockTitle>Banner.tsx</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockWrapButton />
          <CodeBlockCopyButton />
        </CodeBlockHeader>
      </CodeBlock>
    </Box>
  ),
  args: {
    code: SNIPPET_TS,
    language: 'tsx',
    showLineNumbers: true,
  },
};

export const LineAndWordHighlights: Story = {
  render: () => (
    <Box style={{ width: 550 }}>
      <CodeBlock
        code={SNIPPET_TS}
        language="tsx"
        highlightedLines={[5, 6, 7]}
        highlightWords={['stylex', 'colors']}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>Banner.tsx (Highlighted)</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton />
        </CodeBlockHeader>
      </CodeBlock>
    </Box>
  ),
};

export const DiffView: Story = {
  render: () => {
    const diffCode = `export interface Config {
  version: number;
  apiEndpoint: string;
  enableTelemetry: boolean;
}`;
    return (
      <Box style={{ width: 550 }}>
        <CodeBlock
          code={diffCode}
          language="typescript"
          diff={{
            2: { removed: true },
            3: { added: true },
          }}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>git diff config.ts</CodeBlockTitle>
            <CodeBlockCopyButton />
          </CodeBlockHeader>
        </CodeBlock>
      </Box>
    );
  },
};

export const CollapsedWithMaxLines: Story = {
  render: () => (
    <Box style={{ width: 550 }}>
      <CodeBlock code={SNIPPET_TS} language="tsx" maxLines={6}>
        <CodeBlockHeader>
          <CodeBlockTitle>LongFile.tsx (Capped at 6 lines)</CodeBlockTitle>
          <CodeBlockCopyButton />
        </CodeBlockHeader>
      </CodeBlock>
    </Box>
  ),
};
