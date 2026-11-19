import type { JSX } from 'react';
import {
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
  DecoratorNode,
  $applyNodeReplacement,
} from 'lexical';
import { Box, Text } from '@vlrc-fe/components';

export interface ImagePayload {
  altText: string;
  caption?: string;
  height?: number | 'inherit';
  key?: NodeKey;
  maxWidth?: number;
  showCaption?: boolean;
  src: string;
  width?: number | 'inherit';
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption?: string;
    height?: number | 'inherit';
    maxWidth?: number;
    showCaption?: boolean;
    src: string;
    width?: number | 'inherit';
  },
  SerializedLexicalNode
>;

function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth,
  caption,
  showCaption,
}: ImagePayload): JSX.Element {
  return (
    <Box className="lexical-image-container" data-slot="editor-image">
      <img
        src={src}
        alt={altText}
        className="lexical-image"
        style={{
          width: width === 'inherit' ? 'auto' : width ? `${width}px` : '100%',
          height: height === 'inherit' ? 'auto' : height ? `${height}px` : 'auto',
          maxWidth: maxWidth ? `${maxWidth}px` : '100%',
          borderRadius: '6px',
          display: 'block',
        }}
      />
      {showCaption && caption && (
        <Text size="xs" type="secondary" className="lexical-image-caption">
          {caption}
        </Text>
      )}
    </Box>
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;
  __showCaption: boolean;
  __caption: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, caption, src, showCaption } = serializedNode;
    return $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
      caption,
    });
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    if (this.__width) {
      element.setAttribute('width', this.__width.toString());
    }
    if (this.__height) {
      element.setAttribute('height', this.__height.toString());
    }
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
          if (domNode instanceof HTMLImageElement) {
            const { alt: altText, src, width, height } = domNode;
            const node = $createImageNode({ altText, height, src, width });
            return { node };
          }
          return null;
        },
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth = 500,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    showCaption = false,
    caption = '',
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__showCaption = showCaption;
    this.__caption = caption;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      altText: this.__altText,
      caption: this.__caption,
      height: this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.__src,
      width: this.__width,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        showCaption={this.__showCaption}
        caption={this.__caption}
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  caption,
  showCaption,
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, maxWidth, width, height, showCaption, caption, key),
  );
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
