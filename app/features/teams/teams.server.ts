import type { Prisma } from '~/generated/prisma/client'
import { type ActionResult, fail, ok } from '~/lib/action-result'
import { db, isUniqueViolation } from '~/lib/db.server'
import { DEMO_TEAMS } from './demo-teams'
import { slugify } from './slug'
import { type Player, type Team, teamLogo, toPosition } from './team'

const teamInclude = {
  server: true,
  players: { include: { user: true }, orderBy: { position: 'asc' } },
} satisfies Prisma.TeamInclude

type TeamRow = Prisma.TeamGetPayload<{ include: typeof teamInclude }>

export async function getTeams(): Promise<Team[]> {
  if (!__DB_MODE__) return DEMO_TEAMS
  const rows = await db().team.findMany({
    include: teamInclude,
    orderBy: [{ seed: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
  })
  return rows.map(toTeam)
}

export async function getTeam(slug: string): Promise<Team | null> {
  if (!__DB_MODE__) return DEMO_TEAMS.find(team => team.slug === slug) ?? null
  const row = await db().team.findUnique({
    where: { slug },
    include: teamInclude,
  })
  return row ? toTeam(row) : null
}

function toTeam(row: TeamRow): Team {
  const players = row.players.map(toPlayer)
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tag: row.tag,
    logoUrl: teamLogo(row),
    seed: row.seed ?? undefined,
    server: {
      id: row.server.id,
      name: row.server.name,
      iconUrl: row.server.iconUrl ?? undefined,
      inviteUrl: row.server.inviteUrl ?? undefined,
    },
    players: players.filter(player => player.position !== null),
    coach: players.find(player => player.position === null),
  }
}

function toPlayer(row: TeamRow['players'][number]): Player {
  return {
    id: row.id,
    nickname: row.nickname,
    position: toPosition(row.position),
    captain: row.isCaptain,
    discord: row.user
      ? {
          username: row.user.username,
          avatarUrl: row.user.avatarUrl ?? undefined,
        }
      : undefined,
    steam: row.user?.steamId
      ? {
          name: row.user.steamName ?? row.user.steamId,
          profileUrl: row.user.steamProfileUrl ?? undefined,
          avatarUrl: row.user.steamAvatarUrl ?? undefined,
        }
      : undefined,
  }
}

export async function countTeams() {
  const [total, seeded] = await Promise.all([
    db().team.count(),
    db().team.count({ where: { seed: { not: null } } }),
  ])
  return { total, seeded }
}

export function listTeamsForAdmin() {
  return db().team.findMany({
    orderBy: [{ seed: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
    include: {
      server: { select: { name: true, iconUrl: true } },
      players: {
        select: {
          position: true,
          userId: true,
          user: { select: { steamId: true } },
        },
      },
    },
  })
}

export type AdminTeamSummary = Awaited<
  ReturnType<typeof listTeamsForAdmin>
>[number]

export function getTeamForAdmin(teamId: string) {
  return db().team.findUnique({
    where: { id: teamId },
    include: { server: true, players: { include: { user: true } } },
  })
}

export type AdminTeam = NonNullable<Awaited<ReturnType<typeof getTeamForAdmin>>>
export type AdminPlayer = AdminTeam['players'][number]

export async function createTeam(input: {
  name: string
  tag: string
  serverId: string
}): Promise<ActionResult<{ teamId: string }>> {
  const tag = input.tag.toUpperCase()
  if (!input.name || !tag || !input.serverId) {
    return fail('Заполните все поля')
  }

  try {
    const team = await db().team.create({
      data: {
        name: input.name,
        tag,
        serverId: input.serverId,
        slug: slugify(input.name, tag),
      },
    })
    return ok({ teamId: team.id })
  } catch (error) {
    if (isUniqueViolation(error)) {
      return fail('Команда с таким названием или на этом сервере уже есть')
    }
    throw error
  }
}

export async function updateTeam(
  teamId: string,
  input: {
    name: string
    tag: string
    serverId: string
    slug: string
    logoUrl: string | null
  }
): Promise<ActionResult> {
  const tag = input.tag.toUpperCase()
  if (!input.name || !tag) return fail('Укажите название и тег')

  try {
    await db().team.update({
      where: { id: teamId },
      data: {
        name: input.name,
        tag,
        slug: slugify(input.slug || input.name, tag),
        logoUrl: input.logoUrl,
        serverId: input.serverId,
      },
    })
    return ok()
  } catch (error) {
    if (isUniqueViolation(error)) return fail('Такой адрес страницы уже занят')
    throw error
  }
}

export async function deleteTeam(teamId: string) {
  await db().team.delete({ where: { id: teamId } })
}
