import { resolve } from 'node:path';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
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
        rootDir: import.meta.dirname,
      },
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        astryx: resolve(import.meta.dirname, 'src/astryx.ts'),
      },
      name: 'PlatformCoreComponents',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`),
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react/compiler-runtime',
        'react-dom',
        '@stylexjs/stylex',
        '@astryxdesign/core',
        /^@astryxdesign\/core\/.*/,
        '@radix-ui/react-accordion',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-popover',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-select',
        '@radix-ui/react-separator',
        '@radix-ui/react-slot',
        '@radix-ui/react-tooltip',
        '@tanstack/react-table',
        'ahooks',
        'clsx',
        'cmdk',
        'lodash-es',
        'lucide-react',
        'react-day-picker',
        'sonner',
        'react-i18next',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
