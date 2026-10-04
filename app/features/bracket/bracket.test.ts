import { describe, expect, it } from 'vitest'
import {
  buildDoubleElimination,
  findMatch,
  getAgenda,
  getFeaturedMatch,
  getStandings,
  type MatchResult,
  resultChangeConflicts,
  seedingLocked,
  slotResult,
  type TeamRef,
  toMatchStatus,
  winsNeeded,
} from './bracket'

const team = (seed: number): TeamRef => ({
  slug: `t${seed}`,
  name: `Team ${seed}`,
  tag: `T${seed}`,
})
const SEEDS = Array.from({ length: 8 }, (_, i) => team(i + 1))

const won = (a: number, b: number): MatchResult => ({
  score: [a, b],
  status: 'finished',
})

const QUARTERFINALS: Record<string, MatchResult> = {
  'ub-qf1': won(2, 0),
  'ub-qf2': won(2, 1),
  'ub-qf3': won(2, 1),
  'ub-qf4': won(2, 0),
}

const build = (results: Record<string, MatchResult> = {}) =>
  buildDoubleElimination(SEEDS, results)

const teamsOf = (results: Record<string, MatchResult>, id: string) =>
  findMatch(build(results), id)?.slots.map(slot => slot.team?.slug ?? null)

describe('buildDoubleElimination', () => {
  it('pairs the upper quarterfinals by seed: 1–8, 4–5, 2–7, 3–6', () => {
    expect(teamsOf({}, 'ub-qf1')).toEqual(['t1', 't8'])
    expect(teamsOf({}, 'ub-qf2')).toEqual(['t4', 't5'])
    expect(teamsOf({}, 'ub-qf3')).toEqual(['t2', 't7'])
    expect(teamsOf({}, 'ub-qf4')).toEqual(['t3', 't6'])
  })

  it('moves winners up and losers down', () => {
    expect(teamsOf(QUARTERFINALS, 'ub-sf1')).toEqual(['t1', 't4'])
    expect(teamsOf(QUARTERFINALS, 'lb-r1-1')).toEqual(['t8', 't5'])
    expect(teamsOf(QUARTERFINALS, 'lb-r1-2')).toEqual(['t7', 't6'])
  })

  it('crosses upper-semifinal losers so rematches do not come too early', () => {
    const results = {
      ...QUARTERFINALS,
      'ub-sf1': won(2, 0),
      'ub-sf2': won(0, 2),
    }
    expect(teamsOf(results, 'lb-qf1')?.[1]).toBe('t2')
    expect(teamsOf(results, 'lb-qf2')?.[1]).toBe('t4')
  })

  it('names unknown slots after where the team will come from', () => {
    const match = findMatch(build(), 'lb-f')
    expect(match?.slots.map(slot => slot.placeholder)).toEqual([
      'Winner LB SF',
      'Loser UB Final',
    ])
  })

  it('has no winner until the match is finished', () => {
    const live = findMatch(
      build({ 'ub-qf1': { score: [1, 0], status: 'live' } }),
      'ub-qf1'
    )
    expect(live?.winner).toBeNull()
    expect(live && slotResult(live, 0)).toBe('none')
    const done = findMatch(build(QUARTERFINALS), 'ub-qf1')
    expect(done && [slotResult(done, 0), slotResult(done, 1)]).toEqual([
      'won',
      'lost',
    ])
  })
})

describe('getStandings', () => {
  it('keeps upper-bracket losers alive and knocks out lower-bracket losers', () => {
    const results = { ...QUARTERFINALS, 'lb-r1-1': won(2, 0) }
    const standings = getStandings(build(results))
    expect(standings.get('t8')).toEqual({
      state: 'alive',
      roundName: 'Lower Quarterfinals',
    })
    expect(standings.get('t5')).toEqual({
      state: 'eliminated',
      roundName: 'Lower Round 1',
    })
    expect(standings.get('t6')?.state).toBe('alive')
  })

  it('crowns the Grand Final winner and marks the runner-up', () => {
    const results: Record<string, MatchResult> = {
      ...QUARTERFINALS,
      'ub-sf1': won(2, 0),
      'ub-sf2': won(2, 0),
      'ub-f': won(2, 1),
      'lb-r1-1': won(2, 0),
      'lb-r1-2': won(2, 0),
      'lb-qf1': won(2, 0),
      'lb-qf2': won(2, 0),
      'lb-sf': won(2, 0),
      'lb-f': won(0, 2),
      gf: won(1, 3),
    }
    const standings = getStandings(build(results))
    expect(standings.get('t2')?.state).toBe('champion')
    expect(standings.get('t1')?.state).toBe('runner-up')
  })
})

describe('getFeaturedMatch', () => {
  it('prefers a live match', () => {
    const results = {
      ...QUARTERFINALS,
      'ub-sf2': { score: [1, 0] as [number, number], status: 'live' as const },
    }
    expect(getFeaturedMatch(build(results))?.id).toBe('ub-sf2')
  })

  it('otherwise picks the earliest upcoming match with both teams known', () => {
    const results: Record<string, MatchResult> = {
      ...QUARTERFINALS,
      'ub-sf1': { startsAt: '2026-10-18T15:00:00Z' },
      'lb-r1-1': { startsAt: '2026-10-17T15:00:00Z' },
      'ub-f': { startsAt: '2026-10-10T15:00:00Z' },
    }
    expect(getFeaturedMatch(build(results))?.id).toBe('lb-r1-1')
  })
})

describe('getAgenda', () => {
  it('lists live matches first, then upcoming ones by start time', () => {
    const results: Record<string, MatchResult> = {
      ...QUARTERFINALS,
      'ub-sf1': { startsAt: '2026-10-18T15:00:00Z' },
      'ub-sf2': { score: [1, 0], status: 'live' },
      'ub-f': { startsAt: '2026-10-11T15:00:00Z' },
    }
    expect(getAgenda(build(results)).map(match => match.id)).toEqual([
      'ub-sf2',
      'ub-f',
      'ub-sf1',
      'lb-r1-1',
      'lb-r1-2',
    ])
  })

  it('leaves out matches with neither a date nor both teams', () => {
    const ids = getAgenda(build(), 20).map(match => match.id)
    expect(ids).toEqual(['ub-qf1', 'ub-qf2', 'ub-qf3', 'ub-qf4'])
  })
})

describe('toMatchStatus', () => {
  it('accepts the known statuses and reads anything else as upcoming', () => {
    expect(toMatchStatus('live')).toBe('live')
    expect(toMatchStatus('finished')).toBe('finished')
    expect(toMatchStatus('weird')).toBe('upcoming')
    expect(toMatchStatus('toString')).toBe('upcoming')
  })
})

describe('resultChangeConflicts', () => {
  const started = {
    ...QUARTERFINALS,
    'ub-sf1': won(2, 1),
    'lb-r1-1': { score: [1, 0] as [number, number], status: 'live' as const },
  }

  it('blocks flipping a winner whose next matches already started', () => {
    expect(resultChangeConflicts(build(started), 'ub-qf1', won(0, 2))).toEqual([
      'UB SF1',
      'LB R1-1',
    ])
    expect(
      resultChangeConflicts(build(started), 'ub-qf1', {
        status: 'live',
        score: [1, 1],
      })
    ).toHaveLength(2)
  })

  it('allows fixing the score when the winner stays the same', () => {
    expect(resultChangeConflicts(build(started), 'ub-qf1', won(2, 1))).toEqual(
      []
    )
  })

  it('allows any change while the next matches have not started', () => {
    expect(
      resultChangeConflicts(build(QUARTERFINALS), 'ub-qf1', won(0, 2))
    ).toEqual([])
  })
})

describe('seedingLocked', () => {
  it('locks seeding once an opening match is under way', () => {
    expect(seedingLocked(build())).toBe(false)
    expect(seedingLocked(build({ 'ub-qf3': { status: 'live' } }))).toBe(true)
  })
})

describe('winsNeeded', () => {
  it('takes the majority of the series', () => {
    expect(winsNeeded(1)).toBe(1)
    expect(winsNeeded(3)).toBe(2)
    expect(winsNeeded(5)).toBe(3)
  })
})
