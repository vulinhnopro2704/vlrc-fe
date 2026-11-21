import { Children, type HTMLAttributes, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Inbox } from 'lucide-react';
import { colors, spacing } from '../theme/tokens.stylex';
import { Flex } from './flex';
import { Title, Paragraph } from '../Typography';

const styles = stylex.create({
  root: {
    padding: spacing.xl,
    boxSizing: 'border-box',
    width: '100%',
    textAlign: 'center',
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.mutedForeground,
    opacity: 0.6,
    marginBottom: spacing.xs,
  },
  defaultIcon: {
    width: '3.5rem',
    height: '3.5rem',
    strokeWidth: 1.25,
  },
  description: {
    maxWidth: '24rem',
  },
  actions: {
    marginTop: spacing.xs,
  },
});

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  image?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  sx?: stylex.StyleXStyles;
}

export function Empty({
  image,
  title,
  description,
  action,
  children,
  sx,
  className,
  ...props
}: EmptyProps) {
  const isCompound = Children.count(children) > 0;

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap="sm"
      data-slot="empty"
      sx={[styles.root, sx]}
      className={className}
      {...props}
    >
      {isCompound ? (
        children
      ) : (
        <>
          <EmptyImage>{image ?? <Inbox {...stylex.props(styles.defaultIcon)} />}</EmptyImage>
          {title && <EmptyTitle>{title}</EmptyTitle>}
          {description && <EmptyDescription>{description}</EmptyDescription>}
          {action && <EmptyActions>{action}</EmptyActions>}
        </>
      )}
    </Flex>
  );
}

export interface EmptyImageProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export function EmptyImage({ sx, className, children, ...props }: EmptyImageProps) {
  const sxProps = stylex.props(styles.imageWrapper, sx);
  return (
    <div
      data-slot="empty-image"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {children}
    </div>
  );
}

export interface EmptyTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  sx?: stylex.StyleXStyles;
}

export function EmptyTitle({ sx, className, children, ...props }: EmptyTitleProps) {
  return (
    <Title
      level={4}
      weight="semibold"
      size="md"
      data-slot="empty-title"
      sx={sx}
      className={className}
      {...props}
    >
      {children}
    </Title>
  );
}

export interface EmptyDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  sx?: stylex.StyleXStyles;
}

export function EmptyDescription({ sx, className, children, ...props }: EmptyDescriptionProps) {
  return (
    <Paragraph
      type="secondary"
      size="sm"
      data-slot="empty-description"
      sx={[styles.description, sx]}
      className={className}
      {...props}
    >
      {children}
    </Paragraph>
  );
}

export interface EmptyActionsProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export function EmptyActions({ sx, className, children, ...props }: EmptyActionsProps) {
  return (
    <Flex
      align="center"
      justify="center"
      gap="sm"
      data-slot="empty-actions"
      sx={[styles.actions, sx]}
      className={className}
      {...props}
    >
      {children}
    </Flex>
  );
}
