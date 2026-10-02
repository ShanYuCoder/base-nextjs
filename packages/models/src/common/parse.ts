import type { z } from 'zod'

export function parseSchema<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown
): z.infer<T> | unknown {
  const result = schema.safeParse(value)
  return result.success ? result.data : value
}

export function parseSchemaOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown,
  message = 'Invalid API response shape'
): z.infer<T> {
  const result = schema.safeParse(value)
  if (!result.success) {
    throw new Error(message)
  }
  return result.data
}
