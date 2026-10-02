import type { z } from 'zod'

import type { ApiErrorSchema } from './api.schema.js'

export type ApiSuccess<T> = {
  success: true
  message?: string
  data: T
  meta?: Record<string, unknown> | null
}

export type ApiError = z.infer<typeof ApiErrorSchema>

export type ApiResponse<T> = ApiSuccess<T> | ApiError
