import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import Icons from '../Icons';
import type { CodeProps } from './types';
import { resolveCustomTypographyStyle } from './utils';
import { typographyWeightStyles } from './weightStyles';

const styles = stylex.create({
  inline: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '0.875rem',
    borderRadius: radii.sm,
    backgroundColor: colors.muted,
    color: colors.foreground,
    paddingInline: '0.375rem',
    paddingBlock: '0.125rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
  },
  blockContainer: {
    position: 'relative',
    margin: 0,
    width: '100%',
  },
  pre: {
    margin: 0,
    padding: '1rem',
    overflowX: 'auto',
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    color: colors.foreground,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  codeInsidePre: {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
    color: 'inherit',
  },
  copyBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    appearance: 'none',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.mutedForeground,
    cursor: 'pointer',
    padding: '0.375rem',
    borderRadius: radii.sm,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    transitionProperty: 'color, background-color',
    transitionDuration: '150ms',
    ':hover': {
      color: colors.foreground,
      backgroundColor: colors.accent,
    },
  },
  copyIcon: {
    width: '0.875rem',
    height: '0.875rem',
  },
  badge: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: colors.mutedForeground,
    opacity: 0.6,
    userSelect: 'none',
    pointerEvents: 'none',
  },
});

export function Code({
  block = false,
  language,
  copyable = false,
  weight,
  customSize,
  lines,
  rows,
  lineHeight,
  ellipsis,
  textDecoration,
  textDecorationLine,
  textDecorationStyle,
  textDecorationColor,
  textDecorationThickness,
  textUnderlineOffset,
  as,
  className,
  children,
  sx,
  ...props
}: CodeProps) {
  const [copied, setCopied] = useState(false);

  const customStyle = resolveCustomTypographyStyle({
    customSize,
    lines,
    rows,
    lineHeight,
    ellipsis,
    textDecoration,
    textDecorationLine,
    textDecorationStyle,
    textDecorationColor,
    textDecorationThickness,
    textUnderlineOffset,
  });

  const handleCopy = async () => {
    if (typeof children === 'string') {
      try {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore clipboard errors
      }
    }
  };

  if (block) {
    const Component = (as || 'pre') as React.ElementType;
    const sxProps = stylex.props(styles.pre, weight && typographyWeightStyles[weight], sx);

    return (
      <div {...stylex.props(styles.blockContainer)} data-slot="typography-code-block">
        <Component
          data-weight={weight}
          {...sxProps}
          style={{ ...sxProps.style, ...customStyle }}
          className={
            className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className
          }
          {...props}
        >
          <code {...stylex.props(styles.codeInsidePre)} data-language={language}>
            {children}
          </code>
        </Component>

        {language && <span {...stylex.props(styles.badge)}>{language}</span>}

        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            {...stylex.props(styles.copyBtn)}
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? (
              <Icons.Check {...stylex.props(styles.copyIcon)} />
            ) : (
              <Icons.Copy {...stylex.props(styles.copyIcon)} />
            )}
          </button>
        )}
      </div>
    );
  }

  const Component = (as || 'code') as React.ElementType;
  const sxProps = stylex.props(styles.inline, weight && typographyWeightStyles[weight], sx);

  return (
    <Component
      data-slot="typography-code"
      data-language={language}
      data-weight={weight}
      {...sxProps}
      style={{ ...sxProps.style, ...customStyle }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </Component>
  );
}
