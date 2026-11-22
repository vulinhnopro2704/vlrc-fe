import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Token } from '@astryxdesign/core';
import { radius } from '../theme/tokens.stylex';
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
  closableIcon: {
    cursor: 'pointer',
    opacity: 0.7,
    display: 'inline-flex',
    alignItems: 'center',
    ':hover': {
      opacity: 1,
    },
  },
  categoryDefault: {
    backgroundColor: 'var(--color-surface-subtle, #f1f5f9)',
    borderColor: 'var(--color-border, #e2e8f0)',
    color: 'var(--color-fg-muted, #64748b)',
  },
  categoryGeekblue: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    color: '#2563eb',
  },
  categorySuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    color: '#16a34a',
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

  if (categoryColor) {
    const categoryStyle =
      categoryColor === 'success'
        ? styles.categorySuccess
        : categoryColor === 'geekblue'
          ? styles.categoryGeekblue
          : styles.categoryDefault;

    const sxProps = stylex.props(styles.customTag, categoryStyle, sx);

    return (
      <span
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        onClick={onClick}
      >
        {icon && <span>{icon}</span>}
        <span>{content}</span>
        {closable && (
          <span
            {...stylex.props(styles.closableIcon)}
            onClick={(event) => {
              event.stopPropagation();
              onClose?.(event);
            }}
          >
            <XIcon size={12} />
          </span>
        )}
      </span>
    );
  }

  if (typeof content === 'string') {
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

  const sxProps = stylex.props(styles.customTag, styles.categoryDefault, sx);

  return (
    <span
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{content}</span>
      {closable && (
        <span
          {...stylex.props(styles.closableIcon)}
          onClick={(event) => {
            event.stopPropagation();
            onClose?.(event);
          }}
        >
          <XIcon size={12} />
        </span>
      )}
    </span>
  );
}

export default Tag;
