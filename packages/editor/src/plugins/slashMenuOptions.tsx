import type { ReactNode } from 'react';
import type { LexicalEditor } from 'lexical';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
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
import { $createCalloutNode } from '../nodes/CalloutNode';
import { $insertCollapsible } from '../nodes/CollapsibleNodes';

export interface SlashOption {
  title: string;
  description: string;
  icon: ReactNode;
  category: 'basic' | 'media';
  actionId?: 'table' | 'image' | 'youtube' | 'figma';
  onSelect: (editor: LexicalEditor) => void;
}

export const SLASH_OPTIONS: SlashOption[] = [
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
