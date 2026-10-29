import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import type { CardProps } from './card';

const CARD_TITLE = 'Card Title';
const CARD_DESC = 'Card Description';
const CARD_BODY = 'Card Content Body';

const createDefaultProps = (overrides?: Partial<CardProps>): CardProps => ({
  children: (
    <>
      <CardHeader>
        <CardTitle>{CARD_TITLE}</CardTitle>
        <CardDescription>{CARD_DESC}</CardDescription>
      </CardHeader>
      <CardContent>{CARD_BODY}</CardContent>
      <CardFooter>Footer</CardFooter>
    </>
  ),
  ...overrides,
});

describe('Card', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(<Card {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['default' as const],
      ['glass' as const],
      ['glass-strong' as const],
      ['elevated' as const],
      ['elevated-glass' as const],
      ['auth' as const],
    ])('should match snapshot for %s variant', (variant) => {
      const { asFragment } = render(<Card {...createDefaultProps({ variant })} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
