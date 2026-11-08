'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { colors, radii } from '../theme/tokens.stylex';
import { Icons } from '../Icons';
import { Text } from '../Typography';
import { formatFileSize, type UploadHandler } from './file-upload-adapters';

export * from './file-upload-adapters';

const ROOT_NAME = 'FileUpload';
const DROPZONE_NAME = 'FileUploadDropzone';
const TRIGGER_NAME = 'FileUploadTrigger';
const LIST_NAME = 'FileUploadList';
const ITEM_NAME = 'FileUploadItem';
const ITEM_PREVIEW_NAME = 'FileUploadItemPreview';
const ITEM_METADATA_NAME = 'FileUploadItemMetadata';
const ITEM_PROGRESS_NAME = 'FileUploadItemProgress';
const ITEM_DELETE_NAME = 'FileUploadItemDelete';

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
  },
  dropzone: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: radii.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: '1.5rem',
    cursor: 'pointer',
    userSelect: 'none',
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: '200ms',
    outline: 'none',
    ':hover': {
      backgroundColor: colors.accent,
      borderColor: colors.primary,
    },
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: '0 0 0 2px var(--background), 0 0 0 4px var(--ring)',
    },
  },
  dropzoneDragging: {
    backgroundColor: colors.accent,
    borderColor: colors.primary,
    boxShadow: '0 0 0 2px var(--background), 0 0 0 4px var(--primary)',
  },
  dropzoneInvalid: {
    borderColor: colors.destructive,
    backgroundColor: 'color-mix(in srgb, var(--destructive) 5%, transparent)',
    boxShadow: '0 0 0 2px var(--background), 0 0 0 4px var(--destructive)',
  },
  dropzoneDisabled: {
    pointerEvents: 'none',
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  avatarDropzone: {
    position: 'relative',
    width: '8rem',
    height: '8rem',
    borderRadius: radii.full,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transitionProperty: 'border-color, background-color',
    transitionDuration: '200ms',
    padding: 0,
    ':hover': {
      borderColor: colors.primary,
    },
  },
  avatarOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    color: '#ffffff',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '200ms',
    ':hover': {
      opacity: 1,
    },
  },
  avatarItem: {
    width: '100%',
    height: '100%',
    padding: 0,
    borderWidth: 0,
  },
  avatarPreview: {
    width: '100%',
    height: '100%',
    borderRadius: radii.full,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  },
  listHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.cardForeground,
    padding: '0.625rem 0.75rem',
    overflow: 'hidden',
    transitionProperty: 'border-color, background-color',
    transitionDuration: '150ms',
  },
  itemPreview: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    minWidth: '2.5rem',
    borderRadius: radii.sm,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    overflow: 'hidden',
  },
  itemPreviewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemMetadata: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    gap: '0.125rem',
  },
  itemName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.foreground,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemSize: {
    fontSize: '0.75rem',
    color: colors.mutedForeground,
  },
  itemError: {
    fontSize: '0.75rem',
    color: colors.destructive,
  },
  itemDeleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: radii.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    cursor: 'pointer',
    padding: 0,
    transitionProperty: 'background-color, color',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.destructive,
    },
  },
  progressRoot: {
    position: 'relative',
    width: '100%',
    height: '4px',
    borderRadius: radii.full,
    backgroundColor: colors.muted,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    transitionProperty: 'width',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-in-out',
  },
  progressBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 0,
    height: '3px',
  },
  progressFill: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    borderRadius: 0,
    backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
    pointerEvents: 'none',
  },
  iconCircle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.mutedForeground,
  },
  dropzoneTitle: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.foreground,
    margin: 0,
  },
  dropzoneSubtitle: {
    fontSize: '0.75rem',
    color: colors.mutedForeground,
    margin: 0,
    textAlign: 'center',
  },
  whiteText: {
    color: '#ffffff',
  },
  compactDropzone: {
    padding: '0.75rem 1rem',
    flexDirection: 'row',
    gap: '0.75rem',
  },
  clearBtnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  clearBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: colors.mutedForeground,
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: radii.sm,
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.destructive,
    },
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

export interface FileState {
  file: File;
  progress: number;
  error?: string;
  status: 'idle' | 'uploading' | 'error' | 'success';
}

interface StoreState {
  files: Map<File, FileState>;
  dragOver: boolean;
  invalid: boolean;
}

type StoreAction =
  | { type: 'ADD_FILES'; files: File[] }
  | { type: 'SET_FILES'; files: File[] }
  | { type: 'SET_PROGRESS'; file: File; progress: number }
  | { type: 'SET_SUCCESS'; file: File }
  | { type: 'SET_ERROR'; file: File; error: string }
  | { type: 'REMOVE_FILE'; file: File }
  | { type: 'SET_DRAG_OVER'; dragOver: boolean }
  | { type: 'SET_INVALID'; invalid: boolean }
  | { type: 'CLEAR' };

export type FileUploadStore = {
  getState: () => StoreState;
  dispatch: (action: StoreAction) => void;
  subscribe: (listener: () => void) => () => void;
};

function createStore(
  listeners: Set<() => void>,
  files: Map<File, FileState>,
  urlCache: WeakMap<File, string>,
  invalid: boolean,
  onValueChange?: (files: File[]) => void,
): FileUploadStore {
  let state: StoreState = {
    files,
    dragOver: false,
    invalid: invalid,
  };

  function reducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
      case 'ADD_FILES': {
        for (const file of action.files) {
          files.set(file, {
            file,
            progress: 0,
            status: 'idle',
          });
        }
        if (onValueChange) {
          const fileList = Array.from(files.values()).map((fileState) => fileState.file);
          onValueChange(fileList);
        }
        return { ...state, files };
      }
      case 'SET_FILES': {
        const newFileSet = new Set(action.files);
        for (const existingFile of files.keys()) {
          if (!newFileSet.has(existingFile)) {
            files.delete(existingFile);
          }
        }
        for (const file of action.files) {
          const existingState = files.get(file);
          if (!existingState) {
            files.set(file, {
              file,
              progress: 0,
              status: 'idle',
            });
          }
        }
        return { ...state, files };
      }
      case 'SET_PROGRESS': {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: action.progress,
            status: 'uploading',
          });
        }
        return { ...state, files };
      }
      case 'SET_SUCCESS': {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: 100,
            status: 'success',
          });
        }
        return { ...state, files };
      }
      case 'SET_ERROR': {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            error: action.error,
            status: 'error',
          });
        }
        return { ...state, files };
      }
      case 'REMOVE_FILE': {
        if (urlCache) {
          const cachedUrl = urlCache.get(action.file);
          if (cachedUrl) {
            URL.revokeObjectURL(cachedUrl);
            urlCache.delete(action.file);
          }
        }
        files.delete(action.file);
        if (onValueChange) {
          const fileList = Array.from(files.values()).map((fileState) => fileState.file);
          onValueChange(fileList);
        }
        return { ...state, files };
      }
      case 'SET_DRAG_OVER': {
        return { ...state, dragOver: action.dragOver };
      }
      case 'SET_INVALID': {
        return { ...state, invalid: action.invalid };
      }
      case 'CLEAR': {
        for (const file of files.keys()) {
          if (urlCache) {
            const cachedUrl = urlCache.get(file);
            if (cachedUrl) {
              URL.revokeObjectURL(cachedUrl);
              urlCache.delete(file);
            }
          }
        }
        files.clear();
        if (onValueChange) {
          onValueChange([]);
        }
        return { ...state, files };
      }
      default:
        return state;
    }
  }

  function notify() {
    listeners.forEach((listener) => listener());
  }

  return {
    getState: () => state,
    dispatch: (action: StoreAction) => {
      state = reducer(state, action);
      notify();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

const StoreContext = React.createContext<FileUploadStore | null>(null);

function useStore<T>(selector: (state: StoreState) => T): T {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within FileUploadRoot');
  }

  const lastStateRef = React.useRef<StoreState | null>(null);
  const lastSelectedRef = React.useRef<T | undefined>(undefined);

  const getSnapshot = React.useCallback(() => {
    const currentState = store.getState();
    if (currentState === lastStateRef.current && lastSelectedRef.current !== undefined) {
      return lastSelectedRef.current;
    }
    const nextSelected = selector(currentState);
    lastStateRef.current = currentState;
    lastSelectedRef.current = nextSelected;
    return nextSelected;
  }, [store, selector]);

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useFileUpload<T>(selector: (state: StoreState) => T): T {
  return useStore(selector);
}

interface FileUploadContextValue {
  dropzoneId: string;
  inputId: string;
  listId: string;
  labelId: string;
  dir?: 'ltr' | 'rtl';
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  urlCache: WeakMap<File, string>;
  processFiles: (files: File[]) => Promise<void>;
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUploadContext(name: string) {
  const context = React.useContext(FileUploadContext);
  if (!context) {
    throw new Error(`${name} must be within ${ROOT_NAME}`);
  }
  return context;
}

export interface FileUploadRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue'
> {
  asChild?: boolean;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  onAccept?: (files: File[]) => void;
  onFileReject?: (file: File, message: string) => void;
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => Promise<void> | void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  invalid?: boolean;
  label?: string;
  dir?: 'ltr' | 'rtl';
  sx?: stylex.StyleXStyles;
}

function FileUploadRoot(props: FileUploadRootProps) {
  const {
    asChild,
    value,
    defaultValue,
    onValueChange,
    onAccept,
    onFileReject,
    onUpload,
    accept,
    maxFiles = 0,
    maxSize = Infinity,
    minSize = 0,
    multiple = false,
    disabled = false,
    name,
    required,
    invalid = false,
    label,
    dir = 'ltr',
    className,
    sx,
    children,
    ...rootProps
  } = props;

  const dropzoneId = React.useId();
  const inputId = React.useId();
  const listId = React.useId();
  const labelId = React.useId();

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listeners = React.useRef(new Set<() => void>()).current;
  const urlCache = React.useRef(new WeakMap<File, string>()).current;

  const initialFilesMap = React.useMemo(() => {
    const map = new Map<File, FileState>();
    const initialFiles = value ?? defaultValue ?? [];
    for (const file of initialFiles) {
      map.set(file, {
        file,
        progress: 0,
        status: 'idle',
      });
    }
    return map;
  }, []);

  const store = React.useMemo(
    () => createStore(listeners, initialFilesMap, urlCache, invalid, onValueChange),
    [],
  );

  React.useEffect(() => {
    if (value !== undefined) {
      store.dispatch({ type: 'SET_FILES', files: value });
    }
  }, [value, store]);

  React.useEffect(() => {
    store.dispatch({ type: 'SET_INVALID', invalid });
  }, [invalid, store]);

  const validateFile = React.useCallback(
    (file: File): string | null => {
      if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return fileName.endsWith(type);
          }
          if (type.endsWith('/*')) {
            const baseType = type.slice(0, -2);
            return fileType.startsWith(baseType);
          }
          return fileType === type;
        });

        if (!isAccepted) {
          return `File "${file.name}" is not an accepted format (${accept})`;
        }
      }

      if (file.size > maxSize) {
        return `File "${file.name}" exceeds maximum allowed size of ${formatFileSize(maxSize)}`;
      }

      if (file.size < minSize) {
        return `File "${file.name}" is smaller than minimum required size of ${formatFileSize(minSize)}`;
      }

      return null;
    },
    [accept, maxSize, minSize],
  );

  const processFiles = React.useCallback(
    async (rawFiles: File[]) => {
      if (disabled) return;

      const currentFiles = Array.from(store.getState().files.keys());
      const maxAllowed = multiple ? (maxFiles > 0 ? maxFiles : Infinity) : 1;
      const availableSlots = maxAllowed - currentFiles.length;

      if (availableSlots <= 0 && maxAllowed === 1) {
        store.dispatch({ type: 'CLEAR' });
      } else if (availableSlots <= 0) {
        onFileReject?.(rawFiles[0], `Maximum file limit (${maxFiles}) reached`);
        return;
      }

      const filesToConsider = multiple
        ? rawFiles.slice(0, availableSlots <= 0 ? 1 : availableSlots)
        : [rawFiles[0]];

      const validFiles: File[] = [];

      for (const file of filesToConsider) {
        const error = validateFile(file);
        if (error) {
          onFileReject?.(file, error);
        } else {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        store.dispatch({ type: 'ADD_FILES', files: validFiles });
        onAccept?.(validFiles);

        if (onUpload) {
          for (const file of validFiles) {
            store.dispatch({ type: 'SET_PROGRESS', file, progress: 0 });
          }

          try {
            await onUpload(validFiles, {
              onProgress: (file, progress) => {
                store.dispatch({ type: 'SET_PROGRESS', file, progress });
              },
              onSuccess: (file) => {
                store.dispatch({ type: 'SET_SUCCESS', file });
              },
              onError: (file, error) => {
                store.dispatch({ type: 'SET_ERROR', file, error: error.message });
              },
            });
          } catch {
            // Handled via onError callback
          }
        }
      }
    },
    [disabled, maxFiles, multiple, onAccept, onFileReject, onUpload, store, validateFile],
  );

  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      if (files.length > 0) {
        processFiles(files);
      }
      event.target.value = '';
    },
    [processFiles],
  );

  const contextValue = React.useMemo(
    () => ({
      dropzoneId,
      inputId,
      listId,
      labelId,
      dir,
      disabled,
      inputRef,
      urlCache,
      processFiles,
    }),
    [dropzoneId, inputId, listId, labelId, dir, disabled, urlCache, processFiles],
  );

  const RootPrimitive = asChild ? Slot : 'div';
  const sxProps = stylex.props(styles.root, sx);

  return (
    <StoreContext.Provider value={store}>
      <FileUploadContext.Provider value={contextValue}>
        <RootPrimitive
          data-disabled={disabled ? '' : undefined}
          data-slot="file-upload"
          dir={dir}
          {...rootProps}
          {...sxProps}
          className={
            className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className
          }
        >
          {children}
          <input
            type="file"
            id={inputId}
            aria-labelledby={labelId}
            aria-describedby={dropzoneId}
            ref={inputRef}
            tabIndex={-1}
            accept={accept}
            name={name}
            {...stylex.props(styles.srOnly)}
            disabled={disabled}
            multiple={multiple}
            required={required}
            onChange={onInputChange}
          />
          <span id={labelId} {...stylex.props(styles.srOnly)}>
            {label ?? 'File upload'}
          </span>
        </RootPrimitive>
      </FileUploadContext.Provider>
    </StoreContext.Provider>
  );
}

export interface FileUploadDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function FileUploadDropzone(props: FileUploadDropzoneProps) {
  const {
    asChild,
    className,
    sx,
    onClick: onClickProp,
    onDragOver: onDragOverProp,
    onDragEnter: onDragEnterProp,
    onDragLeave: onDragLeaveProp,
    onDrop: onDropProp,
    onKeyDown: onKeyDownProp,
    children,
    ...dropzoneProps
  } = props;

  const context = useFileUploadContext(DROPZONE_NAME);
  const store = React.useContext(StoreContext);
  const dragOver = useStore((state) => state.dragOver);
  const invalid = useStore((state) => state.invalid);

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClickProp?.(event);
      if (event.defaultPrevented) return;

      const target = event.target;
      const isFromTrigger =
        target instanceof HTMLElement && target.closest('[data-slot="file-upload-trigger"]');

      if (!isFromTrigger) {
        context.inputRef.current?.click();
      }
    },
    [context.inputRef, onClickProp],
  );

  const onDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragOverProp?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      store?.dispatch({ type: 'SET_DRAG_OVER', dragOver: true });
    },
    [store, onDragOverProp],
  );

  const onDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragEnterProp?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      store?.dispatch({ type: 'SET_DRAG_OVER', dragOver: true });
    },
    [store, onDragEnterProp],
  );

  const onDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragLeaveProp?.(event);
      if (event.defaultPrevented) return;

      const relatedTarget = event.relatedTarget;
      if (
        relatedTarget &&
        relatedTarget instanceof Node &&
        event.currentTarget.contains(relatedTarget)
      ) {
        return;
      }

      event.preventDefault();
      store?.dispatch({ type: 'SET_DRAG_OVER', dragOver: false });
    },
    [store, onDragLeaveProp],
  );

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDropProp?.(event);
      if (event.defaultPrevented) return;

      event.preventDefault();
      store?.dispatch({ type: 'SET_DRAG_OVER', dragOver: false });

      const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
      if (files.length === 0) return;

      context.processFiles(files);
    },
    [store, context.processFiles, onDropProp],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(event);
      if (!event.defaultPrevented && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        context.inputRef.current?.click();
      }
    },
    [context.inputRef, onKeyDownProp],
  );

  const DropzonePrimitive = asChild ? Slot : 'div';
  const sxProps = stylex.props(
    styles.dropzone,
    dragOver && styles.dropzoneDragging,
    invalid && styles.dropzoneInvalid,
    context.disabled && styles.dropzoneDisabled,
    sx,
  );

  return (
    <DropzonePrimitive
      role="region"
      id={context.dropzoneId}
      aria-controls={`${context.inputId} ${context.listId}`}
      aria-disabled={context.disabled}
      aria-invalid={invalid}
      data-disabled={context.disabled ? '' : undefined}
      data-dragging={dragOver ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      data-slot="file-upload-dropzone"
      tabIndex={context.disabled ? undefined : 0}
      {...dropzoneProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
    >
      {children}
    </DropzonePrimitive>
  );
}

export interface FileUploadTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function FileUploadTrigger(props: FileUploadTriggerProps) {
  const { asChild, onClick: onClickProp, className, sx, ...triggerProps } = props;
  const context = useFileUploadContext(TRIGGER_NAME);

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event);
      if (event.defaultPrevented) return;
      context.inputRef.current?.click();
    },
    [context.inputRef, onClickProp],
  );

  const TriggerPrimitive = asChild ? Slot : 'button';
  const sxProps = stylex.props(sx);

  return (
    <TriggerPrimitive
      type="button"
      aria-controls={context.inputId}
      data-disabled={context.disabled ? '' : undefined}
      data-slot="file-upload-trigger"
      disabled={context.disabled}
      {...triggerProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      onClick={onClick}
    />
  );
}

export interface FileUploadListProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  orientation?: 'vertical' | 'horizontal';
  sx?: stylex.StyleXStyles;
}

function FileUploadList(props: FileUploadListProps) {
  const { asChild, orientation = 'vertical', className, sx, children, ...listProps } = props;
  const context = useFileUploadContext(LIST_NAME);

  const ListPrimitive = asChild ? Slot : 'div';
  const sxProps = stylex.props(
    styles.list,
    orientation === 'horizontal' && styles.listHorizontal,
    sx,
  );

  return (
    <ListPrimitive
      id={context.listId}
      role="list"
      data-slot="file-upload-list"
      {...listProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      {children}
    </ListPrimitive>
  );
}

interface FileUploadItemContextValue {
  file: File;
  fileState?: FileState;
  statusId: string;
  nameId: string;
  sizeId: string;
}

const FileUploadItemContext = React.createContext<FileUploadItemContextValue | null>(null);

function useFileUploadItemContext(name: string) {
  const context = React.useContext(FileUploadItemContext);
  if (!context) {
    throw new Error(`${name} must be within ${ITEM_NAME}`);
  }
  return context;
}

export interface FileUploadItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  value: File;
  sx?: stylex.StyleXStyles;
}

function FileUploadItem(props: FileUploadItemProps) {
  const { asChild, value, className, sx, children, ...itemProps } = props;
  useFileUploadContext(ITEM_NAME);

  const files = useStore((state) => state.files);
  const fileState = files.get(value);

  const statusId = React.useId();
  const nameId = React.useId();
  const sizeId = React.useId();

  const contextValue = React.useMemo(
    () => ({
      file: value,
      fileState,
      statusId,
      nameId,
      sizeId,
    }),
    [value, fileState, statusId, nameId, sizeId],
  );

  const ItemPrimitive = asChild ? Slot : 'div';
  const sxProps = stylex.props(styles.item, sx);

  return (
    <FileUploadItemContext.Provider value={contextValue}>
      <ItemPrimitive
        role="listitem"
        data-slot="file-upload-item"
        data-status={fileState?.status || 'idle'}
        {...itemProps}
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      >
        {children}
      </ItemPrimitive>
    </FileUploadItemContext.Provider>
  );
}

export interface FileUploadItemPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  render?: (file: File, fallback: () => ReactNode) => ReactNode;
  sx?: stylex.StyleXStyles;
}

function FileUploadItemPreview(props: FileUploadItemPreviewProps) {
  const { asChild, render, className, sx, children, ...previewProps } = props;
  const context = useFileUploadContext(ITEM_PREVIEW_NAME);
  const itemContext = useFileUploadItemContext(ITEM_PREVIEW_NAME);

  const file = itemContext.file;
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const extended = file as File & { uploadedUrl?: string };
    if (extended.uploadedUrl && file.type.startsWith('image/')) {
      setObjectUrl(extended.uploadedUrl);
    } else if (
      file.type.startsWith('image/') &&
      typeof URL !== 'undefined' &&
      URL.createObjectURL
    ) {
      let url = context.urlCache.get(file);
      if (!url) {
        url = URL.createObjectURL(file);
        context.urlCache.set(file, url);
      }
      setObjectUrl(url);
    }
  }, [file, context.urlCache]);

  const defaultFallback = () => {
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type.startsWith('video/')) {
      return <Icons.FileVideoIcon size={20} />;
    }
    if (type.startsWith('audio/')) {
      return <Icons.FileAudioIcon size={20} />;
    }
    if (
      name.endsWith('.zip') ||
      name.endsWith('.tar') ||
      name.endsWith('.gz') ||
      name.endsWith('.rar')
    ) {
      return <Icons.FileArchiveIcon size={20} />;
    }
    if (
      name.endsWith('.js') ||
      name.endsWith('.ts') ||
      name.endsWith('.tsx') ||
      name.endsWith('.html') ||
      name.endsWith('.css') ||
      name.endsWith('.json')
    ) {
      return <Icons.FileCodeIcon size={20} />;
    }
    if (
      type.startsWith('text/') ||
      name.endsWith('.pdf') ||
      name.endsWith('.doc') ||
      name.endsWith('.docx')
    ) {
      return <Icons.FileTextIcon size={20} />;
    }
    return <Icons.FileIcon size={20} />;
  };

  const PreviewPrimitive = asChild ? Slot : 'div';
  const sxProps = stylex.props(styles.itemPreview, sx);

  return (
    <PreviewPrimitive
      data-slot="file-upload-item-preview"
      {...previewProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      {render ? (
        render(file, defaultFallback)
      ) : objectUrl ? (
        <img src={objectUrl} alt={file.name} {...stylex.props(styles.itemPreviewImg)} />
      ) : (
        children || defaultFallback()
      )}
    </PreviewPrimitive>
  );
}

export interface FileUploadItemMetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function FileUploadItemMetadata(props: FileUploadItemMetadataProps) {
  const { asChild, className, sx, children, ...metadataProps } = props;
  const itemContext = useFileUploadItemContext(ITEM_METADATA_NAME);
  const file = itemContext.file;
  const fileState = itemContext.fileState;

  const MetadataPrimitive = asChild ? Slot : 'div';
  const sxProps = stylex.props(styles.itemMetadata, sx);

  return (
    <MetadataPrimitive
      data-slot="file-upload-item-metadata"
      {...metadataProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      {children ? (
        children
      ) : (
        <>
          <Text
            id={itemContext.nameId}
            size="sm"
            weight="medium"
            ellipsis
            title={file.name}
            sx={styles.itemName}
          >
            {file.name}
          </Text>
          {fileState?.error ? (
            <Text size="xs" type="danger" sx={styles.itemError}>
              {fileState.error}
            </Text>
          ) : (
            <Text id={itemContext.sizeId} size="xs" type="muted" sx={styles.itemSize}>
              {formatFileSize(file.size)}
            </Text>
          )}
        </>
      )}
    </MetadataPrimitive>
  );
}

export interface FileUploadItemProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  variant?: 'linear' | 'bottom' | 'fill';
  sx?: stylex.StyleXStyles;
}

function FileUploadItemProgress(props: FileUploadItemProgressProps) {
  const { asChild, variant = 'linear', className, sx, ...progressProps } = props;
  const itemContext = useFileUploadItemContext(ITEM_PROGRESS_NAME);
  const progress = itemContext.fileState?.progress ?? 0;
  const status = itemContext.fileState?.status;

  if (status !== 'uploading' && variant === 'fill') {
    return null;
  }

  const ProgressPrimitive = asChild ? Slot : 'div';
  const sxProps = stylex.props(
    variant === 'fill'
      ? styles.progressFill
      : variant === 'bottom'
        ? [styles.progressRoot, styles.progressBottom]
        : styles.progressRoot,
    sx,
  );

  return (
    <ProgressPrimitive
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      data-slot="file-upload-item-progress"
      {...progressProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
    >
      {variant !== 'fill' && (
        <div
          {...stylex.props(styles.progressIndicator)}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      )}
    </ProgressPrimitive>
  );
}

export interface FileUploadItemDeleteProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function FileUploadItemDelete(props: FileUploadItemDeleteProps) {
  const { asChild, onClick: onClickProp, className, sx, children, ...deleteProps } = props;
  const store = React.useContext(StoreContext);
  const itemContext = useFileUploadItemContext(ITEM_DELETE_NAME);

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event);
      if (event.defaultPrevented) return;
      store?.dispatch({ type: 'REMOVE_FILE', file: itemContext.file });
    },
    [store, itemContext.file, onClickProp],
  );

  const DeletePrimitive = asChild ? Slot : 'button';
  const sxProps = stylex.props(styles.itemDeleteBtn, sx);

  return (
    <DeletePrimitive
      type="button"
      data-slot="file-upload-item-delete"
      aria-label={`Remove ${itemContext.file.name}`}
      {...deleteProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      onClick={onClick}
    >
      {children || <Icons.X size={15} />}
    </DeletePrimitive>
  );
}

export interface FileUploadClearProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  sx?: stylex.StyleXStyles;
}

function FileUploadClear(props: FileUploadClearProps) {
  const { asChild, onClick: onClickProp, className, sx, ...clearProps } = props;
  const store = React.useContext(StoreContext);

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event);
      if (event.defaultPrevented) return;
      store?.dispatch({ type: 'CLEAR' });
    },
    [store, onClickProp],
  );

  const ClearPrimitive = asChild ? Slot : 'button';
  const sxProps = stylex.props(sx);

  return (
    <ClearPrimitive
      type="button"
      data-slot="file-upload-clear"
      {...clearProps}
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      onClick={onClick}
    />
  );
}

// -------------------------------------------------------------------------
// Ready-to-use high-level composite: FileUploader
// -------------------------------------------------------------------------

export interface FileUploaderProps extends Omit<FileUploadRootProps, 'children'> {
  /** Visual display variant */
  variant?: 'default' | 'avatar' | 'compact';
  /** Custom title in the dropzone */
  dropzoneTitle?: string;
  /** Custom subtitle/description in the dropzone */
  dropzoneSubtitle?: string;
  /** Custom upload icon */
  icon?: ReactNode;
  /** Upload handler adapter (such as createApiUploadHandler or createUploadThingUploadHandler) */
  uploadHandler?: UploadHandler;
  /** Whether to display the uploaded file list. Defaults to true. */
  showFileList?: boolean;
  /** Whether to display upload progress bars. Defaults to true. */
  showProgress?: boolean;
  /** Whether to display file thumbnail/icon preview. Defaults to true. */
  showPreview?: boolean;
  /** Whether to show a clear all button when files are present. Defaults to false. */
  showClear?: boolean;
}

function FileUploader({
  variant = 'default',
  dropzoneTitle,
  dropzoneSubtitle,
  icon,
  uploadHandler,
  showFileList = true,
  showProgress = true,
  showPreview = true,
  showClear = false,
  onUpload: onUploadProp,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024,
  accept = 'image/*',
  value,
  onValueChange,
  sx,
  className,
  ...props
}: FileUploaderProps) {
  const [internalFiles, setInternalFiles] = React.useState<File[]>(value || []);
  const activeFiles = value !== undefined ? value : internalFiles;

  const handleValueChange = (newFiles: File[]) => {
    setInternalFiles(newFiles);
    onValueChange?.(newFiles);
  };

  const handleUpload = React.useCallback<NonNullable<FileUploadRootProps['onUpload']>>(
    async (files, options) => {
      if (onUploadProp) {
        return onUploadProp(files, options);
      }
      if (uploadHandler) {
        await uploadHandler(files, {
          onProgress: options.onProgress,
          onSuccess: (f) => options.onSuccess(f),
          onError: (f, err) => options.onError(f, err),
        });
      }
    },
    [onUploadProp, uploadHandler],
  );

  if (variant === 'avatar') {
    const singleFile = activeFiles[0];
    return (
      <FileUploadRoot
        value={activeFiles}
        onValueChange={handleValueChange}
        maxFiles={1}
        maxSize={maxSize}
        accept={accept}
        onUpload={handleUpload}
        sx={sx}
        className={className}
        {...props}
      >
        <FileUploadDropzone sx={styles.avatarDropzone}>
          {singleFile ? (
            <FileUploadItem value={singleFile} sx={styles.avatarItem}>
              <FileUploadItemPreview
                sx={styles.avatarPreview}
                render={(file) => {
                  const url = URL.createObjectURL(file);
                  return <img src={url} alt={file.name} {...stylex.props(styles.itemPreviewImg)} />;
                }}
              />
              <div {...stylex.props(styles.avatarOverlay)}>
                <Icons.Camera size={22} />
                <Text size="xs" weight="semibold" sx={styles.whiteText}>
                  Change
                </Text>
              </div>
              {showProgress && <FileUploadItemProgress variant="fill" />}
            </FileUploadItem>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Icons.Camera size={28} />
              <Text size="xs" type="muted" weight="medium">
                Upload photo
              </Text>
            </div>
          )}
        </FileUploadDropzone>
      </FileUploadRoot>
    );
  }

  if (variant === 'compact') {
    return (
      <FileUploadRoot
        value={activeFiles}
        onValueChange={handleValueChange}
        maxFiles={maxFiles}
        maxSize={maxSize}
        accept={accept}
        multiple={maxFiles > 1}
        onUpload={handleUpload}
        sx={sx}
        className={className}
        {...props}
      >
        <FileUploadDropzone sx={styles.compactDropzone}>
          <div {...stylex.props(styles.iconCircle)}>{icon || <Icons.CloudUpload size={18} />}</div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <Text size="sm" weight="medium">
              {dropzoneTitle || 'Choose or drop files to upload'}
            </Text>
            <Text size="xs" type="muted">
              {dropzoneSubtitle ||
                `${maxFiles > 1 ? `Up to ${maxFiles} files` : '1 file max'} ${
                  maxSize ? `(Max ${formatFileSize(maxSize)})` : ''
                }`}
            </Text>
          </div>
          <FileUploadTrigger asChild>
            <button
              type="button"
              style={{
                fontSize: '0.75rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Browse
            </button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        {showFileList && activeFiles.length > 0 && (
          <FileUploadList orientation="horizontal">
            {activeFiles.map((file, index) => (
              <FileUploadItem key={`${file.name}-${index}`} value={file}>
                {showPreview && <FileUploadItemPreview />}
                <FileUploadItemMetadata />
                {showProgress && <FileUploadItemProgress variant="bottom" />}
                <FileUploadItemDelete />
              </FileUploadItem>
            ))}
          </FileUploadList>
        )}
      </FileUploadRoot>
    );
  }

  const defaultTitle = 'Drag & drop files here, or click to browse';
  const defaultSubtitle = `${
    maxFiles > 1 ? `Up to ${maxFiles} files` : '1 file max'
  } ${maxSize ? `(Max ${formatFileSize(maxSize)})` : ''}`;

  return (
    <FileUploadRoot
      value={activeFiles}
      onValueChange={handleValueChange}
      maxFiles={maxFiles}
      maxSize={maxSize}
      accept={accept}
      multiple={maxFiles > 1}
      onUpload={handleUpload}
      sx={sx}
      className={className}
      {...props}
    >
      <FileUploadDropzone>
        <div {...stylex.props(styles.iconCircle)}>{icon || <Icons.CloudUpload size={20} />}</div>
        <Text size="md" weight="medium" sx={styles.dropzoneTitle}>
          {dropzoneTitle || defaultTitle}
        </Text>
        <Text size="xs" type="muted" sx={styles.dropzoneSubtitle}>
          {dropzoneSubtitle || defaultSubtitle}
        </Text>
      </FileUploadDropzone>

      {showClear && activeFiles.length > 0 && (
        <div {...stylex.props(styles.clearBtnRow)}>
          <FileUploadClear asChild>
            <button type="button" {...stylex.props(styles.clearBtn)}>
              <Icons.Trash2 size={13} />
              Clear all
            </button>
          </FileUploadClear>
        </div>
      )}

      {showFileList && activeFiles.length > 0 && (
        <FileUploadList>
          {activeFiles.map((file, index) => (
            <FileUploadItem key={`${file.name}-${index}`} value={file}>
              {showPreview && (
                <FileUploadItemPreview
                  render={(previewFile, fallback) => {
                    if (previewFile.type.startsWith('image/')) {
                      const url = URL.createObjectURL(previewFile);
                      return (
                        <img
                          src={url}
                          alt={previewFile.name}
                          {...stylex.props(styles.itemPreviewImg)}
                        />
                      );
                    }
                    return fallback();
                  }}
                />
              )}
              <FileUploadItemMetadata />
              {showProgress && <FileUploadItemProgress variant="bottom" />}
              <FileUploadItemDelete />
            </FileUploadItem>
          ))}
        </FileUploadList>
      )}
    </FileUploadRoot>
  );
}

export {
  FileUploadRoot as FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadClear,
  FileUploader,
};
