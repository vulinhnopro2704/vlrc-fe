import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { Copy, Check, WrapText, ChevronDown, ChevronUp } from 'lucide-react';
import { colors, radius, spacing } from '../theme/tokens.stylex';
import { Box } from '../layout/Box';
import { HStack } from '../layout/Stack';
import { Text } from '../Typography/Text';
import { Button, type ButtonProps } from './button';
import { cn } from '../utils';

export interface CodeBlockDiffInfo {
  added?: boolean;
  removed?: boolean;
}

export type CodeBlockDiffMap = Record<number, CodeBlockDiffInfo>;

export interface CodeBlockContextValue {
  code: string;
  language: string;
  wrap: boolean;
  toggleWrap: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  isCopied: boolean;
  copy: () => Promise<void>;
  lineCount: number;
  highlightedLinesSet: Set<number>;
  highlightWords: string[];
  showLineNumbers: boolean;
  startLine: number;
  diff: CodeBlockDiffMap;
  maxLines?: number;
  isCollapsible: boolean;
  disableHighlighting: boolean;
}

const CodeBlockContext = createContext<CodeBlockContextValue | null>(null);

export function useCodeBlock(): CodeBlockContextValue {
  const context = useContext(CodeBlockContext);
  if (!context) {
    throw new Error('useCodeBlock must be used within a CodeBlock');
  }
  return context;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceDefault,
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.borderDefault,
    backgroundColor: colors.surfaceSubtle,
    gap: spacing.xs,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontWeight: 500,
    fontSize: '0.8125rem',
    color: colors.fgDefault,
  },
  languageBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: spacing.xs,
    paddingBlock: spacing['0.5'],
    borderRadius: radius.sm,
    fontSize: '0.6875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
    backgroundColor: colors.surfaceDefault,
    color: colors.fgMuted,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
  },
  content: {
    position: 'relative',
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    boxSizing: 'border-box',
    paddingBlock: spacing.xs,
  },
  contentWrapped: {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  },
  codeSurface: {
    margin: 0,
    padding: 0,
    width: '100%',
    boxSizing: 'border-box',
    lineHeight: 1.6,
    fontSize: '0.8125rem',
  },
  line: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingInline: spacing.sm,
    boxSizing: 'border-box',
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
  },
  lineHighlighted: {
    backgroundColor: 'color-mix(in srgb, var(--primary, #3b82f6) 12%, transparent)',
  },
  lineAdded: {
    backgroundColor: 'color-mix(in srgb, var(--color-success, #16a34a) 15%, transparent)',
  },
  lineRemoved: {
    backgroundColor: 'color-mix(in srgb, var(--destructive, #ef4444) 15%, transparent)',
  },
  gutter: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '2.5rem',
    flexShrink: 0,
    paddingRight: spacing.sm,
    userSelect: 'none',
    color: colors.fgMuted,
    fontSize: '0.75rem',
    textAlign: 'right',
  },
  gutterDiffSign: {
    width: '1rem',
    flexShrink: 0,
    fontWeight: 700,
    userSelect: 'none',
  },
  gutterDiffAdded: {
    color: colors.success,
  },
  gutterDiffRemoved: {
    color: colors.destructive,
  },
  lineContent: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  tokenKeyword: {
    color: colors.primary,
    fontWeight: 600,
  },
  tokenString: {
    color: colors.success,
  },
  tokenComment: {
    color: colors.fgMuted,
    fontStyle: 'italic',
  },
  tokenNumber: {
    color: colors.warning,
  },
  tokenBoolean: {
    color: colors.destructive,
    fontWeight: 600,
  },
  wordHighlight: {
    backgroundColor: 'color-mix(in srgb, var(--color-warning, #eab308) 30%, transparent)',
    borderRadius: radius.sm,
    paddingInline: spacing['0.5'],
  },
  expandBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: spacing.xs,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.borderDefault,
    backgroundColor: colors.surfaceSubtle,
  },
});

function parseHighlightedLines(input?: number[] | string): Set<number> {
  const result = new Set<number>();
  if (!input) return result;
  if (Array.isArray(input)) {
    input.forEach((num) => result.add(num));
    return result;
  }

  const parts = input.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) result.add(i);
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) result.add(num);
    }
  }
  return result;
}

// Lightweight syntax highlighting token parser
const KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'default',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'switch',
  'case',
  'break',
  'class',
  'extends',
  'interface',
  'type',
  'async',
  'await',
  'try',
  'catch',
  'finally',
  'throw',
  'new',
  'def',
  'print',
  'in',
  'is',
  'not',
  'and',
  'or',
  'public',
  'private',
  'protected',
  'static',
  'readonly',
]);

const BOOLEANS = new Set(['true', 'false', 'null', 'undefined', 'None', 'True', 'False']);

function renderHighlightedTokens(
  text: string,
  highlightWords: string[],
  disableHighlighting: boolean,
): ReactNode {
  if (disableHighlighting || !text) {
    return text;
  }

  // Tokenize regex
  const regex = /(\/\/.*$|#.*$|'[^']*'|"[^"]*"|`[^`]*`|\b\w+\b|[^\s\w]+)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const token = match[0];
    const matchStart = match.index;

    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    // Word highlighting check
    const isWordHighlighted = highlightWords.includes(token);

    if (token.startsWith('//') || token.startsWith('#')) {
      parts.push(
        <Box as="span" key={matchStart} sx={styles.tokenComment}>
          {token}
        </Box>,
      );
    } else if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith('`') && token.endsWith('`'))
    ) {
      parts.push(
        <Box as="span" key={matchStart} sx={styles.tokenString}>
          {token}
        </Box>,
      );
    } else if (BOOLEANS.has(token)) {
      parts.push(
        <Box as="span" key={matchStart} sx={styles.tokenBoolean}>
          {token}
        </Box>,
      );
    } else if (KEYWORDS.has(token)) {
      parts.push(
        <Box as="span" key={matchStart} sx={styles.tokenKeyword}>
          {token}
        </Box>,
      );
    } else if (/^\d+$/.test(token)) {
      parts.push(
        <Box as="span" key={matchStart} sx={styles.tokenNumber}>
          {token}
        </Box>,
      );
    } else if (isWordHighlighted) {
      parts.push(
        <Box as="span" key={matchStart} sx={styles.wordHighlight}>
          {token}
        </Box>,
      );
    } else {
      parts.push(token);
    }

    lastIndex = matchStart + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  highlightedLines?: number[] | string;
  highlightWords?: string[];
  showLineNumbers?: boolean;
  startLine?: number;
  wrap?: boolean;
  defaultWrap?: boolean;
  onWrapChange?: (wrap: boolean) => void;
  maxLines?: number;
  diff?: CodeBlockDiffMap;
  disableHighlighting?: boolean;
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function CodeBlock({
  code,
  language = 'typescript',
  highlightedLines,
  highlightWords = [],
  showLineNumbers = true,
  startLine = 1,
  wrap: controlledWrap,
  defaultWrap = false,
  onWrapChange,
  maxLines,
  diff = {},
  disableHighlighting = false,
  sx,
  className,
  ref,
  children,
  ...props
}: CodeBlockProps) {
  const isWrapControlled = controlledWrap !== undefined;
  const [uncontrolledWrap, setUncontrolledWrap] = useState(defaultWrap);
  const wrap = isWrapControlled ? controlledWrap : uncontrolledWrap;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const toggleWrap = useCallback(() => {
    const nextWrap = !wrap;
    if (!isWrapControlled) {
      setUncontrolledWrap(nextWrap);
    }
    onWrapChange?.(nextWrap);
  }, [wrap, isWrapControlled, onWrapChange]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const copy = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [code]);

  const lines = useMemo(() => code.split('\n'), [code]);
  const lineCount = lines.length;
  const isCollapsible = typeof maxLines === 'number' && lineCount > maxLines;
  const highlightedLinesSet = useMemo(
    () => parseHighlightedLines(highlightedLines),
    [highlightedLines],
  );

  const contextValue: CodeBlockContextValue = {
    code,
    language,
    wrap,
    toggleWrap,
    isExpanded,
    toggleExpand,
    isCopied,
    copy,
    lineCount,
    highlightedLinesSet,
    highlightWords,
    showLineNumbers,
    startLine,
    diff,
    maxLines,
    isCollapsible,
    disableHighlighting,
  };

  // Check if children already contains CodeBlockContent
  let hasExplicitContent = false;
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === CodeBlockContent) {
      hasExplicitContent = true;
    }
  });

  const sxProps = stylex.props(styles.root, sx);

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <Box
        ref={ref}
        data-slot="code-block"
        data-language={language}
        data-wrapped={wrap ? 'true' : 'false'}
        data-collapsible={isCollapsible ? 'true' : 'false'}
        data-expanded={isExpanded ? 'true' : 'false'}
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {children}
        {!hasExplicitContent && <CodeBlockContent />}
        {isCollapsible && <CodeBlockExpandButton />}
      </Box>
    </CodeBlockContext.Provider>
  );
}

export interface CodeBlockHeaderProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function CodeBlockHeader({ sx, className, children, ref, ...props }: CodeBlockHeaderProps) {
  const sxProps = stylex.props(styles.header, sx);

  return (
    <Box
      ref={ref}
      data-slot="code-block-header"
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      {children}
    </Box>
  );
}

export interface CodeBlockTitleProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function CodeBlockTitle({ sx, className, children, ref, ...props }: CodeBlockTitleProps) {
  const sxProps = stylex.props(styles.title, sx);

  return (
    <Box
      ref={ref}
      data-slot="code-block-title"
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text size="sm" weight="medium">
          {children}
        </Text>
      ) : (
        children
      )}
    </Box>
  );
}

export interface CodeBlockLanguageProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function CodeBlockLanguage({
  sx,
  className,
  children,
  ref,
  ...props
}: CodeBlockLanguageProps) {
  const { language } = useCodeBlock();
  const sxProps = stylex.props(styles.languageBadge, sx);

  return (
    <Box
      ref={ref}
      data-slot="code-block-language"
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      {children || language}
    </Box>
  );
}

export interface CodeBlockCopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  copyLabel?: string;
  copiedLabel?: string;
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function CodeBlockCopyButton({
  variant = 'ghost',
  size = 'icon-sm',
  copyLabel = 'Copy code',
  copiedLabel = 'Copied!',
  children,
  ref,
  ...props
}: CodeBlockCopyButtonProps) {
  const { isCopied, copy } = useCodeBlock();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      onClick={copy}
      data-slot="code-block-copy"
      data-copied={isCopied ? 'true' : 'false'}
      aria-label={isCopied ? copiedLabel : copyLabel}
      {...props}
    >
      {children ||
        (isCopied ? <Check size={14} color="var(--color-success, #16a34a)" /> : <Copy size={14} />)}
    </Button>
  );
}

export interface CodeBlockWrapButtonProps extends Omit<ButtonProps, 'onClick'> {
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function CodeBlockWrapButton({
  variant = 'ghost',
  size = 'icon-sm',
  children,
  ref,
  ...props
}: CodeBlockWrapButtonProps) {
  const { wrap, toggleWrap } = useCodeBlock();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      onClick={toggleWrap}
      data-slot="code-block-wrap-toggle"
      data-wrapped={wrap ? 'true' : 'false'}
      aria-label="Toggle line wrapping"
      {...props}
    >
      {children || <WrapText size={14} />}
    </Button>
  );
}

export interface CodeBlockExpandButtonProps extends Omit<ButtonProps, 'onClick'> {
  expandLabel?: string;
  collapseLabel?: string;
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function CodeBlockExpandButton({
  variant = 'ghost',
  size = 'sm',
  expandLabel = 'Show more lines',
  collapseLabel = 'Show less',
  children,
  ref,
  ...props
}: CodeBlockExpandButtonProps) {
  const { isExpanded, toggleExpand } = useCodeBlock();

  return (
    <Box sx={styles.expandBar}>
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={toggleExpand}
        data-slot="code-block-expand"
        data-expanded={isExpanded ? 'true' : 'false'}
        {...props}
      >
        {children || (
          <HStack gap="xxs">
            <Text size="xs">{isExpanded ? collapseLabel : expandLabel}</Text>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </HStack>
        )}
      </Button>
    </Box>
  );
}

export interface CodeBlockContentProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function CodeBlockContent({ sx, className, ref, ...props }: CodeBlockContentProps) {
  const {
    code,
    wrap,
    isExpanded,
    maxLines,
    isCollapsible,
    showLineNumbers,
    startLine,
    highlightedLinesSet,
    highlightWords,
    diff,
    disableHighlighting,
  } = useCodeBlock();

  const rawLines = useMemo(() => code.split('\n'), [code]);
  const displayLines = isCollapsible && !isExpanded ? rawLines.slice(0, maxLines) : rawLines;

  const sxProps = stylex.props(styles.content, wrap && styles.contentWrapped, sx);

  return (
    <Box
      ref={ref}
      data-slot="code-block-content"
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      <Box as="pre" sx={styles.codeSurface}>
        {displayLines.map((lineText, idx) => {
          const lineNum = startLine + idx;
          const isHighlighted = highlightedLinesSet.has(lineNum);
          const lineDiff = diff[lineNum];
          const isAdded = lineDiff?.added;
          const isRemoved = lineDiff?.removed;

          return (
            <Box
              key={idx}
              data-slot="code-block-line"
              data-line-number={lineNum}
              data-highlighted={isHighlighted ? 'true' : undefined}
              data-diff={isAdded ? 'added' : isRemoved ? 'removed' : undefined}
              sx={[
                styles.line,
                isHighlighted && styles.lineHighlighted,
                isAdded && styles.lineAdded,
                isRemoved && styles.lineRemoved,
              ]}
            >
              {showLineNumbers && (
                <Box data-slot="code-block-gutter" sx={styles.gutter} aria-hidden="true">
                  {lineNum}
                </Box>
              )}

              {/* Diff sign if diffs are present */}
              {Object.keys(diff).length > 0 && (
                <Box
                  data-slot="code-block-diff-sign"
                  sx={[
                    styles.gutterDiffSign,
                    isAdded && styles.gutterDiffAdded,
                    isRemoved && styles.gutterDiffRemoved,
                  ]}
                  aria-hidden="true"
                >
                  {isAdded ? '+' : isRemoved ? '-' : ' '}
                </Box>
              )}

              <Box data-slot="code-block-line-content" sx={styles.lineContent}>
                {renderHighlightedTokens(lineText, highlightWords, disableHighlighting)}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
