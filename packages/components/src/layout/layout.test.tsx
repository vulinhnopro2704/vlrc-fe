import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Box, Container, Center, Stack, HStack, VStack, StackItem } from './index';

describe('Layout Components', () => {
  describe('Box', () => {
    it('should render default polymorphic div element', () => {
      render(<Box data-testid="test-box">Box Content</Box>);
      const el = screen.getByTestId('test-box');
      expect(el.tagName).toBe('DIV');
      expect(el).toHaveTextContent('Box Content');
    });

    it('should render custom polymorphic element via "as" prop', () => {
      render(
        <Box as="section" data-testid="test-box-section">
          Section Content
        </Box>,
      );
      const el = screen.getByTestId('test-box-section');
      expect(el.tagName).toBe('SECTION');
    });

    it('should apply padding and margin shorthands', () => {
      render(
        <Box p="md" m="sm" data-testid="test-box-spacing">
          Spaced
        </Box>,
      );
      const el = screen.getByTestId('test-box-spacing');
      expect(el).toBeInTheDocument();
    });
  });

  describe('Container', () => {
    it('should render with default size and gutter', () => {
      render(<Container data-testid="test-container">Container Content</Container>);
      const el = screen.getByTestId('test-container');
      expect(el).toHaveAttribute('data-slot', 'container');
      expect(el).toHaveAttribute('data-size', 'xl');
      expect(el).toHaveTextContent('Container Content');
    });

    it('should render custom container size', () => {
      render(
        <Container size="sm" data-testid="test-container-sm">
          Small Container
        </Container>,
      );
      const el = screen.getByTestId('test-container-sm');
      expect(el).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('Center', () => {
    it('should render children centered', () => {
      render(<Center data-testid="test-center">Centered Content</Center>);
      const el = screen.getByTestId('test-center');
      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Centered Content');
    });
  });

  describe('Stack & StackItem', () => {
    it('should render Stack with numeric gap and children', () => {
      render(
        <Stack gap={4} data-testid="test-stack">
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>,
      );
      const el = screen.getByTestId('test-stack');
      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Item 1');
      expect(el).toHaveTextContent('Item 2');
    });

    it('should render HStack and VStack with 7-tier gap strings', () => {
      render(
        <HStack gap="md" data-testid="test-hstack">
          <StackItem size="fill">Item A</StackItem>
          <StackItem size="static">Item B</StackItem>
        </HStack>,
      );
      const el = screen.getByTestId('test-hstack');
      expect(el).toBeInTheDocument();
      expect(el).toHaveTextContent('Item A');
      expect(el).toHaveTextContent('Item B');

      render(
        <VStack gap="sm" data-testid="test-vstack">
          <div>Vertical 1</div>
          <div>Vertical 2</div>
        </VStack>,
      );
      const vEl = screen.getByTestId('test-vstack');
      expect(vEl).toBeInTheDocument();
      expect(vEl).toHaveTextContent('Vertical 1');
    });
  });
});
