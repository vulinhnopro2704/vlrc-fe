import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';
import type { ButtonProps } from './button';

const DEFAULT_BUTTON_TEXT = 'Click me';

const createDefaultProps = (overrides?: Partial<ButtonProps>): ButtonProps => ({
  children: DEFAULT_BUTTON_TEXT,
  ...overrides,
});

describe('Button', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Button {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Button {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['default' as const],
      ['destructive' as const],
      ['outline' as const],
      ['secondary' as const],
      ['ghost' as const],
      ['link' as const],
      ['accent' as const],
      ['accent-cta' as const],
      ['gradient' as const],
      ['gradient-success' as const],
    ])('should match snapshot for %s variant', (variant) => {
      const { asFragment } = render(<Button {...createDefaultProps({ variant })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['sm' as const],
      ['default' as const],
      ['lg' as const],
      ['xl' as const],
      ['2xl' as const],
      ['icon' as const],
      ['icon-sm' as const],
      ['icon-lg' as const],
    ])('should match snapshot for %s size', (size) => {
      const { asFragment } = render(<Button {...createDefaultProps({ size })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
