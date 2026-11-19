import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadControls,
  SignaturePadUndo,
  SignaturePadRedo,
  SignaturePadClear,
} from './signature-pad';
import type { SignaturePadProps, SignaturePadStroke, SignaturePadAPI } from './signature-pad';

// Test constants
const PLACEHOLDER_TEXT = 'Please draw your signature';
const SAMPLE_STROKES: SignaturePadStroke[] = [
  {
    points: [
      { x: 10, y: 10, pressure: 0.5, time: 1000 },
      { x: 50, y: 50, pressure: 0.8, time: 1050 },
    ],
    color: '#000000',
    minWidth: 1.5,
    maxWidth: 3.5,
  },
];

const createDefaultProps = (overrides?: Partial<SignaturePadProps>): SignaturePadProps => ({
  color: '#000000',
  minWidth: 1.5,
  maxWidth: 3.5,
  ...overrides,
});

describe('SignaturePad', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement 2D context for jsdom
    const mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      strokeStyle: '#000000',
      lineWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    };

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);
    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock');
    HTMLCanvasElement.prototype.setPointerCapture = vi.fn();
    HTMLCanvasElement.prototype.releasePointerCapture = vi.fn();
    HTMLCanvasElement.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  });

  describe('UI', () => {
    it('should match snapshot in default empty state', () => {
      const { asFragment } = render(
        <SignaturePad {...createDefaultProps()}>
          <SignaturePadArea>
            <SignaturePadGuide />
            <SignaturePadPlaceholder>{PLACEHOLDER_TEXT}</SignaturePadPlaceholder>
          </SignaturePadArea>
          <SignaturePadControls>
            <SignaturePadUndo />
            <SignaturePadRedo />
            <SignaturePadClear />
          </SignaturePadControls>
        </SignaturePad>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with defaultValue strokes present', () => {
      const { asFragment } = render(
        <SignaturePad {...createDefaultProps({ defaultValue: SAMPLE_STROKES })}>
          <SignaturePadArea>
            <SignaturePadGuide />
            <SignaturePadPlaceholder>{PLACEHOLDER_TEXT}</SignaturePadPlaceholder>
          </SignaturePadArea>
          <SignaturePadControls>
            <SignaturePadUndo />
            <SignaturePadRedo />
            <SignaturePadClear />
          </SignaturePadControls>
        </SignaturePad>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(
        <SignaturePad {...createDefaultProps({ disabled: true })}>
          <SignaturePadArea />
        </SignaturePad>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when readOnly', () => {
      const { asFragment } = render(
        <SignaturePad {...createDefaultProps({ readOnly: true, defaultValue: SAMPLE_STROKES })}>
          <SignaturePadArea />
        </SignaturePad>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render hidden input when name prop is supplied', () => {
      const { container } = render(
        <SignaturePad name="user_signature" defaultValue={SAMPLE_STROKES}>
          <SignaturePadArea />
        </SignaturePad>,
      );

      const hiddenInput = container.querySelector('input[name="user_signature"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('type', 'hidden');
      expect(hiddenInput?.getAttribute('value')).toContain('<svg');
    });

    it('should hide placeholder when strokes exist', () => {
      render(
        <SignaturePad defaultValue={SAMPLE_STROKES}>
          <SignaturePadArea>
            <SignaturePadPlaceholder>{PLACEHOLDER_TEXT}</SignaturePadPlaceholder>
          </SignaturePadArea>
        </SignaturePad>,
      );

      expect(screen.queryByText(PLACEHOLDER_TEXT)).not.toBeInTheDocument();
    });

    it('should handle clear button click', async () => {
      const onValueChange = vi.fn();
      render(
        <SignaturePad defaultValue={SAMPLE_STROKES} onValueChange={onValueChange}>
          <SignaturePadArea>
            <SignaturePadPlaceholder>{PLACEHOLDER_TEXT}</SignaturePadPlaceholder>
          </SignaturePadArea>
          <SignaturePadControls>
            <SignaturePadClear />
          </SignaturePadControls>
        </SignaturePad>,
      );

      const clearBtn = screen.getByRole('button', { name: /clear signature/i });
      expect(clearBtn).not.toBeDisabled();

      await act(async () => {
        fireEvent.click(clearBtn);
      });

      expect(onValueChange).toHaveBeenCalledWith([]);
      expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument();
    });

    it('should handle undo button click', async () => {
      const onValueChange = vi.fn();
      render(
        <SignaturePad defaultValue={SAMPLE_STROKES} onValueChange={onValueChange}>
          <SignaturePadArea />
          <SignaturePadControls>
            <SignaturePadUndo />
          </SignaturePadControls>
        </SignaturePad>,
      );

      const undoBtn = screen.getByRole('button', { name: /undo stroke/i });
      expect(undoBtn).not.toBeDisabled();

      await act(async () => {
        fireEvent.click(undoBtn);
      });

      expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it('should expose imperative API via apiRef', () => {
      let api: SignaturePadAPI | null = null;
      render(
        <SignaturePad
          defaultValue={SAMPLE_STROKES}
          apiRef={(ref) => {
            api = ref;
          }}
        >
          <SignaturePadArea />
        </SignaturePad>,
      );

      expect(api).not.toBeNull();
      expect(api!.isEmpty()).toBe(false);
      expect(api!.toSVG()).toContain('<svg');
      expect(api!.toDataURL()).toContain('data:image/png;base64');

      act(() => {
        api!.clear();
      });
      expect(api!.isEmpty()).toBe(true);
    });
  });
});
