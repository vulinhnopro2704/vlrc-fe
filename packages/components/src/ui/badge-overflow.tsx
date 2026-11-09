import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { spacing } from '../theme/tokens.stylex';
import { Badge } from './badge';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  overflowBadge: {
    cursor: 'pointer',
    userSelect: 'none',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    ':hover': {
      opacity: 0.8,
    },
  },
  popoverContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    maxWidth: '16rem',
  },
});

export interface BadgeOverflowProps<T = string> extends React.ComponentProps<'div'> {
  items: T[];
  max?: number;
  renderBadge?: (item: T, index: number) => React.ReactNode;
  renderOverflow?: (hiddenCount: number, hiddenItems: T[]) => React.ReactNode;
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
    <div
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
              <Badge variant="outline" data-slot="badge-overflow-trigger" sx={styles.overflowBadge}>
                +{hiddenCount}
              </Badge>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={4}>
              <div
                data-slot="badge-overflow-popover-content"
                {...stylex.props(styles.popoverContainer)}
              >
                {hiddenItems.map((item, index) => badgeRenderer(item, max + index))}
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Badge variant="outline" data-slot="badge-overflow-count">
            +{hiddenCount}
          </Badge>
        ))}
    </div>
  );
}

export { BadgeOverflow };
