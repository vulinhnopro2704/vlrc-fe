import type React from 'react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from './theme/tokens.stylex';
import type { ComponentSize } from './theme/types';
import Icons from './Icons';
import { Title, Text } from './Typography';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transitionProperty: 'opacity',
    transitionDuration: '200ms',
  },
  backdropOpen: {
    opacity: 1,
  },
  backdropClosed: {
    opacity: 0,
  },
  dialog: {
    position: 'relative',
    zIndex: 2,
    marginInline: '1rem',
    width: '100%',
    borderRadius: radii.lg,
    backgroundColor: 'var(--background, #ffffff)',
    color: 'var(--foreground, #0f172a)',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    transitionProperty: 'transform, opacity',
    transitionDuration: '200ms',
  },
  sizeXxs: { maxWidth: 320 },
  sizeXs: { maxWidth: 380 },
  sizeSm: { maxWidth: 440 },
  sizeMd: { maxWidth: '26rem' },
  sizeLg: { maxWidth: 640 },
  sizeXl: { maxWidth: 768 },
  sizeXxl: { maxWidth: 960 },
  dialogOpen: {
    transform: 'translateY(0) scale(1)',
    opacity: 1,
  },
  dialogClosed: {
    transform: 'translateY(1.25rem) scale(0.95)',
    opacity: 0,
  },
  closeBtn: {
    position: 'absolute',
    right: '1rem',
    top: '1rem',
    borderRadius: radii.full,
    padding: '0.25rem',
    color: colors.mutedForeground,
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.foreground,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
    paddingRight: '1.5rem',
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 0,
  },
  body: {
    minWidth: 0,
    flex: '1 1 0%',
  },
  title: {
    margin: 0,
    marginBottom: '0.375rem',
    fontSize: '1.125rem',
    lineHeight: 1.4,
    fontWeight: 600,
    color: colors.foreground,
  },
  message: {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: colors.mutedForeground,
  },
  footer: {
    marginTop: '1.25rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.625rem',
  },
  cancelBtn: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.foreground,
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ':hover': {
      backgroundColor: colors.accent,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  confirmBtn: {
    borderRadius: radii.md,
    borderWidth: 0,
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  btnWarning: {
    backgroundColor: '#eab308',
    ':hover': { backgroundColor: '#ca8a04' },
  },
  btnInfo: {
    backgroundColor: '#3b82f6',
    ':hover': { backgroundColor: '#2563eb' },
  },
  btnSuccess: {
    backgroundColor: '#22c55e',
    ':hover': { backgroundColor: '#16a34a' },
  },
  btnDanger: {
    backgroundColor: colors.destructive,
    ':hover': { opacity: 0.9 },
  },
  iconWarning: { color: '#eab308' },
  iconInfo: { color: '#3b82f6' },
  iconSuccess: { color: '#22c55e' },
  iconDanger: { color: colors.destructive },
  spinner: {
    display: 'inline-block',
    marginRight: '0.5rem',
    width: '1rem',
    height: '1rem',
    animationName: spin,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    borderRadius: radii.full,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopColor: '#ffffff',
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  typeIcon: {
    width: 24,
    height: 24,
  },
  loadingContent: {
    display: 'inline-flex',
    alignItems: 'center',
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

export type ConfirmModalType = 'warning' | 'info' | 'success' | 'danger' | 'error';

export interface ConfirmModalProps {
  /** Controls visibility of the confirmation modal dialog. */
  open?: boolean;
  /** Alias for `open` maintaining backward compatibility. */
  isOpen?: boolean;
  /** Callback fired when the dialog is dismissed or cancel button clicked. */
  onClose?: () => void;
  /** Alias for `onClose` (consistent with Modal `onCancel`). */
  onCancel?: () => void;
  /** Callback fired when the user confirms the action. */
  onConfirm?: () => void;
  /** Alias for `onConfirm`. */
  onOk?: () => void;
  /** Dialog heading title summarizing the intent. */
  title: ReactNode;
  /** Detailed explanatory message describing the consequences of the action. */
  message?: ReactNode;
  /** Alias for `message` (consistent with Modal `description`). */
  description?: ReactNode;
  /** Optional body content rendered inside the dialog body. */
  children?: ReactNode;
  /** Text shown on the confirmation button (defaults to "Confirm"). */
  confirmText?: string;
  /** Text shown on the cancel button (defaults to "Cancel"). */
  cancelText?: string;
  /** Accessible ARIA label for the modal close button. */
  closeLabel?: string;
  /** Text shown when an async confirmation is pending (defaults to "Processing..."). */
  processingText?: string;
  /** Alias for `processingText` (consistent with Modal `loadingText`). */
  loadingText?: string;
  /** Semantic type determining the accent color and icon. */
  type?: ConfirmModalType;
  /** Alias for `type` to follow design system variant conventions. */
  variant?: ConfirmModalType;
  /** Whether the confirmation request is currently pending. */
  isLoading?: boolean;
  /** Alias for `isLoading`. */
  loading?: boolean;
  /** Sizing tier across the universal 7-level scale. Defaults to 'md'. */
  size?: ComponentSize;
  /** Maximum width in pixels or CSS unit (overrides size preset). */
  width?: number | string;
  /** Custom footer node replacing the default cancel/confirm button row. */
  footer?: ReactNode;
  /** Custom StyleX style overrides applied to the dialog container. */
  sx?: stylex.StyleXStyles;
  /** Additional CSS class names. */
  className?: string;
}

/** Legacy type alias */
export type ConfirmationDialogProps = ConfirmModalProps;

/**
 * Confirmation dialog for critical user actions (deletions, warnings, approvals).
 * Features smooth animations, escape-key support, semantic type palettes,
 * 7-tier sizing scale, and unified prop conventions matching Modal.
 */
export function ConfirmModal({
  open,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  onOk,
  title,
  message,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  closeLabel = 'Close',
  processingText,
  loadingText,
  type,
  variant = 'warning',
  isLoading,
  loading,
  size = 'md',
  width,
  footer,
  sx,
  className,
}: ConfirmModalProps) {
  const isModalOpen = open ?? isOpen ?? true;
  const isPending = isLoading ?? loading ?? false;
  const rawType = type ?? variant ?? 'warning';
  const resolvedType: 'warning' | 'info' | 'success' | 'danger' =
    rawType === 'error' ? 'danger' : rawType;
  const resolvedMessage = message ?? description;
  const resolvedLoadingText = loadingText ?? processingText ?? 'Processing...';

  const [isRendered, setIsRendered] = useState(isModalOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      setIsRendered(true);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isRendered || isModalOpen) return;

    const timeoutId = window.setTimeout(() => setIsRendered(false), 200);
    return () => window.clearTimeout(timeoutId);
  }, [isModalOpen, isRendered]);

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

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isPending) {
      handleDismiss();
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen && !isPending) {
        handleDismiss();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, isPending]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  if (!isRendered) return null;

  const Icon = {
    warning: Icons.AlertTriangle,
    info: Icons.Info,
    success: Icons.CheckCircle2,
    danger: Icons.XCircle,
  }[resolvedType];

  const typeStyles = {
    warning: { icon: styles.iconWarning, btn: styles.btnWarning },
    info: { icon: styles.iconInfo, btn: styles.btnInfo },
    success: { icon: styles.iconSuccess, btn: styles.btnSuccess },
    danger: { icon: styles.iconDanger, btn: styles.btnDanger },
  }[resolvedType];

  const sizeStyle = sizeStyles[size] ?? styles.sizeMd;
  const dialogSxProps = stylex.props(
    styles.dialog,
    sizeStyle,
    isModalOpen ? styles.dialogOpen : styles.dialogClosed,
    sx,
  );
  const mergedDialogClass = className
    ? `${dialogSxProps.className || ''} ${className}`.trim()
    : dialogSxProps.className;
  const mergedDialogStyle =
    width || dialogSxProps.style
      ? { ...dialogSxProps.style, ...(width ? { maxWidth: width } : {}) }
      : undefined;

  return (
    <div ref={containerRef} {...stylex.props(styles.container)}>
      <div
        {...stylex.props(
          styles.backdrop,
          isModalOpen ? styles.backdropOpen : styles.backdropClosed,
        )}
        onClick={handleBackdropClick}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        {...dialogSxProps}
        className={mergedDialogClass}
        style={mergedDialogStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDismiss}
          disabled={isPending}
          {...stylex.props(styles.closeBtn)}
          aria-label={closeLabel}
        >
          <Icons.X {...stylex.props(styles.closeIcon)} />
        </button>

        <div {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.iconWrap)}>
            <Icon {...stylex.props(styles.typeIcon, typeStyles.icon)} />
          </div>
          <div {...stylex.props(styles.body)}>
            <Title id="confirm-modal-title" level={3} sx={styles.title}>
              {title}
            </Title>
            {resolvedMessage ? (
              <Text type="muted" sx={styles.message}>
                {resolvedMessage}
              </Text>
            ) : null}
            {children}
          </div>
        </div>

        {footer ? (
          footer
        ) : (
          <div {...stylex.props(styles.footer)}>
            <button
              type="button"
              onClick={handleDismiss}
              disabled={isPending}
              {...stylex.props(styles.cancelBtn)}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              {...stylex.props(styles.confirmBtn, typeStyles.btn)}
            >
              {isPending ? (
                <span {...stylex.props(styles.loadingContent)}>
                  <span {...stylex.props(styles.spinner)} />
                  {resolvedLoadingText}
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmModal;
