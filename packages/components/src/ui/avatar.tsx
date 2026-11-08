'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: radii.full,
  },
  // 7-tier Avatar Sizes
  sizeXxs: {
    width: '1.25rem',
    height: '1.25rem',
    fontSize: '0.625rem',
  },
  sizeXs: {
    width: '1.5rem',
    height: '1.5rem',
    fontSize: '0.6875rem',
  },
  sizeSm: {
    width: '1.75rem',
    height: '1.75rem',
    fontSize: '0.75rem',
  },
  sizeMd: {
    width: '2rem',
    height: '2rem',
    fontSize: '0.875rem',
  },
  sizeLg: {
    width: '2.5rem',
    height: '2.5rem',
    fontSize: '1rem',
  },
  sizeXl: {
    width: '3rem',
    height: '3rem',
    fontSize: '1.25rem',
  },
  sizeXxl: {
    width: '4rem',
    height: '4rem',
    fontSize: '1.5rem',
  },
  image: {
    aspectRatio: '1 / 1',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  fallback: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    fontWeight: 500,
  },
});

const sizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  /** 7-tier sizing scale ('xxs' to 'xxl', default 'md') */
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function Avatar({ className, size = 'md', sx, ...props }: AvatarProps) {
  const sxProps = stylex.props(styles.root, sizeStyles[size] ?? styles.sizeMd, sx);
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {
  sx?: stylex.StyleXStyles;
}

function AvatarImage({ className, sx, ...props }: AvatarImageProps) {
  const sxProps = stylex.props(styles.image, sx);
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  sx?: stylex.StyleXStyles;
}

function AvatarFallback({ className, sx, ...props }: AvatarFallbackProps) {
  const sxProps = stylex.props(styles.fallback, sx);
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
