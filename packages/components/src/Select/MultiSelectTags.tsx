import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Icons from '../Icons';
import type { BaseSelectOption, SelectValue } from './type';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
    alignItems: 'center',
    flex: '1 1 0%',
    minWidth: 0,
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    paddingInline: '0.375rem',
    paddingBlock: '0.125rem',
    fontSize: '0.75rem',
  },
  removeIcon: {
    width: '0.75rem',
    height: '0.75rem',
    cursor: 'pointer',
    opacity: 0.7,
    ':hover': {
      opacity: 1,
    },
  },
  moreBadge: {
    fontSize: '0.75rem',
    cursor: 'default',
  },
  tooltipList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    maxWidth: '12rem',
  },
});

/**
 * Component to render tags for multi-select with responsive behavior
 */
export function MultiSelectTags<T extends SelectValue = SelectValue>({
  selectedOptions,
  maxTagCount = 'responsive',
  onRemove,
  disabled,
  tagRender
}: {
  selectedOptions: BaseSelectOption<T>[];
  maxTagCount?: number | 'responsive';
  onRemove: (value: T) => void;
  disabled?: boolean;
  tagRender?: (option: BaseSelectOption<T>, onRemove: () => void) => ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(selectedOptions.length);
  const [hiddenOptions, setHiddenOptions] = useState<BaseSelectOption<T>[]>([]);

  useEffect(() => {
    if (maxTagCount === 'responsive' && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth - 60; // Reserve space for +N badge
      let totalWidth = 0;
      let count = 0;

      const children = Array.from(container.children);
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.classList?.contains('select-tag')) {
          const childWidth = child.offsetWidth + 4; // Include gap
          if (totalWidth + childWidth <= containerWidth) {
            totalWidth += childWidth;
            count++;
          } else {
            break;
          }
        }
      }

      if (count < selectedOptions.length) {
        setVisibleCount(Math.max(1, count - 1)); // Show at least 1 tag
        setHiddenOptions(selectedOptions.slice(Math.max(1, count - 1)));
      } else {
        setVisibleCount(selectedOptions.length);
        setHiddenOptions([]);
      }
    } else if (typeof maxTagCount === 'number') {
      setVisibleCount(Math.min(maxTagCount, selectedOptions.length));
      setHiddenOptions(selectedOptions.slice(maxTagCount));
    } else {
      setVisibleCount(selectedOptions.length);
      setHiddenOptions([]);
    }
  }, [selectedOptions, maxTagCount]);

  const visibleOptions = selectedOptions.slice(0, visibleCount);
  const remainingCount = selectedOptions.length - visibleCount;

  return (
    <div ref={containerRef} {...stylex.props(styles.container)}>
      {visibleOptions.map(opt => {
        const handleRemove = () => onRemove(opt.value);

        if (tagRender) {
          return <span key={String(opt.value)} className='select-tag'>{tagRender(opt, handleRemove)}</span>;
        }

        return (
          <Badge
            key={String(opt.value)}
            variant='secondary'
            className='select-tag'
            sx={styles.tag}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.label}</span>
            {!disabled && (
              <span onClick={e => { e.stopPropagation(); handleRemove(); }}>
                <Icons.XIcon {...stylex.props(styles.removeIcon)} />
              </span>
            )}
          </Badge>
        );
      })}

      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant='outline' sx={styles.moreBadge}>
                +{remainingCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div {...stylex.props(styles.tooltipList)}>
                {hiddenOptions.map(opt => (
                  <span key={String(opt.value)}>{opt.label}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
