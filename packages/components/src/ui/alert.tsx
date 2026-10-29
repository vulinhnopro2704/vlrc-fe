import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';

export type AlertVariant = 'default' | 'destructive';

const styles = stylex.create({
  root: {
    position: 'relative',
    width: '100%',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingInline: '1rem',
    paddingBlock: '0.75rem',
    fontSize: '0.875rem',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '0.75rem',
    alignItems: 'start',
  },
  variantDefault: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    color: colors.cardForeground,
  },
  variantDestructive: {
    backgroundColor: colors.card,
    borderColor: colors.destructive,
    color: colors.destructive,
  },
  title: {
    gridColumnStart: 2,
    lineHeight: 1.25,
    fontWeight: 500,
    letterSpacing: '-0.025em',
  },
  description: {
    gridColumnStart: 2,
    display: 'grid',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: colors.mutedForeground,
  },
});

const variantStyles: Record<AlertVariant, stylex.StyleXStyles> = {
  default: styles.variantDefault,
  destructive: styles.variantDestructive,
};

export interface AlertProps extends React.ComponentProps<'div'> {
  variant?: AlertVariant;
  sx?: stylex.StyleXStyles;
}

function Alert({
  className,
  variant = 'default',
  sx,
  ...props
}: AlertProps) {
  const sxProps = stylex.props(
    styles.root,
    variantStyles[variant],
    sx
  );

  return (
    <div
      data-slot="alert"
      role="alert"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function AlertTitle({ className, sx, ...props }: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <div
      data-slot="alert-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <div
      data-slot="alert-description"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function alertVariants(options?: { variant?: AlertVariant; className?: string }) {
  const v = options?.variant || 'default';
  return stylex.props(styles.root, variantStyles[v]).className || '';
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
