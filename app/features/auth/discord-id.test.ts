import { describe, expect, it } from 'vitest'
import { isDiscordId } from './discord-id'

describe('isDiscordId', () => {
  it('accepts Discord user IDs', () => {
    expect(isDiscordId('80351110224678912')).toBe(true)
    expect(isDiscordId('1094839240352071711')).toBe(true)
  })

  it('rejects usernames, mentions and short numbers', () => {
    expect(isDiscordId('')).toBe(false)
    expect(isDiscordId('nazar')).toBe(false)
    expect(isDiscordId('<@1094839240352071711>')).toBe(false)
    expect(isDiscordId('123456')).toBe(false)
    expect(isDiscordId('1094839240352071711 ')).toBe(false)
  })
})
