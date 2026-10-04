import { type ActionResult, fail, ok } from '~/lib/action-result'
import { db } from '~/lib/db.server'
import { fetchGuildFromInvite } from './discord-invite.server'

export const countServers = () => db().server.count()

export function listServers() {
  return db().server.findMany({
    orderBy: { name: 'asc' },
    include: { team: { select: { id: true, name: true } } },
  })
}

export type AdminServer = Awaited<ReturnType<typeof listServers>>[number]

export function listServerChoices(currentId?: string) {
  return db().server.findMany({
    where: { OR: [{ team: null }, ...(currentId ? [{ id: currentId }] : [])] },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })
}

export async function saveServer(
  id: string | null,
  input: { name: string; iconUrl: string | null; inviteUrl: string | null }
): Promise<ActionResult> {
  let { name, iconUrl } = input
  if (input.inviteUrl && (!name || !iconUrl)) {
    const guild = await fetchGuildFromInvite(input.inviteUrl)
    name ||= guild?.name ?? ''
    iconUrl ??= guild?.iconUrl ?? null
  }
  if (!name) return fail('Не удалось определить название сервера')

  const values = { name, iconUrl, inviteUrl: input.inviteUrl }
  if (id) {
    await db().server.update({ where: { id }, data: values })
  } else {
    await db().server.create({ data: values })
  }
  return ok()
}

export async function refreshServer(id: string): Promise<ActionResult> {
  const server = await db().server.findUnique({ where: { id } })
  const guild = server?.inviteUrl
    ? await fetchGuildFromInvite(server.inviteUrl)
    : null
  if (!guild) return fail('Discord не отдал данные по этой ссылке')

  await db().server.update({
    where: { id },
    data: { name: guild.name, iconUrl: guild.iconUrl },
  })
  return ok()
}

export async function deleteServer(id: string): Promise<ActionResult> {
  const team = await db().team.findUnique({ where: { serverId: id } })
  if (team) return fail(`У сервера есть команда ${team.name}`)

  await db().server.delete({ where: { id } })
  return ok()
}
