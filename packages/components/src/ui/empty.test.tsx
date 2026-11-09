import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Empty, EmptyImage, EmptyTitle, EmptyDescription, EmptyActions } from './empty';
import { Button } from './button';

const TITLE_TEXT = 'No data available';
const DESC_TEXT = 'Create your first project to get started.';
const ACTION_BUTTON_TEXT = 'Create Project';

describe('Empty', () => {
  describe('UI', () => {
    it('should match snapshot with default shorthand props', () => {
      const { asFragment } = render(
        <Empty
          title={TITLE_TEXT}
          description={DESC_TEXT}
          action={<Button>{ACTION_BUTTON_TEXT}</Button>}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with compound subcomponents', () => {
      const { asFragment } = render(
        <Empty>
          <EmptyImage>
            <span data-testid="custom-illustration">SVG</span>
          </EmptyImage>
          <EmptyTitle>{TITLE_TEXT}</EmptyTitle>
          <EmptyDescription>{DESC_TEXT}</EmptyDescription>
          <EmptyActions>
            <Button variant="outline">{ACTION_BUTTON_TEXT}</Button>
          </EmptyActions>
        </Empty>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render title and description correctly', () => {
      render(<Empty title={TITLE_TEXT} description={DESC_TEXT} />);

      expect(screen.getByText(TITLE_TEXT)).toBeInTheDocument();
      expect(screen.getByText(DESC_TEXT)).toBeInTheDocument();
    });

    it('should handle action button click', () => {
      const onActionClick = vi.fn();
      render(
        <Empty
          title={TITLE_TEXT}
          action={<Button onClick={onActionClick}>{ACTION_BUTTON_TEXT}</Button>}
        />,
      );

      const button = screen.getByRole('button', { name: ACTION_BUTTON_TEXT });
      fireEvent.click(button);

      expect(onActionClick).toHaveBeenCalledTimes(1);
    });
  });
});
