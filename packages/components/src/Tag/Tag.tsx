import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Token } from '@astryxdesign/core';
import { radius, shadow } from '../theme/tokens.stylex';
import { unstyledButtonStyles } from '../utils';
import { Button } from '../ui/button';
import { Text } from '../Typography';
import Icons from '../Icons';

const styles = stylex.create({
  customTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingInline: '0.5rem',
    paddingBlock: '0.125rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.25,
    width: 'fit-content',
    whiteSpace: 'nowrap',
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '150ms',
  },
  clickable: {
    cursor: 'pointer',
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
      outline: 'none',
    },
  },
  contentButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },
  closeButton: {
    paddingInline: 0,
    paddingBlock: 0,
    height: '1rem',
    width: '1rem',
    minWidth: '1rem',
    borderRadius: radius.full,
    opacity: 0.7,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'inherit',
    ':hover': {
      opacity: 1,
      backgroundColor: 'transparent',
    },
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
      outline: 'none',
    },
  },
  categoryDefault: {
    backgroundColor: 'var(--color-surface-subtle, #f1f5f9)',
    borderColor: 'var(--color-border, #e2e8f0)',
    color: 'var(--color-fg-muted, #64748b)',
  },
  categoryGeekblue: {
    backgroundColor: 'var(--tag-geekblue-bg, #eff6ff)',
    borderColor: 'var(--tag-geekblue-border, #bfdbfe)',
    color: 'var(--tag-geekblue-fg, #3b82f6)',
  },
  categorySuccess: {
    backgroundColor: 'var(--tag-success-bg, #f0fdf4)',
    borderColor: 'var(--tag-success-border, #bbf7d0)',
    color: 'var(--tag-success-fg, #16a34a)',
  },
});

export type TagCategoryColor = 'default' | 'geekblue' | 'success';

export interface TagProps {
  label?: ReactNode;
  children?: ReactNode;
  closable?: boolean;
  onClose?: (event: ReactMouseEvent) => void;
  categoryColor?: TagCategoryColor;
  color?:
    | 'default'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'cyan'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  onClick?: (event: ReactMouseEvent) => void;
  sx?: stylex.StyleXStyles;
  className?: string;
}

export function Tag({
  label,
  children,
  closable = false,
  onClose,
  categoryColor,
  color = 'default',
  size = 'sm',
  icon,
  onClick,
  sx,
  className,
}: TagProps) {
  const content = label ?? children;
  const XIcon = Icons.X;

  // Delegate standard string tokens without categoryColor to Astryx Token
  if (!categoryColor && typeof content === 'string') {
    return (
      <Token
        label={content}
        color={color}
        size={size}
        icon={icon}
        onRemove={
          closable
            ? (event) => {
                event.stopPropagation();
                onClose?.(event);
              }
            : undefined
        }
        onClick={onClick}
      />
    );
  }

  const categoryStyle =
    categoryColor === 'success'
      ? styles.categorySuccess
      : categoryColor === 'geekblue'
        ? styles.categoryGeekblue
        : styles.categoryDefault;

  const closeButton = closable ? (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label="Remove tag"
      sx={[unstyledButtonStyles.reset, styles.closeButton]}
      onClick={(event) => {
        event.stopPropagation();
        onClose?.(event);
      }}
    >
      <XIcon size={12} />
    </Button>
  ) : null;

  // Single interactive button when clickable and not closable
  if (onClick && !closable) {
    return (
      <Button
        type="button"
        variant="ghost"
        sx={[unstyledButtonStyles.reset, styles.customTag, categoryStyle, styles.clickable, sx]}
        className={className}
        onClick={onClick}
      >
        {icon && <Text>{icon}</Text>}
        <Text>{content}</Text>
      </Button>
    );
  }

  // Clickable content with separate sibling close button to avoid nested buttons
  if (onClick && closable) {
    const sxProps = stylex.props(styles.customTag, categoryStyle, sx);
    return (
      <span
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      >
        <Button
          type="button"
          variant="ghost"
          sx={[unstyledButtonStyles.reset, styles.contentButton, styles.clickable]}
          onClick={onClick}
        >
          {icon && <Text>{icon}</Text>}
          <Text>{content}</Text>
        </Button>
        {closeButton}
      </span>
    );
  }

  // Non-clickable container with optional close button
  const sxProps = stylex.props(styles.customTag, categoryStyle, sx);
  return (
    <span
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      {icon && <Text>{icon}</Text>}
      <Text>{content}</Text>
      {closeButton}
    </span>
  );
}

export default Tag;
