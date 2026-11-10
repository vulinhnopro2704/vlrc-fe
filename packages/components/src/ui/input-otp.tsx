import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import type { ComponentSize } from '../theme/types';

const caretBlink = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0 },
});

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  slot: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: colors.background,
    color: colors.foreground,
    borderRadius: radii.md,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: '150ms',
    outline: 'none',
    userSelect: 'none',
    boxSizing: 'border-box',
    fontWeight: 600,
  },
  slotActive: {
    borderColor: colors.ring,
    boxShadow: '0 0 0 2px var(--ring)',
    zIndex: 1,
  },

  // 7-tier Slot Sizing
  slotXxs: {
    width: '1.5rem',
    height: '1.5rem',
    fontSize: '0.75rem',
    borderRadius: radii.sm,
  },
  slotXs: {
    width: '1.75rem',
    height: '1.75rem',
    fontSize: '0.8125rem',
    borderRadius: radii.sm,
  },
  slotSm: {
    width: '2rem',
    height: '2rem',
    fontSize: '0.875rem',
    borderRadius: radii.md,
  },
  slotMd: {
    width: '2.5rem',
    height: '2.5rem',
    fontSize: '1rem',
    borderRadius: radii.md,
  },
  slotLg: {
    width: '3rem',
    height: '3rem',
    fontSize: '1.125rem',
    borderRadius: radii.lg,
  },
  slotXl: {
    width: '3.5rem',
    height: '3.5rem',
    fontSize: '1.25rem',
    borderRadius: radii.lg,
  },
  slotXxl: {
    width: '4rem',
    height: '4rem',
    fontSize: '1.5rem',
    borderRadius: radii.xl,
  },

  caretContainer: {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caret: {
    width: 1.5,
    height: '50%',
    backgroundColor: colors.foreground,
    animationName: caretBlink,
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.mutedForeground,
  },
  separatorIcon: {
    width: 16,
    height: 16,
  },
});

const slotSizeStyles: Record<ComponentSize, stylex.StyleXStyles> = {
  xxs: styles.slotXxs,
  xs: styles.slotXs,
  sm: styles.slotSm,
  md: styles.slotMd,
  lg: styles.slotLg,
  xl: styles.slotXl,
  xxl: styles.slotXxl,
};

const InputOTPContext = React.createContext<{ size: ComponentSize }>({ size: 'md' });

export type InputOTPProps = {
  size?: ComponentSize;
  containerSx?: stylex.StyleXStyles;
  sx?: stylex.StyleXStyles;
} & (
  | (Omit<React.ComponentProps<typeof OTPInput>, 'size' | 'render'> & { render?: never })
  | (Omit<React.ComponentProps<typeof OTPInput>, 'size' | 'children'> & { children?: never })
);

function InputOTP({
  size = 'md',
  className,
  containerClassName,
  containerSx,
  sx,
  ...props
}: InputOTPProps) {
  const containerSxProps = stylex.props(styles.container, containerSx);
  const inputSxProps = stylex.props(sx);
  const mergedInputClassName = className
    ? `${inputSxProps.className || ''} ${className}`.trim()
    : inputSxProps.className;

  return (
    <InputOTPContext.Provider value={{ size }}>
      <OTPInput
        data-slot="input-otp"
        data-size={size}
        containerClassName={
          containerClassName
            ? `${containerSxProps.className || ''} ${containerClassName}`.trim()
            : containerSxProps.className
        }
        className={mergedInputClassName}
        {...(props as React.ComponentProps<typeof OTPInput>)}
      />
    </InputOTPContext.Provider>
  );
}

export interface InputOTPGroupProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function InputOTPGroup({ className, sx, ...props }: InputOTPGroupProps) {
  const sxProps = stylex.props(styles.group, sx);
  return (
    <div
      data-slot="input-otp-group"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends React.ComponentProps<'div'> {
  index: number;
  size?: ComponentSize;
  sx?: stylex.StyleXStyles;
}

function InputOTPSlot({ index, size: propSize, className, sx, ...props }: InputOTPSlotProps) {
  const context = React.useContext(InputOTPContext);
  const resolvedSize = propSize ?? context.size ?? 'md';
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  const sizeStyle = slotSizeStyles[resolvedSize] ?? styles.slotMd;
  const sxProps = stylex.props(styles.slot, sizeStyle, isActive && styles.slotActive, sx);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-size={resolvedSize}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div {...stylex.props(styles.caretContainer)}>
          <div {...stylex.props(styles.caret)} />
        </div>
      )}
    </div>
  );
}

export interface InputOTPSeparatorProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function InputOTPSeparator({ className, sx, ...props }: InputOTPSeparatorProps) {
  const sxProps = stylex.props(styles.separator, sx);
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    >
      <MinusIcon {...stylex.props(styles.separatorIcon)} />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
