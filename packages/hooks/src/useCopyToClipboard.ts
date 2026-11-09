import * as React from 'react';

export interface UseCopyToClipboardOptions {
  /** Delay in milliseconds before `copied` resets to false. Defaults to 2000. */
  timeout?: number;
  /** Callback fired after successful copy */
  onSuccess?: (text: string) => void;
  /** Callback fired when copying fails */
  onError?: (error: Error) => void;
}

export interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { timeout = 2000, onSuccess, onError } = options;
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const reset = React.useCallback(() => {
    clearTimer();
    setCopied(false);
  }, [clearTimer]);

  const copy = React.useCallback(
    async (text: string): Promise<boolean> => {
      clearTimer();

      if (!navigator?.clipboard?.writeText) {
        const error = new Error('Clipboard API is not available');
        onError?.(error);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onSuccess?.(text);

        if (timeout > 0) {
          timeoutRef.current = setTimeout(() => {
            setCopied(false);
            timeoutRef.current = null;
          }, timeout);
        }
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy text');
        setCopied(false);
        onError?.(error);
        return false;
      }
    },
    [clearTimer, timeout, onSuccess, onError],
  );

  return { copied, copy, reset };
}
