import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Typography, {
  Title,
  Paragraph,
  Text,
  Link,
  Blockquote,
  Code,
  TypographyWeightMap,
} from './index';

describe('Typography', () => {
  describe('Title', () => {
    it('should render default h1 tag with resolved xxl size', () => {
      render(<Title level={1}>Heading 1</Title>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Heading 1');
      expect(heading).toHaveAttribute('data-size', 'xxl');
    });

    it('should support explicit 7-tier size prop', () => {
      render(
        <Title level={3} size="sm">
          Heading 3 Small
        </Title>,
      );
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveAttribute('data-size', 'sm');
    });

    it('should support customSize style override', () => {
      render(<Title customSize={28}>Custom 28px Title</Title>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveStyle({ fontSize: '28px' });
    });

    it('should support polymorphic as prop', () => {
      render(
        <Title level={2} as="h4">
          Custom As Level
        </Title>,
      );
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
    });

    it('should support weight prop', () => {
      render(
        <Title level={2} weight="light">
          Light Title
        </Title>,
      );
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('data-weight', 'light');
    });
  });

  describe('Paragraph', () => {
    it('should render paragraph text with 7-tier size', () => {
      render(<Paragraph size="lg">Large paragraph text.</Paragraph>);
      const p = screen.getByText('Large paragraph text.');
      expect(p).toHaveAttribute('data-size', 'lg');
    });

    it('should support customSize and lines clamp', () => {
      render(
        <Paragraph customSize="18px" lines={3}>
          Multi-line paragraph.
        </Paragraph>,
      );
      const p = screen.getByText('Multi-line paragraph.');
      expect(p).toHaveStyle({ fontSize: '18px', WebkitLineClamp: '3' });
    });

    it('should support weight prop', () => {
      render(<Paragraph weight="semibold">Semibold Paragraph</Paragraph>);
      const p = screen.getByText('Semibold Paragraph');
      expect(p).toHaveAttribute('data-weight', 'semibold');
    });
  });

  describe('Text', () => {
    it('should render text with semantic type and 7-tier size', () => {
      render(
        <Text type="success" size="xs">
          Success text
        </Text>,
      );
      const el = screen.getByText('Success text');
      expect(el).toHaveAttribute('data-type', 'success');
      expect(el).toHaveAttribute('data-size', 'xs');
    });

    it('should render kbd element when keyboard prop is true', () => {
      render(<Text keyboard>Ctrl</Text>);
      expect(screen.getByText('Ctrl').tagName).toBe('KBD');
    });

    it('should render strong element when strong prop is true', () => {
      render(<Text strong>Bold text</Text>);
      expect(screen.getByText('Bold text').tagName).toBe('STRONG');
    });

    it('should support customSize and single ellipsis', () => {
      render(
        <Text customSize={22} ellipsis>
          Ellipsis text
        </Text>,
      );
      const el = screen.getByText('Ellipsis text');
      expect(el).toHaveStyle({ fontSize: '22px' });
    });

    it('should support full shorthand textDecoration', () => {
      render(<Text textDecoration="underline wavy #ef4444">Wavy text</Text>);
      const el = screen.getByText('Wavy text');
      expect(el).toHaveStyle({ textDecoration: 'underline wavy #ef4444' });
    });

    it('should support granular text decoration properties', () => {
      render(
        <Text
          textDecorationLine="underline"
          textDecorationStyle="dashed"
          textDecorationColor="#3b82f6"
          textDecorationThickness={2}
          textUnderlineOffset={4}
        >
          Granular decoration
        </Text>,
      );
      const el = screen.getByText('Granular decoration');
      expect(el).toHaveStyle({
        textDecorationLine: 'underline',
        textDecorationStyle: 'dashed',
        textDecorationColor: '#3b82f6',
        textDecorationThickness: '2px',
        textUnderlineOffset: '4px',
      });
    });

    it('should support weight prop', () => {
      render(<Text weight="black">Heavy black text</Text>);
      const el = screen.getByText('Heavy black text');
      expect(el).toHaveAttribute('data-weight', 'black');
    });
  });

  describe('Link', () => {
    it('should render anchor tag with 7-tier size', () => {
      render(
        <Link href="https://vlrc.vn" size="lg">
          VLRC
        </Link>,
      );
      const anchor = screen.getByRole('link', { name: /VLRC/i });
      expect(anchor).toHaveAttribute('href', 'https://vlrc.vn');
      expect(anchor).toHaveAttribute('data-size', 'lg');
    });

    it('should handle external link attributes', () => {
      render(
        <Link href="https://vlrc.vn" external>
          VLRC External
        </Link>,
      );
      const anchor = screen.getByRole('link', { name: /VLRC External/i });
      expect(anchor).toHaveAttribute('target', '_blank');
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should support weight prop', () => {
      render(
        <Link href="https://vlrc.vn" weight="bold">
          Bold Link
        </Link>,
      );
      const anchor = screen.getByRole('link', { name: /Bold Link/i });
      expect(anchor).toHaveAttribute('data-weight', 'bold');
    });
  });

  describe('Blockquote', () => {
    it('should render blockquote element', () => {
      render(<Blockquote>A famous quote.</Blockquote>);
      expect(screen.getByText('A famous quote.')).toBeInTheDocument();
    });

    it('should support weight prop', () => {
      render(<Blockquote weight="medium">Medium Quote</Blockquote>);
      const bq = screen.getByText('Medium Quote');
      expect(bq).toHaveAttribute('data-weight', 'medium');
    });
  });

  describe('Code', () => {
    it('should render inline code', () => {
      render(<Code>const x = 1;</Code>);
      expect(screen.getByText('const x = 1;').tagName).toBe('CODE');
    });

    it('should render preformatted block code', () => {
      render(
        <Code block language="ts">
          let a = 2;
        </Code>,
      );
      expect(screen.getByText('let a = 2;')).toBeInTheDocument();
      expect(screen.getByText('ts')).toBeInTheDocument();
    });

    it('should support weight prop on inline code', () => {
      render(<Code weight="semibold">const a = 1;</Code>);
      const code = screen.getByText('const a = 1;');
      expect(code).toHaveAttribute('data-weight', 'semibold');
    });

    it('should support weight prop on block code', () => {
      render(
        <Code block weight="bold" language="js">
          const b = 2;
        </Code>,
      );
      const pre = screen.getByText('const b = 2;').closest('pre');
      expect(pre).toHaveAttribute('data-weight', 'bold');
    });
  });

  describe('TypographyWeightMap', () => {
    it('should correctly map all semantic font weight names to numeric values', () => {
      expect(TypographyWeightMap.thin).toBe(100);
      expect(TypographyWeightMap['extra-light']).toBe(200);
      expect(TypographyWeightMap.extralight).toBe(200);
      expect(TypographyWeightMap.light).toBe(300);
      expect(TypographyWeightMap.normal).toBe(400);
      expect(TypographyWeightMap.regular).toBe(400);
      expect(TypographyWeightMap.medium).toBe(500);
      expect(TypographyWeightMap['semi-bold']).toBe(600);
      expect(TypographyWeightMap.semibold).toBe(600);
      expect(TypographyWeightMap.bold).toBe(700);
      expect(TypographyWeightMap['extra-bold']).toBe(800);
      expect(TypographyWeightMap.extrabold).toBe(800);
      expect(TypographyWeightMap.black).toBe(900);
    });
  });

  describe('Compound Typography', () => {
    it('should export all subcomponents via Typography object', () => {
      expect(Typography.Title).toBe(Title);
      expect(Typography.Paragraph).toBe(Paragraph);
      expect(Typography.Text).toBe(Text);
      expect(Typography.Link).toBe(Link);
      expect(Typography.Blockquote).toBe(Blockquote);
      expect(Typography.Code).toBe(Code);
    });
  });
});
