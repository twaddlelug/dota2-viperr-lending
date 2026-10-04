import { describe, expect, it } from 'vitest'
import {
  formatMatchTime,
  fromTournamentLocalInput,
  toTournamentLocalInput,
} from './format'

describe('tournament time (Moscow, UTC+3)', () => {
  it('shows UTC instants as Moscow wall time in the admin input', () => {
    expect(toTournamentLocalInput('2026-10-24T12:00:00Z')).toBe(
      '2026-10-24T15:00'
    )
    expect(toTournamentLocalInput('2026-10-24T22:30:00Z')).toBe(
      '2026-10-25T01:30'
    )
  })

  it('reads the admin input as Moscow time', () => {
    expect(fromTournamentLocalInput('2026-10-24T15:00')?.toISOString()).toBe(
      '2026-10-24T12:00:00.000Z'
    )
  })

  it('round-trips and handles empty values', () => {
    const iso = '2026-12-31T20:45:00.000Z'
    const local = toTournamentLocalInput(iso)
    expect(fromTournamentLocalInput(local)?.toISOString()).toBe(iso)
    expect(toTournamentLocalInput(undefined)).toBe('')
    expect(fromTournamentLocalInput('')).toBeNull()
  })

  it('labels match times with the time zone', () => {
    expect(formatMatchTime('2026-10-24T12:00:00Z')).toMatch(/15:00 МСК$/)
  })
})
