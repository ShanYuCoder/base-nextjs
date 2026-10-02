import { z } from 'zod'

/** Shared primitive fields reused across entity contract schemas. */
export const fields = {
  id: z.number(),
  nullableString: z.string().nullable(),
  optionalNullableString: z.string().nullable().optional(),
  email: z.string(),
  status: z.union([z.string(), z.number()]),
  createdAt: z.string().nullable().optional()
} as const
