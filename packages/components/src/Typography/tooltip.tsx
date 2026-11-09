import React, { type ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import type { TypographyTooltip } from './types';

/**
 * Recursively extracts plain text from React children.
 */
export function getTextFromChildren(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }
  if (React.isValidElement(children) && (children.props as any)?.children) {
    return getTextFromChildren((children.props as any).children);
  }
  return '';
}

/**
 * Resolves the tooltip content based on tooltip and ellipsis props.
 */
export function resolveTooltipContent(
  tooltip?: TypographyTooltip,
  ellipsis?: boolean | { rows?: number; tooltip?: TypographyTooltip },
  children?: ReactNode,
): ReactNode | null {
  const ellipsisTooltip =
    typeof ellipsis === 'object' && ellipsis !== null ? ellipsis.tooltip : undefined;
  const activeTooltip = tooltip !== undefined ? tooltip : ellipsisTooltip;

  if (!activeTooltip) return null;

  if (activeTooltip === true) {
    if (typeof children === 'string' || typeof children === 'number') {
      return String(children);
    }
    const extracted = getTextFromChildren(children);
    return extracted || (children as ReactNode);
  }

  if (
    typeof activeTooltip === 'object' &&
    activeTooltip !== null &&
    'title' in (activeTooltip as object)
  ) {
    return (activeTooltip as { title?: ReactNode }).title ?? null;
  }

  return activeTooltip as ReactNode;
}

/**
 * Conditionally wraps an element with a Tooltip if tooltip content exists.
 */
export function renderWithTooltip(
  element: React.ReactElement,
  tooltipContent: ReactNode | null,
): React.ReactElement {
  if (!tooltipContent) {
    return element;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
