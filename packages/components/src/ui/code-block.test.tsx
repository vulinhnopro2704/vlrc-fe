import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockLanguage,
  CodeBlockCopyButton,
  CodeBlockWrapButton,
  CodeBlockExpandButton,
  CodeBlockContent,
} from './code-block';
import type { CodeBlockProps } from './code-block';

// Test constants
const SAMPLE_CODE = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

const SAMPLE_TITLE = 'greet.ts';
const SAMPLE_LANG = 'typescript';

const createDefaultProps = (overrides?: Partial<CodeBlockProps>): CodeBlockProps => ({
  code: SAMPLE_CODE,
  language: SAMPLE_LANG,
  showLineNumbers: true,
  ...overrides,
});

describe('CodeBlock', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(
        <CodeBlock {...createDefaultProps()}>
          <CodeBlockHeader>
            <CodeBlockTitle>{SAMPLE_TITLE}</CodeBlockTitle>
            <CodeBlockLanguage />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
        </CodeBlock>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with highlighted lines and diff indicators', () => {
      const { asFragment } = render(
        <CodeBlock
          {...createDefaultProps({
            highlightedLines: [1],
            diff: { 2: { added: true } },
          })}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>{SAMPLE_TITLE}</CodeBlockTitle>
          </CodeBlockHeader>
        </CodeBlock>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when line numbers are hidden', () => {
      const { asFragment } = render(
        <CodeBlock {...createDefaultProps({ showLineNumbers: false })} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when maxLines is set', () => {
      const { asFragment } = render(<CodeBlock {...createDefaultProps({ maxLines: 1 })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should copy code to clipboard when copy button is clicked', async () => {
      render(
        <CodeBlock code={SAMPLE_CODE}>
          <CodeBlockHeader>
            <CodeBlockCopyButton />
          </CodeBlockHeader>
        </CodeBlock>,
      );

      const copyBtn = screen.getByRole('button', { name: /copy code/i });
      expect(copyBtn).toHaveAttribute('data-copied', 'false');

      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(SAMPLE_CODE);
      expect(copyBtn).toHaveAttribute('data-copied', 'true');
    });

    it('should toggle soft wrapping when wrap button is clicked', async () => {
      const onWrapChange = vi.fn();
      render(
        <CodeBlock code={SAMPLE_CODE} onWrapChange={onWrapChange}>
          <CodeBlockHeader>
            <CodeBlockWrapButton />
          </CodeBlockHeader>
        </CodeBlock>,
      );

      const wrapBtn = screen.getByRole('button', { name: /toggle line wrapping/i });
      expect(wrapBtn).toHaveAttribute('data-wrapped', 'false');

      await act(async () => {
        fireEvent.click(wrapBtn);
      });

      expect(onWrapChange).toHaveBeenCalledWith(true);
      expect(wrapBtn).toHaveAttribute('data-wrapped', 'true');
    });

    it('should expand and collapse lines when maxLines is exceeded', async () => {
      render(<CodeBlock code={SAMPLE_CODE} maxLines={1} />);

      const expandBtn = screen.getByRole('button', { name: /show more lines/i });
      expect(expandBtn).toBeInTheDocument();

      // Initially only 1 line displayed
      expect(screen.queryByText(/Hello,/)).not.toBeInTheDocument();

      await act(async () => {
        fireEvent.click(expandBtn);
      });

      // After expand, all lines are visible
      expect(screen.getByText(/Hello,/)).toBeInTheDocument();
    });

    it('should render explicit CodeBlockContent when provided in children', () => {
      const { container } = render(
        <CodeBlock code={SAMPLE_CODE}>
          <CodeBlockContent />
        </CodeBlock>,
      );

      const contentSlots = container.querySelectorAll('[data-slot="code-block-content"]');
      expect(contentSlots.length).toBe(1);
    });
  });
});
