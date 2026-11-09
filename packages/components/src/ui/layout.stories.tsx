import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './flex';
import { Row, Col } from './row-col';
import { Grid, GridItem } from './grid';
import { COMPONENT_SIZES, type ComponentSize } from '../theme';

const meta = {
  title: 'Layout/Flex & Grid System',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const boxStyle: React.CSSProperties = {
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)',
  padding: '12px 16px',
  borderRadius: '8px',
  textAlign: 'center',
  fontWeight: 600,
  fontSize: '0.875rem',
};

const boxSubtleStyle: React.CSSProperties = {
  backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
  color: 'var(--foreground)',
  border: '1px dashed var(--primary)',
  padding: '12px 16px',
  borderRadius: '8px',
  textAlign: 'center',
  fontWeight: 500,
  fontSize: '0.875rem',
};

export const FlexOverview: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Flex Horizontal with 7-Tier Gap Scale</h3>
        <p style={{ color: 'var(--muted-foreground)', margin: '0 0 1rem 0' }}>
          Supports universal sizes: <code>xxs</code>, <code>xs</code>, <code>sm</code>,{' '}
          <code>md</code>, <code>lg</code>, <code>xl</code>, <code>xxl</code>.
        </p>
        <Flex gap="md" align="center" justify="space-between" wrap>
          <div style={boxStyle}>Home</div>
          <div style={boxStyle}>Dashboard</div>
          <div style={boxStyle}>Analytics</div>
          <div style={boxStyle}>Settings</div>
        </Flex>
      </div>

      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Flex Vertical with Align Start</h3>
        <Flex vertical gap="sm" align="start">
          <div style={{ ...boxStyle, width: '240px' }}>Vertical Item 1</div>
          <div style={{ ...boxStyle, width: '320px' }}>Vertical Item 2</div>
          <div style={{ ...boxStyle, width: '180px' }}>Vertical Item 3</div>
        </Flex>
      </div>

      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Flex with Custom Tuple Gap [Y, X]</h3>
        <Flex gap={[12, 32]} wrap>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={boxStyle}>
              Tuple Item {i + 1}
            </div>
          ))}
        </Flex>
      </div>
    </div>
  ),
};

export const RowCol24Grid: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>24-Column Grid with Gutter [X, Y]</h3>
        <p style={{ color: 'var(--muted-foreground)', margin: '0 0 1rem 0' }}>
          Ant Design style 24-column layout with <code>gutter={[16, 16]}</code> and column spans.
        </p>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div style={boxStyle}>Col span 24 (100%)</div>
          </Col>
          <Col span={12}>
            <div style={boxStyle}>Col span 12 (50%)</div>
          </Col>
          <Col span={12}>
            <div style={boxStyle}>Col span 12 (50%)</div>
          </Col>
          <Col span={8}>
            <div style={boxStyle}>Col span 8 (33.3%)</div>
          </Col>
          <Col span={8}>
            <div style={boxStyle}>Col span 8 (33.3%)</div>
          </Col>
          <Col span={8}>
            <div style={boxStyle}>Col span 8 (33.3%)</div>
          </Col>
          <Col span={6}>
            <div style={boxStyle}>Col span 6 (25%)</div>
          </Col>
          <Col span={6}>
            <div style={boxStyle}>Col span 6 (25%)</div>
          </Col>
          <Col span={6}>
            <div style={boxStyle}>Col span 6 (25%)</div>
          </Col>
          <Col span={6}>
            <div style={boxStyle}>Col span 6 (25%)</div>
          </Col>
        </Row>
      </div>

      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Offset & Push / Pull</h3>
        <Row gutter={16}>
          <Col span={8}>
            <div style={boxStyle}>Col 8</div>
          </Col>
          <Col span={8} offset={8}>
            <div style={boxSubtleStyle}>Col 8, Offset 8</div>
          </Col>
        </Row>
      </div>

      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Responsive Breakpoints (xs, sm, md, lg)</h3>
        <p style={{ color: 'var(--muted-foreground)', margin: '0 0 1rem 0' }}>
          Resize your viewport:{' '}
          <code>
            xs={24} sm={12} md={8} lg={6}
          </code>
          .
        </p>
        <Row gutter={[16, 16]}>
          {Array.from({ length: 4 }, (_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <div style={boxStyle}>Responsive Card {i + 1}</div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  ),
};

export const ModernCSSGrid: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>SimpleGrid Auto-Responsive (minChildWidth)</h3>
        <p style={{ color: 'var(--muted-foreground)', margin: '0 0 1rem 0' }}>
          Inspired by Mantine & Chakra: <code>minChildWidth={220}</code> auto-fits columns without
          media queries.
        </p>
        <Grid minChildWidth={220} gap="md">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={boxStyle}>
              Auto Card {i + 1}
            </div>
          ))}
        </Grid>
      </div>

      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>CSS Grid with GridItem Spanning</h3>
        <Grid columns={4} gap="md">
          <GridItem colSpan={2}>
            <div style={{ ...boxStyle, height: '100%' }}>Col Span 2 (Header)</div>
          </GridItem>
          <GridItem colSpan={2}>
            <div style={{ ...boxStyle, height: '100%' }}>Col Span 2 (Sidebar)</div>
          </GridItem>
          <GridItem colSpan={4}>
            <div style={boxSubtleStyle}>Col Span 4 (Full Width Footer)</div>
          </GridItem>
        </Grid>
      </div>
    </div>
  ),
};
