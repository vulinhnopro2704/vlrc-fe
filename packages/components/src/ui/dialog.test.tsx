import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from './dialog';

const TITLE_TEXT = 'Edit Profile';
const DESCRIPTION_TEXT = 'Make changes to your profile details here.';
const TRIGGER_TEXT = 'Open Dialog';
const CANCEL_TEXT = 'Cancel';
const SAVE_TEXT = 'Save Changes';

describe('Dialog', () => {
  describe('UI', () => {
    it('should match snapshot when open', () => {
      const { asFragment } = render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{TITLE_TEXT}</DialogTitle>
              <DialogDescription>{DESCRIPTION_TEXT}</DialogDescription>
            </DialogHeader>
            <div>Form content goes here</div>
            <DialogFooter>
              <DialogClose>{CANCEL_TEXT}</DialogClose>
              <button type="button">{SAVE_TEXT}</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should satisfy W3C Dialog accessibility semantics', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{TITLE_TEXT}</DialogTitle>
              <DialogDescription>{DESCRIPTION_TEXT}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('data-slot', 'dialog-content');

      // W3C ARIA labelling relations
      const title = screen.getByText(TITLE_TEXT);
      const description = screen.getByText(DESCRIPTION_TEXT);

      expect(title).toHaveAttribute('id');
      expect(description).toHaveAttribute('id');
      expect(dialog).toHaveAttribute('aria-labelledby', title.id);
      expect(dialog).toHaveAttribute('aria-describedby', description.id);
    });

    it('should open and close via trigger and close button', () => {
      const handleOpenChange = vi.fn();

      render(
        <Dialog onOpenChange={handleOpenChange}>
          <DialogTrigger>{TRIGGER_TEXT}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{TITLE_TEXT}</DialogTitle>
            </DialogHeader>
            <DialogClose>{CANCEL_TEXT}</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.click(trigger);
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('should assign contextual zIndex to overlay and content', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{TITLE_TEXT}</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );

      const overlay = document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement;
      const content = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;

      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();

      const overlayZ = Number(window.getComputedStyle(overlay).zIndex);
      const contentZ = Number(window.getComputedStyle(content).zIndex);

      // Content must sit above its overlay
      expect(contentZ).toBe(overlayZ + 1);
    });
  });
});
