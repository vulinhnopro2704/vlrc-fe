import * as React from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const BREAKPOINTS: readonly Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export const responsiveMap: Record<Breakpoint, string> = {
  xs: '(max-width: 575.98px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
};

export type ScreenMap = Record<Breakpoint, boolean>;

const DEFAULT_SCREENS: ScreenMap = {
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
};

/**
 * Hook detecting active screen breakpoints based on standard grid thresholds.
 * Returns an object of active breakpoint booleans: `{ xs, sm, md, lg, xl, xxl }`.
 */
export function useBreakpoint(): ScreenMap {
  const [screens, setScreens] = React.useState<ScreenMap>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return DEFAULT_SCREENS;
    }
    const initial: Partial<ScreenMap> = {};
    for (const bp of BREAKPOINTS) {
      initial[bp] = window.matchMedia(responsiveMap[bp]).matches;
    }
    return initial as ScreenMap;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mqlList: Array<{
      bp: Breakpoint;
      mql: MediaQueryList;
      listener: (e: MediaQueryListEvent) => void;
    }> = [];

    for (const bp of BREAKPOINTS) {
      const mql = window.matchMedia(responsiveMap[bp]);
      const listener = () => {
        setScreens((prev) => {
          const nextMatches = mql.matches;
          if (prev[bp] === nextMatches) return prev;
          return { ...prev, [bp]: nextMatches };
        });
      };

      if (mql.addEventListener) {
        mql.addEventListener('change', listener);
      } else {
        (mql as any).addListener(listener);
      }

      mqlList.push({ bp, mql, listener });
    }

    return () => {
      for (const { mql, listener } of mqlList) {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', listener);
        } else {
          (mql as any).removeListener(listener);
        }
      }
    };
  }, []);

  return screens;
}

/**
 * Returns the highest matched breakpoint key from a ScreenMap.
 */
export function getHighestBreakpoint(screens: ScreenMap): Breakpoint {
  for (let i = BREAKPOINTS.length - 1; i >= 0; i--) {
    const bp = BREAKPOINTS[i];
    if (screens[bp]) {
      return bp;
    }
  }
  return 'xs';
}
