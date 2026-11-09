import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { Inbox } from 'lucide-react';
import { colors, spacing } from '../theme/tokens.stylex';
import { Flex } from './flex';
import { Text } from '../Typography/Text';

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

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  image?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  sx?: stylex.StyleXStyles;
}

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ image, title, description, action, children, sx, className, ...props }, ref) => {
    const isCompound = React.Children.count(children) > 0;

    return (
      <Flex
        ref={ref}
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
  },
);
Empty.displayName = 'Empty';

export interface EmptyImageProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export const EmptyImage = React.forwardRef<HTMLDivElement, EmptyImageProps>(
  ({ sx, className, children, ...props }, ref) => {
    const sxProps = stylex.props(styles.imageWrapper, sx);
    return (
      <div
        ref={ref}
        data-slot="empty-image"
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      >
        {children}
      </div>
    );
  },
);
EmptyImage.displayName = 'EmptyImage';

export interface EmptyTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  sx?: stylex.StyleXStyles;
}

export const EmptyTitle = React.forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        as="h4"
        weight="semibold"
        size="md"
        data-slot="empty-title"
        sx={sx}
        className={className}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
EmptyTitle.displayName = 'EmptyTitle';

export interface EmptyDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  sx?: stylex.StyleXStyles;
}

export const EmptyDescription = React.forwardRef<HTMLParagraphElement, EmptyDescriptionProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        as="p"
        type="secondary"
        size="sm"
        data-slot="empty-description"
        sx={[styles.description, sx]}
        className={className}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
EmptyDescription.displayName = 'EmptyDescription';

export interface EmptyActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
}

export const EmptyActions = React.forwardRef<HTMLDivElement, EmptyActionsProps>(
  ({ sx, className, children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
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
  },
);
EmptyActions.displayName = 'EmptyActions';
