import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';
import Icons from '../Icons';
import { resolveTooltipContent, renderWithTooltip } from './tooltip';
import type { TitleLevel, TitleProps, TitleTracking, TitleVariant } from './types';
import { resolveCustomTypographyStyle } from './utils';
import { typographyWeightStyles } from './weightStyles';

const styles = stylex.create({
  base: {
    margin: 0,
    fontWeight: 700,
    color: colors.foreground,
    lineHeight: 1.25,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  // 7-tier Title Sizing (10, 12, 14, 16, 20, 24, 32px)
  sizeXxs: {
    fontSize: '0.625rem', // 10px
    lineHeight: 1.3,
  },
  sizeXs: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.3,
  },
  sizeSm: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.35,
  },
  sizeMd: {
    fontSize: '1rem', // 16px
    lineHeight: 1.35,
  },
  sizeLg: {
    fontSize: '1.25rem', // 20px
    lineHeight: 1.3,
  },
  sizeXl: {
    fontSize: '1.5rem', // 24px
    lineHeight: 1.25,
  },
  sizeXxl: {
    fontSize: '2rem', // 32px
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },

  // Variants
  defaultVariant: {
    color: colors.foreground,
  },
  gradientVariant: {
    backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  monoVariant: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontWeight: 600,
  },

  // Tracking
  tight: {
    letterSpacing: '-0.035em',
  },
  normal: {
    letterSpacing: 'normal',
  },
  wide: {
    letterSpacing: '0.05em',
  },

  ellipsisSingle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    maxWidth: '100%',
    minWidth: 0,
  },

  actionBtn: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    cursor: 'pointer',
    padding: '0.25rem',
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
  actionIcon: {
    width: '1rem',
    height: '1rem',
  },
  editInput: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontFamily: 'inherit',
    color: colors.foreground,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.ring,
    borderRadius: radii.sm,
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    outline: 'none',
  },
  requiredAsterisk: {
    color: colors.destructive,
    marginLeft: '0.25rem',
    display: 'inline-block',
    lineHeight: 1,
    fontWeight: 600,
    userSelect: 'none',
  },
});

const defaultLevelSizes: Record<TitleLevel, ComponentSize> = {
  1: 'xxl', // 32px
  2: 'xl', // 24px
  3: 'lg', // 20px
  4: 'md', // 16px
  5: 'sm', // 14px
  6: 'xs', // 12px
};

const titleSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.sizeXxs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  xxl: styles.sizeXxl,
};

const variantStyles: Record<TitleVariant, stylex.StyleXStyles> = {
  default: styles.defaultVariant,
  gradient: styles.gradientVariant,
  mono: styles.monoVariant,
};

const trackingStyles: Record<TitleTracking, stylex.StyleXStyles> = {
  tight: styles.tight,
  normal: styles.normal,
  wide: styles.wide,
};

export const Title = React.forwardRef<HTMLElement, TitleProps>(function Title(
  {
    level = 1,
    size,
    variant = 'default',
    tracking = 'normal',
    weight,
    customSize,
    lines,
    rows,
    lineHeight,
    ellipsis,
    tooltip,
    textDecoration,
    textDecorationLine,
    textDecorationStyle,
    textDecorationColor,
    textDecorationThickness,
    textUnderlineOffset,
    color,
    margin,
    m,
    marginTop,
    mt,
    marginBottom,
    mb,
    marginLeft,
    ml,
    marginRight,
    mr,
    marginInline,
    mx,
    marginBlock,
    my,
    letterSpacing,
    editable,
    copyable,
    onEdit,
    required,
    as,
    className,
    children,
    sx,
    ...props
  }: TitleProps,
  ref,
) {
  const Component = (as || `h${level}`) as React.ElementType;
  const [copied, setCopied] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [textValue, setTextValue] = React.useState(typeof children === 'string' ? children : '');

  const resolvedSize = size ?? defaultLevelSizes[level] ?? 'xxl';
  const currentSizeStyle = titleSizeStyles[resolvedSize] ?? styles.sizeXxl;

  const resolvedRows = lines ?? rows ?? (typeof ellipsis === 'object' ? ellipsis?.rows : undefined);
  const isSingleEllipsis =
    (ellipsis === true || (typeof ellipsis === 'object' && ellipsis !== null && !ellipsis.rows)) &&
    !resolvedRows;

  const customStyle = resolveCustomTypographyStyle({
    customSize,
    color,
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
    margin,
    m,
    marginTop,
    mt,
    marginBottom,
    mb,
    marginLeft,
    ml,
    marginRight,
    mr,
    marginInline,
    mx,
    marginBlock,
    my,
    letterSpacing,
  });

  const handleCopy = async () => {
    const textToCopy = typeof children === 'string' ? children : textValue;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  const handleEditSubmit = () => {
    setIsEditing(false);
    onEdit?.(textValue);
  };

  const sxProps = stylex.props(
    styles.base,
    currentSizeStyle,
    variantStyles[variant],
    trackingStyles[tracking],
    weight && typographyWeightStyles[weight],
    isSingleEllipsis && styles.ellipsisSingle,
    sx,
  );

  const tooltipContent = resolveTooltipContent(tooltip, ellipsis, children);

  const element = (
    <Component
      ref={ref}
      data-slot="typography-title"
      data-level={level}
      data-size={resolvedSize}
      data-variant={variant}
      data-weight={weight}
      {...sxProps}
      style={{ ...sxProps.style, ...customStyle }}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {isEditing ? (
        <input
          autoFocus
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEditSubmit();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          {...stylex.props(styles.editInput)}
        />
      ) : (
        <span>
          {children}
          {required && (
            <span aria-hidden="true" {...stylex.props(styles.requiredAsterisk)}>
              *
            </span>
          )}
        </span>
      )}

      {editable && !isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          {...stylex.props(styles.actionBtn)}
          aria-label="Edit title"
        >
          <Icons.Pencil {...stylex.props(styles.actionIcon)} />
        </button>
      )}

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          {...stylex.props(styles.actionBtn)}
          aria-label={copied ? 'Copied' : 'Copy title'}
        >
          {copied ? (
            <Icons.Check {...stylex.props(styles.actionIcon)} />
          ) : (
            <Icons.Copy {...stylex.props(styles.actionIcon)} />
          )}
        </button>
      )}
    </Component>
  );

  return renderWithTooltip(element, tooltipContent);
});

Title.displayName = 'Typography.Title';
