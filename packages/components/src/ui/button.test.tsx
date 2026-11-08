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
      ['xxs' as const],
      ['xs' as const],
      ['sm' as const],
      ['md' as const],
      ['default' as const],
      ['lg' as const],
      ['xl' as const],
      ['xxl' as const],
      ['2xl' as const],
      ['icon' as const],
      ['icon-xxs' as const],
      ['icon-xs' as const],
      ['icon-sm' as const],
      ['icon-md' as const],
      ['icon-lg' as const],
      ['icon-xl' as const],
      ['icon-xxl' as const],
    ])('should match snapshot for %s size', (size) => {
      const { asFragment } = render(<Button {...createDefaultProps({ size })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render prefix and suffix correctly', () => {
      const { getByTestId } = render(
        <Button
          prefix={<span data-testid="prefix-icon">Left</span>}
          suffix={<span data-testid="suffix-icon">Right</span>}
          iconSize="lg"
        >
          Button with Addons
        </Button>,
      );
      expect(getByTestId('prefix-icon')).toBeInTheDocument();
      expect(getByTestId('suffix-icon')).toBeInTheDocument();
    });
  });
});
