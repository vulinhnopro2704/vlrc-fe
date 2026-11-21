import { useState, useEffect, useCallback, type JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $setBlocksType,
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { create } from '@stylexjs/stylex';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  ChevronDown,
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Table as TableIcon,
  Image as ImageIcon,
  FolderTree,
  Video,
  Frame as FigmaIcon,
  Lightbulb,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Baseline,
  PaintBucket,
  RemoveFormatting,
  Subscript,
  Superscript,
} from 'lucide-react';
import { colors, radius, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import {
  Box,
  HStack,
  Button,
  Text,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@vlrc-fe/components';
import { $createCalloutNode } from '../nodes/CalloutNode';
import { $insertCollapsible, type CollapsibleLevel } from '../nodes/CollapsibleNodes';
import { $createImageNode } from '../nodes/ImageNode';
import { $createYouTubeNode, $createFigmaNode } from '../nodes/EmbedNodes';
import { InsertTableDialog } from './InsertTableDialog';

const TOGGLE_TOOLBAR_ITEMS: Array<{
  title: string;
  icon: typeof FolderTree;
  level: CollapsibleLevel;
}> = [
  { title: 'Toggle List', icon: FolderTree, level: 'default' },
  { title: 'Toggle Heading 1', icon: Heading1, level: 'h1' },
  { title: 'Toggle Heading 2', icon: Heading2, level: 'h2' },
  { title: 'Toggle Heading 3', icon: Heading3, level: 'h3' },
];

const FONT_FAMILIES = [
  'Arial',
  'Courier New',
  'Georgia',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

const TEXT_COLORS = [
  { name: 'Default', value: 'inherit' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Slate', value: '#64748b' },
];

const BG_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Purple', value: '#ddd6fe' },
];

const styles = create({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing['0.5'],
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.borderDefault,
    backgroundColor: colors.surfaceSubtle,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    boxSizing: 'border-box',
    rowGap: spacing['1'],
  },
  divider: {
    width: 1,
    height: '1.25rem',
    backgroundColor: colors.borderDefault,
    marginInline: spacing['0.5'],
  },
  buttonActive: {
    backgroundColor: colors.surfaceDefault,
    color: colors.primary,
  },
  dropdownTrigger: {
    height: '28px',
    paddingInline: '8px',
    gap: '4px',
    fontSize: '0.8125rem',
    fontWeight: '500',
  },
  fontSizeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
});

export function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(15);
  const [blockType, setBlockType] = useState('Normal');
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsCode(selection.hasFormat('code'));

            const font = $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial');
            setFontFamily(font || 'Arial');

            const sizeStr = $getSelectionStyleValueForProperty(selection, 'font-size', '15px');
            const parsedSize = parseInt(sizeStr, 10);
            if (!Number.isNaN(parsedSize)) {
              setFontSize(parsedSize);
            }
          }
        });
      }),
    );
  }, [editor]);

  const applyFontFamily = useCallback(
    (font: string) => {
      setFontFamily(font);
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { 'font-family': font });
        }
      });
    },
    [editor],
  );

  const applyFontSize = useCallback(
    (newSize: number) => {
      const clamped = Math.max(8, Math.min(72, newSize));
      setFontSize(clamped);
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { 'font-size': `${clamped}px` });
        }
      });
    },
    [editor],
  );

  const applyTextColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { color });
        }
      });
    },
    [editor],
  );

  const applyBgColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { 'background-color': color });
        }
      });
    },
    [editor],
  );

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setBlockType('Normal');
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
    setBlockType(headingSize.toUpperCase());
  };

  const insertLink = () => {
    if (!isLink) {
      const url = window.prompt('Enter link URL:', 'https://');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        setIsLink(true);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      setIsLink(false);
    }
  };

  return (
    <Box data-slot="editor-toolbar" className="vlrc-editor-toolbar" sx={styles.toolbar}>
      {/* Undo & Redo */}
      <HStack gap="xxs">
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          aria-label="Undo"
        >
          <Undo2 size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          aria-label="Redo"
        >
          <Redo2 size={14} />
        </Button>
      </HStack>

      <Box sx={styles.divider} className="vlrc-editor-toolbar-divider" aria-hidden="true" />

      {/* Block Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" sx={styles.dropdownTrigger}>
            <Text size="xs" weight="medium">
              {blockType}
            </Text>
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={formatParagraph}>
            <Type size={14} style={{ marginRight: 8 }} />
            Normal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading('h1')}>
            <Heading1 size={14} style={{ marginRight: 8 }} />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading('h2')}>
            <Heading2 size={14} style={{ marginRight: 8 }} />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading('h3')}>
            <Heading3 size={14} style={{ marginRight: 8 }} />
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
              setBlockType('Bullet List');
            }}
          >
            <List size={14} style={{ marginRight: 8 }} />
            Bulleted List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
              setBlockType('Numbered List');
            }}
          >
            <ListOrdered size={14} style={{ marginRight: 8 }} />
            Numbered List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
              setBlockType('Check List');
            }}
          >
            <ListTodo size={14} style={{ marginRight: 8 }} />
            Check List
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createQuoteNode());
                }
              });
              setBlockType('Quote');
            }}
          >
            <Quote size={14} style={{ marginRight: 8 }} />
            Quote
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createCodeNode());
                }
              });
              setBlockType('Code Block');
            }}
          >
            <Code size={14} style={{ marginRight: 8 }} />
            Code Block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Box sx={styles.divider} className="vlrc-editor-toolbar-divider" aria-hidden="true" />

      {/* Font Family Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" sx={styles.dropdownTrigger}>
            <Text size="xs" weight="medium">
              {fontFamily}
            </Text>
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {FONT_FAMILIES.map((font) => (
            <DropdownMenuItem
              key={font}
              onClick={() => applyFontFamily(font)}
              style={{ fontFamily: font }}
            >
              {font}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size controls */}
      <Box sx={styles.fontSizeBox}>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => applyFontSize(fontSize - 1)}
          aria-label="Decrease font size"
        >
          <Minus size={12} />
        </Button>
        <Text size="xs" weight="medium" style={{ minWidth: '20px', textAlign: 'center' }}>
          {fontSize}
        </Text>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => applyFontSize(fontSize + 1)}
          aria-label="Increase font size"
        >
          <Plus size={12} />
        </Button>
      </Box>

      <Box sx={styles.divider} className="vlrc-editor-toolbar-divider" aria-hidden="true" />

      {/* Basic Format Buttons */}
      <HStack gap="xxs">
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={isBold ? 'true' : 'false'}
          sx={isBold && styles.buttonActive}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          aria-label="Bold"
        >
          <Bold size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={isItalic ? 'true' : 'false'}
          sx={isItalic && styles.buttonActive}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          aria-label="Italic"
        >
          <Italic size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={isUnderline ? 'true' : 'false'}
          sx={isUnderline && styles.buttonActive}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          aria-label="Underline"
        >
          <Underline size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={isCode ? 'true' : 'false'}
          sx={isCode && styles.buttonActive}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          aria-label="Inline Code"
        >
          <Code size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          data-active={isLink ? 'true' : 'false'}
          sx={isLink && styles.buttonActive}
          onClick={insertLink}
          aria-label="Insert link"
        >
          <Link size={14} />
        </Button>
      </HStack>

      <Box sx={styles.divider} className="vlrc-editor-toolbar-divider" aria-hidden="true" />

      {/* Color Dropdowns */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="vlrc-editor-toolbar-btn"
            aria-label="Text color"
          >
            <Baseline size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {TEXT_COLORS.map((c) => (
              <DropdownMenuItem key={c.name} onClick={() => applyTextColor(c.value)}>
                <Box
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: c.value === 'inherit' ? '#000' : c.value,
                    marginRight: 8,
                  }}
                />
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="vlrc-editor-toolbar-btn"
            aria-label="Background color"
          >
            <PaintBucket size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {BG_COLORS.map((c) => (
              <DropdownMenuItem key={c.name} onClick={() => applyBgColor(c.value)}>
                <Box
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '2px',
                    backgroundColor: c.value === 'transparent' ? '#fff' : c.value,
                    border: '1px solid #cbd5e1',
                    marginRight: 8,
                  }}
                />
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text Transformations (Aa) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            sx={styles.dropdownTrigger}
            aria-label="More text options"
          >
            <Text size="xs" weight="medium">
              Aa
            </Text>
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            data-active={isStrikethrough ? 'true' : 'false'}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          >
            <Strikethrough size={14} style={{ marginRight: 8 }} />
            Strikethrough
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}
          >
            <Subscript size={14} style={{ marginRight: 8 }} />
            Subscript
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}
          >
            <Superscript size={14} style={{ marginRight: 8 }} />
            Superscript
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $patchStyleText(selection, {
                    color: '',
                    'background-color': '',
                    'font-family': '',
                    'font-size': '',
                  });
                }
              });
            }}
          >
            <RemoveFormatting size={14} style={{ marginRight: 8 }} />
            Clear Formatting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Box sx={styles.divider} className="vlrc-editor-toolbar-divider" aria-hidden="true" />

      {/* + Insert Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" sx={styles.dropdownTrigger}>
            <Plus size={14} />
            <Text size="xs" weight="medium">
              Insert
            </Text>
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
          >
            <Minus size={14} style={{ marginRight: 8 }} />
            Horizontal Rule
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsTableDialogOpen(true)}>
            <TableIcon size={14} style={{ marginRight: 8 }} />
            Table...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
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
                        caption: 'Unsplash visual illustration',
                      }),
                    ]);
                  }
                });
              }
            }}
          >
            <ImageIcon size={14} style={{ marginRight: 8 }} />
            Image
          </DropdownMenuItem>
          {TOGGLE_TOOLBAR_ITEMS.map(({ title, icon: Icon, level }) => (
            <DropdownMenuItem
              key={level}
              onClick={() => {
                editor.update(() => {
                  $insertCollapsible(level);
                });
                editor.focus();
              }}
            >
              <Icon size={14} style={{ marginRight: 8 }} />
              {title}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={() => {
              const videoId = window.prompt(
                'Enter YouTube Video ID (e.g. jNQXAC9IVRw):',
                'jNQXAC9IVRw',
              );
              if (videoId) {
                editor.update(() => {
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    selection.insertNodes([$createYouTubeNode(videoId)]);
                  }
                });
              }
            }}
          >
            <Video size={14} style={{ marginRight: 8 }} />
            YouTube Video
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
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
            }}
          >
            <FigmaIcon size={14} style={{ marginRight: 8 }} />
            Figma Embed
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createCalloutNode('💡'));
                }
              });
            }}
          >
            <Lightbulb size={14} style={{ marginRight: 8 }} />
            Callout Box
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Box sx={styles.divider} className="vlrc-editor-toolbar-divider" aria-hidden="true" />

      {/* Alignment & Indentation */}
      <HStack gap="xxs">
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          aria-label="Align left"
        >
          <AlignLeft size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
          aria-label="Align center"
        >
          <AlignCenter size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
          aria-label="Align right"
        >
          <AlignRight size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
          aria-label="Align justify"
        >
          <AlignJustify size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
          aria-label="Outdent"
        >
          <Outdent size={14} />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="vlrc-editor-toolbar-btn"
          onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
          aria-label="Indent"
        >
          <Indent size={14} />
        </Button>
      </HStack>

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
    </Box>
  );
}

export default ToolbarPlugin;
