import type { Klass, LexicalNode } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HashtagNode } from '@lexical/hashtag';
import { CalloutNode } from './CalloutNode';
import { MentionNode } from './MentionNode';
import {
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
} from './CollapsibleNodes';
import { ImageNode } from './ImageNode';
import { YouTubeNode, FigmaNode } from './EmbedNodes';

export { CalloutNode, $createCalloutNode, $isCalloutNode } from './CalloutNode';
export { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
export { HashtagNode } from '@lexical/hashtag';
export { MentionNode, $createMentionNode, $isMentionNode } from './MentionNode';
export {
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
  $createCollapsibleContainerNode,
  $isCollapsibleContainerNode,
  $createCollapsibleTitleNode,
  $isCollapsibleTitleNode,
  $createCollapsibleContentNode,
  $isCollapsibleContentNode,
  $insertCollapsible,
  type CollapsibleLevel,
} from './CollapsibleNodes';
export { ImageNode, $createImageNode, $isImageNode } from './ImageNode';
export {
  YouTubeNode,
  $createYouTubeNode,
  $isYouTubeNode,
  FigmaNode,
  $createFigmaNode,
  $isFigmaNode,
} from './EmbedNodes';

export const EDITOR_NODES: Array<Klass<LexicalNode>> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  HorizontalRuleNode,
  HashtagNode,
  MentionNode,
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
  ImageNode,
  YouTubeNode,
  FigmaNode,
  CalloutNode,
];
