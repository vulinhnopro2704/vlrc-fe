import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { vi } from 'date-fns/locale';
import { Calendar } from './calendar';

const meta = {
  title: 'Primitives/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const WithDropdownCaption: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          locale={vi}
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2035, 11)}
        />
      </div>
    );
  },
};

export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from: Date | undefined; to?: Date | undefined }>({
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 5)),
    });
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
        <Calendar mode="range" selected={range} onSelect={setRange} />
      </div>
    );
  },
};

export const MultipleMonths: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from: Date | undefined; to?: Date | undefined }>({
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 10)),
    });
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
        <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />
      </div>
    );
  },
};

export const DisabledWeekends: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(d) => d.getDay() === 0 || d.getDay() === 6}
        />
      </div>
    );
  },
};

export const HiddenOutsideDays: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
        <Calendar mode="single" selected={date} onSelect={setDate} showOutsideDays={false} />
      </div>
    );
  },
};

export const CalendarSizes: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        {sizes.map((s) => (
          <div key={s} style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
              Size: {s.toUpperCase()}
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
              <Calendar
                size={s}
                mode="single"
                captionLayout="dropdown"
                selected={date}
                onSelect={setDate}
                locale={vi}
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
};
