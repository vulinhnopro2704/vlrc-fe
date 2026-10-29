import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from './theme/tokens.stylex';
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui';

const styles = stylex.create({
  content: {
    display: 'flex',
    maxHeight: 'calc(100vh - 150px)',
    flexDirection: 'column',
    gap: 0,
    padding: 0,
  },
  header: {
    paddingInline: '1.5rem',
    paddingBlock: '1rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  body: {
    flex: '1 1 0%',
    overflowY: 'auto',
    paddingInline: '1.5rem',
    paddingBlock: '1rem',
  },
  footer: {
    paddingInline: '1.5rem',
    paddingBlock: '1rem',
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

export interface ModalProps {
  open?: boolean;
  onCancel: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  sx?: stylex.StyleXStyles;
}

export function Modal({
  open = true,
  title,
  description,
  children,
  footer,
  width = 900,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isLoading = false,
  onCancel,
  onConfirm,
  sx
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={val => !val && onCancel()}>
      <DialogContent
        sx={[styles.content, sx]}
        style={{ maxWidth: width }}>
        <DialogHeader sx={styles.header}>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div {...stylex.props(styles.body)}>{children}</div>

        {(footer || onConfirm) && (
          <DialogFooter sx={styles.footer}>
            {footer ? (
              footer
            ) : (
              <div {...stylex.props(styles.actions)}>
                <Button variant='outline' onClick={onCancel} disabled={isLoading}>
                  {cancelText}
                </Button>
                {onConfirm ? (
                  <Button onClick={onConfirm} disabled={isLoading}>
                    {confirmText}
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
