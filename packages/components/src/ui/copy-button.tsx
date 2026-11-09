import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { Copy, Check } from 'lucide-react';
import { Button, type ButtonProps } from './button';
import { Text } from '../Typography/Text';

const styles = stylex.create({
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'transform, opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
  },
  iconSm: {
    width: '0.875rem',
    height: '0.875rem',
  },
  iconMd: {
    width: '1rem',
    height: '1rem',
  },
  iconLg: {
    width: '1.25rem',
    height: '1.25rem',
  },
  copiedIcon: {
    color: 'var(--success, #22c55e)',
  },
  label: {
    marginLeft: '0.5rem',
  },
});

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'onCopy'> {
  /** The text value to copy to clipboard */
  value: string;
  /** Timeout in ms before reset to non-copied state. Default 2000ms. */
  timeout?: number;
  /** Callback fired after value is copied */
  onCopy?: (value: string) => void;
  /** Whether to render label next to the icon */
  showLabel?: boolean;
  /** Label to display in default state */
  copyLabel?: string;
  /** Label to display in copied state */
  copiedLabel?: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      timeout = 2000,
      onCopy,
      showLabel = false,
      copyLabel = 'Copy',
      copiedLabel = 'Copied',
      variant = 'ghost',
      size = 'icon',
      children,
      sx,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (!navigator?.clipboard?.writeText) {
        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.(value);

        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, timeout);
      } catch {
        setCopied(false);
      }
    };

    const iconSizeStyle =
      size === 'sm' || size === 'xs'
        ? styles.iconSm
        : size === 'lg'
          ? styles.iconLg
          : styles.iconMd;

    const currentAriaLabel = ariaLabel ?? (copied ? 'Copied to clipboard' : 'Copy to clipboard');

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        onClick={handleCopy}
        aria-label={currentAriaLabel}
        data-slot="copy-button"
        data-copied={copied ? 'true' : 'false'}
        sx={sx}
        className={className}
        {...props}
      >
        <span {...stylex.props(styles.iconWrapper)}>
          {copied ? (
            <Check
              data-slot="copy-icon-check"
              {...stylex.props(iconSizeStyle, styles.copiedIcon)}
            />
          ) : (
            <Copy data-slot="copy-icon" {...stylex.props(iconSizeStyle)} />
          )}
        </span>

        {showLabel && (
          <Text as="span" size="sm" sx={[styles.label]}>
            {copied ? copiedLabel : copyLabel}
          </Text>
        )}

        {children}
      </Button>
    );
  },
);

CopyButton.displayName = 'CopyButton';
