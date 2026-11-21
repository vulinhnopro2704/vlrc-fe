import { type ComponentProps, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, spacing, radius, shadow } from '../theme/tokens.stylex';
import { Badge } from './badge';
import { Button } from './button';
import { Flex } from '../layout';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  overflowTriggerButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingInline: 0,
    paddingBlock: 0,
    height: 'auto',
    minHeight: 0,
    width: 'auto',
    minWidth: 0,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    borderRadius: radius.full,
    boxShadow: 'none',
    ':hover': {
      backgroundColor: 'transparent',
    },
    ':active': {
      backgroundColor: 'transparent',
    },
    ':focus': {
      backgroundColor: 'transparent',
    },
    ':focus-visible': {
      boxShadow: shadow.ringFocus,
    },
  },
  overflowBadge: {
    cursor: 'pointer',
    userSelect: 'none',
    transitionProperty: 'opacity, background-color, border-color',
    transitionDuration: '150ms',
    ':hover': {
      opacity: 0.8,
      backgroundColor: colors.accent,
    },
  },
  popoverContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    maxWidth: '16rem',
  },
});

export interface BadgeOverflowProps<T = string> extends ComponentProps<'div'> {
  items: T[];
  max?: number;
  renderBadge?: (item: T, index: number) => ReactNode;
  renderOverflow?: (hiddenCount: number, hiddenItems: T[]) => ReactNode;
  showPopover?: boolean;
  sx?: stylex.StyleXStyles;
}

function BadgeOverflow<T = string>({
  className,
  items,
  max = 3,
  renderBadge,
  renderOverflow,
  showPopover = true,
  sx,
  ...props
}: BadgeOverflowProps<T>) {
  const visibleItems = items.slice(0, max);
  const hiddenItems = items.slice(max);
  const hiddenCount = hiddenItems.length;

  const defaultRenderBadge = (item: T, index: number) => {
    const text = typeof item === 'string' ? item : String(index);
    return (
      <Badge key={index} variant="secondary">
        {text}
      </Badge>
    );
  };

  const badgeRenderer = renderBadge ?? defaultRenderBadge;

  const sxProps = stylex.props(styles.root, sx);

  return (
    <Flex
      data-slot="badge-overflow"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {visibleItems.map((item, index) => badgeRenderer(item, index))}

      {hiddenCount > 0 &&
        (renderOverflow ? (
          renderOverflow(hiddenCount, hiddenItems)
        ) : showPopover ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                data-slot="badge-overflow-trigger"
                aria-label={`+${hiddenCount} more items`}
                sx={styles.overflowTriggerButton}
              >
                <Badge variant="outline" sx={styles.overflowBadge}>
                  +{hiddenCount}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={4}>
              <Flex
                data-slot="badge-overflow-popover-content"
                wrap="wrap"
                gap="xs"
                sx={styles.popoverContainer}
              >
                {hiddenItems.map((item, index) => badgeRenderer(item, max + index))}
              </Flex>
            </PopoverContent>
          </Popover>
        ) : (
          <Badge variant="outline" data-slot="badge-overflow-count">
            +{hiddenCount}
          </Badge>
        ))}
    </Flex>
  );
}

export { BadgeOverflow };
