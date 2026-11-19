import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  server: {
    watch: null,
  },
  plugins: [
    stylex.vite({
      useCSSLayers: {
        before: ['reset', 'astryx-base', 'astryx-theme'],
        after: ['product'],
      },
      dev: true,
      runtimeInjection: false,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: import.meta.dirname,
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@vlrc-fe/components/theme/tokens.stylex': resolve(
        import.meta.dirname,
        './packages/components/src/theme/tokens.stylex.ts',
      ),
      '@vlrc-fe/components/theme': resolve(
        import.meta.dirname,
        './packages/components/src/theme/tokens.stylex.ts',
      ),
      '@vlrc-fe/components/Icons': resolve(
        import.meta.dirname,
        './packages/components/src/Icons/index.ts',
      ),
      '@vlrc-fe/components': resolve(import.meta.dirname, './packages/components/src/index.ts'),
      '@vlrc-fe/hooks': resolve(import.meta.dirname, './packages/hooks/src/index.ts'),
      '@vlrc-fe/editor': resolve(import.meta.dirname, './packages/editor/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'forks',
    teardownTimeout: 100,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/*.test.{ts,tsx}'],
    watch: false,
  },
});
