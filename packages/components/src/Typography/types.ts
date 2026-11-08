import type React from 'react';
import type { ElementType, ReactNode } from 'react';
import type * as stylex from '@stylexjs/stylex';
import type { ComponentSize } from '../theme/types';

/**
 * Text decoration line values with typed autocomplete and support for any custom string combination.
 */
export type TextDecorationLine =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'underline line-through'
  | 'underline overline'
  | 'overline line-through'
  | 'underline overline line-through'
  | 'blink'
  | (string & {});

/**
 * Text decoration line styles with typed autocomplete.
 */
export type TextDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | (string & {});

/**
 * Text decoration stroke thickness (number in px or CSS string).
 */
export type TextDecorationThickness = 'auto' | 'from-font' | number | (string & {});

/**
 * Text decoration line color (supports named colors, theme tokens, hex, rgb).
 */
export type TextDecorationColor = 'currentColor' | 'transparent' | 'inherit' | (string & {});

/**
 * Text underline offset distance (number in px or CSS string).
 */
export type TextUnderlineOffset = 'auto' | number | (string & {});

/**
 * Shorthand text-decoration property with typed autocomplete for common patterns while allowing any string.
 */
export type TextDecoration =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'underline solid'
  | 'underline double'
  | 'underline dotted'
  | 'underline dashed'
  | 'underline wavy'
  | 'line-through solid'
  | 'line-through wavy'
  | 'overline solid'
  | 'overline wavy'
  | 'underline wavy red'
  | 'underline wavy currentColor'
  | 'underline 2px solid'
  | 'underline 2px dashed'
  | (string & {});

export interface BaseTypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Polymorphic component to override the semantic HTML tag */
  as?: ElementType;
  /** Additional CSS class name */
  className?: string;
  /** Content to render */
  children?: ReactNode;
  /** Whether the field/label is required, displaying an accessible red asterisk indicator */
  required?: boolean;
  /** Arbitrary custom font size in pixels or CSS units (e.g., 18 or '1.5rem') */
  customSize?: number | string;
  /** Max lines of text before truncating with ellipsis */
  lines?: number;
  /** Alias for lines */
  rows?: number;
  /** Custom line height multiplier or CSS unit (e.g., 1.4 or '24px') */
  lineHeight?: number | string;
  /** Truncate text or clamp to specified number of rows */
  ellipsis?: boolean | { rows?: number };
  /** Complete text decoration shorthand or custom value with typed autocomplete */
  textDecoration?: TextDecoration;
  /** Decoration line type (underline, overline, line-through, etc.) with typed autocomplete */
  textDecorationLine?: TextDecorationLine;
  /** Decoration line style (solid, double, dotted, dashed, wavy) with typed autocomplete */
  textDecorationStyle?: TextDecorationStyle;
  /** Decoration line color (named color, hex, rgb, currentColor, etc.) with typed autocomplete */
  textDecorationColor?: TextDecorationColor;
  /** Decoration line thickness (number in px or CSS unit like '2px', 'from-font') with typed autocomplete */
  textDecorationThickness?: TextDecorationThickness;
  /** Underline offset distance (number in px or CSS unit like '4px') with typed autocomplete */
  textUnderlineOffset?: TextUnderlineOffset;
  /** StyleX style overrides */
  sx?: stylex.StyleXStyles | (stylex.StyleXStyles | false | undefined)[];
}

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleVariant = 'default' | 'gradient' | 'mono';
export type TitleTracking = 'tight' | 'normal' | 'wide';

export interface TitleProps extends BaseTypographyProps {
  /** Heading level corresponding to h1 through h6 (defaults to 1) */
  level?: TitleLevel;
  /** 7-tier sizing scale (xxs: 10px, xs: 12px, sm: 14px, md: 16px, lg: 20px, xl: 24px, xxl: 32px) */
  size?: ComponentSize;
  /** Visual presentation variant */
  variant?: TitleVariant;
  /** Letter tracking/spacing */
  tracking?: TitleTracking;
  /** Enables inline editing */
  editable?: boolean;
  /** Enables copy-to-clipboard button */
  copyable?: boolean;
  /** Callback fired when inline edit completes */
  onEdit?: (value: string) => void;
}

export type ParagraphVariant = 'default' | 'lead';
export type ParagraphSpacing = 'none' | 'sm' | 'md' | 'lg';
export type ParagraphAlign = 'left' | 'center' | 'right' | 'justify';

export interface ParagraphProps extends BaseTypographyProps {
  /** 7-tier sizing scale (xxs: 8px, xs: 10px, sm: 12px, md: 14px [default], lg: 16px, xl: 20px, xxl: 24px) */
  size?: ComponentSize;
  /** Text style variant */
  variant?: ParagraphVariant;
  /** Bottom margin spacing */
  spacing?: ParagraphSpacing;
  /** Text alignment */
  align?: ParagraphAlign;
}

export type TextType =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends BaseTypographyProps {
  /** Semantic color type */
  type?: TextType;
  /** 7-tier sizing scale (xxs: 8px, xs: 10px, sm: 12px, md: 14px [default], lg: 16px, xl: 20px, xxl: 24px) */
  size?: ComponentSize;
  /** Font weight */
  weight?: TextWeight;
  /** Bold text styling (renders <strong> if as is unset) */
  strong?: boolean;
  /** Italic text styling (renders <em> if as is unset) */
  italic?: boolean;
  /** Underline text decoration */
  underline?: boolean;
  /** Strike-through text decoration (renders <del> if as is unset) */
  delete?: boolean;
  /** Keyboard key styling (renders <kbd> if as is unset) */
  keyboard?: boolean;
  /** Enables copy-to-clipboard button */
  copyable?: boolean;
}

export type LinkUnderline = 'always' | 'hover' | 'none';

export interface LinkProps extends Omit<BaseTypographyProps, 'onClick'> {
  /** Target URL */
  href?: string;
  /** 7-tier sizing scale (xxs: 8px, xs: 10px, sm: 12px, md: 14px [default], lg: 16px, xl: 20px, xxl: 24px) */
  size?: ComponentSize;
  /** Opens in new tab with secure noopener noreferrer */
  external?: boolean;
  /** Underline behavior */
  underline?: LinkUnderline;
  /** Disabled link state */
  disabled?: boolean;
  /** Target frame */
  target?: string;
  /** Rel attribute */
  rel?: string;
  /** Click event handler */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type BlockquoteVariant = 'default' | 'bordered' | 'filled';

export interface BlockquoteProps extends BaseTypographyProps {
  /** Visual variant */
  variant?: BlockquoteVariant;
  /** Citation or author source */
  cite?: string;
}

export interface CodeProps extends BaseTypographyProps {
  /** Whether to render as a preformatted code block */
  block?: boolean;
  /** Programming language identifier */
  language?: string;
  /** Enables copy button */
  copyable?: boolean;
}
