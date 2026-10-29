import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Checkbox, type CheckboxProps } from './checkbox';

const createDefaultProps = (overrides?: Partial<CheckboxProps>): CheckboxProps => ({
  'aria-label': 'Accept terms',
  ...overrides,
});

describe('Checkbox', () => {
  describe('UI', () => {
    it('should match snapshot in unchecked state', () => {
      const { asFragment } = render(<Checkbox {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in checked state', () => {
      const { asFragment } = render(<Checkbox {...createDefaultProps({ checked: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Checkbox {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
