import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmModal } from './ConfirmModal';

const TEST_TITLE = 'Delete Project';
const TEST_MESSAGE = 'This action cannot be undone.';
const CONFIRM_TEXT = 'Yes, Delete';
const CANCEL_TEXT = 'Cancel';
const PROCESSING_TEXT = 'Deleting...';

describe('ConfirmModal', () => {
  describe('UI', () => {
    it('should match snapshot when open', () => {
      const { asFragment } = render(
        <ConfirmModal
          open
          type="danger"
          title={TEST_TITLE}
          message={TEST_MESSAGE}
          confirmText={CONFIRM_TEXT}
          cancelText={CANCEL_TEXT}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render loading state when isLoading is true', () => {
      render(
        <ConfirmModal
          open
          isLoading
          loadingText={PROCESSING_TEXT}
          title={TEST_TITLE}
          message={TEST_MESSAGE}
        />,
      );
      expect(screen.getByText(PROCESSING_TEXT)).toBeInTheDocument();
    });
  });

  describe('Behavior', () => {
    it('should trigger onConfirm when confirm button clicked', () => {
      const handleConfirm = vi.fn();
      render(
        <ConfirmModal
          open
          title={TEST_TITLE}
          confirmText={CONFIRM_TEXT}
          onConfirm={handleConfirm}
        />,
      );

      fireEvent.click(screen.getByText(CONFIRM_TEXT));
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('should trigger onCancel when cancel button clicked', () => {
      const handleCancel = vi.fn();
      render(
        <ConfirmModal open title={TEST_TITLE} cancelText={CANCEL_TEXT} onCancel={handleCancel} />,
      );

      fireEvent.click(screen.getByText(CANCEL_TEXT));
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should not fire callbacks when isLoading is active', () => {
      const handleConfirm = vi.fn();
      const handleCancel = vi.fn();
      render(
        <ConfirmModal
          open
          isLoading
          title={TEST_TITLE}
          confirmText={CONFIRM_TEXT}
          cancelText={CANCEL_TEXT}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />,
      );

      const cancelBtn = screen.getByText(CANCEL_TEXT);
      expect(cancelBtn).toBeDisabled();
      fireEvent.click(cancelBtn);
      expect(handleCancel).not.toHaveBeenCalled();
    });
  });
});
