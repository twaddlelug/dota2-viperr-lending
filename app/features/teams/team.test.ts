import { describe, expect, it } from 'vitest'
import { positionLabel, positionWithNumber, teamLogo, toPosition } from './team'

describe('toPosition', () => {
  it('keeps positions 1–5', () => {
    expect(toPosition(1)).toBe(1)
    expect(toPosition(5)).toBe(5)
  })

  it('reads anything else as the coach', () => {
    expect(toPosition(null)).toBeNull()
    expect(toPosition(0)).toBeNull()
    expect(toPosition(6)).toBeNull()
    expect(toPosition('1')).toBeNull()
  })
})

describe('position labels', () => {
  it('names positions in English and the coach in Russian', () => {
    expect(positionLabel(1)).toBe('Carry')
    expect(positionWithNumber(4)).toBe('4 · Soft Support')
    expect(positionLabel(null)).toBe('Тренер')
    expect(positionWithNumber(null)).toBe('Тренер')
  })
})

describe('teamLogo', () => {
  const server = { iconUrl: 'https://cdn.discordapp.com/icons/1/a.png' }

  it('prefers the team logo', () => {
    expect(teamLogo({ logoUrl: 'https://example.com/logo.png', server })).toBe(
      'https://example.com/logo.png'
    )
  })

  it('falls back to the server icon, then to nothing', () => {
    expect(teamLogo({ logoUrl: null, server })).toBe(server.iconUrl)
    expect(teamLogo({ logoUrl: null, server: { iconUrl: null } })).toBe(
      undefined
    )
  })
})
