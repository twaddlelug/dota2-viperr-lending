import { randomBytes } from 'node:crypto'
import { type ActionResult, fail, ok } from '~/lib/action-result'
import { db, isRecordNotFound, isUniqueViolation } from '~/lib/db.server'
import { NAME_MAX_LENGTH, type Position, teamLogo, toPosition } from './team'

type PlayerInput = { nickname: string; position: Position | null }

const PLAYER_NOT_FOUND = 'Игрок не найден'

function nicknameError(nickname: string) {
  if (!nickname) return fail('Укажите ник')
  if (nickname.length > NAME_MAX_LENGTH) {
    return fail(`Ник — не длиннее ${NAME_MAX_LENGTH} символов`)
  }
}

export async function addPlayer(
  teamId: string,
  { nickname, position }: PlayerInput
): Promise<ActionResult> {
  const invalid = nicknameError(nickname)
  if (invalid) return invalid
  const taken = await db().player.findFirst({ where: { teamId, position } })
  if (taken) return fail('Слот уже занят')

  return rosterWrite(() =>
    db().player.create({
      data: { teamId, nickname, position, inviteCode: newInviteCode() },
    })
  )
}

export async function updatePlayer(
  teamId: string,
  playerId: string,
  { nickname, position }: PlayerInput
): Promise<ActionResult> {
  const invalid = nicknameError(nickname)
  if (invalid) return invalid

  return rosterWrite(() =>
    db().$transaction(async tx => {
      const player = await tx.player.findUniqueOrThrow({
        where: { id: playerId, teamId },
      })
      const occupant = await tx.player.findFirst({
        where: { teamId, position, NOT: { id: playerId } },
      })
      await tx.player.update({
        where: { id: playerId },
        data: { position: null },
      })
      if (occupant) {
        await tx.player.update({
          where: { id: occupant.id },
          data: { position: player.position },
        })
      }
      const becomesCoach = position === null
      await tx.player.update({
        where: { id: playerId },
        data: {
          nickname,
          position,
          ...(becomesCoach && { isCaptain: false }),
        },
      })
    })
  )
}

export async function toggleCaptain(
  teamId: string,
  playerId: string
): Promise<ActionResult> {
  const player = await db().player.findUnique({
    where: { id: playerId, teamId },
  })
  if (!player) return fail(PLAYER_NOT_FOUND)
  if (player.position === null) return fail('Тренер не может быть капитаном')

  return rosterWrite(() =>
    db().$transaction([
      db().player.updateMany({ where: { teamId }, data: { isCaptain: false } }),
      ...(player.isCaptain
        ? []
        : [
            db().player.update({
              where: { id: playerId },
              data: { isCaptain: true },
            }),
          ]),
    ])
  )
}

export function renewInvite(teamId: string, playerId: string) {
  return rosterWrite(() =>
    db().player.updateMany({
      where: { id: playerId, teamId, userId: null },
      data: { inviteCode: newInviteCode() },
    })
  )
}

export function unlinkPlayer(teamId: string, playerId: string) {
  return rosterWrite(() =>
    db().player.update({
      where: { id: playerId, teamId },
      data: { userId: null, inviteCode: newInviteCode() },
    })
  )
}

export function deletePlayer(teamId: string, playerId: string) {
  return rosterWrite(() =>
    db().player.delete({ where: { id: playerId, teamId } })
  )
}

async function rosterWrite(
  write: () => Promise<unknown>
): Promise<ActionResult> {
  try {
    await write()
    return ok()
  } catch (error) {
    if (isUniqueViolation(error)) return fail('Слот уже занят')
    if (isRecordNotFound(error)) return fail(PLAYER_NOT_FOUND)
    throw error
  }
}

const newInviteCode = () => randomBytes(16).toString('base64url')

export function getInvite(code: string) {
  return db().player.findUnique({
    where: { inviteCode: code },
    include: { team: { include: { server: true } } },
  })
}

export async function claimInvite(code: string, userId: string) {
  try {
    const { count } = await db().player.updateMany({
      where: { inviteCode: code, userId: null },
      data: { userId, inviteCode: null },
    })
    return count > 0 ? 'claimed' : 'not-found'
  } catch (error) {
    if (isUniqueViolation(error)) return 'already-on-roster'
    throw error
  }
}

export async function getRosterProgress() {
  const [players, linked, steam] = await Promise.all([
    db().player.count(),
    db().player.count({ where: { userId: { not: null } } }),
    db().player.count({ where: { user: { steamId: { not: null } } } }),
  ])
  return { players, linked, steam, pending: players - linked }
}

export async function listPendingInvites(limit = 12) {
  const players = await db().player.findMany({
    where: { userId: null, inviteCode: { not: null } },
    orderBy: [{ team: { name: 'asc' } }, { position: 'asc' }],
    take: limit,
    include: {
      team: {
        select: {
          id: true,
          name: true,
          tag: true,
          logoUrl: true,
          server: { select: { iconUrl: true } },
        },
      },
    },
  })
  return players.map(({ team, ...player }) => ({
    id: player.id,
    nickname: player.nickname,
    position: toPosition(player.position),
    team: {
      id: team.id,
      name: team.name,
      tag: team.tag,
      logoUrl: teamLogo(team),
    },
    inviteCode: player.inviteCode,
  }))
}
