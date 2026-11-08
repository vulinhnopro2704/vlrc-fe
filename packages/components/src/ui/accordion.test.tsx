import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

describe('Accordion', () => {
  describe('UI', () => {
    it('should match snapshot in default state', () => {
      const { asFragment } = render(
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Test Trigger</AccordionTrigger>
            <AccordionContent>Test Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Interactions', () => {
    it('should expand and collapse when clicked', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Toggle Panel</AccordionTrigger>
            <AccordionContent>Panel is now visible</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button', { name: /Toggle Panel/i });
      expect(trigger).toHaveAttribute('data-state', 'closed');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');
      expect(screen.getByText('Panel is now visible')).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });
  });
});
