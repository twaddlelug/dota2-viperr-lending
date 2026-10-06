import { createContext, data } from 'react-router'
import { type CurrentUser, requireUser } from '~/features/auth/session.server'
import { db } from '~/lib/db.server'

export function listManagedServers(discordId: string) {
  return db().server.findMany({
    where: { managerDiscordId: discordId },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, iconUrl: true },
  })
}

type Manager = {
  user: CurrentUser
  servers: Awaited<ReturnType<typeof listManagedServers>>
}

export const managerContext = createContext<Manager>()

export async function requireManager(request: Request): Promise<Manager> {
  const user = await requireUser(request)
  const servers = await listManagedServers(user.discordId)
  if (servers.length === 0) {
    throw data(
      'Вы не менеджер ни одного сервера — попросите организаторов указать ваш Discord ID',
      { status: 403 }
    )
  }
  return { user, servers }
}

export function managedServer(manager: Manager, serverId: string) {
  const server = manager.servers.find(({ id }) => id === serverId)
  if (!server) throw data('Сервер не найден', { status: 404 })
  return server
}
