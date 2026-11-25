import ky, { type Options } from 'ky';
import { AppApiError, normalizeApiErrorResponse, type ApiErrorResponse } from './api-error';
import { DEFAULT_AUTH_API_PATHS } from './auth-routes';

export interface AuthRefreshConfig {
  /** Called once when a non-auth request returns 401. Should throw if refresh fails. */
  refreshFn: () => Promise<void>;
  /** Return true for auth endpoints (login, register, refresh, logout, etc.) that should not trigger refresh. */
  isAuthEndpoint?: (url: URL) => boolean;
  /** Called when refreshFn fails so the app can clear session cache and redirect to login. */
  onUnauthorized?: () => void;
  /** Header used to prevent infinite retry loops on a single request. Defaults to 'x-retry'. */
  retryHeaderName?: string;
}

export interface HttpClientConfig {
  prefixUrl?: string;
  timeout?: number;
  credentials?: RequestCredentials;
  headers?: Options['headers'];
  retry?: Options['retry'];
  getAuthToken?: () => string | null | undefined;
  authRefresh?: AuthRefreshConfig;
  afterResponse?: NonNullable<Options['hooks']>['afterResponse'];
}

export interface AppApiClientConfig {
  baseUrl: string;
  timeout?: number;
  credentials?: RequestCredentials;
  headers?: Options['headers'];
  refreshPath?: string;
  unauthorizedEventName?: string;
  authEndpointPaths?: readonly string[];
  onUnauthorized?: () => void;
  onApiError?: (error: ApiErrorResponse) => void;
}

export const createHttpClient = (config?: HttpClientConfig) => {
  const retryHeaderName = config?.authRefresh?.retryHeaderName ?? 'x-retry';
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
  }> = [];

  const processQueue = (error: unknown) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    failedQueue = [];
  };

  const client = ky.create({
    prefixUrl: config?.prefixUrl || '',
    timeout: config?.timeout ?? 30000,
    credentials: config?.credentials,
    headers: config?.headers,
    retry: config?.retry ?? {
      limit: 2,
      methods: ['get'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        (request, options) => {
          if (options.body instanceof FormData) {
            request.headers.delete('Content-Type');
          }
          const token = config?.getAuthToken?.();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        },
      ],
      afterResponse: [
        async (request, options, response) => {
          const authRefresh = config?.authRefresh;
          if (authRefresh && response.status === 401) {
            const url = new URL(request.url);
            const isAuth = authRefresh.isAuthEndpoint?.(url) ?? false;
            const hasRetryHeader = request.headers.get(retryHeaderName) === 'true';

            if (!isAuth && !hasRetryHeader) {
              if (!isRefreshing) {
                isRefreshing = true;
                try {
                  await authRefresh.refreshFn();
                  isRefreshing = false;
                  processQueue(null);

                  const retryHeaders = new Headers(options.headers);
                  retryHeaders.set(retryHeaderName, 'true');
                  return client(request.url, {
                    ...options,
                    headers: retryHeaders,
                  });
                } catch (err) {
                  isRefreshing = false;
                  processQueue(err);
                  authRefresh.onUnauthorized?.();
                  throw err;
                }
              }

              return new Promise<Response>((resolve, reject) => {
                failedQueue.push({
                  resolve: () => {
                    const queuedHeaders = new Headers(options.headers);
                    queuedHeaders.set(retryHeaderName, 'true');
                    resolve(
                      client(request.url, {
                        ...options,
                        headers: queuedHeaders,
                      }),
                    );
                  },
                  reject: (err) => reject(err),
                });
              });
            }
          }

          return response;
        },
        ...(config?.afterResponse ?? []),
      ],
    },
  });

  return client;
};

/**
 * Opinionated API client factory for VLRC apps using cookie-based auth,
 * single-flight refresh token queue, `auth:unauthorized` event dispatch,
 * and normalized `AppApiError` responses.
 */
export const createAppApiClient = (config: AppApiClientConfig) => {
  const credentials = config.credentials ?? 'include';
  const refreshPath = config.refreshPath ?? '/auth/refresh';
  const unauthorizedEventName = config.unauthorizedEventName ?? 'auth:unauthorized';
  const authEndpointPaths = config.authEndpointPaths ?? DEFAULT_AUTH_API_PATHS;

  return createHttpClient({
    prefixUrl: config.baseUrl,
    timeout: config.timeout ?? 10_000,
    credentials,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.headers,
    },
    retry: 0,
    authRefresh: {
      isAuthEndpoint: (url) => authEndpointPaths.some((path) => url.pathname.includes(path)),
      refreshFn: async () => {
        const refreshUrl = new URL(refreshPath, config.baseUrl).href;
        const refreshResponse = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials,
        });
        if (!refreshResponse.ok) {
          throw new Error('Refresh failed');
        }
      },
      onUnauthorized: () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(unauthorizedEventName));
        }
        config.onUnauthorized?.();
      },
    },
    afterResponse: [
      async (request, _options, response) => {
        if (response.ok) {
          return response;
        }

        let payload: unknown;
        try {
          payload = await response.clone().json();
        } catch {
          payload = undefined;
        }

        const normalizedError = normalizeApiErrorResponse(payload, response.status);
        config.onApiError?.(normalizedError);

        throw new AppApiError({
          statusCode: normalizedError.statusCode,
          errorCode: normalizedError.errorCode,
          message: normalizedError.message,
          errors: normalizedError.errors,
          timestamp: normalizedError.timestamp,
          traceId: normalizedError.traceId,
          url: request.url,
          response,
        });
      },
    ],
  });
};

export const httpClient = createHttpClient();
