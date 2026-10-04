import type { MatchResult } from './bracket'

export const DEMO_RESULTS: Record<string, MatchResult> = {
  'ub-qf1': {
    score: [2, 0],
    status: 'finished',
    startsAt: '2026-10-10T15:00:00+03:00',
  },
  'ub-qf2': {
    score: [2, 1],
    status: 'finished',
    startsAt: '2026-10-10T18:00:00+03:00',
  },
  'ub-qf3': {
    score: [2, 1],
    status: 'finished',
    startsAt: '2026-10-11T15:00:00+03:00',
  },
  'ub-qf4': {
    score: [1, 2],
    status: 'finished',
    startsAt: '2026-10-11T18:00:00+03:00',
  },
  'lb-r1-1': {
    score: [0, 2],
    status: 'finished',
    startsAt: '2026-10-12T15:00:00+03:00',
  },
  'lb-r1-2': {
    score: [2, 1],
    status: 'finished',
    startsAt: '2026-10-12T18:00:00+03:00',
  },
  'ub-sf1': {
    score: [2, 1],
    status: 'finished',
    startsAt: '2026-10-17T15:00:00+03:00',
  },
  'ub-sf2': {
    score: [1, 1],
    status: 'live',
    startsAt: '2026-10-17T18:00:00+03:00',
  },
  'lb-qf1': { startsAt: '2026-10-18T15:00:00+03:00' },
  'lb-qf2': { startsAt: '2026-10-18T18:00:00+03:00' },
  'lb-sf': { startsAt: '2026-10-19T17:00:00+03:00' },
  'ub-f': { startsAt: '2026-10-24T15:00:00+03:00' },
  'lb-f': { startsAt: '2026-10-24T18:00:00+03:00' },
  gf: { startsAt: '2026-10-25T17:00:00+03:00' },
}
