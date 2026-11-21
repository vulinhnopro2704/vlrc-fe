import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, shadow } from './theme/tokens.stylex';
import type { ComponentSize } from './theme/types';
import Icons from './Icons';
import { Title, Text } from './Typography';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  dialog: {
    width: '100%',
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    color: colors.foreground,
    padding: '1rem',
    boxShadow: shadow.xl,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    overscrollBehavior: 'contain',
  },
  sizeXxs: { maxWidth: 320 },
  sizeXs: { maxWidth: 380 },
  sizeSm: { maxWidth: 440 },
  sizeMd: { maxWidth: '26rem' },
  sizeLg: { maxWidth: 640 },
  sizeXl: { maxWidth: 768 },
  sizeXxl: { maxWidth: 960 },
  closeBtn: {
    position: 'absolute',
    right: '0.75rem',
    top: '0.75rem',
    borderRadius: radius.full,
    padding: '0.25rem',
    color: colors.mutedForeground,
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.foreground,
    },
    ':focus-visible': {
      outline: 'none',
      boxShadow: shadow.ringFocus,
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
    paddingRight: '1rem',
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    paddingTop: '0.125rem',
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
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.625rem',
    marginTop: 0,
  },
  cancelBtn: {
    borderRadius: radius.md,
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
    boxShadow: shadow.xs,
    ':hover': {
      backgroundColor: colors.accent,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  confirmBtn: {
    borderRadius: radius.md,
    borderWidth: 0,
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.primaryForeground,
    cursor: 'pointer',
    boxShadow: shadow.xs,
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  btnWarning: {
    backgroundColor: colors.warning,
    ':hover': { opacity: 0.9 },
  },
  btnInfo: {
    backgroundColor: colors.info,
    ':hover': { opacity: 0.9 },
  },
  btnSuccess: {
    backgroundColor: colors.success,
    ':hover': { opacity: 0.9 },
  },
  btnDanger: {
    backgroundColor: colors.destructive,
    ':hover': { opacity: 0.9 },
  },
  iconWarning: { color: colors.warning },
  iconInfo: { color: colors.info },
  iconSuccess: { color: colors.success },
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
    borderRadius: radius.full,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopColor: colors.primaryForeground,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  typeIcon: {
    width: 24,
    height: 24,
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
  /** Explanatory message describing the consequences of the action. */
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
  /** Alias for processingText */
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

const TYPE_CONFIG = {
  warning: {
    Icon: Icons.AlertTriangle,
    iconStyle: styles.iconWarning,
    btnStyle: styles.btnWarning,
  },
  info: { Icon: Icons.Info, iconStyle: styles.iconInfo, btnStyle: styles.btnInfo },
  success: { Icon: Icons.CheckCircle2, iconStyle: styles.iconSuccess, btnStyle: styles.btnSuccess },
  danger: { Icon: Icons.XCircle, iconStyle: styles.iconDanger, btnStyle: styles.btnDanger },
} as const;

/**
 * Confirmation dialog for critical user actions (deletions, warnings, approvals).
 * Built with Meta StyleX and Radix UI Dialog with native overscroll containment.
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
  processingText = 'Processing...',
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

  const handleDismiss = () => {
    if (!isPending) (onCancel ?? onClose)?.();
  };

  const handleConfirm = () => {
    if (!isPending) (onConfirm ?? onOk)?.();
  };

  const { Icon, iconStyle, btnStyle } = TYPE_CONFIG[resolvedType] ?? TYPE_CONFIG.warning;
  const sizeStyle = sizeStyles[size] ?? styles.sizeMd;

  return (
    <Dialog open={isModalOpen} onOpenChange={(val) => !val && handleDismiss()}>
      <DialogContent
        showCloseButton={false}
        sx={[styles.dialog, sizeStyle, sx]}
        className={className}
        style={width ? { maxWidth: width } : undefined}
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
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
            <Icon {...stylex.props(styles.typeIcon, iconStyle)} />
          </div>
          <div {...stylex.props(styles.body)}>
            <DialogTitle asChild>
              <Title id="confirm-modal-title" level={3} sx={styles.title}>
                {title}
              </Title>
            </DialogTitle>
            {resolvedMessage ? (
              <DialogDescription asChild>
                <Text type="muted" sx={styles.message}>
                  {resolvedMessage}
                </Text>
              </DialogDescription>
            ) : null}
            {children}
          </div>
        </div>

        {footer ?? (
          <div {...stylex.props(styles.footer)}>
            <Button
              type="button"
              variant="outline"
              onClick={handleDismiss}
              disabled={isPending}
              sx={styles.cancelBtn}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={resolvedType === 'danger' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              isLoading={isPending}
              sx={[styles.confirmBtn, btnStyle]}
            >
              {isPending ? resolvedLoadingText : confirmText}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
