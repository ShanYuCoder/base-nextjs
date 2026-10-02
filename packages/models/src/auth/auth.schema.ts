import { z } from 'zod'

import { fields } from '../common/fields.js'
import { UserMeSchema } from '../user/user.schema.js'

export const LoginRequestSchema = z.object({
  email: fields.email,
  password: z.string()
})

export const TokenResponseSchema = z.object({
  tokenType: z.literal('Bearer').optional(),
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  token: z.string().nullable().optional()
})

export const LoginResponseSchema = TokenResponseSchema.extend({
  token: z.string().nullable().optional(),
  user: UserMeSchema.optional()
})

export const RegisterRequestSchema = z.object({
  name: z.string().optional(),
  email: fields.email,
  password: z.string(),
  password_confirmation: z.string()
})

export const ForgotPasswordRequestSchema = z.object({
  email: fields.email
})

export const ResetPasswordRequestSchema = z.object({
  email: fields.email,
  token: z.string(),
  password: z.string(),
  password_confirmation: z.string()
})

export const ChangePasswordRequestSchema = z.object({
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string()
})
