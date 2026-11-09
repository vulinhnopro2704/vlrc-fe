import * as stylex from '@stylexjs/stylex';

/**
 * Design tokens mapping directly to CSS custom properties.
 * This guarantees seamless multi-theme compatibility with vlrc's themes
 * (light, dark, pink, lavender) defined in CSS variables.
 */
export const colors = stylex.defineVars({
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

  // Charts
  chart1: 'var(--chart-1, #e76e50)',
  chart2: 'var(--chart-2, #2a9d8f)',
  chart3: 'var(--chart-3, #264653)',
  chart4: 'var(--chart-4, #e9c46a)',
  chart5: 'var(--chart-5, #f4a261)',

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

export const radii = stylex.defineVars({
  radius: 'var(--radius, 1rem)',
  none: '0px',
  sm: 'calc(var(--radius, 1rem) - 4px)',
  md: 'calc(var(--radius, 1rem) - 2px)',
  lg: 'var(--radius, 1rem)',
  xl: 'calc(var(--radius, 1rem) + 4px)',
  '2xl': 'calc(var(--radius, 1rem) + 8px)',
  full: '9999px',
});

export const textColors = stylex.defineVars({
  default: 'var(--foreground, #0f172a)',
  muted: 'var(--muted-foreground, #64748b)',
  primary: 'var(--primary, #3b82f6)',
  destructive: 'var(--destructive, #ef4444)',
});

/**
 * 7-tier Spacing, Gap, Margin, and Gutter design system tokens.
 * Maps to root CSS variables for full theme adaptability.
 */
export const spacing = stylex.defineVars({
  xxs: 'var(--spacing-xxs, 0.25rem)',
  xs: 'var(--spacing-xs, 0.5rem)',
  sm: 'var(--spacing-sm, 0.75rem)',
  md: 'var(--spacing-md, 1rem)',
  lg: 'var(--spacing-lg, 1.5rem)',
  xl: 'var(--spacing-xl, 2rem)',
  xxl: 'var(--spacing-xxl, 3rem)',
});

export const gaps = spacing;
export const gutters = spacing;
