import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from '../theme/tokens.stylex';

export type CardVariant =
  | 'default'
  | 'glass'
  | 'glass-strong'
  | 'elevated'
  | 'elevated-glass'
  | 'auth';

const styles = stylex.create({
  base: {
    backgroundColor: colors.card,
    color: colors.cardForeground,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    boxShadow: shadow.xs,
    gap: '1.5rem',
    paddingBlock: '1.5rem',
  },

  variantDefault: {},
  variantGlass: {
    backgroundColor: 'color-mix(in srgb, var(--card) 80%, transparent)',
    backdropFilter: 'blur(8px)',
  },
  variantGlassStrong: {
    backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
    backdropFilter: 'blur(12px)',
  },
  variantElevated: {
    borderWidth: 0,
    boxShadow: shadow.lg,
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '200ms',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: shadow.xl,
    },
  },
  variantElevatedGlass: {
    borderWidth: 0,
    backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
    backdropFilter: 'blur(12px)',
    boxShadow: shadow.lg,
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '200ms',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: shadow.xl,
    },
  },
  variantAuth: {
    width: '100%',
    maxWidth: '28rem',
    marginInline: 'auto',
    backgroundColor: 'color-mix(in srgb, var(--card) 80%, transparent)',
    backdropFilter: 'blur(24px) saturate(150%)',
    borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)',
    borderRadius: radius['2xl'],
    boxShadow: shadow['2xl'],
  },

  header: {
    display: 'grid',
    alignItems: 'start',
    gap: '0.5rem',
    paddingInline: '1.5rem',
  },
  title: {
    lineHeight: 1,
    fontWeight: 600,
    fontSize: '1.25rem',
    letterSpacing: '-0.025em',
  },
  description: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
  },
  action: {
    gridColumnStart: 2,
    gridRow: '1 / span 2',
    alignSelf: 'start',
    justifySelf: 'end',
  },
  content: {
    paddingInline: '1.5rem',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: '1.5rem',
  },
});

const variantStyles: Record<CardVariant, stylex.StyleXStyles> = {
  default: styles.variantDefault,
  glass: styles.variantGlass,
  'glass-strong': styles.variantGlassStrong,
  elevated: styles.variantElevated,
  'elevated-glass': styles.variantElevatedGlass,
  auth: styles.variantAuth,
};

export interface CardProps extends React.ComponentProps<'div'> {
  variant?: CardVariant;
  sx?: stylex.StyleXStyles;
}

function Card({ className, variant = 'default', sx, ...props }: CardProps) {
  const sxProps = stylex.props(styles.base, variantStyles[variant], sx);

  return (
    <div
      data-slot="card"
      data-variant={variant}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function CardHeader({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.header, sx);
  return (
    <div
      data-slot="card-header"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function CardTitle({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.title, sx);
  return (
    <div
      data-slot="card-title"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function CardDescription({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.description, sx);
  return (
    <div
      data-slot="card-description"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function CardAction({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.action, sx);
  return (
    <div
      data-slot="card-action"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function CardContent({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.content, sx);
  return (
    <div
      data-slot="card-content"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function CardFooter({
  className,
  sx,
  ...props
}: React.ComponentProps<'div'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.footer, sx);
  return (
    <div
      data-slot="card-footer"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function cardVariants(options?: { variant?: CardVariant; className?: string }) {
  const v = options?.variant || 'default';
  return stylex.props(styles.base, variantStyles[v]).className || '';
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
