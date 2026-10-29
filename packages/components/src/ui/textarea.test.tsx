import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea, type TextareaProps } from './textarea';

const DEFAULT_PLACEHOLDER = 'Type your message here...';
const DEFAULT_VALUE = 'Sample multiline text content';

const createDefaultProps = (overrides?: Partial<TextareaProps>): TextareaProps => ({
  placeholder: DEFAULT_PLACEHOLDER,
  defaultValue: DEFAULT_VALUE,
  ...overrides,
});

describe('Textarea', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Textarea {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(<Textarea {...createDefaultProps({ disabled: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when invalid', () => {
      const { asFragment } = render(<Textarea {...createDefaultProps({ 'aria-invalid': true })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
