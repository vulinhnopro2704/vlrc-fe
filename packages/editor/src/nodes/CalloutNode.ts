import {
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
} from 'lexical';

export type SerializedCalloutNode = Spread<
  {
    icon: string;
  },
  SerializedElementNode
>;

export class CalloutNode extends ElementNode {
  __icon: string;

  static override getType(): string {
    return 'callout';
  }

  static override clone(node: CalloutNode): CalloutNode {
    return new CalloutNode(node.__icon, node.__key);
  }

  constructor(icon = '💡', key?: NodeKey) {
    super(key);
    this.__icon = icon;
  }

  getIcon(): string {
    return this.__icon;
  }

  setIcon(icon: string): void {
    const writable = this.getWritable();
    writable.__icon = icon;
  }

  override createDOM(): HTMLElement {
    const dom = document.createElement('div');
    dom.setAttribute('data-lexical-callout', 'true');
    dom.className = 'lexical-callout';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'lexical-callout-icon';
    iconSpan.textContent = this.__icon;
    iconSpan.contentEditable = 'false';
    dom.appendChild(iconSpan);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'lexical-callout-content';
    dom.appendChild(contentDiv);

    return dom;
  }

  override updateDOM(prevNode: CalloutNode, dom: HTMLElement): boolean {
    if (prevNode.__icon !== this.__icon) {
      const iconSpan = dom.querySelector('.lexical-callout-icon');
      if (iconSpan) {
        iconSpan.textContent = this.__icon;
      }
    }
    return false;
  }

  static override importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-callout')) {
          return null;
        }
        return {
          conversion: (): DOMConversionOutput => {
            const iconSpan = domNode.querySelector('.lexical-callout-icon');
            const icon = iconSpan?.textContent || '💡';
            return { node: $createCalloutNode(icon) };
          },
          priority: 2,
        };
      },
    };
  }

  override exportDOM(): DOMExportOutput {
    const element = this.createDOM();
    return { element };
  }

  static override importJSON(serializedNode: SerializedCalloutNode): CalloutNode {
    const node = $createCalloutNode(serializedNode.icon);
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  override exportJSON(): SerializedCalloutNode {
    return {
      ...super.exportJSON(),
      icon: this.getIcon(),
      type: 'callout',
      version: 1,
    };
  }
}

export function $createCalloutNode(icon = '💡'): CalloutNode {
  return new CalloutNode(icon);
}

export function $isCalloutNode(node: LexicalNode | null | undefined): node is CalloutNode {
  return node instanceof CalloutNode;
}
