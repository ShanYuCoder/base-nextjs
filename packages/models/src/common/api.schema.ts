import { z } from 'zod'

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    message: z.string().optional(),
    data,
    meta: z.record(z.unknown()).nullable().optional()
  })

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string().optional(),
  errors: z.record(z.array(z.string())).optional()
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.discriminatedUnion('success', [ApiSuccessSchema(data), ApiErrorSchema])
