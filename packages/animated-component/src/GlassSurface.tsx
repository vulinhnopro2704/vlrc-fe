import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Box } from '@vlrc-fe/components';

const styles = stylex.create({
  surface: {
    backgroundColor: {
      default: 'var(--color-surface-raised, var(--card))',
      '@supports (backdrop-filter: blur(12px))':
        'color-mix(in srgb, var(--color-surface-raised, var(--card)) 88%, transparent)',
    },
    backdropFilter: 'blur(12px)',
  },
});

export function GlassSurface({ children, sx }: { children: ReactNode; sx?: stylex.StyleXStyles }) {
  return <Box sx={[styles.surface, sx]}>{children}</Box>;
}
