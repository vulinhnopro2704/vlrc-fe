import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  FileUpload as FileUploadRoot,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadClear,
  useFileUpload,
  createApiUploadHandler,
  createUploadThingUploadHandler,
  formatFileSize,
  type ApiStorageConfig,
  type UploadThingStorageConfig,
  type UploadHandler,
} from '../../ui/file-upload';
import { colors, radius } from '../../theme/tokens.stylex';
import { Icons } from '../../Icons';
import { Text } from '../../Typography';
import { Button } from '../../ui/button';
import { FieldError } from '../../ui/field';

const styles = stylex.create({
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  avatarDropzone: {
    position: 'relative',
    width: '8rem',
    height: '8rem',
    borderRadius: radius.full,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: 'hidden',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'border-color, background-color',
    transitionDuration: '200ms',
    ':hover': {
      borderColor: colors.primary,
    },
  },
  avatarItem: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    borderRadius: 0,
    borderWidth: 0,
    padding: 0,
  },
  avatarPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
    color: colors.primaryForeground,
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '200ms',
    ':hover': {
      opacity: 1,
    },
  },
  avatarPlaceholder: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    backgroundColor: colors.accent,
    color: colors.mutedForeground,
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
  },
  compactDropzone: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.75rem',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    transitionProperty: 'border-color, background-color',
    transitionDuration: '150ms',
    ':hover': {
      borderColor: colors.primary,
      backgroundColor: colors.accent,
    },
  },
  compactContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  iconCircle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: radius.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.mutedForeground,
    marginBottom: '0.25rem',
  },
  compactIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: radius.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.mutedForeground,
    flexShrink: 0,
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
    borderRadius: radius.sm,
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.destructive,
    },
  },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: radius.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    cursor: 'pointer',
    flexShrink: 0,
    transitionProperty: 'color, background-color',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.destructive,
    },
  },
  whiteText: {
    color: colors.primaryForeground,
  },
});

/**
 * Base shared properties for the `FileUpload` and `FormFileUpload` components.
 */
export type FileUploadBaseProps = {
  /**
   * Current value of the field.
   * - In manual mode: `File` or `File[]`.
   * - In auto mode: remote URL `string` or `string[]`.
   */
  value?: string | string[] | File | File[];
  /**
   * Callback fired when the value changes.
   */
  onChange?: (value: string | string[] | File | File[] | null) => void;
  /**
   * Maximum files selectable. Default is 1.
   * @default 1
   */
  maxFiles?: number;
  /**
   * Maximum allowed file size in bytes. Default is 5MB (5242880 bytes).
   * @default 5242880
   */
  maxSize?: number;
  /**
   * Minimum allowed file size in bytes.
   */
  minSize?: number;
  /**
   * Accepted MIME types or extensions (e.g., 'image/*', '.pdf').
   * @default "image/*"
   */
  accept?: string;
  /**
   * Whether to allow multiple file selection.
   * Defaults to `true` if `maxFiles > 1`, else `false`.
   */
  multiple?: boolean;
  /**
   * If true, the field will be disabled and non-interactive.
   */
  disabled?: boolean;
  /**
   * Additional CSS class name.
   */
  className?: string;
  /**
   * StyleX override styles.
   */
  sx?: stylex.StyleXStyles;
  /**
   * Visual presentation variant:
   * - `'default'`: Standard drag & drop zone with file list card.
   * - `'avatar'`: Circular profile avatar dropzone with hover action.
   * - `'compact'`: Low-profile horizontal row dropzone.
   * @default "default"
   */
  variant?: 'default' | 'avatar' | 'compact';
  /**
   * Custom title text displayed inside dropzone.
   */
  dropzoneTitle?: string;
  /**
   * Custom subtitle description displayed inside dropzone.
   */
  dropzoneSubtitle?: string;
  /**
   * Custom icon element rendered inside dropzone.
   */
  icon?: ReactNode;
  /**
   * Whether to display the uploaded file list below the dropzone.
   * @default true
   */
  showFileList?: boolean;
  /**
   * Whether to display upload progress bars.
   * @default true
   */
  showProgress?: boolean;
  /**
   * Whether to display file thumbnail or type preview icon.
   * @default true
   */
  showPreview?: boolean;
  /**
   * Whether to show a "Clear all" button when files are selected.
   * @default false
   */
  showClear?: boolean;
  /**
   * Single error message or error object to display.
   */
  error?: string | { message?: string } | null;
  /**
   * Array of errors to display via `<FieldError>`.
   */
  errors?: Array<{ message?: string } | undefined>;
  /**
   * Callback fired when a file is rejected during selection/drop (e.g. exceeds maxSize, invalid format).
   */
  onFileReject?: (file: File, message: string) => void;
  /**
   * Callback fired when valid files are accepted.
   */
  onAccept?: (files: File[]) => void;
  /**
   * If true, suppresses the internal `<FieldError>` rendering.
   * Useful when wrapped by FormBase which renders its own FieldError.
   * @default false
   */
  hideError?: boolean;
  /**
   * Whether the field is marked as invalid.
   */
  invalid?: boolean;
  /**
   * Accessibility attribute indicating the field has an error.
   */
  'aria-invalid'?: boolean | 'true' | 'false';
};

/**
 * Props for automatic upload mode.
 * When `autoUpload: true`, files are uploaded immediately upon selection
 * and `onChange` emits remote URL strings.
 */
export type FileUploadAutoProps = {
  /** Enables immediate upload when a file is selected. */
  autoUpload: true;
  /**
   * Storage backend strategy name or direct config.
   */
  storage?: 'api' | 'uploadthing' | 'custom';
  /**
   * Direct upload function for a single file returning its remote URL string.
   */
  uploadFile?: (file: File) => Promise<string>;
  /**
   * Custom backend API storage configuration (uses XMLHttpRequest for real-time progress).
   */
  apiConfig?: ApiStorageConfig;
  /**
   * UploadThing configuration for AWS S3 storage.
   */
  uploadThingConfig?: UploadThingStorageConfig;
  /**
   * Custom UploadHandler adapter.
   */
  uploadHandler?: UploadHandler;
};

/**
 * Props for manual upload mode (files kept as File objects for form submit).
 */
export type FileUploadManualProps = {
  autoUpload?: false;
  storage?: never;
  uploadFile?: never;
  apiConfig?: never;
  uploadThingConfig?: never;
  uploadHandler?: never;
};

export type FileUploadProps = FileUploadBaseProps & (FileUploadAutoProps | FileUploadManualProps);

type FileUploadSyncValue = string | string[] | File | File[] | null;

interface FileUploadSyncProps {
  onChange?: (value: FileUploadSyncValue) => void;
  autoUpload: boolean;
  maxFiles: number;
  onResetReject?: () => void;
}

/**
 * Internal synchronizer component that monitors file store mutations
 * and propagates updated file references or uploaded URL strings to onChange.
 */
function FileUploadSync({
  onChange,
  autoUpload,
  maxFiles,
  onResetReject,
}: FileUploadSyncProps): null {
  const store = useFileUpload((state) => state);
  const lastValueRef = useRef<FileUploadSyncValue>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (!onChange) return;

    const currentFiles = Array.from(store.files.values());

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (currentFiles.length === 0) {
        return;
      }
    }

    const newValue: FileUploadSyncValue = (() => {
      if (autoUpload) {
        const urls = currentFiles
          .filter((fs) => fs.status === 'success')
          .map((fs) => (fs.file as File & { uploadedUrl?: string }).uploadedUrl)
          .filter((u): u is string => Boolean(u));
        return maxFiles === 1 ? (urls.length > 0 ? urls[urls.length - 1] : null) : urls;
      }
      const files = currentFiles.map((fs) => fs.file);
      return maxFiles === 1 ? (files.length > 0 ? files[files.length - 1] : null) : files;
    })();

    const last = lastValueRef.current;
    const isEq = (() => {
      if (autoUpload) return JSON.stringify(last) === JSON.stringify(newValue);
      if (Array.isArray(newValue) && Array.isArray(last)) {
        return (
          newValue.length === last.length && newValue.every((f, i) => f === (last as File[])[i])
        );
      }
      return newValue === last;
    })();

    if (!isEq) {
      lastValueRef.current = newValue;
      onChange(newValue);
      onResetReject?.();
    }
  }, [store, autoUpload, maxFiles, onChange, onResetReject]);

  return null;
}

type ExtendedFile = File & { isUploadedUrl?: boolean; uploadedUrl?: string };

function urlToStubFile(url: string, accept = ''): ExtendedFile {
  const fileName = url.split('/').pop()?.split('?')[0] || 'file';
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
  };
  let type = ext && mimeTypes[ext];
  if (!type) {
    type = accept.includes('image') ? 'image/jpeg' : 'application/octet-stream';
  }
  const file = new File([''], fileName, { type }) as ExtendedFile;
  file.isUploadedUrl = true;
  file.uploadedUrl = url;
  return file;
}

function FileUploadItemsList({
  showPreview,
  showProgress,
  orientation = 'vertical',
  avatarImgSx,
  deleteBtnSx,
}: {
  showPreview: boolean;
  showProgress: boolean;
  orientation?: 'vertical' | 'horizontal';
  avatarImgSx: stylex.StyleXStyles;
  deleteBtnSx: stylex.StyleXStyles;
}) {
  const files = useFileUpload((state) =>
    Array.from(state.files.values()).map((fs) => fs.file as ExtendedFile),
  );

  if (files.length === 0) return null;

  return (
    <FileUploadList orientation={orientation}>
      {files.map((file, i) => (
        <FileUploadItem key={`${file.name}-${i}`} value={file}>
          {showPreview && (
            <FileUploadItemPreview
              render={(previewFile, fallback) => {
                const extended = previewFile as ExtendedFile;
                const url =
                  extended.uploadedUrl ||
                  (previewFile.type.startsWith('image/') &&
                  typeof URL !== 'undefined' &&
                  URL.createObjectURL
                    ? URL.createObjectURL(previewFile)
                    : null);

                if (url && previewFile.type.startsWith('image/')) {
                  return <img src={url} alt={previewFile.name} {...stylex.props(avatarImgSx)} />;
                }
                return fallback();
              }}
            />
          )}
          <FileUploadItemMetadata />
          {showProgress && <FileUploadItemProgress variant="bottom" />}
          <FileUploadItemDelete asChild>
            <Button variant="ghost" size="icon" aria-label={`Delete ${file.name}`} sx={deleteBtnSx}>
              <Icons.Trash2 size={orientation === 'horizontal' ? 15 : 16} />
            </Button>
          </FileUploadItemDelete>
        </FileUploadItem>
      ))}
    </FileUploadList>
  );
}

function FileUploadClearRow({
  clearBtnRowSx,
  clearBtnSx,
}: {
  clearBtnRowSx: stylex.StyleXStyles;
  clearBtnSx: stylex.StyleXStyles;
}) {
  const count = useFileUpload((state) => state.files.size);
  if (count === 0) return null;

  return (
    <div {...stylex.props(clearBtnRowSx)}>
      <FileUploadClear asChild>
        <button type="button" {...stylex.props(clearBtnSx)}>
          <Icons.Trash2 size={13} />
          Clear all
        </button>
      </FileUploadClear>
    </div>
  );
}

interface FileUploadAvatarRendererProps {
  showProgress: boolean;
  maxSize?: number;
  errorElem?: ReactNode;
}

/**
 * Dedicated renderer for circular profile avatar dropzones.
 */
function FileUploadAvatarRenderer({
  showProgress,
  maxSize,
  errorElem,
}: FileUploadAvatarRendererProps): ReactElement {
  const file = useFileUpload((state) => {
    const first = state.files.values().next();
    return first.done ? null : (first.value.file as ExtendedFile);
  });

  return (
    <div {...stylex.props(styles.avatarContainer)}>
      <FileUploadDropzone sx={styles.avatarDropzone}>
        {file ? (
          <FileUploadItem value={file} sx={styles.avatarItem}>
            <FileUploadItemPreview
              sx={styles.avatarPreview}
              render={(previewFile) => {
                const extended = previewFile as ExtendedFile;
                const url =
                  extended.uploadedUrl ||
                  (previewFile.type.startsWith('image/') &&
                  typeof URL !== 'undefined' &&
                  URL.createObjectURL
                    ? URL.createObjectURL(previewFile)
                    : null);

                if (url) {
                  return <img src={url} alt="Avatar" {...stylex.props(styles.avatarImg)} />;
                }
                return (
                  <div {...stylex.props(styles.avatarPlaceholder)}>
                    <Icons.Camera size={24} />
                    <Text size="xs" weight="medium">
                      Upload
                    </Text>
                  </div>
                );
              }}
            />
            <div {...stylex.props(styles.avatarOverlay)}>
              <Icons.Camera size={22} />
              <Text size="xs" weight="semibold" sx={styles.whiteText}>
                Change photo
              </Text>
            </div>
            {showProgress && <FileUploadItemProgress variant="fill" style={{ opacity: 0.5 }} />}
          </FileUploadItem>
        ) : (
          <div {...stylex.props(styles.avatarPlaceholder)}>
            <Icons.Camera size={24} />
            <Text size="xs" weight="medium">
              Upload
            </Text>
          </div>
        )}
      </FileUploadDropzone>
      {maxSize ? (
        <Text size="xs" type="muted">
          Max {formatFileSize(maxSize)}
        </Text>
      ) : null}
      {errorElem}
    </div>
  );
}

/**
 * Resolves an array of error objects from explicit errors, a single error,
 * or rejection error messages captured during file validation.
 *
 * @param explicitErrors Array of error objects passed via props
 * @param singleError Single error string or object passed via props
 * @param rejectMessages Rejection messages captured during file validation
 * @returns Array of errors formatted for FieldError, or undefined if none exist
 */
function resolveDisplayErrors(
  explicitErrors?: Array<{ message?: string } | undefined>,
  singleError?: string | { message?: string } | null,
  rejectMessages: string[] = [],
): Array<{ message?: string } | undefined> | undefined {
  if (explicitErrors && explicitErrors.length > 0) {
    return explicitErrors;
  }
  if (singleError) {
    return [typeof singleError === 'string' ? { message: singleError } : singleError];
  }
  if (rejectMessages.length > 0) {
    return rejectMessages.map((message) => ({ message }));
  }
  return undefined;
}

/**
 * Rich, accessible File Upload control styled with Meta StyleX.
 * Supports auto-upload via UploadThing (AWS S3) or custom HTTP APIs,
 * as well as manual deferred upload on form submission.
 */
export function FileUpload({
  value,
  onChange,
  autoUpload = false,
  uploadFile,
  apiConfig,
  uploadThingConfig,
  uploadHandler,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 5,
  minSize,
  accept = 'image/*',
  multiple,
  disabled,
  className,
  sx,
  variant = 'default',
  dropzoneTitle,
  dropzoneSubtitle,
  icon,
  showFileList = true,
  showProgress = true,
  showPreview = true,
  showClear = false,
  error,
  errors,
  onFileReject,
  onAccept,
  hideError = false,
  invalid,
  'aria-invalid': ariaInvalid,
}: FileUploadProps): ReactElement {
  const [rejectErrors, setRejectErrors] = useState<string[]>([]);

  const handleFileReject = useCallback(
    (file: File, message: string): void => {
      setRejectErrors((prev) => (prev.includes(message) ? prev : [...prev, message]));
      onFileReject?.(file, message);
    },
    [onFileReject],
  );

  const handleAccept = useCallback(
    (files: File[]): void => {
      setRejectErrors([]);
      onAccept?.(files);
    },
    [onAccept],
  );

  const handleResetReject = useCallback((): void => {
    setRejectErrors([]);
  }, []);

  useEffect(() => {
    setRejectErrors([]);
  }, [value]);

  const displayErrors = useMemo(
    () => resolveDisplayErrors(errors, error, rejectErrors),
    [errors, error, rejectErrors],
  );

  const errorElem =
    !hideError && displayErrors && displayErrors.length > 0 ? (
      <FieldError errors={displayErrors} />
    ) : null;

  const cachedStubsRef = useRef<Map<string, ExtendedFile>>(new Map());

  const mappedFiles: ExtendedFile[] = useMemo(() => {
    const valArray = Array.isArray(value) ? value : value ? [value] : [];
    return valArray.map((item) => {
      if (item instanceof File) return item as ExtendedFile;
      if (typeof item === 'string') {
        let stub = cachedStubsRef.current.get(item);
        if (!stub) {
          stub = urlToStubFile(item, accept);
          cachedStubsRef.current.set(item, stub);
        }
        return stub;
      }
      return item as ExtendedFile;
    });
  }, [value, accept]);

  const resolvedUploadHandler = useMemo<UploadHandler | null>(() => {
    if (uploadHandler) return uploadHandler;
    if (uploadThingConfig) return createUploadThingUploadHandler(uploadThingConfig);
    if (apiConfig) return createApiUploadHandler(apiConfig);
    return null;
  }, [uploadHandler, uploadThingConfig, apiConfig]);

  const handleUpload = async (
    filesToUpload: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    if (!autoUpload) {
      filesToUpload.forEach((f) => options.onSuccess(f));
      return;
    }

    if (resolvedUploadHandler) {
      try {
        const results = await resolvedUploadHandler(filesToUpload, {
          onProgress: options.onProgress,
          onSuccess: (file, result) => {
            (file as ExtendedFile).uploadedUrl = result.url;
            options.onSuccess(file);
          },
          onError: (file, error) => {
            options.onError(file, error);
          },
        });
        results.forEach((res, index) => {
          const file = filesToUpload[index];
          if (file) {
            (file as ExtendedFile).uploadedUrl = res.url;
          }
        });
      } catch {
        // Handled via onError callback
      }
      return;
    }

    if (uploadFile) {
      await Promise.all(
        filesToUpload.map(async (file) => {
          const extendedFile = file as ExtendedFile;
          if (extendedFile.isUploadedUrl) {
            options.onSuccess(file);
            return;
          }
          try {
            options.onProgress(file, 20);
            const url = await uploadFile(file);
            extendedFile.uploadedUrl = url;
            options.onProgress(file, 100);
            options.onSuccess(file);
          } catch (error: unknown) {
            options.onError(file, error instanceof Error ? error : new Error('Upload failed'));
          }
        }),
      );
      return;
    }

    console.warn('FileUpload: autoUpload is true but no upload handler or config was provided.');
    filesToUpload.forEach((f) => options.onError(f, new Error('Missing upload configuration')));
  };

  const defaultTitle = 'Drag & drop files here, or click to select';
  const defaultSubtitle = `${
    maxFiles > 1 ? `Up to ${maxFiles} files` : '1 file max'
  } ${maxSize ? `(Max ${formatFileSize(maxSize)})` : ''}`;

  const isMultiple = variant === 'avatar' ? false : (multiple ?? maxFiles > 1);

  const renderCompactVariant = () => (
    <>
      <FileUploadDropzone sx={styles.compactDropzone}>
        <div {...stylex.props(styles.compactIcon)}>{icon || <Icons.CloudUpload size={18} />}</div>
        <div {...stylex.props(styles.compactContent)}>
          <Text size="sm" weight="medium">
            {dropzoneTitle || 'Choose or drop files to upload'}
          </Text>
          <Text size="xs" type="muted">
            {dropzoneSubtitle || defaultSubtitle}
          </Text>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            Browse
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>

      {showClear && (
        <FileUploadClearRow clearBtnRowSx={styles.clearBtnRow} clearBtnSx={styles.clearBtn} />
      )}

      {showFileList && (
        <FileUploadItemsList
          showPreview={showPreview}
          showProgress={showProgress}
          orientation="horizontal"
          avatarImgSx={styles.avatarImg}
          deleteBtnSx={styles.deleteBtn}
        />
      )}

      {errorElem}
    </>
  );

  const renderDefaultVariant = () => (
    <>
      <FileUploadDropzone>
        <div {...stylex.props(styles.iconCircle)}>{icon || <Icons.CloudUpload size={20} />}</div>
        <Text size="md" weight="medium">
          {dropzoneTitle || defaultTitle}
        </Text>
        <Text size="xs" type="muted">
          {dropzoneSubtitle || defaultSubtitle}
        </Text>
      </FileUploadDropzone>

      {showClear && (
        <FileUploadClearRow clearBtnRowSx={styles.clearBtnRow} clearBtnSx={styles.clearBtn} />
      )}

      {showFileList && (
        <FileUploadItemsList
          showPreview={showPreview}
          showProgress={showProgress}
          orientation="vertical"
          avatarImgSx={styles.avatarImg}
          deleteBtnSx={styles.deleteBtn}
        />
      )}

      {errorElem}
    </>
  );

  return (
    <FileUploadRoot
      value={mappedFiles}
      maxFiles={variant === 'avatar' ? 1 : maxFiles}
      maxSize={maxSize}
      minSize={minSize}
      accept={accept}
      multiple={isMultiple}
      disabled={disabled}
      invalid={Boolean(invalid || ariaInvalid || (displayErrors && displayErrors.length > 0))}
      onUpload={handleUpload}
      onFileReject={handleFileReject}
      onAccept={handleAccept}
      className={className}
      sx={sx}
    >
      <FileUploadSync
        onChange={onChange}
        autoUpload={Boolean(autoUpload)}
        maxFiles={variant === 'avatar' ? 1 : maxFiles}
        onResetReject={handleResetReject}
      />
      {variant === 'avatar' ? (
        <FileUploadAvatarRenderer
          showProgress={showProgress}
          maxSize={maxSize}
          errorElem={errorElem}
        />
      ) : variant === 'compact' ? (
        renderCompactVariant()
      ) : (
        renderDefaultVariant()
      )}
    </FileUploadRoot>
  );
}
