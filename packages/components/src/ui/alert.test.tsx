import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert, AlertTitle, AlertDescription, type AlertProps, type AlertVariant } from './alert';

const DEFAULT_TITLE = 'Alert Title';
const DEFAULT_DESCRIPTION = 'This is an important alert message.';

const createDefaultProps = (overrides?: Partial<AlertProps>): AlertProps => ({
  children: (
    <>
      <AlertTitle>{DEFAULT_TITLE}</AlertTitle>
      <AlertDescription>{DEFAULT_DESCRIPTION}</AlertDescription>
    </>
  ),
  ...overrides,
});

describe('Alert', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Alert {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['default' as AlertVariant],
      ['destructive' as AlertVariant],
    ])('should match snapshot for %s variant', (variant) => {
      const { asFragment } = render(<Alert {...createDefaultProps({ variant })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
