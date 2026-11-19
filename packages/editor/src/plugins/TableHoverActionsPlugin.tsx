import { useState, useEffect, useCallback, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getTableCellNodeFromLexicalNode,
  $insertTableRowAtNode,
  $insertTableColumnAtNode,
} from '@lexical/table';
import { $getNearestNodeFromDOMNode } from 'lexical';
import { Plus } from 'lucide-react';
import { create } from '@stylexjs/stylex';
import { colors, radius, shadow } from '@vlrc-fe/components/theme/tokens.stylex';
import { Button } from '@vlrc-fe/components';

const styles = create({
  hoverButton: {
    position: 'absolute',
    zIndex: 25,
    width: '18px',
    height: '18px',
    minWidth: '18px',
    padding: 0,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceDefault,
    borderColor: colors.borderDefault,
    borderWidth: 1,
    borderStyle: 'solid',
    boxShadow: shadow.sm,
    color: colors.fgMuted,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'background-color, color, transform',
    transitionDuration: '120ms',
    ':hover': {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
      borderColor: colors.primary,
      transform: 'scale(1.15)',
    },
  },
});

export interface TableHoverActionsPluginProps {
  anchorElem: HTMLElement;
}

export function TableHoverActionsPlugin({
  anchorElem,
}: TableHoverActionsPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [hoveredCell, setHoveredCell] = useState<{
    element: HTMLTableCellElement;
    key: string;
    rect: DOMRect;
  } | null>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cellElement = target.closest('td, th') as HTMLTableCellElement | null;
      if (!cellElement) {
        setHoveredCell(null);
        return;
      }

      editor.getEditorState().read(() => {
        const node = $getNearestNodeFromDOMNode(cellElement);
        const cellNode = node ? $getTableCellNodeFromLexicalNode(node) : null;
        if (cellNode) {
          setHoveredCell({
            element: cellElement,
            key: cellNode.getKey(),
            rect: cellElement.getBoundingClientRect(),
          });
        }
      });
    },
    [editor],
  );

  useEffect(() => {
    if (!anchorElem) return;
    anchorElem.addEventListener('mousemove', onMouseMove);
    return () => {
      anchorElem.removeEventListener('mousemove', onMouseMove);
    };
  }, [anchorElem, onMouseMove]);

  const insertRow = useCallback(() => {
    if (!hoveredCell) return;
    editor.update(() => {
      const node = editor.getElementByKey(hoveredCell.key);
      if (node) {
        const lexicalNode = $getNearestNodeFromDOMNode(node);
        const cellNode = lexicalNode ? $getTableCellNodeFromLexicalNode(lexicalNode) : null;
        if (cellNode) {
          $insertTableRowAtNode(cellNode, true);
        }
      }
    });
    setHoveredCell(null);
  }, [editor, hoveredCell]);

  const insertColumn = useCallback(() => {
    if (!hoveredCell) return;
    editor.update(() => {
      const node = editor.getElementByKey(hoveredCell.key);
      if (node) {
        const lexicalNode = $getNearestNodeFromDOMNode(node);
        const cellNode = lexicalNode ? $getTableCellNodeFromLexicalNode(lexicalNode) : null;
        if (cellNode) {
          $insertTableColumnAtNode(cellNode, true);
        }
      }
    });
    setHoveredCell(null);
  }, [editor, hoveredCell]);

  if (!hoveredCell || !anchorElem) return null;

  const anchorRect = anchorElem.getBoundingClientRect();
  const colAddLeft = hoveredCell.rect.right - anchorRect.left - 9;
  const colAddTop = hoveredCell.rect.top - anchorRect.top - 12;

  const rowAddTop = hoveredCell.rect.bottom - anchorRect.top - 9;
  const rowAddLeft = hoveredCell.rect.left - anchorRect.left - 12;

  return createPortal(
    <>
      {/* Quick Add Column Button at top-right of cell */}
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        sx={styles.hoverButton}
        style={{
          left: `${colAddLeft}px`,
          top: `${colAddTop}px`,
        }}
        onClick={insertColumn}
        aria-label="Add column right"
      >
        <Plus size={10} />
      </Button>

      {/* Quick Add Row Button at bottom-left of cell */}
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        sx={styles.hoverButton}
        style={{
          left: `${rowAddLeft}px`,
          top: `${rowAddTop}px`,
        }}
        onClick={insertRow}
        aria-label="Add row below"
      >
        <Plus size={10} />
      </Button>
    </>,
    anchorElem,
  );
}

export default TableHoverActionsPlugin;
