import { useState, useEffect, useRef, useCallback, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getTableCellNodeFromLexicalNode } from '@lexical/table';
import { $getNearestNodeFromDOMNode } from 'lexical';
import { create } from '@stylexjs/stylex';
import { colors, radius } from '@vlrc-fe/components/theme/tokens.stylex';
import { Box } from '@vlrc-fe/components';

const styles = create({
  resizerLine: {
    position: 'absolute',
    pointerEvents: 'auto',
    zIndex: 15,
  },
  colResizer: {
    width: '6px',
    cursor: 'col-resize',
    backgroundColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: '120ms',
    borderRadius: radius.sm,
    ':hover': {
      backgroundColor: colors.primary,
    },
  },
  colResizerActive: {
    backgroundColor: colors.primary,
  },
  rowResizer: {
    height: '6px',
    cursor: 'row-resize',
    backgroundColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: '120ms',
    borderRadius: radius.sm,
    ':hover': {
      backgroundColor: colors.primary,
    },
  },
  rowResizerActive: {
    backgroundColor: colors.primary,
  },
});

export interface TableCellResizerPluginProps {
  anchorElem: HTMLElement;
}

export function TableCellResizerPlugin({
  anchorElem,
}: TableCellResizerPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [activeCell, setActiveCell] = useState<{
    element: HTMLTableCellElement;
    key: string;
    rect: DOMRect;
  } | null>(null);

  const [isResizingCol, setIsResizingCol] = useState(false);
  const [isResizingRow, setIsResizingRow] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isResizingCol || isResizingRow) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const cellElement = target.closest('td, th') as HTMLTableCellElement | null;
      if (!cellElement) {
        setActiveCell(null);
        return;
      }

      editor.getEditorState().read(() => {
        const node = $getNearestNodeFromDOMNode(cellElement);
        const cellNode = node ? $getTableCellNodeFromLexicalNode(node) : null;
        if (cellNode) {
          setActiveCell({
            element: cellElement,
            key: cellNode.getKey(),
            rect: cellElement.getBoundingClientRect(),
          });
        }
      });
    },
    [editor, isResizingCol, isResizingRow],
  );

  useEffect(() => {
    if (!anchorElem) return;
    anchorElem.addEventListener('mousemove', onMouseMove);
    return () => {
      anchorElem.removeEventListener('mousemove', onMouseMove);
    };
  }, [anchorElem, onMouseMove]);

  const startColResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!activeCell) return;

      setIsResizingCol(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: activeCell.element.offsetWidth,
        height: activeCell.element.offsetHeight,
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!dragStartRef.current || !activeCell) return;
        const deltaX = moveEvent.clientX - dragStartRef.current.x;
        const newWidth = Math.max(40, dragStartRef.current.width + deltaX);
        activeCell.element.style.width = `${newWidth}px`;
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        if (dragStartRef.current && activeCell) {
          const deltaX = upEvent.clientX - dragStartRef.current.x;
          const finalWidth = Math.max(40, dragStartRef.current.width + deltaX);
          editor.update(() => {
            const node = editor.getElementByKey(activeCell.key);
            if (node) {
              const lexicalNode = $getNearestNodeFromDOMNode(node);
              const cellNode = lexicalNode ? $getTableCellNodeFromLexicalNode(lexicalNode) : null;
              if (cellNode) {
                cellNode.setWidth(finalWidth);
              }
            }
          });
        }
        setIsResizingCol(false);
        dragStartRef.current = null;
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [activeCell, editor],
  );

  const startRowResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!activeCell) return;

      setIsResizingRow(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: activeCell.element.offsetWidth,
        height: activeCell.element.offsetHeight,
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!dragStartRef.current || !activeCell) return;
        const deltaY = moveEvent.clientY - dragStartRef.current.y;
        const newHeight = Math.max(30, dragStartRef.current.height + deltaY);
        activeCell.element.style.height = `${newHeight}px`;
      };

      const handlePointerUp = () => {
        setIsResizingRow(false);
        dragStartRef.current = null;
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [activeCell],
  );

  if (!activeCell || !anchorElem) return null;

  const anchorRect = anchorElem.getBoundingClientRect();
  const colLeft = activeCell.rect.right - anchorRect.left - 3;
  const colTop = activeCell.rect.top - anchorRect.top;
  const colHeight = activeCell.rect.height;

  const rowTop = activeCell.rect.bottom - anchorRect.top - 3;
  const rowLeft = activeCell.rect.left - anchorRect.left;
  const rowWidth = activeCell.rect.width;

  return createPortal(
    <>
      {/* Column Resizer Handle */}
      <Box
        className="vlrc-table-col-resizer"
        sx={[styles.resizerLine, styles.colResizer, isResizingCol && styles.colResizerActive]}
        style={{
          left: `${colLeft}px`,
          top: `${colTop}px`,
          height: `${colHeight}px`,
        }}
        onMouseDown={startColResize}
        aria-hidden="true"
      />

      {/* Row Resizer Handle */}
      <Box
        className="vlrc-table-row-resizer"
        sx={[styles.resizerLine, styles.rowResizer, isResizingRow && styles.rowResizerActive]}
        style={{
          left: `${rowLeft}px`,
          top: `${rowTop}px`,
          width: `${rowWidth}px`,
        }}
        onMouseDown={startRowResize}
        aria-hidden="true"
      />
    </>,
    anchorElem,
  );
}

export default TableCellResizerPlugin;
