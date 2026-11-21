import { useState, useMemo, useCallback, useEffect, useRef, type JSX, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
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
import { colors, radius, shadow, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import { Box, VStack, Text } from '@vlrc-fe/components';
import { $createCalloutNode } from '../nodes/CalloutNode';
import { $insertCollapsible } from '../nodes/CollapsibleNodes';
import { $createImageNode } from '../nodes/ImageNode';
import { $createYouTubeNode, $createFigmaNode } from '../nodes/EmbedNodes';
import { InsertTableDialog } from './InsertTableDialog';
import { InsertMediaDialog, type MediaType } from './InsertMediaDialog';

const MENU_WIDTH = 280;
const MENU_MAX_HEIGHT = 320;
const VIEWPORT_PADDING = 12;

const styles = create({
  menu: {
    position: 'fixed',
    zIndex: 9999,
    width: `${MENU_WIDTH}px`,
    maxHeight: `min(${MENU_MAX_HEIGHT}px, calc(100vh - 24px))`,
    overflowY: 'auto',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceDefault,
    boxShadow: shadow.lg,
    padding: spacing['1'],
    boxSizing: 'border-box',
    overscrollBehavior: 'contain',
    scrollBehavior: 'smooth',
  },
  groupHeading: {
    paddingInline: spacing.sm,
    paddingBlock: spacing['1'],
    userSelect: 'none',
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
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    outline: 'none',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: colors.surfaceSubtle,
    },
  },
  itemSelected: {
    backgroundColor: colors.surfaceSubtle,
  },
  iconBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSubtle,
    color: colors.fgMuted,
    flexShrink: 0,
  },
  empty: {
    paddingInline: spacing.md,
    paddingBlock: spacing.lg,
    textAlign: 'center',
  },
});

export interface SlashOption {
  title: string;
  description: string;
  icon: ReactNode;
  category: 'basic' | 'media';
  actionId?: 'table' | 'image' | 'youtube' | 'figma';
  onSelect: (editor: ReturnType<typeof useLexicalComposerContext>[0]) => void;
}

const SLASH_OPTIONS: SlashOption[] = [
  // Basic blocks
  {
    title: 'Text',
    description: 'Plain body text paragraph',
    icon: <Type size={16} />,
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
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
    category: 'basic',
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: 'Numbered List',
    description: 'Ordered step-by-step list',
    icon: <ListOrdered size={16} />,
    category: 'basic',
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: 'To-do List',
    description: 'Interactive checklist with checkboxes',
    icon: <ListTodo size={16} />,
    category: 'basic',
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    },
  },
  {
    title: 'Quote',
    description: 'Indented block quote',
    icon: <Quote size={16} />,
    category: 'basic',
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
    description: 'Formatted syntax highlighting block',
    icon: <Code size={16} />,
    category: 'basic',
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
    title: 'Divider',
    description: 'Visual horizontal divider rule',
    icon: <Minus size={16} />,
    category: 'basic',
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    },
  },

  // Media & embeds
  {
    title: 'Callout',
    description: 'Notion highlight callout banner',
    icon: <Lightbulb size={16} />,
    category: 'media',
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
    title: 'Table',
    description: 'Insert customizable table with rows and columns',
    icon: <TableIcon size={16} />,
    category: 'media',
    actionId: 'table',
    onSelect: () => {},
  },
  {
    title: 'Image',
    description: 'Embed image from web URL with caption',
    icon: <ImageIcon size={16} />,
    category: 'media',
    actionId: 'image',
    onSelect: () => {},
  },
  ...(
    [
      {
        title: 'Toggle List',
        description: 'Toggles can show and hide content inside',
        icon: <FolderTree size={16} />,
        level: 'default',
      },
      {
        title: 'Toggle Heading 1',
        description: 'Large section heading that can hide content',
        icon: <Heading1 size={16} />,
        level: 'h1',
      },
      {
        title: 'Toggle Heading 2',
        description: 'Medium section heading that can hide content',
        icon: <Heading2 size={16} />,
        level: 'h2',
      },
      {
        title: 'Toggle Heading 3',
        description: 'Small section heading that can hide content',
        icon: <Heading3 size={16} />,
        level: 'h3',
      },
    ] as const
  ).map(({ title, description, icon, level }): SlashOption => ({
    title,
    description,
    icon,
    category: 'basic',
    onSelect: (editor) => {
      editor.update(() => {
        $insertCollapsible(level);
      });
    },
  })),
  {
    title: 'YouTube Video',
    description: 'Embed video player by YouTube ID or link',
    icon: <Video size={16} />,
    category: 'media',
    actionId: 'youtube',
    onSelect: () => {},
  },
  {
    title: 'Figma Embed',
    description: 'Embed interactive Figma design preview',
    icon: <FigmaIcon size={16} />,
    category: 'media',
    actionId: 'figma',
    onSelect: () => {},
  },
];

export function SlashMenuPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');

  // Dialog states for rich embeds
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [mediaDialogType, setMediaDialogType] = useState<MediaType | null>(null);

  // References for keyboard navigation and viewport anchoring
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredOptions = useMemo(() => {
    if (!query) return SLASH_OPTIONS;
    const q = query.toLowerCase();
    return SLASH_OPTIONS.filter(
      (opt) => opt.title.toLowerCase().includes(q) || opt.description.toLowerCase().includes(q),
    );
  }, [query]);

  // Scroll active item into view whenever selectedIndex changes
  useEffect(() => {
    if (!isOpen) return;
    const activeItem = itemRefs.current[selectedIndex];
    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [selectedIndex, isOpen]);

  const selectOption = useCallback(
    (option: SlashOption) => {
      // Remove the slash command trigger text from editor selection
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
      } else if (
        option.actionId === 'image' ||
        option.actionId === 'youtube' ||
        option.actionId === 'figma'
      ) {
        setMediaDialogType(option.actionId);
      } else {
        option.onSelect(editor);
      }

      setIsOpen(false);
      setQuery('');
    },
    [editor],
  );

  // Calculate anchored viewport coordinates with auto-flip collision handling
  const calculatePosition = useCallback(() => {
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return null;

    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0 && rect.top === 0 && rect.left === 0) {
      return null;
    }

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldFlip = spaceBelow < MENU_MAX_HEIGHT + VIEWPORT_PADDING && spaceAbove > spaceBelow;

    const top = shouldFlip
      ? Math.max(VIEWPORT_PADDING, rect.top - MENU_MAX_HEIGHT - 6)
      : Math.min(window.innerHeight - MENU_MAX_HEIGHT - VIEWPORT_PADDING, rect.bottom + 6);

    const left = Math.max(
      VIEWPORT_PADDING,
      Math.min(window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING, rect.left),
    );

    return { top, left };
  }, []);

  // Listen for editor typing to detect "/" trigger and query
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

          const pos = calculatePosition();
          if (pos) {
            setPosition(pos);
            setIsOpen(true);
          }
        } else {
          setIsOpen(false);
        }
      });
    });
  }, [editor, calculatePosition]);

  // Recalculate or dismiss on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowChange = () => {
      const pos = calculatePosition();
      if (pos) {
        setPosition(pos);
      } else {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleWindowChange, { passive: true });
    window.addEventListener('scroll', handleWindowChange, { passive: true, capture: true });
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, { capture: true });
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, calculatePosition]);

  // Keyboard navigation
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
        if (event.key === 'Home') {
          event.preventDefault();
          setSelectedIndex(0);
          return true;
        }
        if (event.key === 'End') {
          event.preventDefault();
          setSelectedIndex(filteredOptions.length - 1);
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

  // Group items by category for clean visual separation
  const basicItems = useMemo(
    () => filteredOptions.filter((opt) => opt.category === 'basic'),
    [filteredOptions],
  );
  const mediaItems = useMemo(
    () => filteredOptions.filter((opt) => opt.category === 'media'),
    [filteredOptions],
  );

  return (
    <>
      {isOpen &&
        createPortal(
          <Box
            ref={menuRef}
            data-slot="slash-menu"
            className="vlrc-slash-menu"
            sx={styles.menu}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              // Modern CSS Anchor Positioning (Baseline 2026)
              positionArea: 'block-end span-inline-end',
              positionTryFallbacks: 'flip-block, flip-inline',
            }}
          >
            {filteredOptions.length === 0 ? (
              <Box sx={styles.empty}>
                <Text size="sm" type="secondary">
                  No commands match &ldquo;{query}&rdquo;
                </Text>
              </Box>
            ) : (
              <VStack gap="xxs">
                {basicItems.length > 0 && (
                  <>
                    <Box sx={styles.groupHeading}>
                      <Text size="xs" weight="medium" type="secondary">
                        Basic blocks
                      </Text>
                    </Box>
                    {basicItems.map((opt) => {
                      const overallIndex = filteredOptions.indexOf(opt);
                      const isSelected = overallIndex === selectedIndex;
                      return (
                        <Box
                          as="button"
                          key={opt.title}
                          ref={(el: HTMLButtonElement | null) => {
                            itemRefs.current[overallIndex] = el;
                          }}
                          type="button"
                          data-slot="slash-menu-item"
                          data-selected={isSelected ? 'true' : 'false'}
                          className="vlrc-slash-menu-item"
                          sx={[styles.item, isSelected && styles.itemSelected]}
                          onClick={() => selectOption(opt)}
                          onMouseEnter={() => setSelectedIndex(overallIndex)}
                        >
                          <Box
                            className="vlrc-slash-menu-icon"
                            sx={styles.iconBox}
                            aria-hidden="true"
                          >
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
                  </>
                )}

                {mediaItems.length > 0 && (
                  <>
                    <Box sx={styles.groupHeading} style={{ marginTop: '0.25rem' }}>
                      <Text size="xs" weight="medium" type="secondary">
                        Media & embeds
                      </Text>
                    </Box>
                    {mediaItems.map((opt) => {
                      const overallIndex = filteredOptions.indexOf(opt);
                      const isSelected = overallIndex === selectedIndex;
                      return (
                        <Box
                          as="button"
                          key={opt.title}
                          ref={(el: HTMLButtonElement | null) => {
                            itemRefs.current[overallIndex] = el;
                          }}
                          type="button"
                          data-slot="slash-menu-item"
                          data-selected={isSelected ? 'true' : 'false'}
                          className="vlrc-slash-menu-item"
                          sx={[styles.item, isSelected && styles.itemSelected]}
                          onClick={() => selectOption(opt)}
                          onMouseEnter={() => setSelectedIndex(overallIndex)}
                        >
                          <Box
                            className="vlrc-slash-menu-icon"
                            sx={styles.iconBox}
                            aria-hidden="true"
                          >
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
                  </>
                )}
              </VStack>
            )}
          </Box>,
          document.body,
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

      <InsertMediaDialog
        open={mediaDialogType !== null}
        type={mediaDialogType}
        onOpenChange={(open) => {
          if (!open) setMediaDialogType(null);
        }}
        onConfirm={({ type, url, caption }) => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              if (type === 'image') {
                selection.insertNodes([
                  $createImageNode({
                    src: url,
                    altText: caption || 'Embedded Image',
                    showCaption: Boolean(caption),
                    caption: caption || '',
                  }),
                ]);
              } else if (type === 'youtube') {
                // Extract video id if full url is pasted
                const ytMatch = url.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*)/);
                const vid = ytMatch && ytMatch[1] ? ytMatch[1] : url;
                selection.insertNodes([$createYouTubeNode(vid)]);
              } else if (type === 'figma') {
                selection.insertNodes([$createFigmaNode(url)]);
              }
            }
          });
        }}
      />
    </>
  );
}

export default SlashMenuPlugin;
