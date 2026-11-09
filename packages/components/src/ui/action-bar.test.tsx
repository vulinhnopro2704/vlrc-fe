import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  ActionBar,
  ActionBarSelection,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSeparator,
  ActionBarClose,
} from './action-bar';

const SELECTION_TEXT = '3 items selected';
const DELETE_LABEL = 'Delete';
const EXPORT_LABEL = 'Export';
const CLEAR_LABEL = 'Deselect';

describe('ActionBar', () => {
  describe('UI', () => {
    it('should match snapshot when open', () => {
      const { asFragment } = render(
        <ActionBar open>
          <ActionBarSelection>{SELECTION_TEXT}</ActionBarSelection>
          <ActionBarSeparator />
          <ActionBarGroup>
            <ActionBarItem>{DELETE_LABEL}</ActionBarItem>
            <ActionBarItem>{EXPORT_LABEL}</ActionBarItem>
          </ActionBarGroup>
          <ActionBarSeparator />
          <ActionBarClose>{CLEAR_LABEL}</ActionBarClose>
        </ActionBar>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when closed (null output)', () => {
      const { asFragment } = render(
        <ActionBar open={false}>
          <ActionBarSelection>{SELECTION_TEXT}</ActionBarSelection>
        </ActionBar>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should close when pressing Escape key', () => {
      const onOpenChange = vi.fn();

      render(
        <ActionBar open onOpenChange={onOpenChange}>
          <ActionBarSelection>{SELECTION_TEXT}</ActionBarSelection>
        </ActionBar>,
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should close when clicking ActionBarClose', () => {
      const onOpenChange = vi.fn();

      render(
        <ActionBar open onOpenChange={onOpenChange}>
          <ActionBarClose>{CLEAR_LABEL}</ActionBarClose>
        </ActionBar>,
      );

      const closeButton = screen.getByRole('button', { name: new RegExp(CLEAR_LABEL, 'i') });
      fireEvent.click(closeButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should trigger action callbacks on item click', () => {
      const handleDelete = vi.fn();

      render(
        <ActionBar open>
          <ActionBarItem onClick={handleDelete}>{DELETE_LABEL}</ActionBarItem>
        </ActionBar>,
      );

      const deleteBtn = screen.getByRole('button', { name: DELETE_LABEL });
      fireEvent.click(deleteBtn);
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });
  });
});
