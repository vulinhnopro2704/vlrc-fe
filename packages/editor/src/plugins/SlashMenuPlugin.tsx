import { useState, useMemo, useCallback, useEffect, useRef, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { create } from '@stylexjs/stylex';
import { colors, radius, shadow, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import { Box, VStack, Text } from '@vlrc-fe/components';
import { getNextRovingIndex } from '@vlrc-fe/components/utils';
import { InsertTableDialog } from './InsertTableDialog';
import { InsertMediaDialog, type MediaType } from './InsertMediaDialog';
import { SLASH_OPTIONS, type SlashOption } from './slashMenuOptions';
import { $createImageNode } from '../nodes/ImageNode';
import { $createYouTubeNode, $createFigmaNode } from '../nodes/EmbedNodes';

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
    boxShadow: shadow.ringFocus,
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
        editor.focus();
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

  const updatePosition = useCallback((newPos: { top: number; left: number }) => {
    setPosition((prev) => {
      if (prev.top === newPos.top && prev.left === newPos.left) return prev;
      return newPos;
    });
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
            updatePosition(pos);
            setIsOpen(true);
          }
        } else {
          setIsOpen(false);
        }
      });
    });
  }, [editor, calculatePosition, updatePosition]);

  // Recalculate or dismiss on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowChange = () => {
      const pos = calculatePosition();
      if (pos) {
        updatePosition(pos);
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
  }, [isOpen, calculatePosition, updatePosition]);

  // Group items by category for clean visual separation in a single O(N) pass
  const { basicItems, mediaItems } = useMemo(() => {
    const basic: SlashOption[] = [];
    const media: SlashOption[] = [];
    for (const opt of filteredOptions) {
      if (opt.category === 'basic') {
        basic.push(opt);
      } else if (opt.category === 'media') {
        media.push(opt);
      }
    }
    return { basicItems: basic, mediaItems: media };
  }, [filteredOptions]);
  const displayedOptions = filteredOptions;

  // Refs for keyboard handler to avoid re-subscribing on every selection move
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const displayedOptionsRef = useRef(displayedOptions);
  displayedOptionsRef.current = displayedOptions;
  const selectOptionRef = useRef(selectOption);
  selectOptionRef.current = selectOption;

  // Keyboard navigation using unified roving index helper
  useEffect(() => {
    if (!isOpen) return;

    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const options = displayedOptionsRef.current;
        const currentIdx = selectedIndexRef.current;

        const nextIndex = getNextRovingIndex(event.key, currentIdx, options.length, {
          orientation: 'vertical',
          loop: true,
        });

        if (nextIndex !== null) {
          event.preventDefault();
          setSelectedIndex(nextIndex);
          return true;
        }

        if (event.key === 'Enter') {
          event.preventDefault();
          const opt = options[currentIdx];
          if (opt) {
            selectOptionRef.current(opt);
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
  }, [isOpen, editor]);

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
            {displayedOptions.length === 0 ? (
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
                    {basicItems.map((opt, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <Box
                          as="button"
                          key={opt.title}
                          ref={(el: HTMLButtonElement | null) => {
                            itemRefs.current[idx] = el;
                          }}
                          type="button"
                          data-slot="slash-menu-item"
                          data-selected={isSelected ? 'true' : 'false'}
                          className="vlrc-slash-menu-item"
                          sx={[styles.item, isSelected && styles.itemSelected]}
                          onClick={() => selectOption(opt)}
                          onMouseEnter={() => setSelectedIndex(idx)}
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
                    {mediaItems.map((opt, idx) => {
                      const overallIndex = basicItems.length + idx;
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
