import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label, type LabelProps } from './label';

const DEFAULT_LABEL_TEXT = 'Email Address';

const createDefaultProps = (overrides?: Partial<LabelProps>): LabelProps => ({
  children: DEFAULT_LABEL_TEXT,
  htmlFor: 'email-input',
  ...overrides,
});

describe('Label', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Label {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with custom className', () => {
      const { asFragment } = render(
        <Label {...createDefaultProps({ className: 'custom-label-class' })} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
