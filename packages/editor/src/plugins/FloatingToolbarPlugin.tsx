import { useState, useEffect, useCallback, type JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
} from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { create } from '@stylexjs/stylex';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon, Highlighter } from 'lucide-react';
import { colors, radius, shadow, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import { Box, HStack, Button } from '@vlrc-fe/components';

const styles = create({
  toolbar: {
    position: 'absolute',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    gap: spacing['0.5'],
    padding: spacing['0.5'],
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceDefault,
    boxShadow: shadow.md,
    boxSizing: 'border-box',
    transform: 'translateX(-50%)',
    transitionProperty: 'opacity, transform',
    transitionDuration: '120ms',
  },
  buttonActive: {
    backgroundColor: colors.surfaceSubtle,
    color: colors.primary,
  },
});

export function FloatingToolbarPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (
      !$isRangeSelection(selection) ||
      selection.isCollapsed() ||
      selection.getTextContent() === ''
    ) {
      setCoords(null);
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      setCoords(null);
      return;
    }

    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setCoords({
      top: rect.top + window.scrollY - 44,
      left: rect.left + window.scrollX + rect.width / 2,
    });

    setActiveFormats({
      bold: selection.hasFormat('bold'),
      italic: selection.hasFormat('italic'),
      strikethrough: selection.hasFormat('strikethrough'),
      code: selection.hasFormat('code'),
      highlight: selection.hasFormat('highlight'),
    });
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  if (!coords) return null;

  const toggleFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleLink = () => {
    const url = window.prompt('Enter link URL:', 'https://');
    if (url !== null) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url === '' ? null : url);
    }
  };

  return (
    <Box
      data-slot="floating-toolbar"
      className="vlrc-floating-toolbar"
      sx={styles.toolbar}
      style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
    >
      <HStack gap="xxs">
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={activeFormats.bold ? 'true' : 'false'}
          sx={activeFormats.bold && styles.buttonActive}
          onClick={() => toggleFormat('bold')}
          aria-label="Format bold"
        >
          <Bold size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={activeFormats.italic ? 'true' : 'false'}
          sx={activeFormats.italic && styles.buttonActive}
          onClick={() => toggleFormat('italic')}
          aria-label="Format italic"
        >
          <Italic size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={activeFormats.strikethrough ? 'true' : 'false'}
          sx={activeFormats.strikethrough && styles.buttonActive}
          onClick={() => toggleFormat('strikethrough')}
          aria-label="Format strikethrough"
        >
          <Strikethrough size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={activeFormats.code ? 'true' : 'false'}
          sx={activeFormats.code && styles.buttonActive}
          onClick={() => toggleFormat('code')}
          aria-label="Format code"
        >
          <Code size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={activeFormats.highlight ? 'true' : 'false'}
          sx={activeFormats.highlight && styles.buttonActive}
          onClick={() => toggleFormat('highlight')}
          aria-label="Highlight text"
        >
          <Highlighter size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={handleLink}
          aria-label="Insert link"
        >
          <LinkIcon size={14} />
        </Button>
      </HStack>
    </Box>
  );
}
