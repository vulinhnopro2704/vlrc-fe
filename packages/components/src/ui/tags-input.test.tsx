import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  TagsInput,
  TagsInputItem,
  TagsInputItemText,
  TagsInputItemDelete,
  TagsInputInput,
  TagsInputClear,
} from './tags-input';

const TAG_REACT = 'React';
const TAG_VITE = 'Vite';
const TAG_STYLEX = 'StyleX';
const NEW_TAG = 'TypeScript';
const PLACEHOLDER_TEXT = 'Add tag...';

describe('TagsInput', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(
        <TagsInput defaultValue={[TAG_REACT, TAG_VITE]}>
          <TagsInputItem index={0} value={TAG_REACT}>
            <TagsInputItemText>{TAG_REACT}</TagsInputItemText>
            <TagsInputItemDelete index={0} />
          </TagsInputItem>
          <TagsInputItem index={1} value={TAG_VITE}>
            <TagsInputItemText>{TAG_VITE}</TagsInputItemText>
            <TagsInputItemDelete index={1} />
          </TagsInputItem>
          <TagsInputInput placeholder={PLACEHOLDER_TEXT} />
          <TagsInputClear />
        </TagsInput>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([['sm' as const], ['md' as const], ['lg' as const]])(
      'should match snapshot for size %s',
      (size) => {
        const { asFragment } = render(
          <TagsInput size={size} defaultValue={[TAG_REACT]}>
            <TagsInputItem index={0} value={TAG_REACT}>
              <TagsInputItemText>{TAG_REACT}</TagsInputItemText>
            </TagsInputItem>
            <TagsInputInput />
          </TagsInput>,
        );
        expect(asFragment()).toMatchSnapshot();
      },
    );

    it('should match snapshot when disabled or invalid', () => {
      const { asFragment: disabledFragment } = render(
        <TagsInput disabled defaultValue={[TAG_REACT]}>
          <TagsInputItem index={0} value={TAG_REACT}>
            <TagsInputItemText>{TAG_REACT}</TagsInputItemText>
          </TagsInputItem>
          <TagsInputInput />
        </TagsInput>,
      );
      expect(disabledFragment()).toMatchSnapshot();

      const { asFragment: invalidFragment } = render(
        <TagsInput invalid defaultValue={[TAG_REACT]}>
          <TagsInputItem index={0} value={TAG_REACT}>
            <TagsInputItemText>{TAG_REACT}</TagsInputItemText>
          </TagsInputItem>
          <TagsInputInput />
        </TagsInput>,
      );
      expect(invalidFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should add a new tag on Enter key press', () => {
      const onValueChange = vi.fn();

      render(
        <TagsInput defaultValue={[TAG_REACT]} onValueChange={onValueChange}>
          <TagsInputInput data-testid="input" />
        </TagsInput>,
      );

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: NEW_TAG } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onValueChange).toHaveBeenCalledWith([TAG_REACT, NEW_TAG]);
    });

    it('should prevent duplicate tags by default', () => {
      const onValueChange = vi.fn();

      render(
        <TagsInput defaultValue={[TAG_REACT]} onValueChange={onValueChange}>
          <TagsInputInput data-testid="input" />
        </TagsInput>,
      );

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: TAG_REACT } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should remove tag when clicking on delete button', () => {
      const onValueChange = vi.fn();

      render(
        <TagsInput defaultValue={[TAG_REACT, TAG_VITE]} onValueChange={onValueChange}>
          <TagsInputItem index={0} value={TAG_REACT}>
            <TagsInputItemText>{TAG_REACT}</TagsInputItemText>
            <TagsInputItemDelete data-testid="delete-btn-0" index={0} />
          </TagsInputItem>
        </TagsInput>,
      );

      fireEvent.click(screen.getByTestId('delete-btn-0'));
      expect(onValueChange).toHaveBeenCalledWith([TAG_VITE]);
    });

    it('should remove the last tag when pressing Backspace on empty input', () => {
      const onValueChange = vi.fn();

      render(
        <TagsInput defaultValue={[TAG_REACT, TAG_VITE]} onValueChange={onValueChange}>
          <TagsInputInput data-testid="input" />
        </TagsInput>,
      );

      const input = screen.getByTestId('input');
      fireEvent.keyDown(input, { key: 'Backspace' });

      expect(onValueChange).toHaveBeenCalledWith([TAG_REACT]);
    });

    it('should clear all tags when clicking clear button', () => {
      const onValueChange = vi.fn();

      render(
        <TagsInput defaultValue={[TAG_REACT, TAG_VITE, TAG_STYLEX]} onValueChange={onValueChange}>
          <TagsInputClear data-testid="clear-btn" />
        </TagsInput>,
      );

      fireEvent.click(screen.getByTestId('clear-btn'));
      expect(onValueChange).toHaveBeenCalledWith([]);
    });
  });
});
