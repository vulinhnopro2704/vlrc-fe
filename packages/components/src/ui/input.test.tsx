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
      ['text' as const],
      ['password' as const],
      ['email' as const],
      ['number' as const],
    ])('should match snapshot for type %s', (type) => {
      const { asFragment } = render(<Input {...createDefaultProps({ type })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
