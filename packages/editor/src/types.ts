import type { StyleXStyles } from '@stylexjs/stylex';
import type { EditorState, LexicalEditor } from 'lexical';

export interface NotionEditorProps {
  /** Initial markdown or plain text value */
  defaultValue?: string;
  /** Controlled markdown value */
  value?: string;
  /** Callback fired whenever content changes, delivering serialized Markdown */
  onChange?: (markdown: string, editorState: EditorState, editor: LexicalEditor) => void;
  /** Placeholder displayed when the editor is completely empty */
  placeholder?: string;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Whether to automatically focus the editor on mount */
  autoFocus?: boolean;
  /** Whether to display the top fixed formatting toolbar */
  showToolbar?: boolean;
  /** Whether to enable floating bubble formatting toolbar on text selection */
  showFloatingToolbar?: boolean;
  /** Whether to enable the Notion-style '/' slash command menu */
  showSlashMenu?: boolean;
  /** Whether to enable block dragging handles */
  showDraggableBlocks?: boolean;
  /** Whether to display the TreeView AST debug console at the bottom */
  showTreeView?: boolean;
  /** Whether to enable Tab/Shift+Tab keyboard indentation for lists and blocks (default true) */
  enableTabIndentation?: boolean;
  /** Whether to enable code syntax highlighting in code blocks (default true) */
  enableCodeHighlighting?: boolean;
  /** Whether to enable @-mention popover (default true) */
  enableMentions?: boolean;
  /** Whether to enable :-emoji popover (default true) */
  enableEmojis?: boolean;
  /** Whether to enable #hashtag parsing (default true) */
  enableHashtags?: boolean;
  /** StyleX style overrides */
  sx?: StyleXStyles;
  /** Additional CSS class names */
  className?: string;
}
