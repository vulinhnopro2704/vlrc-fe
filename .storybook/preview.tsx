import React, { useEffect } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import './preview.css';

function ThemeWrapper({ theme, children }: { theme: string; children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'pink' || theme === 'lavender') {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <div
      style={{
        minHeight: '100%',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {children}
    </div>
  );
}

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';
  return (
    <ThemeWrapper theme={theme}>
      <Story />
    </ThemeWrapper>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'VLRC design theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'pink', title: 'Pink', icon: 'heart' },
          { value: 'lavender', title: 'Lavender', icon: 'star' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
