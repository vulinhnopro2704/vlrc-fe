import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon, XIcon } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from './theme/tokens.stylex';

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
    zIndex: 10000,
    marginInline: '1rem',
    width: '100%',
    maxWidth: '28rem',
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    color: colors.cardForeground,
    padding: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    transitionProperty: 'transform, opacity',
    transitionDuration: '200ms',
  },
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
    gap: '1rem',
    paddingRight: '2rem',
  },
  iconWrap: {
    marginTop: '0.25rem',
    flexShrink: 0,
  },
  body: {
    minWidth: 0,
    flex: '1 1 0%',
  },
  title: {
    marginBottom: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: colors.foreground,
  },
  message: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: colors.mutedForeground,
  },
  footer: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
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
});

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  closeLabel?: string;
  processingText?: string;
  type?: 'warning' | 'info' | 'success' | 'danger';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  closeLabel = 'Đóng',
  processingText = 'Đang xử lý...',
  type = 'warning',
  isLoading = false
}: ConfirmationDialogProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered || isOpen) return;

    const timeoutId = window.setTimeout(() => setIsRendered(false), 200);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, isRendered]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isLoading]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isRendered) return null;

  const Icon = {
    warning: AlertTriangleIcon,
    info: InfoIcon,
    success: CheckCircleIcon,
    danger: XCircleIcon
  }[type];

  const typeStyles = {
    warning: { icon: styles.iconWarning, btn: styles.btnWarning },
    info: { icon: styles.iconInfo, btn: styles.btnInfo },
    success: { icon: styles.iconSuccess, btn: styles.btnSuccess },
    danger: { icon: styles.iconDanger, btn: styles.btnDanger },
  }[type];

  return (
    <div ref={containerRef} {...stylex.props(styles.container)}>
      <div
        {...stylex.props(
          styles.backdrop,
          isOpen ? styles.backdropOpen : styles.backdropClosed
        )}
        onClick={handleBackdropClick}
      />

      <div
        ref={dialogRef}
        {...stylex.props(
          styles.dialog,
          isOpen ? styles.dialogOpen : styles.dialogClosed
        )}
        onClick={event => event.stopPropagation()}
      >
        <button
          type='button'
          onClick={handleClose}
          disabled={isLoading}
          {...stylex.props(styles.closeBtn)}
          aria-label={closeLabel}
        >
          <XIcon style={{ width: 20, height: 20 }} />
        </button>

        <div {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.iconWrap)}>
            <Icon style={{ width: 24, height: 24 }} {...stylex.props(typeStyles.icon)} />
          </div>
          <div {...stylex.props(styles.body)}>
            <h3 {...stylex.props(styles.title)}>{title}</h3>
            <p {...stylex.props(styles.message)}>{message}</p>
          </div>
        </div>

        <div {...stylex.props(styles.footer)}>
          <button
            type='button'
            onClick={handleClose}
            disabled={isLoading}
            {...stylex.props(styles.cancelBtn)}
          >
            {cancelText}
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            disabled={isLoading}
            {...stylex.props(styles.confirmBtn, typeStyles.btn)}
          >
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span {...stylex.props(styles.spinner)} />
                {processingText}
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
