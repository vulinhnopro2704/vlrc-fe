import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar, AvatarFallback, AvatarGroup } from './avatar';

const USER_1 = 'AB';
const USER_2 = 'CD';
const USER_3 = 'EF';
const USER_4 = 'GH';
const USER_5 = 'IJ';
const MAX_VISIBLE = 3;
const OVERFLOW_TEXT = '+2';

describe('Avatar', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(
        <Avatar>
          <AvatarFallback>{USER_1}</AvatarFallback>
        </Avatar>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['xxs' as const],
      ['xs' as const],
      ['sm' as const],
      ['md' as const],
      ['lg' as const],
      ['xl' as const],
      ['xxl' as const],
    ])('should match snapshot for size %s', (size) => {
      const { asFragment } = render(
        <Avatar size={size}>
          <AvatarFallback>{USER_1}</AvatarFallback>
        </Avatar>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot for AvatarGroup with max overflow', () => {
      const { asFragment } = render(
        <AvatarGroup max={MAX_VISIBLE}>
          <Avatar>
            <AvatarFallback>{USER_1}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_2}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_3}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_4}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_5}</AvatarFallback>
          </Avatar>
        </AvatarGroup>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render overflow avatar with correct count when exceeding max', () => {
      render(
        <AvatarGroup max={MAX_VISIBLE}>
          <Avatar>
            <AvatarFallback>{USER_1}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_2}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_3}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_4}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{USER_5}</AvatarFallback>
          </Avatar>
        </AvatarGroup>,
      );

      expect(screen.getByText(USER_1)).toBeInTheDocument();
      expect(screen.getByText(USER_2)).toBeInTheDocument();
      expect(screen.getByText(USER_3)).toBeInTheDocument();
      expect(screen.queryByText(USER_4)).not.toBeInTheDocument();
      expect(screen.queryByText(USER_5)).not.toBeInTheDocument();
      expect(screen.getByText(OVERFLOW_TEXT)).toBeInTheDocument();
    });

    it('should pass size context to child avatars in AvatarGroup', () => {
      render(
        <AvatarGroup size="lg" data-testid="group">
          <Avatar data-testid="avatar-child">
            <AvatarFallback>{USER_1}</AvatarFallback>
          </Avatar>
        </AvatarGroup>,
      );

      const avatar = screen.getByTestId('avatar-child');
      expect(avatar).toHaveAttribute('data-size', 'lg');
      expect(screen.getByTestId('group')).toHaveAttribute('role', 'group');
    });
  });
});
