import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown, PopupMenu } from './Dropdown';
import type { DropdownItemType } from './types';

const TRIGGER_TEXT = 'Open Menu';
const ITEM_PROFILE = 'Profile';
const ITEM_SETTINGS = 'Settings';
const ITEM_DELETE = 'Delete Account';
const ITEM_SUB_EXPORT = 'Export PDF';
const SUBMENU_LABEL = 'Export Options';

const BASIC_ITEMS: DropdownItemType[] = [
  { key: 'profile', label: ITEM_PROFILE },
  { key: 'settings', label: ITEM_SETTINGS },
  { type: 'separator' },
  { key: 'delete', label: ITEM_DELETE, danger: true },
];

describe('Dropdown', () => {
  describe('UI', () => {
    it('should match snapshot when closed', () => {
      const { asFragment } = render(
        <Dropdown items={BASIC_ITEMS}>
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when open', () => {
      const { asFragment } = render(
        <Dropdown items={BASIC_ITEMS} open>
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with sm size', () => {
      const { asFragment } = render(
        <Dropdown items={BASIC_ITEMS} size="sm" open>
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with lg size', () => {
      const { asFragment } = render(
        <Dropdown items={BASIC_ITEMS} size="lg" open>
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should open menu and fire item onClick when clicked', () => {
      const handleProfileClick = vi.fn();
      const items: DropdownItemType[] = [
        { key: 'profile', label: ITEM_PROFILE, onClick: handleProfileClick },
        { key: 'settings', label: ITEM_SETTINGS },
      ];

      render(
        <Dropdown items={items}>
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );

      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.pointerDown(trigger);

      const profileItem = screen.getByText(ITEM_PROFILE);
      expect(profileItem).toBeInTheDocument();

      fireEvent.click(profileItem);
      expect(handleProfileClick).toHaveBeenCalledTimes(1);
    });

    it('should support declarative menu prop format with items and onClick', () => {
      const handleMenuClick = vi.fn();

      render(
        <Dropdown
          menu={{
            items: BASIC_ITEMS,
            onClick: handleMenuClick,
          }}
        >
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );

      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.pointerDown(trigger);

      const settingsItem = screen.getByText(ITEM_SETTINGS);
      expect(settingsItem).toBeInTheDocument();

      fireEvent.click(settingsItem);
      expect(handleMenuClick).toHaveBeenCalledWith({ key: 'settings' });
    });

    it('should not fire click event on disabled item', () => {
      const handleDisabledClick = vi.fn();
      const items: DropdownItemType[] = [
        {
          key: 'disabled-item',
          label: 'Disabled Item',
          disabled: true,
          onClick: handleDisabledClick,
        },
      ];

      render(
        <Dropdown items={items}>
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );

      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.pointerDown(trigger);

      const item = screen.getByText('Disabled Item');
      fireEvent.click(item);
      expect(handleDisabledClick).not.toHaveBeenCalled();
    });

    it('should render recursive submenus', () => {
      const itemsWithSubmenu: DropdownItemType[] = [
        { key: 'profile', label: ITEM_PROFILE },
        {
          key: 'export',
          label: SUBMENU_LABEL,
          children: [{ key: 'export-pdf', label: ITEM_SUB_EXPORT }],
        },
      ];

      render(
        <Dropdown items={itemsWithSubmenu} open>
          <button type="button">{TRIGGER_TEXT}</button>
        </Dropdown>,
      );

      expect(screen.getByText(SUBMENU_LABEL)).toBeInTheDocument();
    });

    it('should export PopupMenu as alias of Dropdown', () => {
      expect(PopupMenu).toBe(Dropdown);
    });
  });
});
