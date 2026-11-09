import React, { createContext, useContext } from 'react';

/**
 * Standard W3C & Design System semantic z-index scale.
 * Follows layered architecture matching modern enterprise component libraries
 * and W3C overlay stacking specifications.
 */
export const Z_INDEX_LAYERS = {
  deep: -999,
  base: 0,
  docked: 10,
  sticky: 100,
  banner: 200,
  drawer: 500,
  overlay: 500,
  modal: 500,
  popover: 600,
  toast: 700,
  tooltip: 800,
  max: 9999,
} as const;

export type ZIndexLayer = keyof typeof Z_INDEX_LAYERS;

/**
 * React Context providing the current stacking z-index level.
 * When container overlays (Modal, Dialog, Sheet, Drawer) mount, they increment
 * this context so that any child overlays (Select, Popover, DatePicker, nested Modals)
 * are guaranteed to render on top of their parent, regardless of DOM mounting order.
 */
export const ZIndexContext = createContext<number | undefined>(undefined);

/**
 * Hook to retrieve the current resolved z-index.
 *
 * @param defaultLayer - Fallback layer name or raw number when outside of any ZIndexProvider.
 * @param step - Optional offset added to the resolved z-index (default: 0).
 */
export function useZIndex(defaultLayer: ZIndexLayer | number, step = 0): number {
  const contextZIndex = useContext(ZIndexContext);
  const base =
    contextZIndex ??
    (typeof defaultLayer === 'number' ? defaultLayer : Z_INDEX_LAYERS[defaultLayer]);
  return base + step;
}

export interface ZIndexProviderProps {
  /** The base z-index value provided to children */
  value: number;
  children: React.ReactNode;
}

/**
 * Context Provider that establishes a new stacking level for nested overlays.
 */
export function ZIndexProvider({ value, children }: ZIndexProviderProps) {
  return <ZIndexContext.Provider value={value}>{children}</ZIndexContext.Provider>;
}
