import { useState, useMemo, useCallback, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import { Box, VStack, Text } from '@vlrc-fe/components';
import { $createMentionNode } from '../nodes/MentionNode';

export class MentionTypeaheadOption extends MenuOption {
  name: string;

  constructor(name: string) {
    super(name);
    this.name = name;
  }
}

const DEFAULT_MENTIONS = [
  'lvtruong',
  'antigravity',
  'lexical-team',
  'astryx-design',
  'john-doe',
  'sarah-connor',
  'alex-turner',
];

export function MentionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForAtSign = useBasicTypeaheadTriggerMatch('@', {
    minLength: 0,
  });

  const options = useMemo(() => {
    return DEFAULT_MENTIONS.filter((name) =>
      queryString ? name.toLowerCase().includes(queryString.toLowerCase()) : true,
    )
      .slice(0, 5)
      .map((name) => new MentionTypeaheadOption(name));
  }, [queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(`@${selectedOption.name}`);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForAtSign}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (!anchorElementRef.current || options.length === 0) {
          return null;
        }

        return createPortal(
          <Box className="vlrc-typeahead-menu" data-slot="mentions-menu">
            <VStack gap="xxs">
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
                    onClick={() => {
                      setHighlightedIndex(i);
                      selectOptionAndCleanUp(option);
                    }}
                    onMouseEnter={() => {
                      setHighlightedIndex(i);
                    }}
                  >
                    <Text size="sm" weight="medium">
                      @{option.name}
                    </Text>
                  </Box>
                );
              })}
            </VStack>
          </Box>,
          anchorElementRef.current,
        );
      }}
    />
  );
}

export default MentionsPlugin;
