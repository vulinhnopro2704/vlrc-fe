import {
  type EditorConfig,
  type DOMConversionMap,
  type DOMExportOutput,
  ElementNode,
  type LexicalNode,
  type LexicalEditor,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
  $applyNodeReplacement,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';

export type CollapsibleLevel = 'default' | 'h1' | 'h2' | 'h3';

export const KNOWN_COLLAPSIBLE_LEVELS = ['default', 'h1', 'h2', 'h3'] as const;

export function sanitizeCollapsibleLevel(level: unknown): CollapsibleLevel {
  if (
    typeof level === 'string' &&
    (KNOWN_COLLAPSIBLE_LEVELS as readonly string[]).includes(level)
  ) {
    return level as CollapsibleLevel;
  }
  return 'default';
}

export type SerializedCollapsibleContainerNode = Spread<
  {
    open: boolean;
    level: CollapsibleLevel;
  },
  SerializedElementNode
>;

export class CollapsibleContainerNode extends ElementNode {
  __open: boolean;
  __level: CollapsibleLevel;

  static getType(): string {
    return 'collapsible-container';
  }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__level, node.__key);
  }

  constructor(open = true, level: CollapsibleLevel = 'default', key?: NodeKey) {
    super(key);
    this.__open = open;
    this.__level = level;
  }

  createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement('details');
    dom.classList.add('lexical-collapsible-container');
    dom.dataset.level = this.__level;
    dom.open = this.__open;
    dom.addEventListener('toggle', () => {
      const open = dom.open;
      editor.update(() => {
        const node = this.getLatest();
        if (node instanceof CollapsibleContainerNode) {
          node.setOpen(open);
        }
      });
    });
    return dom;
  }

  updateDOM(prevNode: CollapsibleContainerNode, dom: HTMLDetailsElement): boolean {
    if (prevNode.__open !== this.__open) {
      dom.open = this.__open;
    }
    if (prevNode.__level !== this.__level) {
      dom.dataset.level = this.__level;
    }
    return false;
  }

  setOpen(open: boolean): void {
    const writable = this.getWritable();
    writable.__open = open;
  }

  getOpen(): boolean {
    return this.__open;
  }

  setLevel(level: CollapsibleLevel): void {
    const writable = this.getWritable();
    writable.__level = level;
  }

  getLevel(): CollapsibleLevel {
    return this.__level;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('details');
    element.classList.add('lexical-collapsible-container');
    element.setAttribute('data-level', this.__level);
    if (this.__open) {
      element.setAttribute('open', '');
    }
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      details: (_domNode: HTMLElement) => {
        return {
          conversion: (element: HTMLElement) => {
            const open = element.hasAttribute('open');
            const level = sanitizeCollapsibleLevel(element.getAttribute('data-level'));
            return { node: $createCollapsibleContainerNode(open, level) };
          },
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedCollapsibleContainerNode): CollapsibleContainerNode {
    return $createCollapsibleContainerNode(serializedNode.open, serializedNode.level ?? 'default');
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return {
      ...super.exportJSON(),
      open: this.__open,
      level: this.__level,
    };
  }
}

export type SerializedCollapsibleTitleNode = Spread<
  {
    level: CollapsibleLevel;
  },
  SerializedElementNode
>;

export class CollapsibleTitleNode extends ElementNode {
  __level: CollapsibleLevel;

  static getType(): string {
    return 'collapsible-title';
  }

  static clone(node: CollapsibleTitleNode): CollapsibleTitleNode {
    return new CollapsibleTitleNode(node.__level, node.__key);
  }

  constructor(level: CollapsibleLevel = 'default', key?: NodeKey) {
    super(key);
    this.__level = level;
  }

  createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement('summary');
    dom.classList.add('lexical-collapsible-title');
    dom.dataset.level = this.__level;

    const chevron = document.createElement('span');
    chevron.setAttribute('data-collapsible-chevron', '');
    chevron.setAttribute('aria-hidden', 'true');
    chevron.setAttribute('contenteditable', 'false');
    dom.appendChild(chevron);

    dom.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      const isChevronClick = Boolean(target?.closest('[data-collapsible-chevron]'));

      if (!isChevronClick) {
        // Prevent toggle when clicking on the title text area to edit/select
        e.preventDefault();
        editor.update(() => {
          const titleNode = this.getLatest();
          if ($isCollapsibleTitleNode(titleNode)) {
            const firstChild = titleNode.getFirstChild();
            if (
              firstChild &&
              'select' in firstChild &&
              typeof (firstChild as ElementNode).select === 'function'
            ) {
              (firstChild as ElementNode).select();
            } else {
              titleNode.select();
            }
          }
        });
        editor.focus();
      }
      // When chevron is clicked, let the native <details> toggle naturally without focus stealing.
    });
    return dom;
  }

  updateDOM(prevNode: CollapsibleTitleNode, dom: HTMLElement): boolean {
    if (prevNode.__level !== this.__level) {
      dom.dataset.level = this.__level;
    }
    return false;
  }

  setLevel(level: CollapsibleLevel): void {
    const writable = this.getWritable();
    writable.__level = level;
  }

  getLevel(): CollapsibleLevel {
    return this.__level;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('summary');
    element.classList.add('lexical-collapsible-title');
    element.setAttribute('data-level', this.__level);
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      summary: (_domNode: HTMLElement) => {
        return {
          conversion: (element: HTMLElement) => {
            const level = sanitizeCollapsibleLevel(element.getAttribute('data-level'));
            return { node: $createCollapsibleTitleNode(level) };
          },
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedCollapsibleTitleNode): CollapsibleTitleNode {
    return $createCollapsibleTitleNode(serializedNode.level ?? 'default');
  }

  exportJSON(): SerializedCollapsibleTitleNode {
    return {
      ...super.exportJSON(),
      level: this.__level,
    };
  }
}

export class CollapsibleContentNode extends ElementNode {
  static getType(): string {
    return 'collapsible-content';
  }

  static clone(node: CollapsibleContentNode): CollapsibleContentNode {
    return new CollapsibleContentNode(node.__key);
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement('div');
    dom.classList.add('lexical-collapsible-content');
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.classList.add('lexical-collapsible-content');
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.classList.contains('lexical-collapsible-content')) {
          return null;
        }
        return {
          conversion: () => {
            return { node: $createCollapsibleContentNode() };
          },
          priority: 2,
        };
      },
    };
  }

  static importJSON(): CollapsibleContentNode {
    return $createCollapsibleContentNode();
  }

  exportJSON(): SerializedElementNode {
    return super.exportJSON();
  }
}

export function $createCollapsibleContainerNode(
  open = true,
  level: CollapsibleLevel = 'default',
): CollapsibleContainerNode {
  return $applyNodeReplacement(new CollapsibleContainerNode(open, level));
}

export function $isCollapsibleContainerNode(
  node: LexicalNode | null | undefined,
): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode;
}

export function $createCollapsibleTitleNode(
  level: CollapsibleLevel = 'default',
): CollapsibleTitleNode {
  return $applyNodeReplacement(new CollapsibleTitleNode(level));
}

export function $isCollapsibleTitleNode(
  node: LexicalNode | null | undefined,
): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode;
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
  return $applyNodeReplacement(new CollapsibleContentNode());
}

export function $isCollapsibleContentNode(
  node: LexicalNode | null | undefined,
): node is CollapsibleContentNode {
  return node instanceof CollapsibleContentNode;
}

/**
 * Inserts a collapsible container with title and content at the current selection.
 * Shared between SlashMenuPlugin, ToolbarPlugin, and external commands to prevent duplicate insertion logic.
 */
export function $insertCollapsible(
  level: CollapsibleLevel = 'default',
): CollapsibleContainerNode | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return null;
  }
  const container = $createCollapsibleContainerNode(true, level);
  const title = $createCollapsibleTitleNode(level);
  const titleParagraph = $createParagraphNode();
  title.append(titleParagraph);
  const content = $createCollapsibleContentNode();
  const contentParagraph = $createParagraphNode();
  content.append(contentParagraph);
  container.append(title, content);
  selection.insertNodes([container]);
  titleParagraph.select();
  return container;
}
