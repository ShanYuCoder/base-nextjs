import type { z } from 'zod'

import type {
  ChangePasswordRequestSchema,
  ForgotPasswordRequestSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
  ResetPasswordRequestSchema,
  TokenResponseSchema
} from './auth.schema.js'

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type TokenResponse = z.infer<typeof TokenResponseSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>
