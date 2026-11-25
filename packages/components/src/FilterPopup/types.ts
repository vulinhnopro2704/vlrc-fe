import type { ReactNode } from 'react';

export interface FilterPopupOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface FilterPopupCategory {
  key: string;
  label: string;
  options: readonly FilterPopupOption[];
}

export type FilterPopupSelection = Partial<Record<string, readonly string[]>>;
