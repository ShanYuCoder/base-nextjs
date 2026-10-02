import { describe, expect, it } from 'vitest'
import {
  cellValue,
  filterItemsBySearch,
  getNextSortState,
  getTotalPages,
  paginateItems,
  sortItems
} from '@/lib/data-table-logic'

const items: Record<string, unknown>[] = [
  { id: 1, name: 'Alice', score: 100 },
  { id: 2, name: 'Bob', score: 90 },
  { id: 3, name: 'Charlie', score: 95 },
  { id: 4, name: 'Alice', role: 'manager' }
]

describe('molecules/layout/dataTableLogic', () => {
  describe('filterItemsBySearch', () => {
    it('returns all items when search is empty', () => {
      expect(filterItemsBySearch(items, '', ['name'])).toHaveLength(4)
    })
    it('returns all items when search is only whitespace', () => {
      expect(filterItemsBySearch(items, '   ', ['name'])).toHaveLength(4)
    })
    it('filters by search key case insensitive', () => {
      const result = filterItemsBySearch(items, 'alice', ['name'])
      expect(result).toHaveLength(2)
    })
    it('filters by multiple keys', () => {
      const result = filterItemsBySearch(items, 'manager', ['role'])
      expect(result).toHaveLength(1)
    })
    it('returns empty when no match', () => {
      expect(filterItemsBySearch(items, 'xyz', ['name'])).toHaveLength(0)
    })

    it('supports nested keys in search and safely handles non-object nested values', () => {
      const nestedItems = [
        { id: 1, profile: { email: 'alice@example.com' } },
        { id: 2, profile: null },
        { id: 3, profile: 'invalid' }
      ] as Record<string, unknown>[]

      const result = filterItemsBySearch(nestedItems, 'alice@', ['profile.email'])
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })
  })

  describe('sortItems', () => {
    it('returns items unchanged when sortKey is null', () => {
      expect(sortItems(items, null, 'asc')).toEqual(items)
    })
    it('sorts ascending by key', () => {
      const sorted = sortItems(items, 'name', 'asc')
      expect(sorted.map((r) => r.name)).toEqual(['Alice', 'Alice', 'Bob', 'Charlie'])
    })
    it('sorts descending by key', () => {
      const sorted = sortItems(items, 'name', 'desc')
      expect(sorted.map((r) => r.name)).toEqual(['Charlie', 'Bob', 'Alice', 'Alice'])
    })

    it('handles null and undefined values in sort key', () => {
      const rows = [
        { id: 1, name: null },
        { id: 2, name: 'Bob' },
        { id: 3, name: undefined },
        { id: 4, name: 'Alice' }
      ] as Record<string, unknown>[]

      const asc = sortItems(rows, 'name', 'asc')
      expect(asc.map((r) => r.id)).toEqual([4, 2, 1, 3])

      const desc = sortItems(rows, 'name', 'desc')
      expect(desc.map((r) => r.id)).toEqual([1, 3, 2, 4])
    })
  })

  describe('getTotalPages', () => {
    it('returns at least 1', () => {
      expect(getTotalPages(0, 10)).toBe(1)
    })
    it('ceil division', () => {
      expect(getTotalPages(25, 10)).toBe(3)
      expect(getTotalPages(31, 10)).toBe(4)
    })
  })

  describe('paginateItems', () => {
    it('returns first page', () => {
      const page = paginateItems(items, 1, 2)
      expect(page).toHaveLength(2)
      expect(page[0].id).toBe(1)
    })
    it('returns second page', () => {
      const page = paginateItems(items, 2, 2)
      expect(page[0].id).toBe(3)
    })
  })

  describe('getNextSortState', () => {
    it('toggles to desc when same key asc', () => {
      expect(getNextSortState('name', 'asc', 'name')).toEqual({ sortKey: 'name', sortOrder: 'desc' })
    })
    it('toggles to asc when same key desc', () => {
      expect(getNextSortState('name', 'desc', 'name')).toEqual({ sortKey: 'name', sortOrder: 'asc' })
    })
    it('resets to asc when different key', () => {
      expect(getNextSortState('name', 'desc', 'score')).toEqual({ sortKey: 'score', sortOrder: 'asc' })
    })
  })

  describe('cellValue', () => {
    it('returns value for key', () => {
      expect(cellValue(items[0], 'name')).toBe('Alice')
    })
    it('returns empty string for missing key', () => {
      expect(cellValue(items[0], 'missing')).toBe('')
    })

    it('returns nested value and empty string when nested path is invalid', () => {
      const row = { profile: { email: 'alice@example.com' }, broken: 'x' } as Record<string, unknown>
      expect(cellValue(row, 'profile.email')).toBe('alice@example.com')
      expect(cellValue(row, 'broken.email')).toBe('')
    })
  })
})
