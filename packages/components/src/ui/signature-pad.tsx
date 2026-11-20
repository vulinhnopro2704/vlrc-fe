import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefCallback,
  type RefObject,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { Undo2, Redo2, RotateCcw } from 'lucide-react';
import { colors, radius, shadow, spacing } from '../theme/tokens.stylex';
import { Box } from '../layout/Box';
import { HStack } from '../layout/Stack';
import { Text } from '../Typography/Text';
import { Button, type ButtonProps } from './button';
import { cn } from '../utils';

export interface SignaturePoint {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

export interface SignaturePadStroke {
  points: SignaturePoint[];
  color?: string;
  minWidth?: number;
  maxWidth?: number;
}

export interface SignaturePadAPI {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  toSVG: () => string;
  toDataURL: (type?: string, quality?: number) => string;
  isEmpty: () => boolean;
  getStrokes: () => SignaturePadStroke[];
}

export type SignaturePointerType = 'mouse' | 'touch' | 'pen';
export type SignatureWidthSource = 'auto' | 'pressure' | 'speed';

interface SignaturePadContextValue {
  strokes: SignaturePadStroke[];
  currentPoints: SignaturePoint[];
  isEmpty: boolean;
  isDrawing: boolean;
  canUndo: boolean;
  canRedo: boolean;
  disabled: boolean;
  readOnly: boolean;
  color: string;
  minWidth: number;
  maxWidth: number;
  smoothing: number;
  widthSource: SignatureWidthSource;
  allowedPointers: SignaturePointerType[];
  clear: () => void;
  undo: () => void;
  redo: () => void;
  toSVG: () => string;
  toDataURL: (type?: string, quality?: number) => string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  startStroke: (point: SignaturePoint) => void;
  updateStroke: (point: SignaturePoint) => void;
  endStroke: () => void;
}

const SignaturePadContext = createContext<SignaturePadContextValue | null>(null);

export function useSignaturePad(): SignaturePadContextValue {
  const context = useContext(SignaturePadContext);
  if (!context) {
    throw new Error('useSignaturePad must be used within a SignaturePad');
  }
  return context;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    gap: spacing.xs,
  },
  rootDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  areaWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: '160px',
    height: '200px',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceDefault,
    overflow: 'hidden',
    touchAction: 'none',
    userSelect: 'none',
    boxSizing: 'border-box',
  },
  areaFocused: {
    outline: 'none',
    borderColor: colors.focusRing,
    boxShadow: shadow.ring,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
    touchAction: 'none',
  },
  guide: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    height: 1,
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    borderBottomColor: colors.borderMuted,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  guideSign: {
    position: 'absolute',
    left: 0,
    bottom: spacing['1'],
    pointerEvents: 'none',
  },
  placeholder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
});

function calculateDistance(p1: SignaturePoint, p2: SignaturePoint): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function calculateStrokeWidth(
  p1: SignaturePoint,
  p2: SignaturePoint,
  minWidth: number,
  maxWidth: number,
  widthSource: SignatureWidthSource,
): number {
  if (widthSource === 'pressure' && typeof p2.pressure === 'number' && p2.pressure > 0) {
    return minWidth + (maxWidth - minWidth) * p2.pressure;
  }

  if (widthSource === 'speed' || widthSource === 'auto') {
    if (p1.time && p2.time && p2.time > p1.time) {
      const distance = calculateDistance(p1, p2);
      const timeDelta = p2.time - p1.time;
      const speed = distance / timeDelta;
      // Faster drawing results in thinner strokes
      const factor = Math.max(0, Math.min(1, 1 - speed / 2.5));
      return minWidth + (maxWidth - minWidth) * factor;
    }
  }

  return (minWidth + maxWidth) / 2;
}

function strokeToSvgPath(stroke: SignaturePadStroke): string {
  const pts = stroke.points;
  if (pts.length === 0) return '';
  if (pts.length === 1) {
    return `M ${pts[0].x} ${pts[0].y} L ${pts[0].x + 0.1} ${pts[0].y + 0.1}`;
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return d;
}

export interface SignaturePadProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  value?: SignaturePadStroke[];
  defaultValue?: SignaturePadStroke[];
  onValueChange?: (strokes: SignaturePadStroke[]) => void;
  onStrokeStart?: (pointer: ReactPointerEvent) => void;
  onStrokeEnd?: (stroke: SignaturePadStroke) => void;
  apiRef?: MutableRefObject<SignaturePadAPI | null> | RefCallback<SignaturePadAPI | null>;
  color?: string;
  minWidth?: number;
  maxWidth?: number;
  smoothing?: number;
  widthSource?: SignatureWidthSource;
  allowedPointers?: SignaturePointerType[];
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function SignaturePad({
  value: controlledValue,
  defaultValue,
  onValueChange,
  onStrokeStart,
  onStrokeEnd,
  apiRef,
  color = 'currentColor',
  minWidth = 1.5,
  maxWidth = 3.5,
  smoothing = 0.5,
  widthSource = 'auto',
  allowedPointers = ['mouse', 'touch', 'pen'],
  disabled = false,
  readOnly = false,
  name,
  required = false,
  sx,
  className,
  ref,
  children,
  ...props
}: SignaturePadProps) {
  const isControlled = controlledValue !== undefined;
  const [internalStrokes, setInternalStrokes] = useState<SignaturePadStroke[]>(defaultValue || []);
  const strokes = isControlled ? controlledValue : internalStrokes;

  const [history, setHistory] = useState<SignaturePadStroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentPoints, setCurrentPoints] = useState<SignaturePoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const updateStrokes = useCallback(
    (newStrokes: SignaturePadStroke[]) => {
      if (!isControlled) {
        setInternalStrokes(newStrokes);
      }
      onValueChange?.(newStrokes);

      // Update undo/redo history
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, newStrokes];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [isControlled, historyIndex, onValueChange],
  );

  const clear = useCallback(() => {
    if (disabled || readOnly) return;
    updateStrokes([]);
  }, [disabled, readOnly, updateStrokes]);

  const undo = useCallback(() => {
    if (disabled || readOnly || strokes.length === 0) return;
    const nextStrokes = strokes.slice(0, -1);
    if (!isControlled) {
      setInternalStrokes(nextStrokes);
    }
    onValueChange?.(nextStrokes);
    setHistoryIndex((prev) => Math.max(-1, prev - 1));
  }, [disabled, readOnly, strokes, isControlled, onValueChange]);

  const redo = useCallback(() => {
    if (disabled || readOnly) return;
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextStrokes = history[nextIndex];
      if (nextStrokes) {
        if (!isControlled) {
          setInternalStrokes(nextStrokes);
        }
        onValueChange?.(nextStrokes);
        setHistoryIndex(nextIndex);
      }
    }
  }, [disabled, readOnly, historyIndex, history, isControlled, onValueChange]);

  const toSVG = useCallback((): string => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.clientWidth || 400 : 400;
    const height = canvas ? canvas.clientHeight || 200 : 200;

    const paths = strokes
      .map((stroke) => {
        const pathData = strokeToSvgPath(stroke);
        const strokeColor = stroke.color || 'currentColor';
        const strokeWidth = ((stroke.minWidth ?? minWidth) + (stroke.maxWidth ?? maxWidth)) / 2;
        return `<path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
      })
      .join('\n  ');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n  ${paths}\n</svg>`;
  }, [strokes, minWidth, maxWidth]);

  const toDataURL = useCallback((type = 'image/png', quality = 0.92): string => {
    if (!canvasRef.current) return '';
    return canvasRef.current.toDataURL(type, quality);
  }, []);

  const startStroke = useCallback(
    (point: SignaturePoint) => {
      if (disabled || readOnly) return;
      setIsDrawing(true);
      setCurrentPoints([point]);
    },
    [disabled, readOnly],
  );

  const updateStroke = useCallback(
    (point: SignaturePoint) => {
      if (!isDrawing || disabled || readOnly) return;
      setCurrentPoints((prev) => [...prev, point]);
    },
    [isDrawing, disabled, readOnly],
  );

  const endStroke = useCallback(() => {
    if (!isDrawing || disabled || readOnly) return;
    setIsDrawing(false);

    if (currentPoints.length > 0) {
      const newStroke: SignaturePadStroke = {
        points: currentPoints,
        color,
        minWidth,
        maxWidth,
      };
      const nextStrokes = [...strokes, newStroke];
      updateStrokes(nextStrokes);
      onStrokeEnd?.(newStroke);
    }
    setCurrentPoints([]);
  }, [
    isDrawing,
    disabled,
    readOnly,
    currentPoints,
    color,
    minWidth,
    maxWidth,
    strokes,
    updateStrokes,
    onStrokeEnd,
  ]);

  // Redraw canvas on stroke changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.clientWidth || 400;
    const height = rect.height || canvas.clientHeight || 200;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const renderStrokes = [...strokes];
    if (currentPoints.length > 0) {
      renderStrokes.push({
        points: currentPoints,
        color,
        minWidth,
        maxWidth,
      });
    }

    for (const stroke of renderStrokes) {
      const pts = stroke.points;
      if (pts.length === 0) continue;

      ctx.strokeStyle = stroke.color || color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, (stroke.minWidth ?? minWidth) / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color || color;
        ctx.fill();
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        const strokeW = calculateStrokeWidth(
          pts[i - 1],
          pts[i],
          stroke.minWidth ?? minWidth,
          stroke.maxWidth ?? maxWidth,
          widthSource,
        );
        ctx.lineWidth = strokeW;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xc, yc);
      }

      const last = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      ctx.lineWidth = calculateStrokeWidth(
        prev,
        last,
        stroke.minWidth ?? minWidth,
        stroke.maxWidth ?? maxWidth,
        widthSource,
      );
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }

    ctx.restore();
  }, [strokes, currentPoints, color, minWidth, maxWidth, widthSource]);

  const api = useMemo<SignaturePadAPI>(
    () => ({
      clear,
      undo,
      redo,
      toSVG,
      toDataURL,
      isEmpty: () => strokes.length === 0,
      getStrokes: () => strokes,
    }),
    [clear, undo, redo, toSVG, toDataURL, strokes],
  );

  useImperativeHandle(apiRef as any, () => api, [api]);

  const contextValue: SignaturePadContextValue = {
    strokes,
    currentPoints,
    isEmpty: strokes.length === 0 && currentPoints.length === 0,
    isDrawing,
    canUndo: strokes.length > 0,
    canRedo: historyIndex < history.length - 1,
    disabled,
    readOnly,
    color,
    minWidth,
    maxWidth,
    smoothing,
    widthSource,
    allowedPointers,
    clear,
    undo,
    redo,
    toSVG,
    toDataURL,
    canvasRef,
    startStroke,
    updateStroke,
    endStroke,
  };

  const sxProps = stylex.props(styles.root, disabled && styles.rootDisabled, sx);

  return (
    <SignaturePadContext.Provider value={contextValue}>
      <Box
        ref={ref}
        data-slot="signature-pad"
        data-disabled={disabled ? 'true' : undefined}
        data-readonly={readOnly ? 'true' : undefined}
        data-empty={strokes.length === 0 ? 'true' : 'false'}
        className={cn(sxProps.className, className)}
        style={sxProps.style}
        {...props}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={strokes.length > 0 ? toSVG() : ''}
            required={required}
          />
        )}
        {children}
      </Box>
    </SignaturePadContext.Provider>
  );
}

export interface SignaturePadAreaProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function SignaturePadArea({
  sx,
  className,
  children,
  ref,
  ...props
}: SignaturePadAreaProps) {
  const { canvasRef, allowedPointers, startStroke, updateStroke, endStroke, disabled, readOnly } =
    useSignaturePad();

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled || readOnly) return;
    if (!allowedPointers.includes(e.pointerType as SignaturePointerType)) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    startStroke({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure,
      time: Date.now(),
    });
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled || readOnly) return;
    if (!allowedPointers.includes(e.pointerType as SignaturePointerType)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    updateStroke({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure,
      time: Date.now(),
    });
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled || readOnly) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    endStroke();
  };

  const sxProps = stylex.props(styles.areaWrapper, sx);

  return (
    <Box
      ref={ref}
      data-slot="signature-pad-area"
      tabIndex={disabled ? -1 : 0}
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      <canvas
        ref={canvasRef}
        data-slot="signature-pad-canvas"
        {...stylex.props(styles.canvas)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {children}
    </Box>
  );
}

export interface SignaturePadGuideProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function SignaturePadGuide({
  sx,
  className,
  children,
  ref,
  ...props
}: SignaturePadGuideProps) {
  const sxProps = stylex.props(styles.guide, sx);

  return (
    <Box
      ref={ref}
      data-slot="signature-pad-guide"
      aria-hidden="true"
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      <Box data-slot="signature-pad-guide-sign" sx={styles.guideSign}>
        <Text size="xs" type="secondary">
          ✕
        </Text>
      </Box>
      {children}
    </Box>
  );
}

export interface SignaturePadPlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function SignaturePadPlaceholder({
  sx,
  className,
  children = 'Sign here',
  ref,
  ...props
}: SignaturePadPlaceholderProps) {
  const { isEmpty } = useSignaturePad();
  if (!isEmpty) return null;

  const sxProps = stylex.props(styles.placeholder, sx);

  return (
    <Box
      ref={ref}
      data-slot="signature-pad-placeholder"
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text size="sm" type="secondary">
          {children}
        </Text>
      ) : (
        children
      )}
    </Box>
  );
}

export interface SignaturePadControlsProps extends HTMLAttributes<HTMLDivElement> {
  sx?: stylex.StyleXStyles;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function SignaturePadControls({
  sx,
  className,
  children,
  ref,
  ...props
}: SignaturePadControlsProps) {
  const sxProps = stylex.props(styles.controls, sx);

  return (
    <HStack
      ref={ref as any}
      data-slot="signature-pad-controls"
      className={cn(sxProps.className, className)}
      style={sxProps.style}
      {...props}
    >
      {children}
    </HStack>
  );
}

export interface SignaturePadUndoProps extends Omit<ButtonProps, 'onClick'> {
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function SignaturePadUndo({
  variant = 'ghost',
  size = 'sm',
  children,
  disabled: buttonDisabled,
  ref,
  ...props
}: SignaturePadUndoProps) {
  const { undo, canUndo, disabled, readOnly } = useSignaturePad();
  const isButtonDisabled = buttonDisabled ?? (!canUndo || disabled || readOnly);

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      disabled={isButtonDisabled}
      onClick={undo}
      aria-label="Undo stroke"
      data-slot="signature-pad-undo"
      {...props}
    >
      {children || <Undo2 size={14} />}
    </Button>
  );
}

export interface SignaturePadRedoProps extends Omit<ButtonProps, 'onClick'> {
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function SignaturePadRedo({
  variant = 'ghost',
  size = 'sm',
  children,
  disabled: buttonDisabled,
  ref,
  ...props
}: SignaturePadRedoProps) {
  const { redo, canRedo, disabled, readOnly } = useSignaturePad();
  const isButtonDisabled = buttonDisabled ?? (!canRedo || disabled || readOnly);

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      disabled={isButtonDisabled}
      onClick={redo}
      aria-label="Redo stroke"
      data-slot="signature-pad-redo"
      {...props}
    >
      {children || <Redo2 size={14} />}
    </Button>
  );
}

export interface SignaturePadClearProps extends Omit<ButtonProps, 'onClick'> {
  sx?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function SignaturePadClear({
  variant = 'ghost',
  size = 'sm',
  children,
  disabled: buttonDisabled,
  ref,
  ...props
}: SignaturePadClearProps) {
  const { clear, isEmpty, disabled, readOnly } = useSignaturePad();
  const isButtonDisabled = buttonDisabled ?? (isEmpty || disabled || readOnly);

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      disabled={isButtonDisabled}
      onClick={clear}
      aria-label="Clear signature"
      data-slot="signature-pad-clear"
      {...props}
    >
      {children || (
        <HStack gap="xxs">
          <RotateCcw size={14} />
          <Text size="xs">Clear</Text>
        </HStack>
      )}
    </Button>
  );
}
