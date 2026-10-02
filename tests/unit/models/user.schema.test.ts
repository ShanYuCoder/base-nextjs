import { describe, expect, it } from 'vitest'

import {
  UserHeaderSchema,
  UserListSchema,
  UserMeSchema,
  UserSchema,
  UserSelectSchema
} from '~/models/user/user.schema'

describe('models/user/user.schema', () => {
  const fullUser = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    status: 'active',
    created_at: '2026-01-01',
    birthday: null,
    gender: 'female'
  }

  it('parses full user shape', () => {
    expect(UserSchema.parse(fullUser)).toEqual(fullUser)
  })

  it('parses list shape from partial API payload', () => {
    const listItem = {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      status: 1,
      created_at: '2026-01-01'
    }

    expect(UserListSchema.parse(listItem)).toEqual(listItem)
  })

  it('parses select shape', () => {
    expect(UserSelectSchema.parse({ id: 2, name: 'Bob' })).toEqual({ id: 2, name: 'Bob' })
  })

  it('parses header user shape', () => {
    expect(
      UserHeaderSchema.parse({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        full_name: 'Alice Nguyen',
        role: 'OWNER'
      })
    ).toEqual({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      full_name: 'Alice Nguyen',
      role: 'OWNER'
    })
  })

  it('parses auth/me response', () => {
    const me = {
      id: 10,
      email: 'user@test.com',
      role: 'OWNER',
      active: true
    }

    expect(UserMeSchema.parse(me)).toEqual(me)
  })
})
