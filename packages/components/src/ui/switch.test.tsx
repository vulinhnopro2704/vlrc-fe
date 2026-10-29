import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Switch, type SwitchProps } from './switch';

const createDefaultProps = (overrides?: Partial<SwitchProps>): SwitchProps => ({
  'aria-label': 'Airplane mode',
  ...overrides,
});

describe('Switch', () => {
  describe('UI', () => {
    it('should match snapshot in unchecked state', () => {
      const { asFragment } = render(<Switch {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in checked state', () => {
      const { asFragment } = render(<Switch {...createDefaultProps({ checked: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Switch {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
