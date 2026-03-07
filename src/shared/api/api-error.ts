export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'ABORTED'

export type ApiErrorDetails = Record<string, unknown> | null

export class ApiError extends Error {
  public readonly status: number | null
  public readonly code: ApiErrorCode
  public readonly details: ApiErrorDetails
  public readonly isNetworkError: boolean
  public readonly isAborted: boolean

  constructor(params: {
    message: string
    status?: number | null
    code?: ApiErrorCode
    details?: ApiErrorDetails
    cause?: unknown
    isNetworkError?: boolean
    isAborted?: boolean
  }) {
    super(params.message)
    this.name = 'ApiError'
    this.status = params.status ?? null
    this.code = params.code ?? 'UNKNOWN_ERROR'
    this.details = params.details ?? null
    this.cause = params.cause
    this.isNetworkError = params.isNetworkError ?? false
    this.isAborted = params.isAborted ?? false
  }
}

export const isApiError = (value: unknown): value is ApiError => {
  return value instanceof ApiError
}