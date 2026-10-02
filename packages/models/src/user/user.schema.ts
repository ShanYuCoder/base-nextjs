import { z } from 'zod'

import { fields } from '../common/fields.js'

export const RoleSchema = z.enum([
  'OWNER',
  'PLANNER',
  'OPERATOR',
  'QC',
  'MAINTENANCE',
  'EMPLOYEE',
  'USER'
])

/**
 * Full user entity — single source of truth.
 * Covers admin CRUD, `/api/auth/me`, login user payload, list/detail/header views.
 */
export const UserSchema = z.object({
  id: fields.id,
  name: fields.optionalNullableString,
  full_name: fields.optionalNullableString,
  email: fields.email,
  role: z.union([RoleSchema, z.string()]).nullable().optional(),
  status: fields.status.optional(),
  created_at: fields.createdAt,
  birthday: fields.nullableString.optional(),
  gender: fields.nullableString.optional(),
  phone: fields.optionalNullableString,
  company: fields.optionalNullableString,
  active: z.boolean().optional(),
  department: fields.optionalNullableString
})

/** `/api/auth/me` and login `user` payload. */
export const UserMeSchema = UserSchema

export const UserListSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  status: true,
  created_at: true
})

export const UserSelectSchema = UserSchema.pick({
  id: true,
  name: true
})

export const UserDetailSchema = UserSchema

/** Header bar / navbar current user. */
export const UserHeaderSchema = UserSchema.pick({
  id: true,
  name: true,
  full_name: true,
  email: true,
  role: true
})

export const UserReadSchema = UserSchema
