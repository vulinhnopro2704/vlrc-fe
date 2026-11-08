import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import stylex from '@stylexjs/unplugin';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../packages/components/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@vlrc-fe/components/theme': resolve(
            import.meta.dirname,
            '../packages/components/src/theme',
          ),
          '@vlrc-fe/components': resolve(import.meta.dirname, '../packages/components/src'),
          '@vlrc-fe/hooks': resolve(import.meta.dirname, '../packages/hooks/src'),
        },
      },
      plugins: [
        stylex.vite({
          useCSSLayers: true,
          dev: true,
          runtimeInjection: false,
          unstable_moduleResolution: {
            type: 'commonJS',
            rootDir: resolve(import.meta.dirname, '..'),
          },
        }),
      ],
    });
  },
};

export default config;
