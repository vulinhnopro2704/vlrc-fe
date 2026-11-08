import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Design System/Spacing & Tokens',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SPACING_SCALE = [
  {
    tier: 'xxs',
    rem: '0.25rem',
    px: '4px',
    desc: 'Double Extra Small (micro gaps, tight icon offsets)',
  },
  { tier: 'xs', rem: '0.5rem', px: '8px', desc: 'Extra Small (compact button gaps, inline chips)' },
  { tier: 'sm', rem: '0.75rem', px: '12px', desc: 'Small (form field gaps, card header padding)' },
  {
    tier: 'md',
    rem: '1.0rem',
    px: '16px',
    desc: 'Medium / Default (standard container padding & grid gap)',
  },
  { tier: 'lg', rem: '1.5rem', px: '24px', desc: 'Large (section gutters, card bodies)' },
  { tier: 'xl', rem: '2.0rem', px: '32px', desc: 'Extra Large (modal padding, layout gutters)' },
  { tier: 'xxl', rem: '3.0rem', px: '48px', desc: 'Double Extra Large (page section margins)' },
] as const;

export const SevenTierSpacingScale: Story = {
  render: () => (
    <div style={{ maxWidth: 700, fontFamily: 'inherit' }}>
      <h2 style={{ margin: '0 0 0.5rem 0' }}>VLRC 7-Tier Spacing & Sizing Scale</h2>
      <p style={{ margin: '0 0 1.5rem 0', color: 'var(--muted-foreground)' }}>
        Unified design system spacing tokens exported as <code>spacing</code>, <code>gaps</code>,
        and <code>gutters</code>.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {SPACING_SCALE.map(({ tier, rem, px, desc }) => (
          <div
            key={tier}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 100px 1fr',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--card)',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '0.25rem',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                {tier}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{rem}</span>
              <span
                style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginLeft: 6 }}
              >
                ({px})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  height: '1.25rem',
                  width: rem,
                  backgroundColor: 'var(--primary)',
                  borderRadius: 2,
                  opacity: 0.8,
                }}
              />
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                {desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
