import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker, DateRangePicker } from './index';

const meta = {
  title: 'Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div style={{ width: 320 }}>
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="Select date"
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const WithInitialValue: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 10, 8));
    return (
      <div style={{ width: 320 }}>
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="Select date"
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [dates, setDates] = React.useState<[Date | undefined, Date | undefined]>([
      new Date(2026, 10, 5),
      new Date(2026, 10, 15),
    ]);
    return (
      <div style={{ width: 340 }}>
        <DateRangePicker
          value={dates}
          onChange={setDates}
          placeholder="Select date range"
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const DateTimePicker: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ width: 340 }}>
        <DatePicker
          value={date}
          onChange={setDate}
          showTime
          placeholder="Select date and time"
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const MonthPicker: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ width: 300 }}>
        <DatePicker
          pickerType="month"
          value={date}
          onChange={setDate}
          placeholder="Select month"
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const YearPicker: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ width: 300 }}>
        <DatePicker
          pickerType="year"
          value={date}
          onChange={setDate}
          placeholder="Select year"
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const TimePickerOnly: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ width: 300 }}>
        <DatePicker
          pickerType="time"
          value={date}
          onChange={setDate}
          placeholder="Select time"
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const tiers = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 340 }}>
        {tiers.map((size) => (
          <div key={size}>
            <span
              style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}
            >
              Size: {size.toUpperCase()}
            </span>
            <DatePicker size={size} value={date} onChange={setDate} width="full" />
          </div>
        ))}
      </div>
    );
  },
};

export const StatusStates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 320 }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Default</span>
          <DatePicker value={date} onChange={setDate} width="full" />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#eab308' }}>Warning</span>
          <DatePicker status="warning" value={date} onChange={setDate} width="full" />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--destructive)' }}>Error</span>
          <DatePicker status="error" value={date} onChange={setDate} width="full" />
        </div>
      </div>
    );
  },
};

export const DisabledDates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    // Disable past dates and weekends
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div style={{ width: 320 }}>
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="Chỉ chọn ngày trong tương lai"
          disabledDate={(d) => d < today || d.getDay() === 0 || d.getDay() === 6}
          allowClear
          width="full"
        />
      </div>
    );
  },
};

export const DisabledState: Story = {
  render: () => {
    return (
      <div style={{ width: 320 }}>
        <DatePicker
          value={new Date(2026, 10, 8)}
          disabled
          placeholder="Không thể chọn"
          width="full"
        />
      </div>
    );
  },
};
