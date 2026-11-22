import { useState, useMemo, useCallback, forwardRef } from 'react';
import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import {
  HorizontalRuleNode,
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
  CHECK_LIST,
  type ElementTransformer,
  type MultilineElementTransformer,
} from '@lexical/markdown';
import { $createParagraphNode, $createTextNode, type ElementNode, type LexicalNode } from 'lexical';
import {
  TableNode,
  TableRowNode,
  TableCellNode,
  TableCellHeaderStates,
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  $isTableNode,
  $isTableRowNode,
} from '@lexical/table';
import { props as stylexProps } from '@stylexjs/stylex';
import { Box } from '@vlrc-fe/components';
import {
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
  $createCollapsibleContainerNode,
  $createCollapsibleTitleNode,
  $createCollapsibleContentNode,
  $isCollapsibleContainerNode,
  $isCollapsibleTitleNode,
  $isCollapsibleContentNode,
  type CollapsibleLevel,
  sanitizeCollapsibleLevel,
} from './nodes/CollapsibleNodes';
import { EDITOR_NODES } from './nodes';
import { editorStyles, editorTheme } from './theme/editorTheme';
import { SlashMenuPlugin } from './plugins/SlashMenuPlugin';
import { FloatingToolbarPlugin } from './plugins/FloatingToolbarPlugin';
import { DraggableBlockPlugin } from './plugins/DraggableBlockPlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { TreeViewPlugin } from './plugins/TreeViewPlugin';
import { CodeHighlightPlugin } from './plugins/CodeHighlightPlugin';
import { MentionsPlugin } from './plugins/MentionsPlugin';
import { EmojisPlugin } from './plugins/EmojisPlugin';
import { TableActionMenuPlugin } from './plugins/TableActionMenuPlugin';
import { TableCellResizerPlugin } from './plugins/TableCellResizerPlugin';
import { TableHoverActionsPlugin } from './plugins/TableHoverActionsPlugin';
import { CollapsiblePlugin } from './plugins/CollapsiblePlugin';
import type { NotionEditorProps } from './types';
import './theme/editor.css';

export const HR: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node: LexicalNode) => {
    return $isHorizontalRuleNode(node) ? '***' : null;
  },
  regExp: /^(---|[*]{3}|_{3})\s?$/,
  replace: (parentNode, _1, _2, isImport) => {
    const line = $createHorizontalRuleNode();
    if (isImport) {
      parentNode.replace(line);
    } else {
      parentNode.insertBefore(line);
    }
    line.selectNext();
  },
  type: 'element',
};

export const TABLE: MultilineElementTransformer = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: LexicalNode) => {
    if (!$isTableNode(node)) return null;
    const rows = node.getChildren();
    const output: string[] = [];
    rows.forEach((row, rowIndex) => {
      if (!$isTableRowNode(row)) return;
      const cells = row.getChildren();
      const cellTexts = cells.map((cell) => cell.getTextContent().trim());
      output.push(`| ${cellTexts.join(' | ')} |`);
      if (rowIndex === 0) {
        output.push(`| ${cells.map(() => '---').join(' | ')} |`);
      }
    });
    return output.join('\n');
  },
  regExpStart: /^(?:\|)(.+)(?:\|)\s?$/,
  replace: () => false,
  type: 'multiline-element',
  handleImportAfterStartMatch: ({ lines, rootNode, startLineIndex }) => {
    const dividerLine = lines[startLineIndex + 1];
    if (!dividerLine || !/^\|(\s*:?-+:?\s*\|)+\s*$/.test(dividerLine.trim())) {
      return null;
    }
    let endLineIndex = startLineIndex;
    const tableLines: string[] = [];
    while (endLineIndex < lines.length && /^\|(.+)\|\s*$/.test(lines[endLineIndex].trim())) {
      tableLines.push(lines[endLineIndex].trim());
      endLineIndex++;
    }
    const tableNode = $createTableNode();
    tableLines.forEach((line, rIndex) => {
      if (rIndex === 1) return;
      const row = $createTableRowNode();
      const cells = line.split('|').slice(1, -1);
      cells.forEach((cellText) => {
        const cell = $createTableCellNode(
          rIndex === 0 ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS,
        );
        const p = $createParagraphNode();
        p.append($createTextNode(cellText.trim()));
        cell.append(p);
        row.append(cell);
      });
      tableNode.append(row);
    });
    rootNode.append(tableNode);
    return [true, endLineIndex - 1];
  },
};

export const COLLAPSIBLE: MultilineElementTransformer = {
  dependencies: [CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode],
  export: (node: LexicalNode, traverseChildren: (node: ElementNode) => string) => {
    if (!$isCollapsibleContainerNode(node)) return null;
    const level = node.getLevel();
    const open = node.getOpen();
    const children = node.getChildren();
    let titleText = '';
    let contentText = '';
    children.forEach((child) => {
      if ($isCollapsibleTitleNode(child)) {
        titleText = traverseChildren ? traverseChildren(child) : child.getTextContent();
      } else if ($isCollapsibleContentNode(child)) {
        contentText = traverseChildren ? traverseChildren(child) : child.getTextContent();
      }
    });
    return `<details data-level="${level}"${open ? ' open' : ''}>\n<summary data-level="${level}">${titleText}</summary>\n<div class="lexical-collapsible-content">\n${contentText}\n</div>\n</details>`;
  },
  regExpStart: /^<details(?:\s+[^>]*)?>/i,
  replace: () => false,
  type: 'multiline-element',
  handleImportAfterStartMatch: ({ lines, rootNode, startLineIndex }) => {
    const startLine = lines[startLineIndex];
    const levelMatch = /data-level="([^"]+)"/i.exec(startLine);
    const level: CollapsibleLevel = sanitizeCollapsibleLevel(levelMatch?.[1]);
    const isOpen = /\bopen\b/i.test(startLine);

    let endLineIndex = startLineIndex;
    const blockLines: string[] = [];
    while (endLineIndex < lines.length) {
      const line = lines[endLineIndex];
      blockLines.push(line);
      if (/<\/details>/i.test(line)) {
        break;
      }
      endLineIndex++;
    }

    const fullText = blockLines.join('\n');
    const summaryMatch = /<summary(?:\s+[^>]*)?>([\s\S]*?)<\/summary>/i.exec(fullText);
    const titleText = summaryMatch ? summaryMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const contentMatch = /<\/summary>([\s\S]*?)<\/details>/i.exec(fullText);
    let contentText = contentMatch ? contentMatch[1].trim() : '';
    contentText = contentText.replace(/^<div[^>]*>([\s\S]*?)<\/div>$/i, '$1').trim();

    const container = $createCollapsibleContainerNode(isOpen, level);
    const title = $createCollapsibleTitleNode(level);
    const pTitle = $createParagraphNode();
    pTitle.append($createTextNode(titleText));
    title.append(pTitle);

    const content = $createCollapsibleContentNode();
    const pContent = $createParagraphNode();
    pContent.append($createTextNode(contentText));
    content.append(pContent);

    container.append(title, content);
    rootNode.append(container);

    return [true, endLineIndex];
  },
};

export const EDITOR_TRANSFORMERS = [CHECK_LIST, HR, TABLE, COLLAPSIBLE, ...TRANSFORMERS];

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_MATCHER =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const AUTO_LINK_MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) return null;
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
    };
  },
  (text: string) => {
    const match = EMAIL_MATCHER.exec(text);
    if (match === null) return null;
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: `mailto:${fullMatch}`,
    };
  },
];

export const NotionEditor = forwardRef<HTMLDivElement, NotionEditorProps>(
  (
    {
      defaultValue = '',
      value: _value,
      onChange,
      placeholder = "Type '/' for commands, or write markdown...",
      readOnly = false,
      autoFocus = false,
      showToolbar = true,
      showFloatingToolbar = true,
      showSlashMenu = true,
      showDraggableBlocks = true,
      showTreeView = false,
      enableTabIndentation = true,
      enableCodeHighlighting = true,
      enableMentions = true,
      enableEmojis = true,
      enableHashtags = true,
      sx,
      className,
      ...props
    },
    ref,
  ) => {
    const [anchorElem, setAnchorElem] = useState<HTMLDivElement | null>(null);

    const initialConfig: InitialConfigType = useMemo(
      () => ({
        namespace: 'VLRCEditor',
        nodes: EDITOR_NODES,
        theme: editorTheme,
        onError: (error: Error) => {
          console.error('[VLRCEditor Error]:', error);
        },
        editable: !readOnly,
        editorState: defaultValue
          ? () => {
              $convertFromMarkdownString(defaultValue, EDITOR_TRANSFORMERS);
            }
          : undefined,
      }),
      [defaultValue, readOnly],
    );

    const sxProps = stylexProps(editorStyles.root, sx);

    const handleRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const rootClasses = ['vlrc-editor-root', sxProps.className, className]
      .filter(Boolean)
      .join(' ');

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <Box
          ref={handleRef}
          data-slot="notion-editor"
          data-readonly={readOnly ? 'true' : 'false'}
          className={rootClasses}
          style={sxProps.style}
          {...props}
        >
          {showToolbar && <ToolbarPlugin />}

          <Box
            ref={(node: HTMLDivElement | null) => setAnchorElem(node)}
            style={{ position: 'relative', width: '100%', flex: 1 }}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  data-slot="editor-content"
                  className={`vlrc-editor-content ${stylexProps(editorStyles.contentEditable).className || ''}`.trim()}
                  aria-placeholder={placeholder}
                  placeholder={
                    <Box
                      className="vlrc-editor-placeholder"
                      sx={editorStyles.placeholder}
                      aria-hidden="true"
                    >
                      {placeholder}
                    </Box>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin matchers={AUTO_LINK_MATCHERS} />
            <TablePlugin />
            <HorizontalRulePlugin />
            <CollapsiblePlugin />
            {enableTabIndentation && <TabIndentationPlugin />}
            {enableCodeHighlighting && <CodeHighlightPlugin />}
            {enableHashtags && <HashtagPlugin />}
            {enableMentions && !readOnly && <MentionsPlugin />}
            {enableEmojis && !readOnly && <EmojisPlugin />}
            <MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />

            <OnChangePlugin
              onChange={(editorState, editor) => {
                editorState.read(() => {
                  const markdown = $convertToMarkdownString(EDITOR_TRANSFORMERS);
                  onChange?.(markdown, editorState, editor);
                });
              }}
            />

            {autoFocus && <AutoFocusPlugin />}
            {showSlashMenu && !readOnly && <SlashMenuPlugin />}
            {showFloatingToolbar && !readOnly && <FloatingToolbarPlugin />}
            {showDraggableBlocks && !readOnly && anchorElem && (
              <DraggableBlockPlugin anchorElem={anchorElem} />
            )}
            {anchorElem && !readOnly && (
              <>
                <TableActionMenuPlugin anchorElem={anchorElem} />
                <TableCellResizerPlugin anchorElem={anchorElem} />
                <TableHoverActionsPlugin anchorElem={anchorElem} />
              </>
            )}
            {showTreeView && <TreeViewPlugin />}
          </Box>
        </Box>
      </LexicalComposer>
    );
  },
);

NotionEditor.displayName = 'NotionEditor';

export { NotionEditor as Editor };
export default NotionEditor;
