export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  errorCode: string;
  message: string;
  errors?: ApiFieldError[];
  timestamp: string;
  traceId?: string;
}

export const DEFAULT_ERROR_CODE_BY_STATUS: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
};

const DEFAULT_ERROR_MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'The request is invalid. Please review and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with the current data state.',
  422: 'Some fields are invalid. Please review your input.',
  429: 'Too many requests. Please wait and try again.',
  500: 'The server encountered an unexpected error.',
  502: 'The service is temporarily unavailable. Please try again soon.',
  503: 'The service is under maintenance. Please try again later.',
};

const FALLBACK_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isApiFieldError = (value: unknown): value is ApiFieldError =>
  isObject(value) && typeof value.field === 'string' && typeof value.message === 'string';

export const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!isObject(value)) {
    return false;
  }

  const errors = value.errors;
  const hasValidErrors =
    errors === undefined ||
    (Array.isArray(errors) && errors.every((item) => isApiFieldError(item)));

  return (
    typeof value.statusCode === 'number' &&
    typeof value.errorCode === 'string' &&
    typeof value.message === 'string' &&
    value.message.length > 0 &&
    hasValidErrors &&
    typeof value.timestamp === 'string' &&
    (value.traceId === undefined || typeof value.traceId === 'string')
  );
};

export const getDefaultErrorMessageByStatus = (statusCode: number) =>
  DEFAULT_ERROR_MESSAGE_BY_STATUS[statusCode] ?? FALLBACK_ERROR_MESSAGE;

export const normalizeApiErrorResponse = (
  responsePayload: unknown,
  responseStatusCode: number,
): ApiErrorResponse => {
  if (isApiErrorResponse(responsePayload)) {
    return responsePayload;
  }

  return {
    statusCode: responseStatusCode,
    errorCode: DEFAULT_ERROR_CODE_BY_STATUS[responseStatusCode] ?? 'UNEXPECTED_ERROR',
    message: getDefaultErrorMessageByStatus(responseStatusCode),
    errors: [],
    timestamp: new Date().toISOString(),
  };
};

export interface AppApiErrorParams {
  statusCode: number;
  errorCode: string;
  message: string;
  errors?: ApiFieldError[];
  timestamp: string;
  traceId?: string;
  url?: string;
  response?: Response;
}

export class AppApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly errors: ApiFieldError[];
  readonly timestamp: string;
  readonly traceId?: string;
  readonly url?: string;
  readonly response?: Response;

  constructor({
    statusCode,
    errorCode,
    message,
    errors = [],
    timestamp,
    traceId,
    url,
    response,
  }: AppApiErrorParams) {
    super(message);
    this.name = 'AppApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.timestamp = timestamp;
    this.traceId = traceId;
    this.url = url;
    this.response = response;
  }
}
