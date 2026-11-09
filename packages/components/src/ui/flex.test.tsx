import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flex, type FlexProps } from './flex';

// Scoped constants & fixtures
const TEST_ID = 'test-flex';
const CHILD_TEXT_1 = 'Item 1';
const CHILD_TEXT_2 = 'Item 2';

const createDefaultProps = (overrides?: Partial<FlexProps>): FlexProps => ({
  children: (
    <>
      <div>{CHILD_TEXT_1}</div>
      <div>{CHILD_TEXT_2}</div>
    </>
  ),
  ...overrides,
});

describe('Flex', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Flex {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with vertical direction', () => {
      const { asFragment } = render(<Flex {...createDefaultProps({ vertical: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with inline display', () => {
      const { asFragment } = render(<Flex {...createDefaultProps({ inline: true })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['xxs' as const],
      ['sm' as const],
      ['md' as const],
      ['lg' as const],
      ['xxl' as const],
    ])('should match snapshot for 7-tier gap size "%s"', (gap) => {
      const { asFragment } = render(<Flex {...createDefaultProps({ gap })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['start' as const],
      ['center' as const],
      ['end' as const],
      ['stretch' as const],
      ['baseline' as const],
    ])('should match snapshot for align "%s"', (align) => {
      const { asFragment } = render(<Flex {...createDefaultProps({ align })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['start' as const],
      ['center' as const],
      ['end' as const],
      ['space-between' as const],
      ['space-around' as const],
      ['space-evenly' as const],
    ])('should match snapshot for justify "%s"', (justify) => {
      const { asFragment } = render(<Flex {...createDefaultProps({ justify })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should set data-direction attribute to row by default and column when vertical is true', () => {
      const { rerender } = render(<Flex data-testid={TEST_ID} {...createDefaultProps()} />);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-direction', 'row');

      rerender(<Flex data-testid={TEST_ID} {...createDefaultProps({ vertical: true })} />);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-direction', 'column');
    });

    it('should handle type prop variants correctly', () => {
      const { rerender } = render(
        <Flex data-testid={TEST_ID} {...createDefaultProps({ type: 'inline' })} />,
      );
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-inline', 'true');

      rerender(<Flex data-testid={TEST_ID} {...createDefaultProps({ type: 'inline-flex' })} />);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-inline', 'true');

      rerender(<Flex data-testid={TEST_ID} {...createDefaultProps({ type: 'block' })} />);
      expect(screen.getByTestId(TEST_ID)).not.toHaveAttribute('data-inline');
    });

    it('should apply numeric and tuple gap via dynamic style', () => {
      const { rerender } = render(
        <Flex data-testid={TEST_ID} {...createDefaultProps({ gap: 20 })} />,
      );
      expect(screen.getByTestId(TEST_ID)).toHaveStyle({ gap: '20px' });

      rerender(<Flex data-testid={TEST_ID} {...createDefaultProps({ gap: [10, 25] })} />);
      expect(screen.getByTestId(TEST_ID)).toHaveStyle({ gap: '10px 25px' });
    });

    it('should apply flex item properties correctly', () => {
      const { rerender } = render(
        <Flex
          data-testid={TEST_ID}
          {...createDefaultProps({
            grow: true,
            shrink: false,
            basis: '200px',
            width: 'full',
            height: 48,
          })}
        />,
      );
      const element = screen.getByTestId(TEST_ID);
      expect(element).toHaveStyle({
        flexGrow: '1',
        flexShrink: '0',
        flexBasis: '200px',
        width: '100%',
        height: '48px',
      });

      rerender(<Flex data-testid={TEST_ID} {...createDefaultProps({ flex: '1 1 auto' })} />);
      expect(screen.getByTestId(TEST_ID)).toHaveStyle({ flex: '1 1 auto' });
    });

    it('should support polymorphic rendering via "as" and "asChild"', () => {
      const { rerender } = render(
        <Flex as="section" data-testid={TEST_ID} {...createDefaultProps()} />,
      );
      expect(screen.getByTestId(TEST_ID).tagName).toBe('SECTION');

      rerender(
        <Flex asChild data-testid={TEST_ID}>
          <nav data-testid={TEST_ID}>
            <div>{CHILD_TEXT_1}</div>
          </nav>
        </Flex>,
      );
      expect(screen.getByTestId(TEST_ID).tagName).toBe('NAV');
    });
  });
});
