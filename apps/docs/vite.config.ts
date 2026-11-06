import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  base: process.env.BASE_URL || (process.env.GITHUB_ACTIONS ? '/vlrc-fe/' : '/'),
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      dev: true,
      runtimeInjection: false,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: import.meta.dirname,
      },
    }),
    react(),
  ],
  server: {
    port: 3000,
    open: false,
  },
});
