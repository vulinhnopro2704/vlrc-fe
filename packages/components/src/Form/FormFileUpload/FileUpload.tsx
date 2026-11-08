import * as React from 'react';
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
import { colors, radii } from '../../theme/tokens.stylex';
import { Icons } from '../../Icons';
import { Text } from '../../Typography';
import { Button } from '../../ui/button';

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
    borderRadius: radii.full,
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
    color: '#ffffff',
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
    borderRadius: radii.lg,
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
    borderRadius: radii.full,
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
    borderRadius: radii.full,
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
    borderRadius: radii.sm,
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
    borderRadius: radii.sm,
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
    color: '#ffffff',
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
  icon?: React.ReactNode;
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

function FileUploadSync({
  onChange,
  autoUpload,
  maxFiles,
}: {
  onChange?: (value: FileUploadSyncValue) => void;
  autoUpload: boolean;
  maxFiles: number;
}) {
  const store = useFileUpload((state) => state);
  const lastValueRef = React.useRef<FileUploadSyncValue>(null);
  const isFirstRenderRef = React.useRef(true);

  React.useEffect(() => {
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
    }
  }, [store, autoUpload, maxFiles, onChange]);

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

function FileUploadAvatarRenderer({
  showProgress,
  maxSize,
}: {
  showProgress: boolean;
  maxSize?: number;
}) {
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
    </div>
  );
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
}: FileUploadProps) {
  const cachedStubsRef = React.useRef<Map<string, ExtendedFile>>(new Map());

  const mappedFiles: ExtendedFile[] = React.useMemo(() => {
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

  const resolvedUploadHandler = React.useMemo<UploadHandler | null>(() => {
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
    </>
  );

  return (
    <FileUploadRoot
      value={mappedFiles}
      maxFiles={variant === 'avatar' ? 1 : maxFiles}
      maxSize={maxSize}
      accept={accept}
      multiple={isMultiple}
      disabled={disabled}
      onUpload={handleUpload}
      className={className}
      sx={sx}
    >
      <FileUploadSync
        onChange={onChange}
        autoUpload={Boolean(autoUpload)}
        maxFiles={variant === 'avatar' ? 1 : maxFiles}
      />
      {variant === 'avatar' ? (
        <FileUploadAvatarRenderer showProgress={showProgress} maxSize={maxSize} />
      ) : variant === 'compact' ? (
        renderCompactVariant()
      ) : (
        renderDefaultVariant()
      )}
    </FileUploadRoot>
  );
}
