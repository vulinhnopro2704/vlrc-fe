import type { Meta, StoryObj } from '@storybook/react';
import { DollarSign, Users, Activity } from 'lucide-react';
import { Grid } from '../layout';
import {
  Stat,
  StatHeader,
  StatLabel,
  StatValue,
  StatTrend,
  StatDescription,
  StatIndicator,
} from './stat';

const meta: Meta<typeof Stat> = {
  title: 'Components/DataDisplay/Stat',
  component: Stat,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  render: () => (
    <Stat style={{ maxWidth: 320 }}>
      <StatHeader>
        <StatLabel>Total Revenue</StatLabel>
        <StatIndicator>
          <DollarSign size={18} />
        </StatIndicator>
      </StatHeader>
      <StatValue>$45,231.89</StatValue>
      <StatTrend direction="up">+20.1% from last month</StatTrend>
      <StatDescription>Includes all processed transactions</StatDescription>
    </Stat>
  ),
};

export const DashboardGrid: Story = {
  render: () => (
    <Grid columns={{ xs: 1, sm: 2, md: 3 }} gap="md">
      <Stat>
        <StatHeader>
          <StatLabel>Active Users</StatLabel>
          <StatIndicator>
            <Users size={18} />
          </StatIndicator>
        </StatHeader>
        <StatValue>+2,350</StatValue>
        <StatTrend direction="up">+180.1% from last month</StatTrend>
      </Stat>

      <Stat>
        <StatHeader>
          <StatLabel>Bounce Rate</StatLabel>
          <StatIndicator>
            <Activity size={18} />
          </StatIndicator>
        </StatHeader>
        <StatValue>24.5%</StatValue>
        <StatTrend direction="down" inverted>
          -3.2% vs last week (improved)
        </StatTrend>
      </Stat>

      <Stat>
        <StatHeader>
          <StatLabel>Server Response</StatLabel>
          <StatIndicator>
            <Activity size={18} />
          </StatIndicator>
        </StatHeader>
        <StatValue>142ms</StatValue>
        <StatTrend direction="neutral">0.0% no change</StatTrend>
      </Stat>
    </Grid>
  ),
};
