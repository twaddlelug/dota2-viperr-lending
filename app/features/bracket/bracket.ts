import type { Team } from '~/features/teams/team'

export type TeamRef = Pick<Team, 'slug' | 'name' | 'tag' | 'logoUrl'>

const MATCH_STATUSES = ['upcoming', 'live', 'finished'] as const

export type MatchStatus = (typeof MATCH_STATUSES)[number]

export const toMatchStatus = (value: string): MatchStatus =>
  MATCH_STATUSES.find(status => status === value) ?? 'upcoming'

type SlotSource = { seed: number } | { winnerOf: string } | { loserOf: string }

type MatchDef = {
  id: string
  label: string
  bestOf: number
  slots: [SlotSource, SlotSource]
}

type SectionDef = {
  id: 'upper' | 'lower' | 'final'
  name: string
  rounds: Array<{ name: string; matches: MatchDef[] }>
}

export type MatchResult = {
  score?: [number, number]
  status?: MatchStatus
  startsAt?: string
}

export type Slot = {
  team: TeamRef | null
  score: number | null
  placeholder: string
}

export type Match = {
  id: string
  label: string
  sectionId: SectionDef['id']
  roundName: string
  status: MatchStatus
  bestOf: number
  startsAt?: string
  slots: [Slot, Slot]
  winner: 0 | 1 | null
}

export type Section = {
  id: SectionDef['id']
  name: string
  rounds: Array<{ name: string; matches: Match[] }>
}

export type Bracket = Section[]

export type Standing = {
  state: 'champion' | 'runner-up' | 'alive' | 'eliminated'
  roundName: string
}

export type SlotResult = 'won' | 'lost' | 'none'

export const slotResult = (match: Match, index: number): SlotResult =>
  match.winner === null ? 'none' : match.winner === index ? 'won' : 'lost'

const match = (
  id: string,
  label: string,
  a: SlotSource,
  b: SlotSource,
  bestOf = 3
): MatchDef => ({ id, label, bestOf, slots: [a, b] })

const W = (id: string) => ({ winnerOf: id })
const L = (id: string) => ({ loserOf: id })
const S = (seed: number) => ({ seed })

const DOUBLE_ELIMINATION_8: SectionDef[] = [
  {
    id: 'upper',
    name: 'Upper Bracket',
    rounds: [
      {
        name: 'Upper Quarterfinals',
        matches: [
          match('ub-qf1', 'UB QF1', S(1), S(8)),
          match('ub-qf2', 'UB QF2', S(4), S(5)),
          match('ub-qf3', 'UB QF3', S(2), S(7)),
          match('ub-qf4', 'UB QF4', S(3), S(6)),
        ],
      },
      {
        name: 'Upper Semifinals',
        matches: [
          match('ub-sf1', 'UB SF1', W('ub-qf1'), W('ub-qf2')),
          match('ub-sf2', 'UB SF2', W('ub-qf3'), W('ub-qf4')),
        ],
      },
      {
        name: 'Upper Final',
        matches: [match('ub-f', 'UB Final', W('ub-sf1'), W('ub-sf2'))],
      },
    ],
  },
  {
    id: 'lower',
    name: 'Lower Bracket',
    rounds: [
      {
        name: 'Lower Round 1',
        matches: [
          match('lb-r1-1', 'LB R1-1', L('ub-qf1'), L('ub-qf2')),
          match('lb-r1-2', 'LB R1-2', L('ub-qf3'), L('ub-qf4')),
        ],
      },
      {
        name: 'Lower Quarterfinals',
        matches: [
          match('lb-qf1', 'LB QF1', W('lb-r1-1'), L('ub-sf2')),
          match('lb-qf2', 'LB QF2', W('lb-r1-2'), L('ub-sf1')),
        ],
      },
      {
        name: 'Lower Semifinal',
        matches: [match('lb-sf', 'LB SF', W('lb-qf1'), W('lb-qf2'))],
      },
      {
        name: 'Lower Final',
        matches: [match('lb-f', 'LB Final', W('lb-sf'), L('ub-f'))],
      },
    ],
  },
  {
    id: 'final',
    name: 'Grand Final',
    rounds: [
      {
        name: 'Grand Final',
        matches: [match('gf', 'Grand Final', W('ub-f'), W('lb-f'), 5)],
      },
    ],
  },
]

function resultWinner(result: MatchResult): 0 | 1 | null {
  if (result.status !== 'finished' || !result.score) return null
  return result.score[0] > result.score[1] ? 0 : 1
}

export function buildDoubleElimination(
  seeds: Array<TeamRef | null>,
  results: Record<string, MatchResult>
): Bracket {
  const resolved = new Map<string, Match>()

  const sourceTeam = (source: SlotSource): TeamRef | null => {
    if ('seed' in source) return seeds[source.seed - 1] ?? null
    const id = 'winnerOf' in source ? source.winnerOf : source.loserOf
    const from = resolved.get(id)
    if (!from || from.winner === null) return null
    const index = 'winnerOf' in source ? from.winner : 1 - from.winner
    return from.slots[index].team
  }

  const placeholder = (source: SlotSource) => {
    if ('seed' in source) return `Seed ${source.seed}`
    const id = 'winnerOf' in source ? source.winnerOf : source.loserOf
    const label = resolved.get(id)?.label ?? id
    return `${'winnerOf' in source ? 'Winner' : 'Loser'} ${label}`
  }

  return DOUBLE_ELIMINATION_8.map(section => ({
    id: section.id,
    name: section.name,
    rounds: section.rounds.map(round => ({
      name: round.name,
      matches: round.matches.map(def => {
        const result = results[def.id] ?? {}
        const status = result.status ?? 'upcoming'
        const score = result.score
        const resolvedMatch: Match = {
          id: def.id,
          label: def.label,
          sectionId: section.id,
          roundName: round.name,
          status,
          bestOf: def.bestOf,
          startsAt: result.startsAt,
          slots: [
            {
              team: sourceTeam(def.slots[0]),
              score: score?.[0] ?? null,
              placeholder: placeholder(def.slots[0]),
            },
            {
              team: sourceTeam(def.slots[1]),
              score: score?.[1] ?? null,
              placeholder: placeholder(def.slots[1]),
            },
          ],
          winner: resultWinner(result),
        }
        resolved.set(def.id, resolvedMatch)
        return resolvedMatch
      }),
    })),
  }))
}

export const BRACKET_MATCHES = DOUBLE_ELIMINATION_8.flatMap(section =>
  section.rounds.flatMap(round =>
    round.matches.map(({ id, label, bestOf }) => ({
      id,
      label,
      bestOf,
      roundName: round.name,
    }))
  )
)

export const SEED_COUNT = 8

export const SEED_PAIRS = DOUBLE_ELIMINATION_8[0].rounds[0].matches.map(
  ({ label, slots }) => ({
    label,
    seeds: slots.map(slot => ('seed' in slot ? slot.seed : 0)) as [
      number,
      number,
    ],
  })
)

export const winsNeeded = (bestOf: number) => Math.ceil(bestOf / 2)

const allMatches = (bracket: Bracket) =>
  bracket.flatMap(section => section.rounds.flatMap(round => round.matches))

export const findMatch = (bracket: Bracket, matchId: string) =>
  allMatches(bracket).find(match => match.id === matchId)

const sourceMatchId = (source: SlotSource) =>
  'winnerOf' in source
    ? source.winnerOf
    : 'loserOf' in source
      ? source.loserOf
      : null

const dependentMatchIds = (matchId: string) =>
  DOUBLE_ELIMINATION_8.flatMap(section =>
    section.rounds.flatMap(round => round.matches)
  )
    .filter(def => def.slots.some(slot => sourceMatchId(slot) === matchId))
    .map(def => def.id)

export function resultChangeConflicts(
  bracket: Bracket,
  matchId: string,
  next: MatchResult
): string[] {
  const matches = allMatches(bracket)
  const current = matches.find(match => match.id === matchId)
  if (!current || current.winner === resultWinner(next)) return []

  return dependentMatchIds(matchId).flatMap(id => {
    const dependent = matches.find(match => match.id === id)
    return dependent && dependent.status !== 'upcoming' ? [dependent.label] : []
  })
}

export const seedingLocked = (bracket: Bracket) =>
  bracket
    .find(section => section.id === 'upper')
    ?.rounds[0]?.matches.some(match => match.status !== 'upcoming') ?? false

export function getStandings(bracket: Bracket): Map<string, Standing> {
  const standings = new Map<string, Standing>()

  for (const match of allMatches(bracket)) {
    match.slots.forEach(({ team }, i) => {
      if (!team) return

      let state: Standing['state'] = 'alive'
      if (match.winner !== null) {
        const won = match.winner === i
        if (match.sectionId === 'final') state = won ? 'champion' : 'runner-up'
        else if (match.sectionId === 'lower' && !won) state = 'eliminated'
      }
      standings.set(team.slug, { state, roundName: match.roundName })
    })
  }

  return standings
}

export function getTeamMatches(bracket: Bracket, slug: string): Match[] {
  return allMatches(bracket).filter(match =>
    match.slots.some(slot => slot.team?.slug === slug)
  )
}

export function getFeaturedMatch(bracket: Bracket): Match | undefined {
  const matches = allMatches(bracket)
  return (
    matches.find(match => match.status === 'live') ??
    matches
      .filter(match => match.status === 'upcoming' && teamsKnown(match))
      .sort(byStartTime)[0]
  )
}

export function getAgenda(bracket: Bracket, limit = 5): Match[] {
  const matches = allMatches(bracket)

  const scheduled = (match: Match) =>
    Boolean(match.startsAt) || teamsKnown(match)

  return [
    ...matches.filter(match => match.status === 'live'),
    ...matches
      .filter(match => match.status === 'upcoming' && scheduled(match))
      .sort(byStartTime),
  ].slice(0, limit)
}

export const teamsKnown = (match: Match) =>
  match.slots.every(slot => slot.team !== null)

const startTime = (match: Match) =>
  match.startsAt ? Date.parse(match.startsAt) : Number.POSITIVE_INFINITY
const byStartTime = (a: Match, b: Match) => startTime(a) - startTime(b)
