import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Row, Col, Column, type RowProps, type ColProps } from './row-col';

// Scoped constants & fixtures
const ROW_TEST_ID = 'test-row';
const COL_TEST_ID_1 = 'test-col-1';
const COL_TEST_ID_2 = 'test-col-2';
const COL_TEXT_1 = 'Col 1';
const COL_TEXT_2 = 'Col 2';

const createDefaultRowProps = (overrides?: Partial<RowProps>): RowProps => ({
  children: (
    <>
      <Col span={12} data-testid={COL_TEST_ID_1}>
        {COL_TEXT_1}
      </Col>
      <Col span={12} data-testid={COL_TEST_ID_2}>
        {COL_TEXT_2}
      </Col>
    </>
  ),
  ...overrides,
});

describe('Row & Col', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Row {...createDefaultRowProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with single and tuple gutters', () => {
      const { asFragment } = render(<Row {...createDefaultRowProps({ gutter: ['sm', 'lg'] })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([['top' as const], ['middle' as const], ['bottom' as const], ['stretch' as const]])(
      'should match snapshot for row align "%s"',
      (align) => {
        const { asFragment } = render(<Row {...createDefaultRowProps({ align })} />);
        expect(asFragment()).toMatchSnapshot();
      },
    );

    it.each([
      ['start' as const],
      ['center' as const],
      ['end' as const],
      ['space-between' as const],
      ['space-around' as const],
    ])('should match snapshot for row justify "%s"', (justify) => {
      const { asFragment } = render(<Row {...createDefaultRowProps({ justify })} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      [24, 0],
      [12, 6],
      [8, 4],
      [6, 2],
    ])('should match snapshot for Col span %d and offset %d', (span, offset) => {
      const { asFragment } = render(
        <Row>
          <Col span={span} offset={offset}>
            {COL_TEXT_1}
          </Col>
        </Row>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should set gutter CSS custom properties on Row', () => {
      render(<Row data-testid={ROW_TEST_ID} {...createDefaultRowProps({ gutter: 16 })} />);
      const row = screen.getByTestId(ROW_TEST_ID);
      expect(row.style.getPropertyValue('--gutter-x')).toBe('16px');
      expect(row.style.getPropertyValue('--gutter-y')).toBe('0px');
    });

    it('should set tuple gutter CSS custom properties on Row', () => {
      render(<Row data-testid={ROW_TEST_ID} {...createDefaultRowProps({ gutter: [16, 24] })} />);
      const row = screen.getByTestId(ROW_TEST_ID);
      expect(row.style.getPropertyValue('--gutter-x')).toBe('16px');
      expect(row.style.getPropertyValue('--gutter-y')).toBe('24px');
    });

    it('should set span, offset, and flex on Col correctly', () => {
      render(
        <Row>
          <Col data-testid={COL_TEST_ID_1} span={8} offset={4} order={2} push={2} flex="100px">
            {COL_TEXT_1}
          </Col>
        </Row>,
      );
      const col = screen.getByTestId(COL_TEST_ID_1);
      expect(col).toHaveAttribute('data-span', '8');
      expect(col).toHaveAttribute('data-offset', '4');
      expect(col).toHaveStyle({
        order: '2',
        flex: '100px',
      });
    });

    it('should export Column as an alias for Col', () => {
      render(
        <Row>
          <Column data-testid={COL_TEST_ID_1} span={12}>
            {COL_TEXT_1}
          </Column>
        </Row>,
      );
      expect(screen.getByTestId(COL_TEST_ID_1)).toBeInTheDocument();
      expect(screen.getByTestId(COL_TEST_ID_1)).toHaveAttribute('data-span', '12');
    });

    it('should support polymorphic rendering via "as" and "asChild"', () => {
      render(
        <Row as="section" data-testid={ROW_TEST_ID}>
          <Col as="article" data-testid={COL_TEST_ID_1} span={24}>
            {COL_TEXT_1}
          </Col>
        </Row>,
      );
      expect(screen.getByTestId(ROW_TEST_ID).tagName).toBe('SECTION');
      expect(screen.getByTestId(COL_TEST_ID_1).tagName).toBe('ARTICLE');
    });
  });
});
