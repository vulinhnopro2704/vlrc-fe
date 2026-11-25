import { useState, useMemo, useCallback, useEffect, useRef, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  type RangeSelection,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { Box, VStack, Text } from '@vlrc-fe/components';
import { getNextRovingIndex } from '@vlrc-fe/components/utils';
import { InsertTableDialog } from './InsertTableDialog';
import { InsertMediaDialog, type MediaType } from './InsertMediaDialog';
import { SLASH_OPTIONS, type SlashOption } from './slashMenuOptions';
import { MENU_MAX_HEIGHT, MENU_WIDTH, VIEWPORT_PADDING, styles } from './slashMenu.stylex';
import { $createImageNode } from '../nodes/ImageNode';
import { $createYouTubeNode, $createFigmaNode } from '../nodes/EmbedNodes';

function $getSlashTrigger() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return null;

  const { anchor } = selection;
  const node = anchor.getNode();
  if (!$isTextNode(node)) return null;

  const match = node
    .getTextContent()
    .slice(0, anchor.offset)
    .match(/(?:^|\s)\/([a-zA-Z0-9]*)$/);
  if (!match) return null;

  const query = match[1];
  const length = query.length + 1;
  return { node, query, length, offset: anchor.offset - length };
}

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
  const queryRef = useRef<string | null>(null);
  const dialogSelection = useRef<RangeSelection | null>(null);
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
      const action = option.actionId;
      let triggerRemoved = false;
      editor.update(
        () => {
          const trigger = $getSlashTrigger();
          if (!trigger) return;
          trigger.node.spliceText(trigger.offset, trigger.length, '', true);
          triggerRemoved = true;
          if (!action) option.$select(editor);
        },
        {
          onUpdate: () => {
            if (!triggerRemoved || !action) return;
            // Lexical can move the caret onto the parent when it removes an empty text node.
            dialogSelection.current = editor.getEditorState().read(() => {
              const selection = $getSelection();
              return $isRangeSelection(selection) ? selection.clone() : null;
            });
            if (action === 'table') setIsTableDialogOpen(true);
            else setMediaDialogType(action);
          },
        },
      );
      setIsOpen(false);
      queryRef.current = null;
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
        const trigger = $getSlashTrigger();
        if (!trigger) {
          queryRef.current = null;
          setIsOpen(false);
          return;
        }

        const pos = calculatePosition();
        if (!pos) return;
        if (trigger.query !== queryRef.current) {
          queryRef.current = trigger.query;
          setQuery(trigger.query);
          setSelectedIndex(0);
        }
        updatePosition(pos);
        setIsOpen(true);
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

    const moveSelection = (event: KeyboardEvent) => {
      const nextIndex = getNextRovingIndex(
        event.key,
        selectedIndexRef.current,
        displayedOptionsRef.current.length,
        { orientation: 'vertical', loop: true },
      );
      if (nextIndex === null) return false;

      event.preventDefault();
      setSelectedIndex(nextIndex);
      return true;
    };

    return mergeRegister(
      editor.registerCommand(KEY_ARROW_UP_COMMAND, moveSelection, COMMAND_PRIORITY_HIGH),
      editor.registerCommand(KEY_ARROW_DOWN_COMMAND, moveSelection, COMMAND_PRIORITY_HIGH),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          const option = displayedOptionsRef.current[selectedIndexRef.current];
          if (!option || !$getSlashTrigger() || event?.shiftKey || event?.isComposing) return false;
          event?.preventDefault();
          selectOptionRef.current(option);
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        (event) => {
          event.preventDefault();
          setIsOpen(false);
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [isOpen, editor]);

  const renderOptionGroup = (options: SlashOption[], title: string, offset = 0) => {
    if (!options.length) return null;

    return (
      <>
        <Box sx={[styles.groupHeading, offset > 0 && styles.groupSpacing]}>
          <Text size="xs" weight="medium" type="secondary">
            {title}
          </Text>
        </Box>
        {options.map((option, index) => {
          const optionIndex = index + offset;
          const isSelected = optionIndex === selectedIndex;
          return (
            <Box
              as="button"
              key={option.title}
              ref={(element: HTMLButtonElement | null) => {
                itemRefs.current[optionIndex] = element;
              }}
              type="button"
              data-slot="slash-menu-item"
              data-selected={isSelected ? 'true' : 'false'}
              className="vlrc-slash-menu-item"
              sx={[styles.item, isSelected && styles.itemSelected]}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setSelectedIndex(optionIndex)}
            >
              <Box className="vlrc-slash-menu-icon" sx={styles.iconBox} aria-hidden="true">
                {option.icon}
              </Box>
              <VStack gap={0} style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" weight="medium">
                  {option.title}
                </Text>
                <Text size="xs" type="secondary">
                  {option.description}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </>
    );
  };

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
                {renderOptionGroup(basicItems, 'Basic blocks')}
                {renderOptionGroup(mediaItems, 'Media & embeds', basicItems.length)}
              </VStack>
            )}
          </Box>,
          document.body,
        )}

      <InsertTableDialog
        open={isTableDialogOpen}
        onOpenChange={setIsTableDialogOpen}
        onConfirm={({ rows, columns, includeHeaders }) => {
          editor.update(() => {
            if (!dialogSelection.current) return;
            $setSelection(dialogSelection.current);
            dialogSelection.current = null;
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns, includeHeaders });
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
            const selection = dialogSelection.current;
            if (selection) {
              $setSelection(selection);
              dialogSelection.current = null;
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
