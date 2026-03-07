export type Primitive = string | number | boolean | null | undefined

export type QueryParamsValue =
  | Primitive
  | Primitive[]
  | Record<string, Primitive>

export type QueryParams = Record<string, QueryParamsValue>

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestConfig = {
  method?: HttpMethod
  query?: QueryParams
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
  credentials?: RequestCredentials
}

export type ApiErrorResponse = {
  message?: string
  code?: string
  details?: Record<string, unknown>
}