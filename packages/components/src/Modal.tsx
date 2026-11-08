import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from './theme/tokens.stylex';
import type { ComponentSize } from './theme/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui';

const styles = stylex.create({
  content: {
    display: 'flex',
    maxHeight: 'calc(100vh - 120px)',
    flexDirection: 'column',
    gap: 0,
    padding: 0,
    width: '100%',
  },
  sizeXxs: { maxWidth: 320 },
  sizeXs: { maxWidth: 380 },
  sizeSm: { maxWidth: 440 },
  sizeMd: { maxWidth: 500 },
  sizeLg: { maxWidth: 640 },
  sizeXl: { maxWidth: 768 },
  sizeXxl: { maxWidth: 960 },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    paddingInline: '1.25rem',
    paddingBlock: '0.875rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  body: {
    flex: '1 1 auto',
    overflowY: 'auto',
    paddingInline: '1.25rem',
    paddingBlock: '1rem',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: '1.25rem',
    paddingBlock: '0.75rem',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
  },
  actions: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    gap: '0.5rem',
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

export interface ModalProps {
  /** Whether the modal dialog is currently visible and open. */
  open?: boolean;
  /** Alias for `open` for consistent prop usage across modal components. */
  isOpen?: boolean;
  /** Callback fired when the cancel button, close icon, or backdrop is clicked. */
  onCancel?: () => void;
  /** Alias for `onCancel` (consistent with ConfirmModal `onClose`). */
  onClose?: () => void;
  /** Primary title rendered in the modal header. */
  title: ReactNode;
  /** Optional secondary subtitle or description below the title. */
  description?: ReactNode;
  /** Alias for `description` (consistent with ConfirmModal `message`). */
  message?: ReactNode;
  /** Main body content rendered inside the scrollable dialog area. */
  children?: ReactNode;
  /** Custom footer node replacing the default cancel/confirm button row. */
  footer?: ReactNode;
  /** Sizing tier across the universal 7-level scale. Defaults to 'md'. */
  size?: ComponentSize;
  /** Maximum width in pixels or CSS unit (overrides size preset if provided). */
  width?: number | string;
  /** Label text for the primary confirmation button. */
  confirmText?: string;
  /** Label text for the secondary cancel button. */
  cancelText?: string;
  /** Callback fired when the primary confirmation button is clicked. */
  onConfirm?: () => void;
  /** Alias for `onConfirm`. */
  onOk?: () => void;
  /** If true, displays a loading state and disables modal action buttons. */
  isLoading?: boolean;
  /** Alias for `isLoading`. */
  loading?: boolean;
  /** Text displayed when confirmation action is loading. */
  loadingText?: string;
  /** Custom StyleX style overrides applied to the dialog container. */
  sx?: stylex.StyleXStyles;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Standard modal dialog component for VLRC applications.
 * Built on top of Radix UI Dialog and styled with Meta StyleX.
 * Supports configurable 7-tier sizing ('xxs' - 'xxl'), built-in loading states,
 * and unified prop conventions aligned with ConfirmModal.
 */
export function Modal({
  open,
  isOpen,
  title,
  description,
  message,
  children,
  footer,
  size = 'md',
  width,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading,
  loading,
  loadingText,
  onCancel,
  onClose,
  onConfirm,
  onOk,
  sx,
  className,
}: ModalProps) {
  const isVisible = open ?? isOpen ?? true;
  const isPending = isLoading ?? loading ?? false;
  const resolvedDescription = description ?? message;
  const handleDismiss = () => {
    if (!isPending) {
      (onCancel ?? onClose)?.();
    }
  };
  const handleConfirm = () => {
    if (!isPending) {
      (onConfirm ?? onOk)?.();
    }
  };

  const hasConfirmAction = Boolean(onConfirm || onOk);
  const sizeStyle = sizeStyles[size] ?? styles.sizeMd;

  return (
    <Dialog open={isVisible} onOpenChange={(val) => !val && handleDismiss()}>
      <DialogContent
        sx={[styles.content, sizeStyle, sx]}
        className={className}
        style={width ? { maxWidth: width } : undefined}
      >
        <DialogHeader sx={styles.header}>
          <DialogTitle>{title}</DialogTitle>
          {resolvedDescription ? (
            <DialogDescription>{resolvedDescription}</DialogDescription>
          ) : null}
        </DialogHeader>

        {children ? <div {...stylex.props(styles.body)}>{children}</div> : null}

        {(footer || hasConfirmAction) && (
          <DialogFooter sx={styles.footer}>
            {footer ? (
              footer
            ) : (
              <div {...stylex.props(styles.actions)}>
                <Button variant="outline" onClick={handleDismiss} disabled={isPending}>
                  {cancelText}
                </Button>
                {hasConfirmAction ? (
                  <Button onClick={handleConfirm} disabled={isPending}>
                    {isPending && loadingText ? loadingText : confirmText}
                  </Button>
                ) : null}
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
