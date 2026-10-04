import { describe, expect, it } from 'vitest'
import { safeReturnTo } from './return-to'

const BACKSLASH = '\\'

describe('safeReturnTo', () => {
  it('keeps paths on this site, with query and hash', () => {
    expect(safeReturnTo('/admin')).toBe('/admin')
    expect(safeReturnTo('/invite/abc?x=1#top')).toBe('/invite/abc?x=1#top')
  })

  it.each([
    ['protocol-relative', '//evil.com'],
    ['backslash, read by browsers as //', `/${BACKSLASH}evil.com`],
    ['dot segment collapsing into //', '/.//evil.com'],
    ['absolute URL', 'https://evil.com'],
    ['relative path', 'admin'],
    ['empty', ''],
  ])('rejects %s', (_, value) => {
    expect(safeReturnTo(value)).toBe('/me')
  })

  it('falls back when nothing was given', () => {
    expect(safeReturnTo(null)).toBe('/me')
    expect(safeReturnTo(undefined, '/')).toBe('/')
  })
})
