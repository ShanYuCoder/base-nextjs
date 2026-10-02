import type { z } from 'zod'

import type {
  RoleSchema,
  UserDetailSchema,
  UserHeaderSchema,
  UserListSchema,
  UserMeSchema,
  UserSchema,
  UserSelectSchema
} from './user.schema.js'

export type Role = z.infer<typeof RoleSchema>
export type User = z.infer<typeof UserSchema>
export type UserMe = z.infer<typeof UserMeSchema>
export type UserList = z.infer<typeof UserListSchema>
export type UserSelect = z.infer<typeof UserSelectSchema>
export type UserDetail = z.infer<typeof UserDetailSchema>
export type UserHeader = z.infer<typeof UserHeaderSchema>

/** @deprecated Use UserMe */
export type MeResponse = UserMe

/** @deprecated Use UserHeader */
export type CurrentUser = UserHeader
