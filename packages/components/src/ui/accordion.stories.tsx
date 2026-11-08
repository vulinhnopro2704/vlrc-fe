import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import type { ComponentSize } from '../theme/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const meta = {
  title: 'Primitives/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier sizing scale (xxs to xxl, default md)',
    },
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    collapsible: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 440 }}>
      <Accordion type="single" collapsible defaultValue="item-1" size="md">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled with StyleX?</AccordionTrigger>
          <AccordionContent>
            Yes. It is fully compiled with Meta StyleX at build time with zero Tailwind
            dependencies.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It has smooth height transitions for open and close, and animated chevron rotation.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const SevenSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: 440 }}>
      {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as ComponentSize[]).map((size) => (
        <div key={size}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
            }}
          >
            Size: {size}
          </div>
          <Accordion type="single" collapsible defaultValue="item-1" size={size}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion item ({size.toUpperCase()})</AccordionTrigger>
              <AccordionContent>
                Demonstrating proportionate padding, font sizes, and chevron dimensions for size{' '}
                {size}.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div style={{ width: 440 }}>
      <Accordion type="single" collapsible size="md">
        <AccordionItem value="faq-1">
          <AccordionTrigger>Can I toggle this panel?</AccordionTrigger>
          <AccordionContent>
            Panel content successfully expanded upon user click or keyboard interaction.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Can I toggle this panel/i });
    await expect(trigger).toHaveAttribute('data-state', 'closed');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('data-state', 'open');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('data-state', 'closed');
  },
};
