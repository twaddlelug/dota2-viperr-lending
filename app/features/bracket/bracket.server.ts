import { DEMO_TEAMS } from '~/features/teams/demo-teams'
import { teamLogo } from '~/features/teams/team'
import { MatchStatus as DbMatchStatus } from '~/generated/prisma/enums'
import { type ActionResult, fail, ok } from '~/lib/action-result'
import { db } from '~/lib/db.server'
import {
  BRACKET_MATCHES,
  type Bracket,
  buildDoubleElimination,
  findMatch,
  type MatchResult,
  type MatchStatus,
  resultChangeConflicts,
  SEED_COUNT,
  seedingLocked,
  teamsKnown,
  winsNeeded,
} from './bracket'
import { DEMO_RESULTS } from './demo-results'

const FROM_DB: Record<DbMatchStatus, MatchStatus> = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  FINISHED: 'finished',
}

const TO_DB: Record<MatchStatus, DbMatchStatus> = {
  upcoming: DbMatchStatus.UPCOMING,
  live: DbMatchStatus.LIVE,
  finished: DbMatchStatus.FINISHED,
}

export async function getBracket(): Promise<Bracket> {
  if (!__DB_MODE__) {
    const bySeed = [...DEMO_TEAMS].sort(
      (a, b) => (a.seed ?? 99) - (b.seed ?? 99)
    )
    return buildDoubleElimination(bySeed, DEMO_RESULTS)
  }

  const [teams, matches] = await Promise.all([
    db().team.findMany({
      where: { seed: { not: null } },
      select: {
        slug: true,
        name: true,
        tag: true,
        logoUrl: true,
        seed: true,
        server: { select: { iconUrl: true } },
      },
    }),
    db().match.findMany(),
  ])

  const seeds = Array.from({ length: SEED_COUNT }, (_, i) => {
    const team = teams.find(t => t.seed === i + 1)
    return team
      ? {
          slug: team.slug,
          name: team.name,
          tag: team.tag,
          logoUrl: teamLogo(team),
        }
      : null
  })

  const results: Record<string, MatchResult> = {}
  for (const match of matches) {
    results[match.id] = {
      status: FROM_DB[match.status],
      score:
        match.scoreA !== null && match.scoreB !== null
          ? [match.scoreA, match.scoreB]
          : undefined,
      startsAt: match.startsAt?.toISOString(),
    }
  }

  return buildDoubleElimination(seeds, results)
}

export function getSeedingTeams() {
  return db().team.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, tag: true, logoUrl: true, seed: true },
  })
}

export type SeedingTeam = Awaited<ReturnType<typeof getSeedingTeams>>[number]

export async function saveSeeds(picks: string[]): Promise<ActionResult> {
  if (seedingLocked(await getBracket())) {
    return fail('Посев уже не изменить: первый раунд начался')
  }
  const chosen = picks.filter(Boolean)
  if (new Set(chosen).size !== chosen.length) {
    return fail('Команда выбрана дважды')
  }
  const known = await db().team.count({ where: { id: { in: chosen } } })
  if (known !== chosen.length) {
    return fail('Одной из команд уже нет, обновите страницу')
  }

  await db().$transaction([
    db().team.updateMany({ data: { seed: null } }),
    ...picks.flatMap((teamId, i) =>
      teamId
        ? [db().team.update({ where: { id: teamId }, data: { seed: i + 1 } })]
        : []
    ),
  ])
  return ok()
}

export async function saveMatchResult({
  matchId,
  status,
  scoreA,
  scoreB,
  startsAt,
}: {
  matchId: string
  status: MatchStatus
  scoreA: number | null
  scoreB: number | null
  startsAt: Date | null
}): Promise<ActionResult> {
  const def = BRACKET_MATCHES.find(match => match.id === matchId)
  if (!def) return fail('Неизвестный матч')

  const max = winsNeeded(def.bestOf)
  const scores = [scoreA, scoreB]
  if (scores.some(score => score !== null && (score < 0 || score > max))) {
    return fail(`Счёт в Bo${def.bestOf} — от 0 до ${max}`)
  }
  if (
    status === 'finished' &&
    (scoreA === null || scoreB === null || scoreA === scoreB)
  ) {
    return fail('У завершённого матча должен быть победитель')
  }

  const bracket = await getBracket()
  const match = findMatch(bracket, matchId)
  if (status !== 'upcoming' && !(match && teamsKnown(match))) {
    return fail('Обе команды этого матча ещё не известны')
  }
  const conflicts = resultChangeConflicts(bracket, matchId, {
    status,
    score: scoreA !== null && scoreB !== null ? [scoreA, scoreB] : undefined,
  })
  if (conflicts.length > 0) {
    return fail(
      `Сначала сбросьте ${conflicts.join(', ')}: они уже идут по текущему результату`
    )
  }

  const values = { scoreA, scoreB, status: TO_DB[status], startsAt }
  await db().match.upsert({
    where: { id: matchId },
    create: { id: matchId, ...values },
    update: values,
  })
  return ok()
}
