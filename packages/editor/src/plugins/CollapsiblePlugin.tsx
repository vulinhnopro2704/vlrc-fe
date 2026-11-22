import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $findMatchingParent,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  COMMAND_PRIORITY_LOW,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  mergeRegister,
} from 'lexical';
import {
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  $isCollapsibleContainerNode,
  $isCollapsibleContentNode,
  $isCollapsibleTitleNode,
} from '../nodes/CollapsibleNodes';

export function CollapsiblePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const $onEscapeUp = () => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) &&
        selection.isCollapsed() &&
        selection.anchor.offset === 0
      ) {
        const container = $findMatchingParent(
          selection.anchor.getNode(),
          $isCollapsibleContainerNode,
        );

        if ($isCollapsibleContainerNode(container)) {
          const parent = container.getParent();
          if (
            parent !== null &&
            parent.getFirstChild() === container &&
            selection.anchor.key === container.getFirstDescendant()?.getKey()
          ) {
            container.insertBefore($createParagraphNode());
          }
        }
      }
      return false;
    };

    const $onEscapeDown = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && selection.isCollapsed()) {
        const container = $findMatchingParent(
          selection.anchor.getNode(),
          $isCollapsibleContainerNode,
        );

        if ($isCollapsibleContainerNode(container)) {
          const parent = container.getParent();
          if (parent !== null && parent.getLastChild() === container) {
            const titleParagraph = container.getFirstDescendant();
            const contentParagraph = container.getLastDescendant();

            if (
              (contentParagraph !== null &&
                selection.anchor.key === contentParagraph.getKey() &&
                selection.anchor.offset === contentParagraph.getTextContentSize()) ||
              (titleParagraph !== null &&
                selection.anchor.key === titleParagraph.getKey() &&
                selection.anchor.offset === titleParagraph.getTextContentSize() &&
                !container.getOpen())
            ) {
              container.insertAfter($createParagraphNode());
            }
          }
        }
      }
      return false;
    };

    return mergeRegister(
      // Enter in Title: Focus or navigate to first block in Content instead of creating a second paragraph in title
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent | null) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
            return false;
          }

          const titleNode = $findMatchingParent(
            selection.anchor.getNode(),
            $isCollapsibleTitleNode,
          );

          if ($isCollapsibleTitleNode(titleNode)) {
            if (event) {
              event.preventDefault();
            }
            const container = titleNode.getParent();
            if ($isCollapsibleContainerNode(container)) {
              if (!container.getOpen()) {
                container.setOpen(true);
              }
              const content = titleNode.getNextSibling();
              if ($isCollapsibleContentNode(content)) {
                const firstChild = content.getFirstChild();
                if ($isElementNode(firstChild)) {
                  firstChild.selectStart();
                } else {
                  const p = $createParagraphNode();
                  content.append(p);
                  p.select();
                }
                return true;
              }
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      // Also intercept INSERT_PARAGRAPH_COMMAND in title to guarantee no new paragraph is added inside summary
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const titleNode = $findMatchingParent(
              selection.anchor.getNode(),
              $isCollapsibleTitleNode,
            );

            if ($isCollapsibleTitleNode(titleNode)) {
              const container = titleNode.getParent();
              if ($isCollapsibleContainerNode(container)) {
                if (!container.getOpen()) {
                  container.setOpen(true);
                }
                const content = titleNode.getNextSibling();
                if ($isCollapsibleContentNode(content)) {
                  const firstChild = content.getFirstChild();
                  if ($isElementNode(firstChild)) {
                    firstChild.selectStart();
                  } else {
                    const p = $createParagraphNode();
                    content.append(p);
                    p.select();
                  }
                  return true;
                }
              }
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      // Arrow navigation escapes
      editor.registerCommand(KEY_ARROW_DOWN_COMMAND, $onEscapeDown, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, $onEscapeDown, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_UP_COMMAND, $onEscapeUp, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_LEFT_COMMAND, $onEscapeUp, COMMAND_PRIORITY_LOW),

      // Structural integrity transforms
      editor.registerNodeTransform(CollapsibleContentNode, (node) => {
        const parent = node.getParent();
        if (!$isCollapsibleContainerNode(parent)) {
          const children = node.getChildren();
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        } else if (node.isEmpty()) {
          node.append($createParagraphNode());
        }
      }),

      editor.registerNodeTransform(CollapsibleTitleNode, (node) => {
        const parent = node.getParent();
        if (!$isCollapsibleContainerNode(parent)) {
          node.replace($createParagraphNode().append(...node.getChildren()));
        } else if (node.getChildrenSize() > 1) {
          const content = node.getNextSibling();
          if ($isCollapsibleContentNode(content)) {
            const children = node.getChildren();
            for (let i = 1; i < children.length; i++) {
              content.append(children[i]);
            }
          }
        }
      }),

      editor.registerNodeTransform(CollapsibleContainerNode, (node) => {
        const children = node.getChildren();
        if (
          children.length !== 2 ||
          !$isCollapsibleTitleNode(children[0]) ||
          !$isCollapsibleContentNode(children[1])
        ) {
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),
    );
  }, [editor]);

  return null;
}
