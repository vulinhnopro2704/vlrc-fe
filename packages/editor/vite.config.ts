import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      dev: false,
      runtimeInjection: false,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: resolve(import.meta.dirname, '../..'),
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@vlrc-fe/components/theme/tokens.stylex': resolve(
        import.meta.dirname,
        '../components/src/theme/tokens.stylex.ts',
      ),
      '@vlrc-fe/components/theme': resolve(
        import.meta.dirname,
        '../components/src/theme/tokens.stylex.ts',
      ),
      '@vlrc-fe/components/Icons': resolve(import.meta.dirname, '../components/src/Icons/index.ts'),
      '@vlrc-fe/components/utils': resolve(import.meta.dirname, '../components/src/utils.ts'),
      '@vlrc-fe/components': resolve(import.meta.dirname, '../components/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'VLRCEditor',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        '@stylexjs/stylex',
        '@vlrc-fe/components',
        /^@vlrc-fe\/components\/.*/,
        'lexical',
        /^@lexical\/.*/,
        'lucide-react',
      ],
      output: {
        exports: 'named',
      },
    },
  },
});
