import { useState, useMemo, useCallback, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createTextNode, type TextNode } from 'lexical';
import { Box, HStack, Text } from '@vlrc-fe/components';

export class EmojiOption extends MenuOption {
  title: string;
  emoji: string;
  keywords: string[];

  constructor(title: string, emoji: string, keywords: string[]) {
    super(title);
    this.title = title;
    this.emoji = emoji;
    this.keywords = keywords;
  }
}

const EMOJIS: EmojiOption[] = [
  new EmojiOption('smile', '😄', ['smile', 'happy']),
  new EmojiOption('grin', '😁', ['grin']),
  new EmojiOption('joy', '😂', ['joy', 'laugh']),
  new EmojiOption('heart_eyes', '😍', ['heart', 'love']),
  new EmojiOption('sunglasses', '😎', ['cool', 'sunglasses']),
  new EmojiOption('thinking', '🤔', ['think', 'hmm']),
  new EmojiOption('fire', '🔥', ['fire', 'lit', 'hot']),
  new EmojiOption('rocket', '🚀', ['rocket', 'launch', 'fast']),
  new EmojiOption('check', '✅', ['check', 'done']),
  new EmojiOption('sparkles', '✨', ['sparkles', 'magic', 'clean']),
  new EmojiOption('tada', '🎉', ['party', 'tada', 'celebrate']),
  new EmojiOption('thumbsup', '👍', ['thumbsup', 'like', 'approve']),
  new EmojiOption('100', '💯', ['100', 'perfect']),
  new EmojiOption('heart', '❤️', ['heart', 'love']),
  new EmojiOption('bulb', '💡', ['bulb', 'idea']),
];

export function EmojisPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForColon = useBasicTypeaheadTriggerMatch(':', {
    minLength: 0,
  });

  const options = useMemo(() => {
    return EMOJIS.filter((opt) => {
      if (!queryString) return true;
      const q = queryString.toLowerCase();
      return (
        opt.title.toLowerCase().includes(q) || opt.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }).slice(0, 8);
  }, [queryString]);

  const onSelectOption = useCallback(
    (selectedOption: EmojiOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const emojiNode = $createTextNode(selectedOption.emoji);
        if (nodeToReplace) {
          nodeToReplace.replace(emojiNode);
        }
        emojiNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<EmojiOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForColon}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (!anchorElementRef.current || options.length === 0) {
          return null;
        }

        return createPortal(
          <Box className="vlrc-typeahead-menu" data-slot="emojis-menu">
            <HStack gap="xs" style={{ flexWrap: 'wrap', maxWidth: '240px', padding: '4px' }}>
              {options.map((option, i) => {
                const isSelected = selectedIndex === i;
                return (
                  <Box
                    as="button"
                    key={option.key}
                    type="button"
                    tabIndex={-1}
                    className="vlrc-typeahead-item"
                    data-selected={isSelected ? 'true' : 'false'}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border: 'none',
                      background: isSelected
                        ? 'var(--color-surface-subtle, #f1f5f9)'
                        : 'transparent',
                    }}
                    onClick={() => {
                      setHighlightedIndex(i);
                      selectOptionAndCleanUp(option);
                    }}
                    onMouseEnter={() => {
                      setHighlightedIndex(i);
                    }}
                    title={option.title}
                  >
                    <Text>{option.emoji}</Text>
                  </Box>
                );
              })}
            </HStack>
          </Box>,
          anchorElementRef.current,
        );
      }}
    />
  );
}

export default EmojisPlugin;
