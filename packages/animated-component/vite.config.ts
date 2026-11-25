import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: { before: ['reset', 'astryx-base', 'astryx-theme'], after: ['product'] },
      runtimeInjection: false,
      unstable_moduleResolution: { type: 'commonJS', rootDir: import.meta.dirname },
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
