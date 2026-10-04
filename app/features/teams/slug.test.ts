import { describe, expect, it } from 'vitest'
import { slugify } from './slug'

describe('slugify', () => {
  it('lowercases latin names and joins words with dashes', () => {
    expect(slugify('Venom Squad', 'VNM')).toBe('venom-squad')
    expect(slugify('  Team.Liquid!! ', 'TL')).toBe('team-liquid')
  })

  it('transliterates cyrillic names', () => {
    expect(slugify('Гадюки', 'GDK')).toBe('gadyuki')
    expect(slugify('Щука и Ёж', 'SH')).toBe('shchuka-i-ezh')
    expect(slugify('Їжак', 'YI')).toBe('yizhak')
  })

  it('falls back to the tag, then to a fixed word', () => {
    expect(slugify('🔥🔥', 'FIRE')).toBe('fire')
    expect(slugify('🔥', '⚡')).toBe('team')
  })
})
