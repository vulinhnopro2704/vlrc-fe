// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  createEditor,
  $getRoot,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { NotionEditor } from '../Editor';
import {
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
  $insertCollapsible,
  $isCollapsibleTitleNode,
} from '../nodes/CollapsibleNodes';
import { SLASH_OPTIONS } from './slashMenuOptions';

describe('SlashMenuPlugin', () => {
  it('should render editor with SlashMenuPlugin enabled without errors', () => {
    const { container } = render(<NotionEditor showSlashMenu={true} showToolbar={false} />);
    expect(container.querySelector('[data-slot="notion-editor"]')).toBeInTheDocument();
  });

  it('should order toggle items immediately following Divider in basic blocks before callout in media blocks', () => {
    const titles = SLASH_OPTIONS.map((opt) => opt.title);
    const dividerIdx = titles.indexOf('Divider');
    expect(dividerIdx).toBeGreaterThan(-1);

    expect(titles[dividerIdx + 1]).toBe('Toggle List');
    expect(titles[dividerIdx + 2]).toBe('Toggle Heading 1');
    expect(titles[dividerIdx + 3]).toBe('Toggle Heading 2');
    expect(titles[dividerIdx + 4]).toBe('Toggle Heading 3');
    expect(titles[dividerIdx + 5]).toBe('Callout');

    expect(SLASH_OPTIONS[dividerIdx + 1].category).toBe('basic');
    expect(SLASH_OPTIONS[dividerIdx + 2].category).toBe('basic');
    expect(SLASH_OPTIONS[dividerIdx + 3].category).toBe('basic');
    expect(SLASH_OPTIONS[dividerIdx + 4].category).toBe('basic');
    expect(SLASH_OPTIONS[dividerIdx + 5].category).toBe('media');
  });

  it('should focus title paragraph when $insertCollapsible is called', () => {
    const editor = createEditor({
      nodes: [CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode],
    });

    editor.update(() => {
      const root = $getRoot();
      const p = $createParagraphNode();
      root.append(p);
      p.select();

      const container = $insertCollapsible('h1');
      expect(container).not.toBeNull();

      const selection = $getSelection();
      expect($isRangeSelection(selection)).toBe(true);
      if ($isRangeSelection(selection)) {
        const selectedNode = selection.anchor.getNode();
        const parent = selectedNode.getParent();
        const isInTitle =
          $isCollapsibleTitleNode(selectedNode) ||
          $isCollapsibleTitleNode(parent) ||
          selectedNode.getParent()?.getParent() instanceof CollapsibleTitleNode;
        expect(isInTitle).toBe(true);
      }
    });
  });
});
