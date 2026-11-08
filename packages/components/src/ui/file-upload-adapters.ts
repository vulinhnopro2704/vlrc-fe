import * as React from 'react';

/**
 * Metadata for a file that has been successfully uploaded to remote storage.
 */
export interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
  serverData?: unknown;
  [key: string]: unknown;
}

/**
 * Options passed to the upload execution callback.
 */
export interface UploadExecutionOptions {
  onProgress?: (file: File, progress: number) => void;
  onSuccess?: (file: File, result: UploadedFile) => void;
  onError?: (file: File, error: Error) => void;
  signal?: AbortSignal;
}

/**
 * An asynchronous function responsible for uploading an array of files.
 */
export type UploadHandler = (
  files: File[],
  options?: UploadExecutionOptions,
) => Promise<UploadedFile[]>;

/**
 * Formats a byte number into a human-readable file size string.
 * @example formatFileSize(1048576) => '1 MB'
 */
export function formatFileSize(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

/**
 * Configuration options for uploading files via a custom HTTP/REST API endpoint.
 */
export interface ApiStorageConfig {
  /**
   * The destination endpoint URL or a function returning the URL for each file.
   * @example '/api/v1/uploads'
   */
  endpoint: string | ((file: File) => string | Promise<string>);
  /**
   * HTTP method to use for uploading. Defaults to 'POST'.
   */
  method?: 'POST' | 'PUT' | 'PATCH';
  /**
   * Form-data field name containing the file binary. Defaults to 'file'.
   */
  fieldName?: string;
  /**
   * Custom HTTP request headers or a resolver function.
   */
  headers?:
    | Record<string, string>
    | ((file: File) => Record<string, string> | Promise<Record<string, string>>);
  /**
   * Extra form data or payload fields to append to the request.
   */
  extraBody?:
    | Record<string, unknown>
    | ((
        file: File,
      ) => Record<string, unknown> | FormData | Promise<Record<string, unknown> | FormData>);
  /**
   * Send cookies/credentials with the request.
   */
  withCredentials?: boolean;
  /**
   * Request timeout in milliseconds.
   */
  timeout?: number;
  /**
   * Custom parser function to extract the remote URL or UploadedFile from server response.
   */
  responseParser?: (
    response: unknown,
    file: File,
  ) => string | UploadedFile | Promise<string | UploadedFile>;
}

/**
 * Creates an `UploadHandler` targeting any custom backend API endpoint via XMLHttpRequest,
 * with real-time per-file progress events and abort signal support.
 */
export function createApiUploadHandler(config: ApiStorageConfig): UploadHandler {
  const {
    endpoint,
    method = 'POST',
    fieldName = 'file',
    headers: headersConfig,
    extraBody,
    withCredentials = false,
    timeout,
    responseParser,
  } = config;

  return async (files, options = {}) => {
    const uploadSingleFile = async (file: File): Promise<UploadedFile> => {
      return new Promise<UploadedFile>(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (options.signal) {
          if (options.signal.aborted) {
            return reject(new DOMException('Upload aborted', 'AbortError'));
          }
          options.signal.addEventListener('abort', () => {
            xhr.abort();
            reject(new DOMException('Upload aborted', 'AbortError'));
          });
        }

        const targetUrl = typeof endpoint === 'function' ? await endpoint(file) : endpoint;

        xhr.open(method, targetUrl, true);
        xhr.withCredentials = withCredentials;

        if (timeout) {
          xhr.timeout = timeout;
        }

        // Apply headers
        if (headersConfig) {
          const resolvedHeaders =
            typeof headersConfig === 'function' ? await headersConfig(file) : headersConfig;
          for (const [key, value] of Object.entries(resolvedHeaders)) {
            xhr.setRequestHeader(key, value);
          }
        }

        // Track real-time progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && options.onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            options.onProgress(file, percent);
          }
        };

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              let parsedData: unknown = xhr.responseText;
              try {
                parsedData = JSON.parse(xhr.responseText);
              } catch {
                // Not JSON, keep raw text
              }

              let result: UploadedFile;
              if (responseParser) {
                const parsed = await responseParser(parsedData, file);
                if (typeof parsed === 'string') {
                  result = {
                    key: file.name,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: parsed,
                    serverData: parsedData,
                  };
                } else {
                  result = parsed;
                }
              } else {
                // Default parser: look for common URL fields
                const dataObj =
                  typeof parsedData === 'object' && parsedData !== null
                    ? (parsedData as Record<string, unknown>)
                    : {};
                const innerData =
                  typeof dataObj.data === 'object' && dataObj.data !== null
                    ? (dataObj.data as Record<string, unknown>)
                    : {};

                const extractedUrl =
                  (dataObj.url as string) ||
                  (dataObj.fileUrl as string) ||
                  (dataObj.ufsUrl as string) ||
                  (innerData.url as string) ||
                  (innerData.fileUrl as string) ||
                  (typeof parsedData === 'string' &&
                  (parsedData.startsWith('http://') || parsedData.startsWith('https://'))
                    ? parsedData
                    : '');

                const extractedKey =
                  (dataObj.key as string) ||
                  (dataObj.id as string) ||
                  (innerData.key as string) ||
                  file.name;

                result = {
                  key: String(extractedKey),
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  url: extractedUrl,
                  serverData: parsedData,
                };
              }

              options.onProgress?.(file, 100);
              options.onSuccess?.(file, result);
              resolve(result);
            } catch (err) {
              const error =
                err instanceof Error ? err : new Error('Failed to parse upload response');
              options.onError?.(file, error);
              reject(error);
            }
          } else {
            const error = new Error(
              `Upload failed with status ${xhr.status}: ${xhr.statusText || 'Server Error'}`,
            );
            options.onError?.(file, error);
            reject(error);
          }
        };

        xhr.onerror = () => {
          const error = new Error('Network error during file upload');
          options.onError?.(file, error);
          reject(error);
        };

        xhr.ontimeout = () => {
          const error = new Error('File upload timed out');
          options.onError?.(file, error);
          reject(error);
        };

        // Prepare body
        let body: FormData | Document | XMLHttpRequestBodyInit | null = null;
        if (extraBody) {
          const resolvedExtra = typeof extraBody === 'function' ? await extraBody(file) : extraBody;
          if (resolvedExtra instanceof FormData) {
            resolvedExtra.append(fieldName, file);
            body = resolvedExtra;
          } else {
            const formData = new FormData();
            for (const [key, value] of Object.entries(resolvedExtra)) {
              if (value !== undefined && value !== null) {
                formData.append(key, String(value));
              }
            }
            formData.append(fieldName, file);
            body = formData;
          }
        } else {
          const formData = new FormData();
          formData.append(fieldName, file);
          body = formData;
        }

        xhr.send(body);
      });
    };

    return Promise.all(files.map((file) => uploadSingleFile(file)));
  };
}

/**
 * Configuration options for uploading via UploadThing (backing AWS S3).
 */
export interface UploadThingStorageConfig {
  /**
   * The `uploadFiles` helper generated from `@uploadthing/react` via `generateReactHelpers<OurFileRouter>()`.
   */
  uploadFiles: (
    endpoint: string,
    options: {
      files: File[];
      headers?: Record<string, string>;
      skipPolling?: boolean;
      onUploadProgress?: (data: { file: File; progress: number }) => void;
      [key: string]: unknown;
    },
  ) => Promise<unknown[]>;
  /**
   * Endpoint name defined in your UploadThing file router (e.g., 'imageUploader').
   */
  endpoint: string;
  /**
   * Optional custom request headers.
   */
  headers?: Record<string, string>;
  /**
   * Skip polling for server processing callback if applicable.
   */
  skipPolling?: boolean;
}

/**
 * Creates an `UploadHandler` integrating seamlessly with UploadThing for AWS storage.
 */
export function createUploadThingUploadHandler(config: UploadThingStorageConfig): UploadHandler {
  const { uploadFiles, endpoint, headers, skipPolling } = config;

  return async (files, options = {}) => {
    try {
      const response = await uploadFiles(endpoint, {
        files,
        headers,
        skipPolling,
        onUploadProgress: ({ file, progress }) => {
          options.onProgress?.(file, progress);
        },
      });

      const uploadedResults: UploadedFile[] = (response as Record<string, unknown>[]).map(
        (item, index) => {
          const matchedFile = files[index] || files[0];
          const result: UploadedFile = {
            key: String(item.key || matchedFile.name),
            name: String(item.name || matchedFile.name),
            size: Number(item.size || matchedFile.size),
            type: String(item.type || matchedFile.type),
            url: String(item.ufsUrl || item.url || ''),
            serverData: item.serverData,
          };
          options.onSuccess?.(matchedFile, result);
          return result;
        },
      );

      return uploadedResults;
    } catch (err: unknown) {
      const error =
        err instanceof Error
          ? err
          : new Error(
              typeof err === 'object' && err !== null && 'message' in err
                ? String((err as { message: unknown }).message)
                : 'UploadThing upload failed',
            );
      for (const file of files) {
        options.onError?.(file, error);
      }
      throw error;
    }
  };
}

/**
 * Configuration options for AWS S3 direct presigned URL uploads.
 */
export interface S3PresignedStorageConfig {
  /**
   * Obtains a signed upload URL from your backend for each file.
   */
  getPresignedUrl: (file: File) => Promise<{
    uploadUrl: string;
    fileUrl?: string;
    headers?: Record<string, string>;
    method?: 'PUT' | 'POST';
  }>;
}

/**
 * Creates an `UploadHandler` uploading binary files directly to AWS S3 using presigned URLs.
 */
export function createS3PresignedUploadHandler(config: S3PresignedStorageConfig): UploadHandler {
  return async (files, options = {}) => {
    const uploadFile = async (file: File): Promise<UploadedFile> => {
      const { uploadUrl, fileUrl, headers, method = 'PUT' } = await config.getPresignedUrl(file);

      return new Promise<UploadedFile>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (options.signal) {
          if (options.signal.aborted) {
            return reject(new DOMException('Upload aborted', 'AbortError'));
          }
          options.signal.addEventListener('abort', () => {
            xhr.abort();
            reject(new DOMException('Upload aborted', 'AbortError'));
          });
        }

        xhr.open(method, uploadUrl, true);

        if (headers) {
          for (const [key, val] of Object.entries(headers)) {
            xhr.setRequestHeader(key, val);
          }
        }
        if (!headers || !('Content-Type' in headers)) {
          xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && options.onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            options.onProgress(file, percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const resolvedUrl = fileUrl || uploadUrl.split('?')[0];
            const result: UploadedFile = {
              key: file.name,
              name: file.name,
              size: file.size,
              type: file.type,
              url: resolvedUrl,
            };
            options.onProgress?.(file, 100);
            options.onSuccess?.(file, result);
            resolve(result);
          } else {
            const error = new Error(`S3 upload failed with status ${xhr.status}`);
            options.onError?.(file, error);
            reject(error);
          }
        };

        xhr.onerror = () => {
          const error = new Error('Network error during S3 direct upload');
          options.onError?.(file, error);
          reject(error);
        };

        xhr.send(file);
      });
    };

    return Promise.all(files.map((file) => uploadFile(file)));
  };
}

/**
 * Universal hook for file uploads supporting UploadThing, custom APIs, and direct S3.
 */
export interface UseUploadFileOptions {
  uploadHandler?: UploadHandler;
  defaultUploadedFiles?: UploadedFile[];
  onSuccess?: (files: UploadedFile[]) => void;
  onError?: (error: Error) => void;
}

export function useUploadFile(options: UseUploadFileOptions = {}) {
  const { uploadHandler, defaultUploadedFiles = [], onSuccess, onError } = options;

  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const abort = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsUploading(false);
  }, []);

  const reset = React.useCallback(() => {
    abort();
    setUploadedFiles([]);
    setProgresses({});
    setError(null);
  }, [abort]);

  const onUpload = React.useCallback(
    async (files: File[], handlerOverride?: UploadHandler): Promise<UploadedFile[]> => {
      const handler = handlerOverride || uploadHandler;
      if (!handler) {
        throw new Error('No upload handler or configuration provided to useUploadFile.');
      }

      setIsUploading(true);
      setError(null);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const results = await handler(files, {
          signal: controller.signal,
          onProgress: (file, progress) => {
            setProgresses((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          },
        });

        setUploadedFiles((prev) => [...prev, ...results]);
        onSuccess?.(results);
        return results;
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error('An unexpected upload error occurred');
        setError(errorInstance);
        onError?.(errorInstance);
        throw errorInstance;
      } finally {
        setIsUploading(false);
        abortControllerRef.current = null;
      }
    },
    [uploadHandler, onSuccess, onError],
  );

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
    error,
    reset,
    abort,
    setUploadedFiles,
  };
}
