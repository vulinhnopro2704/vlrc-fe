import * as React from 'react';

export interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
  serverData?: unknown;
  [key: string]: unknown;
}

export interface UploadExecutionOptions {
  onProgress?: (file: File, progress: number) => void;
  onSuccess?: (file: File, result: UploadedFile) => void;
  onError?: (file: File, error: Error) => void;
  signal?: AbortSignal;
}

export type UploadHandler = (
  files: File[],
  options?: UploadExecutionOptions,
) => Promise<UploadedFile[]>;

export interface ApiStorageConfig {
  endpoint: string | ((file: File) => string | Promise<string>);
  method?: 'POST' | 'PUT' | 'PATCH';
  fieldName?: string;
  headers?:
    | Record<string, string>
    | ((file: File) => Record<string, string> | Promise<Record<string, string>>);
  extraBody?:
    | Record<string, unknown>
    | ((
        file: File,
      ) => Record<string, unknown> | FormData | Promise<Record<string, unknown> | FormData>);
  withCredentials?: boolean;
  timeout?: number;
  responseParser?: (
    response: unknown,
    file: File,
  ) => string | UploadedFile | Promise<string | UploadedFile>;
}

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

        if (headersConfig) {
          const resolvedHeaders =
            typeof headersConfig === 'function' ? await headersConfig(file) : headersConfig;
          for (const [key, value] of Object.entries(resolvedHeaders)) {
            xhr.setRequestHeader(key, value);
          }
        }

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
                // Raw text
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

export interface UploadThingStorageConfig {
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
  endpoint: string;
  headers?: Record<string, string>;
  skipPolling?: boolean;
}

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

      return (response as Record<string, unknown>[]).map((item, index) => {
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
      });
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
