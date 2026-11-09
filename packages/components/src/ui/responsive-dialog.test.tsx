import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
} from './responsive-dialog';

const DIALOG_TITLE = 'Edit Profile';
const DIALOG_DESC = 'Make changes to your profile here.';
const TRIGGER_TEXT = 'Open Dialog';
const CLOSE_TEXT = 'Cancel';

describe('ResponsiveDialog', () => {
  describe('UI', () => {
    it('should match snapshot in desktop mode', () => {
      const { asFragment } = render(
        <ResponsiveDialog open forceMode="desktop">
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>{DIALOG_TITLE}</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>{DIALOG_DESC}</ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
          </ResponsiveDialogContent>
        </ResponsiveDialog>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in mobile mode', () => {
      const { asFragment } = render(
        <ResponsiveDialog open forceMode="mobile">
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>{DIALOG_TITLE}</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>{DIALOG_DESC}</ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
          </ResponsiveDialogContent>
        </ResponsiveDialog>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render dialog content in desktop mode and handle trigger', () => {
      render(
        <ResponsiveDialog forceMode="desktop">
          <ResponsiveDialogTrigger>{TRIGGER_TEXT}</ResponsiveDialogTrigger>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>{DIALOG_TITLE}</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
          </ResponsiveDialogContent>
        </ResponsiveDialog>,
      );

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });
      fireEvent.click(trigger);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(DIALOG_TITLE)).toBeInTheDocument();
    });

    it('should call onOpenChange when close button is clicked', () => {
      const onOpenChange = vi.fn();
      render(
        <ResponsiveDialog open onOpenChange={onOpenChange} forceMode="desktop">
          <ResponsiveDialogContent>
            <ResponsiveDialogClose>{CLOSE_TEXT}</ResponsiveDialogClose>
          </ResponsiveDialogContent>
        </ResponsiveDialog>,
      );

      const closeBtn = screen.getByRole('button', { name: CLOSE_TEXT });
      fireEvent.click(closeBtn);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
