import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import Typography, { Blockquote, Code, Link, Paragraph, Text, Title } from './index';

const meta = {
  title: 'Primitives/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Universal typography design system supporting 7-tier scale across Text/Link/Paragraph (8, 10, 12, 14, 16, 20, 24px) and Title (10, 12, 14, 16, 20, 24, 32px), with arbitrary custom sizes, line clamps, ellipsis, copy, inline editing, and comprehensive text decorations (line, style, color, thickness, offset).',
      },
    },
  },
} satisfies Meta;

export default meta;

const decorationArgs = {
  textDecoration: undefined,
  textDecorationLine: undefined,
  textDecorationStyle: undefined,
  textDecorationColor: undefined,
  textDecorationThickness: undefined,
  textUnderlineOffset: undefined,
};

const decorationArgTypes = {
  textDecoration: {
    control: 'text' as const,
    description:
      'Complete CSS text-decoration shorthand with typed autocomplete (e.g. "underline wavy #ef4444")',
  },
  textDecorationLine: {
    control: 'select' as const,
    options: [
      'none',
      'underline',
      'overline',
      'line-through',
      'underline line-through',
      'underline overline',
      'overline line-through',
      'blink',
    ],
    description: 'Line placement type (underline, overline, line-through)',
  },
  textDecorationStyle: {
    control: 'select' as const,
    options: ['solid', 'double', 'dotted', 'dashed', 'wavy'],
    description: 'Line stroke style',
  },
  textDecorationColor: {
    control: 'color' as const,
    description: 'Line stroke color',
  },
  textDecorationThickness: {
    control: 'text' as const,
    description: 'Stroke thickness (number in px or CSS unit like "2px", "from-font")',
  },
  textUnderlineOffset: {
    control: 'text' as const,
    description: 'Underline offset distance (number in px or CSS unit like "4px")',
  },
};

export const TitlePlayground: StoryObj<typeof Title> = {
  render: (args) => <Title {...args} />,
  args: {
    children: 'The Quick Brown Fox Jumps Over The Lazy Dog',
    level: 1,
    size: 'xxl',
    variant: 'default',
    tracking: 'normal',
    editable: false,
    copyable: false,
    customSize: undefined,
    lines: undefined,
    ...decorationArgs,
  },
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Heading level tag (h1 - h6)',
    },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier scale (10, 12, 14, 16, 20, 24, 32px)',
    },
    variant: {
      control: 'select',
      options: ['default', 'gradient', 'mono'],
      description: 'Visual appearance variant',
    },
    tracking: {
      control: 'select',
      options: ['tight', 'normal', 'wide'],
      description: 'Letter spacing',
    },
    editable: {
      control: 'boolean',
      description: 'Enables inline editing',
    },
    copyable: {
      control: 'boolean',
      description: 'Enables copy button',
    },
    customSize: {
      control: 'text',
      description: 'Override font size with any arbitrary value (e.g. 28 or "2.5rem")',
    },
    lines: {
      control: 'number',
      description: 'Max lines of text before truncating with ellipsis',
    },
    ...decorationArgTypes,
  },
};

export const ParagraphPlayground: StoryObj<typeof Paragraph> = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children:
      'VLRC Design System provides pre-compiled, type-safe primitives with zero runtime styling overhead. Every component adheres to accessibility standards, dark mode compatibility, and atomic styling guarantees.',
    size: 'md',
    variant: 'default',
    spacing: 'md',
    align: 'left',
    customSize: undefined,
    lines: undefined,
    ...decorationArgs,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier scale (8, 10, 12, 14, 16, 20, 24px)',
    },
    variant: {
      control: 'select',
      options: ['default', 'lead'],
      description: 'Paragraph variant',
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Bottom margin spacing tier',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    customSize: {
      control: 'text',
      description: 'Arbitrary font size',
    },
    lines: {
      control: 'number',
      description: 'Multi-line clamp rows',
    },
    ...decorationArgTypes,
  },
};

export const TextPlayground: StoryObj<typeof Text> = {
  render: (args) => <Text {...args} />,
  args: {
    children: 'Interactive Typography Text Primitive with Full Customization',
    type: 'default',
    size: 'md',
    weight: 'regular',
    strong: false,
    italic: false,
    underline: false,
    delete: false,
    keyboard: false,
    copyable: false,
    customSize: undefined,
    lines: undefined,
    ...decorationArgs,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'secondary', 'muted', 'success', 'warning', 'danger', 'info'],
      description: 'Semantic text color',
    },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier scale (8, 10, 12, 14, 16, 20, 24px)',
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
    },
    strong: { control: 'boolean' },
    italic: { control: 'boolean' },
    underline: { control: 'boolean' },
    delete: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    copyable: { control: 'boolean' },
    customSize: { control: 'text' },
    lines: { control: 'number' },
    ...decorationArgTypes,
  },
};

export const LinkPlayground: StoryObj<typeof Link> = {
  render: (args) => <Link {...args} />,
  args: {
    children: 'Explore Monorepo Documentation',
    href: 'https://vlrc.vn',
    size: 'md',
    external: true,
    underline: 'hover',
    disabled: false,
    customSize: undefined,
    ...decorationArgs,
  },
  argTypes: {
    href: { control: 'text' },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: '7-tier scale (8, 10, 12, 14, 16, 20, 24px)',
    },
    external: { control: 'boolean' },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'none'],
    },
    disabled: { control: 'boolean' },
    customSize: { control: 'text' },
    ...decorationArgTypes,
  },
};

export const BlockquotePlayground: StoryObj<typeof Blockquote> = {
  render: (args) => <Blockquote {...args} />,
  args: {
    children: 'Simplicity is prerequisite for reliability.',
    variant: 'default',
    cite: 'Edsger W. Dijkstra',
    ...decorationArgs,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'filled'],
    },
    cite: { control: 'text' },
    ...decorationArgTypes,
  },
};

export const CodePlayground: StoryObj<typeof Code> = {
  render: (args) => <Code {...args} />,
  args: {
    children: 'pnpm add @vlrc-fe/components',
    block: false,
    language: 'bash',
    copyable: true,
    ...decorationArgs,
  },
  argTypes: {
    block: { control: 'boolean' },
    language: { control: 'text' },
    copyable: { control: 'boolean' },
    ...decorationArgTypes,
  },
};

export const TitleSevenSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography.Title size="xxs">xxs (10px): Subtitle Caption</Typography.Title>
      <Typography.Title size="xs">xs (12px): Section Subheader</Typography.Title>
      <Typography.Title size="sm">sm (14px): Card Heading</Typography.Title>
      <Typography.Title size="md">md (16px): Group Title</Typography.Title>
      <Typography.Title size="lg">lg (20px): Section Header</Typography.Title>
      <Typography.Title size="xl">xl (24px): Page Title</Typography.Title>
      <Typography.Title size="xxl">xxl (32px): Hero Banner</Typography.Title>
    </div>
  ),
};

export const TextSevenSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Typography.Text size="xxs">xxs (8px): Fine print legal and micro copy</Typography.Text>
      <Typography.Text size="xs">xs (10px): Badges, tooltips and timestamps</Typography.Text>
      <Typography.Text size="sm">sm (12px): Secondary captions and meta tags</Typography.Text>
      <Typography.Text size="md">md (14px): Standard default UI body text</Typography.Text>
      <Typography.Text size="lg">lg (16px): Emphasized prominent text</Typography.Text>
      <Typography.Text size="xl">xl (20px): Sub-headline callout copy</Typography.Text>
      <Typography.Text size="xxl">xxl (24px): Featured value display</Typography.Text>
    </div>
  ),
};

export const TextDecorationsDemo: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 640 }}>
      <div>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: '0.75rem',
          }}
        >
          DECORATION STYLES (solid, double, dotted, dashed, wavy)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationStyle="solid"
            textDecorationColor="#3b82f6"
            textDecorationThickness={2}
          >
            Solid underline (#3b82f6, 2px)
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationStyle="double"
            textDecorationColor="#8b5cf6"
            textDecorationThickness={3}
          >
            Double underline (#8b5cf6, 3px)
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationStyle="dotted"
            textDecorationColor="#f59e0b"
            textDecorationThickness={2}
          >
            Dotted underline (#f59e0b, 2px)
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationStyle="dashed"
            textDecorationColor="#10b981"
            textDecorationThickness={2}
          >
            Dashed underline (#10b981, 2px)
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationStyle="wavy"
            textDecorationColor="#ef4444"
            textDecorationThickness={2}
          >
            Wavy underline (#ef4444, 2px)
          </Typography.Text>
        </div>
      </div>

      <div>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: '0.75rem',
          }}
        >
          LINE PLACEMENTS (underline, overline, line-through, combined)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Typography.Text textDecorationLine="underline">Standard Underline</Typography.Text>
          <Typography.Text textDecorationLine="overline">Overline decoration</Typography.Text>
          <Typography.Text textDecorationLine="line-through" textDecorationColor="#ef4444">
            Strike-through deleted content
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline line-through"
            textDecorationColor="#8b5cf6"
          >
            Underline and Line-through combined
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline overline"
            textDecorationStyle="wavy"
            textDecorationColor="#3b82f6"
          >
            Underline and Overline wavy combined
          </Typography.Text>
        </div>
      </div>

      <div>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: '0.75rem',
          }}
        >
          THICKNESS & UNDERLINE OFFSET
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationThickness={1}
            textUnderlineOffset={2}
          >
            Offset 2px, Thickness 1px
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationThickness={2}
            textUnderlineOffset={4}
          >
            Offset 4px, Thickness 2px
          </Typography.Text>
          <Typography.Text
            textDecorationLine="underline"
            textDecorationThickness={4}
            textUnderlineOffset={8}
            textDecorationColor="#3b82f6"
          >
            Offset 8px, Thickness 4px (Primary Blue)
          </Typography.Text>
        </div>
      </div>

      <div>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            marginBottom: '0.75rem',
          }}
        >
          FULL SHORTHAND STRINGS (TYPED AUTOCOMPLETE)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Typography.Text textDecoration="underline wavy #ef4444">
            textDecoration="underline wavy #ef4444"
          </Typography.Text>
          <Typography.Text textDecoration="line-through 2px #6b7280">
            textDecoration="line-through 2px #6b7280"
          </Typography.Text>
          <Typography.Text textDecoration="overline underline dotted #8b5cf6">
            textDecoration="overline underline dotted #8b5cf6"
          </Typography.Text>
          <Typography.Title
            level={3}
            textDecoration="underline 3px wavy #3b82f6"
            textUnderlineOffset={6}
          >
            Title with Underline 3px Wavy (#3b82f6, Offset 6px)
          </Typography.Title>
        </div>
      </div>
    </div>
  ),
};

export const CustomSizeAndLineClamp: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 480 }}>
      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
          CUSTOM SIZE (28px) VIA customSize PROP
        </span>
        <Typography.Title customSize={28} variant="gradient">
          Arbitrary 28px Gradient Title
        </Typography.Title>
      </div>

      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
          LINE CLAMP (lines=2) WITH ELLIPSIS
        </span>
        <Typography.Paragraph lines={2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Typography.Paragraph>
      </div>

      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
          SINGLE LINE ELLIPSIS ON TEXT
        </span>
        <div style={{ width: 260, border: '1px dashed var(--border)', padding: '0.5rem' }}>
          <Typography.Text ellipsis>
            This very long text is truncated with a single ellipsis when exceeding container bounds.
          </Typography.Text>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveTitle: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography.Title level={3} copyable editable>
        Interactive Title Text
      </Typography.Title>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText('Interactive Title Text');
    await expect(title).toBeInTheDocument();
    const editBtn = canvas.getByRole('button', { name: /Edit title/i });
    await expect(editBtn).toBeInTheDocument();
    await userEvent.click(editBtn);
    const input = canvas.getByRole('textbox');
    await expect(input).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Title Value{enter}');
    await expect(canvas.getByText('Updated Title Value')).toBeInTheDocument();
  },
};
