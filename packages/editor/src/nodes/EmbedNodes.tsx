import type { JSX } from 'react';
import {
  DecoratorNode,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
  $applyNodeReplacement,
} from 'lexical';
import { Box } from '@vlrc-fe/components';

// --- YouTube Node ---
export type SerializedYouTubeNode = Spread<
  {
    videoID: string;
  },
  SerializedLexicalNode
>;

export class YouTubeNode extends DecoratorNode<JSX.Element> {
  __id: string;

  static getType(): string {
    return 'youtube';
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__key);
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    return $createYouTubeNode(serializedNode.videoID);
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      type: 'youtube',
      version: 1,
      videoID: this.__id,
    };
  }

  constructor(id: string, key?: NodeKey) {
    super(key);
    this.__id = id;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('data-lexical-youtube', this.__id);
    element.setAttribute('width', '560');
    element.setAttribute('height', '315');
    element.setAttribute('src', `https://www.youtube-nocookie.com/embed/${this.__id}`);
    element.setAttribute('frameborder', '0');
    element.setAttribute('allowfullscreen', 'true');
    return { element };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.className = 'lexical-embed-youtube-wrapper';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Box className="lexical-embed-youtube" style={{ margin: '1rem 0' }}>
        <iframe
          width="100%"
          height="360"
          src={`https://www.youtube-nocookie.com/embed/${this.__id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
          style={{ borderRadius: '8px', border: 'none', maxWidth: '640px', display: 'block' }}
        />
      </Box>
    );
  }
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
  return $applyNodeReplacement(new YouTubeNode(videoID));
}

export function $isYouTubeNode(node: LexicalNode | null | undefined): node is YouTubeNode {
  return node instanceof YouTubeNode;
}

// --- Figma Node ---
export type SerializedFigmaNode = Spread<
  {
    documentURL: string;
  },
  SerializedLexicalNode
>;

export class FigmaNode extends DecoratorNode<JSX.Element> {
  __url: string;

  static getType(): string {
    return 'figma';
  }

  static clone(node: FigmaNode): FigmaNode {
    return new FigmaNode(node.__url, node.__key);
  }

  static importJSON(serializedNode: SerializedFigmaNode): FigmaNode {
    return $createFigmaNode(serializedNode.documentURL);
  }

  exportJSON(): SerializedFigmaNode {
    return {
      type: 'figma',
      version: 1,
      documentURL: this.__url,
    };
  }

  constructor(url: string, key?: NodeKey) {
    super(key);
    this.__url = url;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('data-lexical-figma', this.__url);
    element.setAttribute('width', '560');
    element.setAttribute('height', '315');
    element.setAttribute(
      'src',
      `https://www.figma.com/embed?embed_host=lexical&url=${encodeURIComponent(this.__url)}`,
    );
    return { element };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.className = 'lexical-embed-figma-wrapper';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Box className="lexical-embed-figma" style={{ margin: '1rem 0' }}>
        <iframe
          width="100%"
          height="360"
          src={`https://www.figma.com/embed?embed_host=lexical&url=${encodeURIComponent(this.__url)}`}
          allowFullScreen
          title="Figma document"
          style={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            maxWidth: '640px',
            display: 'block',
          }}
        />
      </Box>
    );
  }
}

export function $createFigmaNode(url: string): FigmaNode {
  return $applyNodeReplacement(new FigmaNode(url));
}

export function $isFigmaNode(node: LexicalNode | null | undefined): node is FigmaNode {
  return node instanceof FigmaNode;
}
