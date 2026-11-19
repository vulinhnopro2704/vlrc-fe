import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type JSX,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeFromDOMNode } from 'lexical';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import { create } from '@stylexjs/stylex';
import { colors, radius, shadow, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import { Box, Text } from '@vlrc-fe/components';

const styles = create({
  handleContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    willChange: 'transform',
    display: 'none',
    opacity: 0,
    alignItems: 'center',
    cursor: 'grab',
    userSelect: 'none',
    zIndex: 30,
    ':active': {
      cursor: 'grabbing',
    },
  },
  handleButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.25rem',
    height: '1.5rem',
    borderRadius: radius.sm,
    color: colors.fgMuted,
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'grab',
    padding: spacing['0.5'],
    ':hover': {
      backgroundColor: colors.surfaceSubtle,
      color: colors.fgDefault,
    },
    ':active': {
      cursor: 'grabbing',
    },
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    willChange: 'transform',
    height: '3px',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    opacity: 0,
    pointerEvents: 'none',
    zIndex: 25,
    boxShadow: shadow.sm,
  },
  menu: {
    position: 'absolute',
    top: '1.625rem',
    left: 0,
    zIndex: 60,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceDefault,
    boxShadow: shadow.md,
    padding: spacing['0.5'],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['0.5'],
    minWidth: '120px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    paddingInline: spacing.xs,
    paddingBlock: spacing['1'],
    borderRadius: radius.sm,
    fontSize: '0.75rem',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: colors.fgDefault,
    width: '100%',
    textAlign: 'left',
    ':hover': {
      backgroundColor: colors.surfaceSubtle,
    },
  },
});

export interface DraggableBlockPluginProps {
  anchorElem?: HTMLElement | null;
}

export function DraggableBlockPlugin({
  anchorElem,
}: DraggableBlockPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const targetLineRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

  const isOnMenu = useCallback((element: HTMLElement) => {
    return !!(menuRef.current && menuRef.current.contains(element));
  }, []);

  const onElementChanged = useCallback((element: HTMLElement | null) => {
    setActiveElement(element);
    if (!element) {
      setIsMenuOpen(false);
    }
  }, []);

  const handleDelete = useCallback(() => {
    if (activeElement) {
      editor.update(() => {
        const node = $getNearestNodeFromDOMNode(activeElement);
        if (node) {
          node.remove();
        }
      });
      setIsMenuOpen(false);
    }
  }, [editor, activeElement]);

  const handleDuplicate = useCallback(() => {
    if (activeElement) {
      editor.update(() => {
        const node = $getNearestNodeFromDOMNode(activeElement);
        if (node) {
          const top = node.getTopLevelElementOrThrow();
          top.insertAfter(node);
        }
      });
      setIsMenuOpen(false);
    }
  }, [editor, activeElement]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && !isOnMenu(target)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [isMenuOpen, isOnMenu]);

  if (!anchorElem) {
    return null;
  }

  const menuComponent = (
    <Box
      ref={menuRef}
      className="vlrc-draggable-handle-container"
      sx={styles.handleContainer}
      data-slot="draggable-handle"
    >
      <Box
        as="button"
        type="button"
        className="vlrc-draggable-handle-btn"
        sx={styles.handleButton}
        title="Drag to reorder, click for block options"
        aria-label="Drag block handle"
        onClick={(e: ReactMouseEvent) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
        }}
      >
        <GripVertical size={14} />
      </Box>

      {isMenuOpen && (
        <Box className="vlrc-draggable-menu" sx={styles.menu}>
          <Box
            as="button"
            type="button"
            className="vlrc-draggable-menu-item"
            sx={styles.menuItem}
            onClick={handleDuplicate}
          >
            <Copy size={12} />
            <Text size="xs">Duplicate</Text>
          </Box>
          <Box
            as="button"
            type="button"
            className="vlrc-draggable-menu-item"
            data-danger="true"
            sx={styles.menuItem}
            onClick={handleDelete}
          >
            <Trash2 size={12} color="var(--destructive, #ef4444)" />
            <Text size="xs" type="danger">
              Delete
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );

  const targetLineComponent = (
    <Box
      ref={targetLineRef}
      className="vlrc-draggable-target-line"
      sx={styles.targetLine}
      data-slot="draggable-target-line"
    />
  );

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={menuComponent}
      targetLineComponent={targetLineComponent}
      isOnMenu={isOnMenu}
      onElementChanged={onElementChanged}
    />
  );
}

export default DraggableBlockPlugin;
