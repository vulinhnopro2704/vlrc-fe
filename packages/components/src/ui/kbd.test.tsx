import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kbd, KbdGroup } from './kbd';
import type { KbdProps } from './kbd';

const DEFAULT_KEY_TEXT = '⌘K';
const CTRL_TEXT = 'Ctrl';
const ENTER_TEXT = 'Enter';
const TEST_ID = 'test-kbd';

const createDefaultProps = (overrides?: Partial<KbdProps>): KbdProps => ({
  children: DEFAULT_KEY_TEXT,
  ...overrides,
});

describe('Kbd', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Kbd {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([['default' as const], ['outline' as const]])(
      'should match snapshot for %s variant',
      (variant) => {
        const { asFragment } = render(<Kbd {...createDefaultProps({ variant })} />);
        expect(asFragment()).toMatchSnapshot();
      },
    );

    it.each([['xs' as const], ['sm' as const], ['md' as const], ['lg' as const]])(
      'should match snapshot for %s size',
      (size) => {
        const { asFragment } = render(<Kbd {...createDefaultProps({ size })} />);
        expect(asFragment()).toMatchSnapshot();
      },
    );

    it('should match snapshot for KbdGroup with multiple keys', () => {
      const { asFragment } = render(
        <KbdGroup>
          <Kbd>{CTRL_TEXT}</Kbd>
          <Kbd>{ENTER_TEXT}</Kbd>
        </KbdGroup>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render correct text content and data attributes', () => {
      render(
        <Kbd data-testid={TEST_ID} size="lg" variant="outline">
          {ENTER_TEXT}
        </Kbd>,
      );

      const kbdElement = screen.getByTestId(TEST_ID);
      expect(kbdElement).toHaveTextContent(ENTER_TEXT);
      expect(kbdElement).toHaveAttribute('data-slot', 'kbd');
      expect(kbdElement).toHaveAttribute('data-size', 'lg');
      expect(kbdElement).toHaveAttribute('data-variant', 'outline');
    });

    it('should render KbdGroup with role="group" and data-slot', () => {
      render(
        <KbdGroup data-testid="group-test">
          <Kbd>{CTRL_TEXT}</Kbd>
          <Kbd>{ENTER_TEXT}</Kbd>
        </KbdGroup>,
      );

      const group = screen.getByTestId('group-test');
      expect(group).toHaveAttribute('role', 'group');
      expect(group).toHaveAttribute('data-slot', 'kbd-group');
    });
  });
});
