import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface SelectItem<T = string> {
  label: string;
  value: T;
  icon?: ReactNode;
  disabled?: boolean;
}
