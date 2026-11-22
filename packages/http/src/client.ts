import ky, { type Options } from 'ky';

export interface HttpClientConfig {
  prefixUrl?: string;
  timeout?: number;
  getAuthToken?: () => string | null | undefined;
}

export const createHttpClient = (config?: HttpClientConfig) => {
  return ky.create({
    prefixUrl: config?.prefixUrl || '',
    timeout: config?.timeout ?? 30000,
    retry: {
      limit: 2,
      methods: ['get'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        (request) => {
          const token = config?.getAuthToken?.();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        },
      ],
    },
  });
};

export const httpClient = createHttpClient();
