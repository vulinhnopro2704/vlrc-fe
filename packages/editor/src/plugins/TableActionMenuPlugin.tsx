import { useState, useEffect, useRef, useCallback, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $getTableColumnIndexFromTableCellNode,
  $insertTableRowAtNode,
  $insertTableColumnAtNode,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
  $setTableRowIsHeader,
  $setTableColumnIsHeader,
  $unmergeCellNode,
  TableCellHeaderStates,
} from '@lexical/table';
import { mergeRegister } from '@lexical/utils';
import { create } from '@stylexjs/stylex';
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Table as TableIcon,
  Columns,
  Rows,
  Split,
} from 'lucide-react';
import { colors, radius, shadow, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import {
  Box,
  Button,
  Text,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@vlrc-fe/components';

const styles = create({
  actionButtonContainer: {
    position: 'absolute',
    zIndex: 20,
    pointerEvents: 'auto',
  },
  triggerButton: {
    width: '20px',
    height: '20px',
    minWidth: '20px',
    padding: 0,
    borderRadius: radius.sm,
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
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '120ms',
    ':hover': {
      backgroundColor: colors.surfaceSubtle,
      color: colors.fgDefault,
    },
  },
  colorSwatch: {
    width: '14px',
    height: '14px',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
    marginRight: spacing.sm,
    flexShrink: 0,
  },
});

const CELL_BG_COLORS = [
  { name: 'Default (Transparent)', value: null, hex: 'transparent' },
  { name: 'Muted Gray', value: '#f1f5f9', hex: '#f1f5f9' },
  { name: 'Soft Red', value: '#fee2e2', hex: '#fee2e2' },
  { name: 'Soft Amber', value: '#fef3c7', hex: '#fef3c7' },
  { name: 'Soft Green', value: '#dcfce7', hex: '#dcfce7' },
  { name: 'Soft Blue', value: '#dbeafe', hex: '#dbeafe' },
  { name: 'Soft Purple', value: '#f3e8ff', hex: '#f3e8ff' },
  { name: 'Soft Pink', value: '#fce7f3', hex: '#fce7f3' },
];

export interface TableActionMenuPluginProps {
  anchorElem: HTMLElement;
}

export function TableActionMenuPlugin({
  anchorElem,
}: TableActionMenuPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [cellNodeKey, setCellNodeKey] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLDivElement | null>(null);

  const updateMenuPosition = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        if (!isMenuOpen) {
          setMenuPosition(null);
          setCellNodeKey(null);
        }
        return;
      }

      const anchorNode = selection.anchor.getNode();
      const cellNode = $getTableCellNodeFromLexicalNode(anchorNode);

      if (!cellNode) {
        if (!isMenuOpen) {
          setMenuPosition(null);
          setCellNodeKey(null);
        }
        return;
      }

      setCellNodeKey(cellNode.getKey());

      const domElement = editor.getElementByKey(cellNode.getKey());
      if (domElement && anchorElem) {
        const cellRect = domElement.getBoundingClientRect();
        const anchorRect = anchorElem.getBoundingClientRect();

        const top = cellRect.top - anchorRect.top + 4;
        const left = cellRect.right - anchorRect.left - 24;

        setMenuPosition({ top, left });
      }
    });
  }, [editor, anchorElem, isMenuOpen]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateMenuPosition();
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateMenuPosition();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateMenuPosition]);

  const insertRow = useCallback(
    (insertAfter: boolean) => {
      if (!cellNodeKey) return;
      editor.update(() => {
        const cellNode = editor.getElementByKey(cellNodeKey);
        if (cellNode) {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const activeCell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
            if (activeCell) {
              $insertTableRowAtNode(activeCell, insertAfter);
            }
          }
        }
      });
      setIsMenuOpen(false);
    },
    [editor, cellNodeKey],
  );

  const insertColumn = useCallback(
    (insertAfter: boolean) => {
      if (!cellNodeKey) return;
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const activeCell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
          if (activeCell) {
            $insertTableColumnAtNode(activeCell, insertAfter);
          }
        }
      });
      setIsMenuOpen(false);
    },
    [editor, cellNodeKey],
  );

  const deleteRow = useCallback(() => {
    editor.update(() => {
      $deleteTableRowAtSelection();
    });
    setIsMenuOpen(false);
    setMenuPosition(null);
  }, [editor]);

  const deleteColumn = useCallback(() => {
    editor.update(() => {
      $deleteTableColumnAtSelection();
    });
    setIsMenuOpen(false);
    setMenuPosition(null);
  }, [editor]);

  const deleteTable = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const activeCell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
        if (activeCell) {
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(activeCell);
          tableNode.remove();
        }
      }
    });
    setIsMenuOpen(false);
    setMenuPosition(null);
  }, [editor]);

  const setCellBackgroundColor = useCallback(
    (color: string | null) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const activeCell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
          if (activeCell) {
            activeCell.setBackgroundColor(color);
          }
        }
      });
      setIsMenuOpen(false);
    },
    [editor],
  );

  const toggleHeaderRow = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const activeCell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
        if (activeCell) {
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(activeCell);
          const rowIndex = $getTableRowIndexFromTableCellNode(activeCell);
          const isCurrentlyHeader = activeCell.hasHeaderState(TableCellHeaderStates.ROW);
          $setTableRowIsHeader(tableNode, rowIndex, !isCurrentlyHeader);
        }
      }
    });
    setIsMenuOpen(false);
  }, [editor]);

  const toggleHeaderColumn = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const activeCell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
        if (activeCell) {
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(activeCell);
          const colIndex = $getTableColumnIndexFromTableCellNode(activeCell);
          const isCurrentlyHeader = activeCell.hasHeaderState(TableCellHeaderStates.COLUMN);
          $setTableColumnIsHeader(tableNode, colIndex, !isCurrentlyHeader);
        }
      }
    });
    setIsMenuOpen(false);
  }, [editor]);

  const unmergeCells = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const activeCell = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
        if (activeCell) {
          $unmergeCellNode(activeCell);
        }
      }
    });
    setIsMenuOpen(false);
  }, [editor]);

  if (!menuPosition || !anchorElem) return null;

  return createPortal(
    <Box
      ref={menuButtonRef}
      className="vlrc-table-action-menu-container"
      sx={styles.actionButtonContainer}
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            sx={styles.triggerButton}
            aria-label="Table cell actions"
          >
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ minWidth: '200px' }}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <Text size="xs" weight="medium" color="muted">
                Rows & Columns
              </Text>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => insertRow(false)}>
              <ArrowUp size={14} style={{ marginRight: 8 }} />
              Insert row above
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertRow(true)}>
              <ArrowDown size={14} style={{ marginRight: 8 }} />
              Insert row below
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertColumn(false)}>
              <ArrowLeft size={14} style={{ marginRight: 8 }} />
              Insert column left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertColumn(true)}>
              <ArrowRight size={14} style={{ marginRight: 8 }} />
              Insert column right
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <Text size="xs" weight="medium" color="muted">
                Headers & Spans
              </Text>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={toggleHeaderRow}>
              <Rows size={14} style={{ marginRight: 8 }} />
              Toggle Row Header
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleHeaderColumn}>
              <Columns size={14} style={{ marginRight: 8 }} />
              Toggle Column Header
            </DropdownMenuItem>
            <DropdownMenuItem onClick={unmergeCells}>
              <Split size={14} style={{ marginRight: 8 }} />
              Unmerge Cell
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <Text size="xs" weight="medium" color="muted">
                Cell Background
              </Text>
            </DropdownMenuLabel>
            {CELL_BG_COLORS.map((item) => (
              <DropdownMenuItem key={item.name} onClick={() => setCellBackgroundColor(item.value)}>
                <Box
                  sx={styles.colorSwatch}
                  style={{ backgroundColor: item.hex }}
                  aria-hidden="true"
                />
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={deleteRow} variant="destructive">
              <Trash2 size={14} style={{ marginRight: 8 }} />
              Delete row
            </DropdownMenuItem>
            <DropdownMenuItem onClick={deleteColumn} variant="destructive">
              <Trash2 size={14} style={{ marginRight: 8 }} />
              Delete column
            </DropdownMenuItem>
            <DropdownMenuItem onClick={deleteTable} variant="destructive">
              <TableIcon size={14} style={{ marginRight: 8 }} />
              Delete table
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>,
    anchorElem,
  );
}
export default TableActionMenuPlugin;
