import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stat, StatHeader, StatLabel, StatValue, StatTrend, StatDescription } from './stat';

const METRIC_LABEL = 'Total Revenue';
const METRIC_VALUE = '$45,231.89';
const TREND_UP_TEXT = '+20.1% from last month';
const TREND_DOWN_TEXT = '-4.5% compared to target';
const DESC_TEXT = 'Calculated from 1,234 paid invoices';

describe('Stat', () => {
  describe('UI', () => {
    it('should match snapshot in positive trend state', () => {
      const { asFragment } = render(
        <Stat>
          <StatHeader>
            <StatLabel>{METRIC_LABEL}</StatLabel>
          </StatHeader>
          <StatValue>{METRIC_VALUE}</StatValue>
          <StatTrend direction="up">{TREND_UP_TEXT}</StatTrend>
          <StatDescription>{DESC_TEXT}</StatDescription>
        </Stat>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with inverted negative trend', () => {
      const { asFragment } = render(
        <Stat bordered={false}>
          <StatHeader>
            <StatLabel>Error Rate</StatLabel>
          </StatHeader>
          <StatValue>0.08%</StatValue>
          <StatTrend direction="down" inverted>
            {TREND_DOWN_TEXT}
          </StatTrend>
        </Stat>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render label, value and trend text content correctly', () => {
      render(
        <Stat>
          <StatHeader>
            <StatLabel>{METRIC_LABEL}</StatLabel>
          </StatHeader>
          <StatValue>{METRIC_VALUE}</StatValue>
          <StatTrend direction="up">{TREND_UP_TEXT}</StatTrend>
          <StatDescription>{DESC_TEXT}</StatDescription>
        </Stat>,
      );

      expect(screen.getByText(METRIC_LABEL)).toBeInTheDocument();
      expect(screen.getByText(METRIC_VALUE)).toBeInTheDocument();
      expect(screen.getByText(TREND_UP_TEXT)).toBeInTheDocument();
      expect(screen.getByText(DESC_TEXT)).toBeInTheDocument();
    });

    it('should render appropriate direction attribute for trend', () => {
      render(
        <StatTrend direction="down" data-testid="test-trend">
          {TREND_DOWN_TEXT}
        </StatTrend>,
      );

      const trend = screen.getByTestId('test-trend');
      expect(trend).toHaveAttribute('data-direction', 'down');
    });
  });
});
