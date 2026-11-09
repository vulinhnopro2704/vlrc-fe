import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from './input-group';

const PLACEHOLDER_TEXT = 'Search or enter query...';
const PREFIX_TEXT = 'https://';
const SUFFIX_TEXT = '.com';
const BUTTON_LABEL = 'Copy';
const TEST_VALUE = 'example-site';
const TYPED_TEXT = 'test-input';

describe('InputGroup', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>{PREFIX_TEXT}</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder={PLACEHOLDER_TEXT} />
          <InputGroupAddon align="inline-end">
            <InputGroupText>{SUFFIX_TEXT}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([['sm' as const], ['md' as const], ['lg' as const]])(
      'should match snapshot for %s size',
      (size) => {
        const { asFragment } = render(
          <InputGroup size={size}>
            <InputGroupInput placeholder={PLACEHOLDER_TEXT} />
          </InputGroup>,
        );
        expect(asFragment()).toMatchSnapshot();
      },
    );

    it('should match snapshot when disabled or invalid', () => {
      const { asFragment: disabledFragment } = render(
        <InputGroup disabled>
          <InputGroupInput placeholder={PLACEHOLDER_TEXT} disabled />
        </InputGroup>,
      );
      expect(disabledFragment()).toMatchSnapshot();

      const { asFragment: invalidFragment } = render(
        <InputGroup invalid>
          <InputGroupInput placeholder={PLACEHOLDER_TEXT} />
        </InputGroup>,
      );
      expect(invalidFragment()).toMatchSnapshot();
    });

    it('should match snapshot with button and textarea', () => {
      const { asFragment } = render(
        <InputGroup>
          <InputGroupTextarea placeholder={PLACEHOLDER_TEXT} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>{BUTTON_LABEL}</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should focus the input when clicking on the addon', () => {
      render(
        <InputGroup>
          <InputGroupAddon data-testid="addon" align="inline-start">
            <InputGroupText>{PREFIX_TEXT}</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput data-testid="input" placeholder={PLACEHOLDER_TEXT} />
        </InputGroup>,
      );

      const addon = screen.getByTestId('addon');
      const input = screen.getByTestId('input');

      expect(input).not.toHaveFocus();
      fireEvent.click(addon);
      expect(input).toHaveFocus();
    });

    it('should trigger button click without stealing button action', () => {
      const handleClick = vi.fn();

      render(
        <InputGroup>
          <InputGroupInput defaultValue={TEST_VALUE} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={handleClick}>{BUTTON_LABEL}</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>,
      );

      const button = screen.getByRole('button', { name: BUTTON_LABEL });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render correct data attributes and input value', () => {
      render(
        <InputGroup size="lg" invalid disabled data-testid="group">
          <InputGroupInput data-testid="input" placeholder={PLACEHOLDER_TEXT} />
        </InputGroup>,
      );

      const group = screen.getByTestId('group');
      const input = screen.getByTestId('input');

      expect(group).toHaveAttribute('data-slot', 'input-group');
      expect(group).toHaveAttribute('data-size', 'lg');
      expect(group).toHaveAttribute('data-disabled');
      expect(group).toHaveAttribute('data-invalid');

      fireEvent.change(input, { target: { value: TYPED_TEXT } });
      expect(input).toHaveValue(TYPED_TEXT);
    });
  });
});
