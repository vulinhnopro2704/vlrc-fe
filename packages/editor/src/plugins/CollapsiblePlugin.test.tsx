// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import {
  createEditor,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  KEY_ENTER_COMMAND,
} from 'lexical';
import { ListNode, ListItemNode, $insertList } from '@lexical/list';
import {
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
  $createCollapsibleContainerNode,
  $createCollapsibleTitleNode,
  $createCollapsibleContentNode,
  $isCollapsibleTitleNode,
  $isCollapsibleContentNode,
} from '../nodes/CollapsibleNodes';

describe('CollapsibleNodes & CollapsiblePlugin', () => {
  it('should identify CollapsibleContainerNode and CollapsibleContentNode as shadow roots', () => {
    const editor = createEditor({
      nodes: [CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode],
    });

    editor.update(() => {
      const container = $createCollapsibleContainerNode(true);
      const content = $createCollapsibleContentNode();
      expect(container.isShadowRoot()).toBe(true);
      expect(content.isShadowRoot()).toBe(true);
    });
  });

  it('should navigate from CollapsibleTitleNode to CollapsibleContentNode on insertNewAfter', () => {
    const editor = createEditor({
      nodes: [CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode],
    });

    editor.update(() => {
      const root = $getRoot();
      const container = $createCollapsibleContainerNode(false, 'default');
      const title = $createCollapsibleTitleNode('default');
      const titleP = $createParagraphNode();
      titleP.append($createTextNode('My Title'));
      title.append(titleP);

      const content = $createCollapsibleContentNode();
      const contentP = $createParagraphNode();
      contentP.append($createTextNode('My Content'));
      content.append(contentP);

      container.append(title, content);
      root.append(container);

      titleP.select();
      const selection = $getSelection();
      expect($isRangeSelection(selection)).toBe(true);

      if ($isRangeSelection(selection)) {
        const nextTarget = title.insertNewAfter(selection);
        expect(nextTarget).toBe(contentP);
        expect(container.getOpen()).toBe(true);
      }
    });
  });

  it('should support $insertList inside CollapsibleContentNode without climbing outside', () => {
    const editor = createEditor({
      nodes: [
        CollapsibleContainerNode,
        CollapsibleTitleNode,
        CollapsibleContentNode,
        ListNode,
        ListItemNode,
      ],
    });

    editor.update(() => {
      const root = $getRoot();
      const container = $createCollapsibleContainerNode(true, 'default');
      const title = $createCollapsibleTitleNode('default');
      const titleP = $createParagraphNode();
      title.append(titleP);

      const content = $createCollapsibleContentNode();
      const contentP = $createParagraphNode();
      contentP.append($createTextNode('List item one'));
      content.append(contentP);

      container.append(title, content);
      root.append(container);

      // Select content paragraph
      contentP.select();

      // Convert into bullet list
      $insertList('bullet');

      // Verify that content contains a ListNode
      const children = content.getChildren();
      expect(children.length).toBe(1);
      const firstChild = children[0];
      expect(firstChild instanceof ListNode).toBe(true);
      if (firstChild instanceof ListNode) {
        expect(firstChild.getListType()).toBe('bullet');
        const listItems = firstChild.getChildren();
        expect(listItems.length).toBe(1);
        expect(listItems[0].getTextContent()).toBe('List item one');
      }

      // Container should still have exactly title and content
      expect(container.getChildren().length).toBe(2);
      expect($isCollapsibleTitleNode(container.getChildren()[0])).toBe(true);
      expect($isCollapsibleContentNode(container.getChildren()[1])).toBe(true);
    });
  });

  it('should navigate from Title to Content when KEY_ENTER_COMMAND is handled', () => {
    const editor = createEditor({
      nodes: [CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode],
    });

    // Register our plugin listener pattern directly
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor.getNode();
          const title = anchor instanceof CollapsibleTitleNode ? anchor : anchor.getParent();
          if ($isCollapsibleTitleNode(title)) {
            const container = title.getParent();
            if (container instanceof CollapsibleContainerNode) {
              container.setOpen(true);
              const content = title.getNextSibling();
              if ($isCollapsibleContentNode(content)) {
                const firstChild = content.getFirstChild();
                if ($isElementNode(firstChild)) {
                  firstChild.selectStart();
                  return true;
                }
              }
            }
          }
        }
        return false;
      },
      1,
    );

    editor.update(() => {
      const root = $getRoot();
      const container = $createCollapsibleContainerNode(false, 'default');
      const title = $createCollapsibleTitleNode('default');
      const titleP = $createParagraphNode();
      titleP.append($createTextNode('Title Header'));
      title.append(titleP);

      const content = $createCollapsibleContentNode();
      const contentP = $createParagraphNode();
      contentP.append($createTextNode('Body Text'));
      content.append(contentP);

      container.append(title, content);
      root.append(container);

      titleP.select();
      const handled = editor.dispatchCommand(KEY_ENTER_COMMAND, null);
      expect(handled).toBe(true);
      expect(container.getOpen()).toBe(true);

      const newSelection = $getSelection();
      expect($isRangeSelection(newSelection)).toBe(true);
      if ($isRangeSelection(newSelection)) {
        // Selection should now be in content
        const selectedNode = newSelection.anchor.getNode();
        const isInContent =
          selectedNode === contentP ||
          selectedNode.getParent() === content ||
          selectedNode.getParent()?.getParent() === content;
        expect(isInContent).toBe(true);
      }
    });
  });
});
