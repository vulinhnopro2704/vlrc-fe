import { useState, useMemo, useCallback, useEffect, type JSX, type ReactNode } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $createParagraphNode,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import { create } from '@stylexjs/stylex';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Lightbulb,
  Type,
  Minus,
  Table as TableIcon,
  Image as ImageIcon,
  FolderTree,
  Video,
  Frame as FigmaIcon,
} from 'lucide-react';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { colors, radius, shadow, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import { Box, VStack, Text } from '@vlrc-fe/components';
import { $createCalloutNode } from '../nodes/CalloutNode';
import {
  $createCollapsibleContainerNode,
  $createCollapsibleTitleNode,
  $createCollapsibleContentNode,
} from '../nodes/CollapsibleNodes';
import { $createImageNode } from '../nodes/ImageNode';
import { $createYouTubeNode, $createFigmaNode } from '../nodes/EmbedNodes';
import { InsertTableDialog } from './InsertTableDialog';

const styles = create({
  menu: {
    position: 'absolute',
    zIndex: 50,
    width: '260px',
    maxHeight: '320px',
    overflowY: 'auto',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceDefault,
    boxShadow: shadow.lg,
    padding: spacing['1'],
    boxSizing: 'border-box',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    borderRadius: radius.sm,
    cursor: 'pointer',
    userSelect: 'none',
    transitionProperty: 'background-color',
    transitionDuration: '100ms',
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  itemSelected: {
    backgroundColor: colors.surfaceSubtle,
  },
  iconBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSubtle,
    color: colors.fgMuted,
    flexShrink: 0,
  },
});

interface SlashOption {
  title: string;
  description: string;
  icon: ReactNode;
  actionId?: string;
  onSelect: (editor: ReturnType<typeof useLexicalComposerContext>[0]) => void;
}

const SLASH_OPTIONS: SlashOption[] = [
  {
    title: 'Text',
    description: 'Plain body text',
    icon: <Type size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    },
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h1'));
        }
      });
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h2'));
        }
      });
    },
  },
  {
    title: 'Heading 3',
    description: 'Small subsection heading',
    icon: <Heading3 size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h3'));
        }
      });
    },
  },
  {
    title: 'Bullet List',
    description: 'Simple unorganized list',
    icon: <List size={16} />,
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: 'Numbered List',
    description: 'Ordered step-by-step list',
    icon: <ListOrdered size={16} />,
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: 'To-do List',
    description: 'Interactive checklist with checkboxes',
    icon: <ListTodo size={16} />,
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    },
  },
  {
    title: 'Quote',
    description: 'Indented block quote',
    icon: <Quote size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    },
  },
  {
    title: 'Code Block',
    description: 'Formatted syntax block',
    icon: <Code size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    },
  },
  {
    title: 'Callout',
    description: 'Notion banner highlight block',
    icon: <Lightbulb size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCalloutNode('💡'));
        }
      });
    },
  },
  {
    title: 'Divider',
    description: 'Visual horizontal divider line',
    icon: <Minus size={16} />,
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    },
  },
  {
    title: 'Table',
    description: 'Insert customizable table grid with rows and columns',
    icon: <TableIcon size={16} />,
    actionId: 'table',
    onSelect: () => {},
  },
  {
    title: 'Image',
    description: 'Insert web image by URL',
    icon: <ImageIcon size={16} />,
    onSelect: (editor) => {
      const url = window.prompt(
        'Enter Image URL:',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      );
      if (url) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([
              $createImageNode({
                src: url,
                altText: 'Inserted Image',
                showCaption: true,
                caption: 'Visual graphic illustration',
              }),
            ]);
          }
        });
      }
    },
  },
  {
    title: 'Toggle / Collapsible',
    description: 'Collapsible toggle container',
    icon: <FolderTree size={16} />,
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const container = $createCollapsibleContainerNode(true);
          const title = $createCollapsibleTitleNode();
          title.append($createParagraphNode());
          const content = $createCollapsibleContentNode();
          content.append($createParagraphNode());
          container.append(title, content);
          selection.insertNodes([container]);
        }
      });
    },
  },
  {
    title: 'YouTube Video',
    description: 'Embed video player by YouTube ID',
    icon: <Video size={16} />,
    onSelect: (editor) => {
      const videoId = window.prompt('Enter YouTube Video ID (e.g. jNQXAC9IVRw):', 'jNQXAC9IVRw');
      if (videoId) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([$createYouTubeNode(videoId)]);
          }
        });
      }
    },
  },
  {
    title: 'Figma Embed',
    description: 'Embed interactive Figma design preview',
    icon: <FigmaIcon size={16} />,
    onSelect: (editor) => {
      const figmaUrl = window.prompt(
        'Enter Figma Document URL:',
        'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
      );
      if (figmaUrl) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([$createFigmaNode(figmaUrl)]);
          }
        });
      }
    },
  },
];

export function SlashMenuPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!query) return SLASH_OPTIONS;
    const q = query.toLowerCase();
    return SLASH_OPTIONS.filter(
      (opt) => opt.title.toLowerCase().includes(q) || opt.description.toLowerCase().includes(q),
    );
  }, [query]);

  const selectOption = useCallback(
    (option: SlashOption) => {
      // Remove slash and trigger option
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor;
          const node = anchor.getNode();
          const text = node.getTextContent();
          const slashIdx = text.lastIndexOf('/');
          if (slashIdx !== -1 && $isTextNode(node)) {
            const nextText = text.slice(0, slashIdx);
            node.setTextContent(nextText);
          }
        }
      });
      if (option.actionId === 'table') {
        setIsTableDialogOpen(true);
      } else {
        option.onSelect(editor);
      }
      setIsOpen(false);
      setQuery('');
    },
    [editor],
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          setIsOpen(false);
          return;
        }

        const anchor = selection.anchor;
        const node = anchor.getNode();
        const textContent = node.getTextContent();
        const offset = anchor.offset;
        const textBeforeCursor = textContent.slice(0, offset);

        const match = textBeforeCursor.match(/(?:^|\s)\/([a-zA-Z0-9]*)$/);
        if (match) {
          const rawQuery = match[1] || '';
          setQuery(rawQuery);
          setSelectedIndex(0);

          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setPosition({
              top: rect.bottom + window.scrollY + 6,
              left: Math.max(16, rect.left + window.scrollX),
            });
            setIsOpen(true);
          }
        } else {
          setIsOpen(false);
        }
      });
    });
  }, [editor]);

  useEffect(() => {
    if (!isOpen) return;

    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredOptions.length);
          return true;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
          return true;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          const opt = filteredOptions[selectedIndex];
          if (opt) {
            selectOption(opt);
          }
          return true;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          setIsOpen(false);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [isOpen, filteredOptions, selectedIndex, selectOption, editor]);

  return (
    <>
      {isOpen && filteredOptions.length > 0 && (
        <Box
          data-slot="slash-menu"
          className="vlrc-slash-menu"
          sx={styles.menu}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          <VStack gap="xxs">
            {filteredOptions.map((opt, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <Box
                  as="button"
                  key={opt.title}
                  type="button"
                  data-slot="slash-menu-item"
                  data-selected={isSelected ? 'true' : 'false'}
                  className="vlrc-slash-menu-item"
                  sx={[styles.item, isSelected && styles.itemSelected]}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <Box className="vlrc-slash-menu-icon" sx={styles.iconBox} aria-hidden="true">
                    {opt.icon}
                  </Box>
                  <VStack gap={0} style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" weight="medium">
                      {opt.title}
                    </Text>
                    <Text size="xs" type="secondary">
                      {opt.description}
                    </Text>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        </Box>
      )}

      <InsertTableDialog
        open={isTableDialogOpen}
        onOpenChange={setIsTableDialogOpen}
        onConfirm={({ rows, columns, includeHeaders }) => {
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows,
            columns,
            includeHeaders,
          });
        }}
      />
    </>
  );
}
