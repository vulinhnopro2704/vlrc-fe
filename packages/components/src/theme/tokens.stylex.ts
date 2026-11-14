import * as stylex from '@stylexjs/stylex';

/**
 * Design tokens mapping directly to CSS custom properties.
 * Unified between Astryx Design System and VLRC Design System.
 * Ensures zero magic values and multi-theme compatibility.
 */
export const colors = stylex.defineVars({
  // Base VLRC palette
  background: 'var(--background, #ffffff)',
  foreground: 'var(--foreground, #0f172a)',
  card: 'var(--card, #ffffff)',
  cardForeground: 'var(--card-foreground, #0f172a)',
  popover: 'var(--popover, #ffffff)',
  popoverForeground: 'var(--popover-foreground, #0f172a)',
  primary: 'var(--primary, #3b82f6)',
  primaryForeground: 'var(--primary-foreground, #ffffff)',
  secondary: 'var(--secondary, #f1f5f9)',
  secondaryForeground: 'var(--secondary-foreground, #0f172a)',
  muted: 'var(--muted, #f8fafc)',
  mutedForeground: 'var(--muted-foreground, #64748b)',
  accent: 'var(--accent, #f1f5f9)',
  accentForeground: 'var(--accent-foreground, #0f172a)',
  destructive: 'var(--destructive, #ef4444)',
  destructiveForeground: 'var(--destructive-foreground, #ffffff)',
  border: 'var(--border, #e2e8f0)',
  input: 'var(--input, #cbd5e1)',
  ring: 'var(--ring, #3b82f6)',

  // Astryx Semantic Surface Tokens
  surfaceDefault: 'var(--color-surface-default, var(--background, #ffffff))',
  surfaceRaised: 'var(--color-surface-raised, var(--card, #ffffff))',
  surfaceOverlay: 'var(--color-surface-overlay, var(--popover, #ffffff))',
  surfaceSubtle: 'var(--color-surface-subtle, var(--secondary, #f1f5f9))',
  surfaceMuted: 'var(--color-surface-muted, var(--muted, #f8fafc))',
  surfaceAccent: 'var(--color-surface-accent, var(--primary, #3b82f6))',
  surfaceAccentSubtle: 'var(--color-surface-accent-subtle, var(--accent, #f1f5f9))',
  surfaceDanger: 'var(--color-surface-danger, var(--destructive, #ef4444))',

  // Astryx Semantic Foreground Tokens
  fgDefault: 'var(--color-fg-default, var(--foreground, #0f172a))',
  fgMuted: 'var(--color-fg-muted, var(--muted-foreground, #64748b))',
  fgSubtle: 'var(--color-fg-subtle, #94a3b8)',
  fgAccent: 'var(--color-fg-accent, var(--primary, #3b82f6))',
  fgDanger: 'var(--color-fg-danger, var(--destructive, #ef4444))',
  fgInverse: 'var(--color-fg-inverse, #ffffff)',
  fgDisabled: 'var(--color-fg-disabled, #cbd5e1)',

  // Semantic Status Colors
  success: 'var(--color-success, #16a34a)',
  warning: 'var(--color-warning, #eab308)',
  info: 'var(--color-info, #3b82f6)',

  // Astryx Semantic Border & Ring
  borderDefault: 'var(--color-border-default, var(--border, #e2e8f0))',
  borderMuted: 'var(--color-border-muted, var(--input, #cbd5e1))',
  focusRing: 'var(--color-focus-ring, var(--ring, #3b82f6))',

  // Charts & Dataviz Categoricals (1-12)
  chart1: 'var(--chart-1, #3b82f6)',
  chart2: 'var(--chart-2, #10b981)',
  chart3: 'var(--chart-3, #f59e0b)',
  chart4: 'var(--chart-4, #8b5cf6)',
  chart5: 'var(--chart-5, #ec4899)',
  dataviz1: 'var(--color-dataviz-categorical-1, #3b82f6)',
  dataviz2: 'var(--color-dataviz-categorical-2, #10b981)',
  dataviz3: 'var(--color-dataviz-categorical-3, #f59e0b)',
  dataviz4: 'var(--color-dataviz-categorical-4, #8b5cf6)',
  dataviz5: 'var(--color-dataviz-categorical-5, #ec4899)',
  dataviz6: 'var(--color-dataviz-categorical-6, #06b6d4)',
  dataviz7: 'var(--color-dataviz-categorical-7, #f97316)',
  dataviz8: 'var(--color-dataviz-categorical-8, #14b8a6)',
  dataviz9: 'var(--color-dataviz-categorical-9, #6366f1)',
  dataviz10: 'var(--color-dataviz-categorical-10, #d946ef)',
  dataviz11: 'var(--color-dataviz-categorical-11, #84cc16)',
  dataviz12: 'var(--color-dataviz-categorical-12, #64748b)',

  // Sidebar
  sidebar: 'var(--sidebar, var(--background, #ffffff))',
  sidebarForeground: 'var(--sidebar-foreground, var(--foreground, #0f172a))',
  sidebarPrimary: 'var(--sidebar-primary, var(--primary, #3b82f6))',
  sidebarPrimaryForeground: 'var(--sidebar-primary-foreground, var(--primary-foreground, #ffffff))',
  sidebarAccent: 'var(--sidebar-accent, var(--accent, #f1f5f9))',
  sidebarAccentForeground: 'var(--sidebar-accent-foreground, var(--accent-foreground, #0f172a))',
  sidebarBorder: 'var(--sidebar-border, var(--border, #e2e8f0))',
  sidebarRing: 'var(--sidebar-ring, var(--ring, #3b82f6))',
});

/**
 * Astryx standard border radius scale (default = 4px).
 */
export const radius = stylex.defineVars({
  none: '0px',
  sm: 'var(--radius-sm, 2px)',
  default: 'var(--radius-default, 4px)',
  md: 'var(--radius-md, 6px)',
  lg: 'var(--radius-lg, 8px)',
  xl: 'var(--radius-xl, 12px)',
  '2xl': 'var(--radius-2xl, 16px)',
  '3xl': 'var(--radius-3xl, 24px)',
  full: 'var(--radius-full, 9999px)',
  radius: 'var(--radius, 4px)',
});

/** Backward compatibility alias for radii */
export const radii = radius;

export const textColors = stylex.defineVars({
  default: 'var(--foreground, #0f172a)',
  muted: 'var(--muted-foreground, #64748b)',
  primary: 'var(--primary, #3b82f6)',
  destructive: 'var(--destructive, #ef4444)',
  success: 'var(--color-success, #16a34a)',
  warning: 'var(--color-warning, #eab308)',
  info: 'var(--color-info, #3b82f6)',
});

/**
 * Unified Spacing scale:
 * Combines Astryx numeric 4px grid steps (0 through 24) and VLRC 7-tier scale (xxs through xxl).
 */
export const spacing = stylex.defineVars({
  // 7-tier scale
  xxs: 'var(--spacing-xxs, 0.25rem)', // 4px
  xs: 'var(--spacing-xs, 0.5rem)', // 8px
  sm: 'var(--spacing-sm, 0.75rem)', // 12px
  md: 'var(--spacing-md, 1rem)', // 16px
  lg: 'var(--spacing-lg, 1.5rem)', // 24px
  xl: 'var(--spacing-xl, 2rem)', // 32px
  xxl: 'var(--spacing-xxl, 3rem)', // 48px

  // Astryx Numeric 4px Scale
  '0': 'var(--spacing-0, 0rem)',
  '0.5': 'var(--spacing-0-5, 0.125rem)',
  '1': 'var(--spacing-1, 0.25rem)',
  '1.5': 'var(--spacing-1-5, 0.375rem)',
  '2': 'var(--spacing-2, 0.5rem)',
  '2.5': 'var(--spacing-2-5, 0.625rem)',
  '3': 'var(--spacing-3, 0.75rem)',
  '3.5': 'var(--spacing-3-5, 0.875rem)',
  '4': 'var(--spacing-4, 1rem)',
  '5': 'var(--spacing-5, 1.25rem)',
  '6': 'var(--spacing-6, 1.5rem)',
  '7': 'var(--spacing-7, 1.75rem)',
  '8': 'var(--spacing-8, 2rem)',
  '9': 'var(--spacing-9, 2.25rem)',
  '10': 'var(--spacing-10, 2.5rem)',
  '11': 'var(--spacing-11, 2.75rem)',
  '12': 'var(--spacing-12, 3rem)',
  '14': 'var(--spacing-14, 3.5rem)',
  '16': 'var(--spacing-16, 4rem)',
  '20': 'var(--spacing-20, 5rem)',
  '24': 'var(--spacing-24, 6rem)',
});

export const gaps = spacing;
export const gutters = spacing;

/**
 * Astryx standard 8-tier elevation shadow tokens.
 */
export const shadow = stylex.defineVars({
  none: 'var(--shadow-none, none)',
  xs: 'var(--shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
  sm: 'var(--shadow-sm, 0 1px 3px 0 rgba(0, 0, 0, 0.1))',
  md: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
  lg: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
  xl: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1))',
  '2xl': 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
  inner: 'var(--shadow-inner, inset 0 2px 4px 0 rgba(0, 0, 0, 0.05))',
  ring: 'var(--shadow-ring, 0 0 0 2px color-mix(in srgb, var(--ring, #3b82f6) 50%, transparent))',
  ringFocus: 'var(--shadow-ring-focus, 0 0 0 2px var(--ring, #3b82f6))',
  ringDestructive:
    'var(--shadow-ring-destructive, 0 0 0 2px color-mix(in srgb, var(--destructive, #ef4444) 40%, transparent))',
  low: 'var(--shadow-low, var(--shadow-sm))',
  med: 'var(--shadow-med, var(--shadow-md))',
  high: 'var(--shadow-high, var(--shadow-lg))',
});

/**
 * Astryx motion tokens (duration & easing).
 */
export const duration = stylex.defineVars({
  fast: 'var(--duration-fast, 100ms)',
  normal: 'var(--duration-normal, 200ms)',
  slow: 'var(--duration-slow, 300ms)',
  slower: 'var(--duration-slower, 500ms)',
});

export const easing = stylex.defineVars({
  standard: 'var(--easing-standard, cubic-bezier(0.24, 1, 0.4, 1))',
  decelerate: 'var(--easing-decelerate, cubic-bezier(0, 0, 0.2, 1))',
  accelerate: 'var(--easing-accelerate, cubic-bezier(0.4, 0, 1, 1))',
  linear: 'var(--easing-linear, linear)',
});

/**
 * Typography ramp tokens, including preserved compact sizes.
 */
export const typography = stylex.defineVars({
  // Preserved small sizes
  xxs: 'var(--font-size-xxs, 0.5rem)',
  xs: 'var(--font-size-xs, 0.625rem)',
  titleXxs: 'var(--font-size-title-xxs, 0.625rem)',
  titleXxl: 'var(--font-size-title-xxl, 2rem)',

  // Astryx standard ramps
  caption: 'var(--font-size-caption, 0.75rem)',
  bodySm: 'var(--font-size-body-sm, 0.875rem)',
  body: 'var(--font-size-body, 1rem)',
  bodyLg: 'var(--font-size-body-lg, 1.125rem)',
  subtitle: 'var(--font-size-subtitle, 1.25rem)',
  titleSm: 'var(--font-size-title-sm, 1.5rem)',
  title: 'var(--font-size-title, 1.875rem)',
  titleLg: 'var(--font-size-title-lg, 2.25rem)',
  headline: 'var(--font-size-headline, 3rem)',
  display: 'var(--font-size-display, 3.75rem)',
});
