import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadControls,
  SignaturePadUndo,
  SignaturePadRedo,
  SignaturePadClear,
  type SignaturePadAPI,
} from './signature-pad';
import { Button } from './button';
import { Box, VStack, HStack } from '../layout';
import { Text } from '../Typography';

const meta: Meta<typeof SignaturePad> = {
  title: 'Forms/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    minWidth: { control: 'number' },
    maxWidth: { control: 'number' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Default: Story = {
  render: (args) => (
    <Box style={{ width: 450 }}>
      <SignaturePad {...args}>
        <SignaturePadArea>
          <SignaturePadGuide />
          <SignaturePadPlaceholder>Sign here with mouse, finger, or pen</SignaturePadPlaceholder>
        </SignaturePadArea>
        <SignaturePadControls>
          <SignaturePadUndo />
          <SignaturePadRedo />
          <SignaturePadClear />
        </SignaturePadControls>
      </SignaturePad>
    </Box>
  ),
  args: {
    minWidth: 1.5,
    maxWidth: 3.5,
  },
};

export const ControlledWithExport: Story = {
  render: () => {
    const apiRef = useRef<SignaturePadAPI | null>(null);
    const [svgOutput, setSvgOutput] = useState('');

    const handleExport = () => {
      if (apiRef.current) {
        setSvgOutput(apiRef.current.toSVG());
      }
    };

    return (
      <VStack gap="md" style={{ width: 500 }}>
        <SignaturePad apiRef={apiRef}>
          <SignaturePadArea>
            <SignaturePadGuide />
            <SignaturePadPlaceholder>Draw signature to export SVG</SignaturePadPlaceholder>
          </SignaturePadArea>
          <SignaturePadControls>
            <SignaturePadUndo />
            <SignaturePadRedo />
            <SignaturePadClear />
          </SignaturePadControls>
        </SignaturePad>

        <HStack gap="sm">
          <Button onClick={handleExport} variant="outline" size="sm">
            Export SVG
          </Button>
        </HStack>

        {svgOutput && (
          <VStack gap="xs">
            <Text size="sm" weight="semibold">
              Exported SVG Preview:
            </Text>
            <Box
              style={{
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: 'var(--muted)',
              }}
              dangerouslySetInnerHTML={{ __html: svgOutput }}
            />
          </VStack>
        )}
      </VStack>
    );
  },
};

export const DisabledAndReadOnly: Story = {
  render: () => (
    <VStack gap="lg" style={{ width: 450 }}>
      <VStack gap="xs">
        <Text size="sm" weight="semibold">
          Disabled State:
        </Text>
        <SignaturePad disabled>
          <SignaturePadArea>
            <SignaturePadPlaceholder>Disabled signature pad</SignaturePadPlaceholder>
          </SignaturePadArea>
        </SignaturePad>
      </VStack>

      <VStack gap="xs">
        <Text size="sm" weight="semibold">
          Read-Only State:
        </Text>
        <SignaturePad readOnly>
          <SignaturePadArea>
            <SignaturePadPlaceholder>Read-only locked pad</SignaturePadPlaceholder>
          </SignaturePadArea>
        </SignaturePad>
      </VStack>
    </VStack>
  ),
};
