import { vlrcStylexOptions } from '@vlrc-fe/components/stylex-config';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: { before: ['reset', 'astryx-base', 'astryx-theme'], after: ['product'] },
      runtimeInjection: false,
      unstable_moduleResolution: vlrcStylexOptions(import.meta.dirname).unstable_moduleResolution,
    }),
    react(),
  ],
  build: {
    minify: false,
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: {
      external: [/^react(?:\/|$)/, /^@vlrc-fe\/components(?:\/|$)/, '@stylexjs/stylex', 'gsap'],
    },
  },
});
