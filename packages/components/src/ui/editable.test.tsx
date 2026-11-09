import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Editable,
  EditableArea,
  EditablePreview,
  EditableInput,
  EditableToolbar,
  EditableTrigger,
  EditableSubmit,
  EditableCancel,
} from './editable';

const DEFAULT_TEXT = 'Project Alpha';
const UPDATED_TEXT = 'Project Beta';
const PLACEHOLDER_TEXT = 'Enter project title...';

describe('Editable', () => {
  describe('UI', () => {
    it('should match snapshot in preview mode', () => {
      const { asFragment } = render(
        <Editable defaultValue={DEFAULT_TEXT}>
          <EditableArea>
            <EditablePreview />
            <EditableInput />
            <EditableToolbar>
              <EditableTrigger />
            </EditableToolbar>
          </EditableArea>
        </Editable>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in editing mode', () => {
      const { asFragment } = render(
        <Editable defaultValue={DEFAULT_TEXT} defaultEditing>
          <EditableArea>
            <EditablePreview />
            <EditableInput />
            <EditableToolbar>
              <EditableSubmit />
              <EditableCancel />
            </EditableToolbar>
          </EditableArea>
        </Editable>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when empty with placeholder', () => {
      const { asFragment } = render(
        <Editable placeholder={PLACEHOLDER_TEXT}>
          <EditableArea>
            <EditablePreview />
          </EditableArea>
        </Editable>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should enter edit mode when clicking on preview', () => {
      render(
        <Editable defaultValue={DEFAULT_TEXT}>
          <EditableArea>
            <EditablePreview data-testid="preview" />
            <EditableInput data-testid="input" />
          </EditableArea>
        </Editable>,
      );

      const preview = screen.getByTestId('preview');
      expect(preview).toBeInTheDocument();
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();

      fireEvent.click(preview);

      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.queryByTestId('preview')).not.toBeInTheDocument();
    });

    it('should commit edited text on Enter key press', () => {
      const onSubmit = vi.fn();

      render(
        <Editable defaultValue={DEFAULT_TEXT} onSubmit={onSubmit}>
          <EditableArea>
            <EditablePreview data-testid="preview" />
            <EditableInput data-testid="input" />
          </EditableArea>
        </Editable>,
      );

      fireEvent.click(screen.getByTestId('preview'));

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: UPDATED_TEXT } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onSubmit).toHaveBeenCalledWith(UPDATED_TEXT);
      expect(screen.getByText(UPDATED_TEXT)).toBeInTheDocument();
    });

    it('should revert edited text on Escape key press', () => {
      const onCancel = vi.fn();

      render(
        <Editable defaultValue={DEFAULT_TEXT} onCancel={onCancel}>
          <EditableArea>
            <EditablePreview data-testid="preview" />
            <EditableInput data-testid="input" />
          </EditableArea>
        </Editable>,
      );

      fireEvent.click(screen.getByTestId('preview'));

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: UPDATED_TEXT } });
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(screen.getByText(DEFAULT_TEXT)).toBeInTheDocument();
    });

    it('should commit with EditableSubmit button click', () => {
      const onSubmit = vi.fn();

      render(
        <Editable defaultValue={DEFAULT_TEXT} defaultEditing onSubmit={onSubmit}>
          <EditableArea>
            <EditableInput data-testid="input" />
            <EditableToolbar>
              <EditableSubmit data-testid="submit-btn" />
            </EditableToolbar>
          </EditableArea>
        </Editable>,
      );

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: UPDATED_TEXT } });
      fireEvent.click(screen.getByTestId('submit-btn'));

      expect(onSubmit).toHaveBeenCalledWith(UPDATED_TEXT);
    });
  });
});
