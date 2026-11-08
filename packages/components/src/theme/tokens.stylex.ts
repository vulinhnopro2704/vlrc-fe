import * as stylex from '@stylexjs/stylex';

/**
 * Design tokens mapping directly to CSS custom properties.
 * This guarantees seamless multi-theme compatibility with vlrc's themes
 * (light, dark, pink, lavender) defined in CSS variables.
 */
export const colors = stylex.defineVars({
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  popover: 'var(--popover)',
  popoverForeground: 'var(--popover-foreground)',
  primary: 'var(--primary)',
  primaryForeground: 'var(--primary-foreground)',
  secondary: 'var(--secondary)',
  secondaryForeground: 'var(--secondary-foreground)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  accentForeground: 'var(--accent-foreground)',
  destructive: 'var(--destructive)',
  destructiveForeground: 'var(--destructive-foreground, #ffffff)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',

  // Charts
  chart1: 'var(--chart-1)',
  chart2: 'var(--chart-2)',
  chart3: 'var(--chart-3)',
  chart4: 'var(--chart-4)',
  chart5: 'var(--chart-5)',

  // Sidebar
  sidebar: 'var(--sidebar, var(--background))',
  sidebarForeground: 'var(--sidebar-foreground, var(--foreground))',
  sidebarPrimary: 'var(--sidebar-primary, var(--primary))',
  sidebarPrimaryForeground: 'var(--sidebar-primary-foreground, var(--primary-foreground))',
  sidebarAccent: 'var(--sidebar-accent, var(--accent))',
  sidebarAccentForeground: 'var(--sidebar-accent-foreground, var(--accent-foreground))',
  sidebarBorder: 'var(--sidebar-border, var(--border))',
  sidebarRing: 'var(--sidebar-ring, var(--ring))',
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
  default: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
  primary: 'var(--primary)',
  destructive: 'var(--destructive)',
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
