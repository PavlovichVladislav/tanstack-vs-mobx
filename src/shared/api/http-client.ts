import { env } from '@/shared/config/env'
import { ApiError, type ApiErrorCode } from './api-error'
import {
  type ApiErrorResponse,
  type QueryParams,
  type RequestConfig,
} from './types'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function buildUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${env.apiBaseUrl}${normalizedPath}`)

  if (!query) {
    return url.toString()
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          url.searchParams.append(key, String(item))
        }
      })
      return
    }

    if (isPlainObject(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue !== undefined && nestedValue !== null) {
          url.searchParams.append(`${key}.${nestedKey}`, String(nestedValue))
        }
      })
      return
    }

    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

async function tryParseJson(response: Response): Promise<unknown | null> {
  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return null
  }

  try {
    return await response.json()
  } catch {
    return null
  }
}

function mapStatusToCode(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return 'BAD_REQUEST'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 409:
      return 'CONFLICT'
    case 422:
      return 'VALIDATION_ERROR'
    case 429:
      return 'RATE_LIMITED'
    default:
      return status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR'
  }
}

async function createApiErrorFromResponse(response: Response): Promise<ApiError> {
  const parsedBody = await tryParseJson(response)
  const payload = isPlainObject(parsedBody)
    ? (parsedBody as ApiErrorResponse)
    : null

  const message =
    payload?.message ||
    response.statusText ||
    'Request failed'

  return new ApiError({
    message,
    status: response.status,
    code: payload?.code && typeof payload.code === 'string'
      ? (payload.code as ApiErrorCode)
      : mapStatusToCode(response.status),
    details: payload?.details ?? null,
  })
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  return (await response.text()) as T
}

export async function request<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const {
    method = 'GET',
    query,
    body,
    headers,
    signal,
    credentials = 'include',
  } = config

  const url = buildUrl(path, query)

  const requestHeaders = new Headers(headers)

  const init: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
    credentials,
  }

  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
    init.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, init)

    if (!response.ok) {
      throw await createApiErrorFromResponse(response)
    }

    return await parseResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError({
        message: 'Request was aborted',
        code: 'ABORTED',
        isAborted: true,
      })
    }

    throw new ApiError({
      message: 'Network error',
      code: 'NETWORK_ERROR',
      isNetworkError: true,
      cause: error,
    })
  }
}

export const httpClient = {
  get: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, {
      ...config,
      method: 'GET',
    }),

  post: <TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    config?: Omit<RequestConfig, 'method' | 'body'>,
  ) =>
    request<TResponse>(path, {
      ...config,
      method: 'POST',
      body,
    }),

  put: <TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    config?: Omit<RequestConfig, 'method' | 'body'>,
  ) =>
    request<TResponse>(path, {
      ...config,
      method: 'PUT',
      body,
    }),

  patch: <TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    config?: Omit<RequestConfig, 'method' | 'body'>,
  ) =>
    request<TResponse>(path, {
      ...config,
      method: 'PATCH',
      body,
    }),

  delete: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, {
      ...config,
      method: 'DELETE',
    }),
}