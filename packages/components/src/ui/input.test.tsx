import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input, type InputProps } from './input';

const DEFAULT_PLACEHOLDER = 'Enter value...';
const DEFAULT_VALUE = 'Sample input value';

const createDefaultProps = (overrides?: Partial<InputProps>): InputProps => ({
  placeholder: DEFAULT_PLACEHOLDER,
  defaultValue: DEFAULT_VALUE,
  ...overrides,
});

describe('Input', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Input {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Input {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when invalid', () => {
      const { asFragment } = render(<Input {...createDefaultProps({ 'aria-invalid': true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['xxs' as const],
      ['xs' as const],
      ['sm' as const],
      ['md' as const],
      ['lg' as const],
      ['xl' as const],
      ['xxl' as const],
    ])('should match snapshot for size %s', (size) => {
      const { asFragment } = render(<Input {...createDefaultProps({ size })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render prefix and suffix addons with separate button size', () => {
      const { getByTestId, getByText } = render(
        <Input
          prefixIcon={<span data-testid="search-icon">🔍</span>}
          suffixButton={<button data-testid="clear-btn">Clear</button>}
          size="lg"
          buttonSize="xs"
          iconSize="sm"
        />,
      );
      expect(getByTestId('search-icon')).toBeInTheDocument();
      expect(getByTestId('clear-btn')).toBeInTheDocument();
      expect(getByText('Clear')).toBeInTheDocument();
    });
  });
});
