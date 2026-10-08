import { DEMO_SERVERS, DEMO_TEAMS } from '~/features/teams/demo-teams'
import { db } from '~/lib/db.server'

export type Partner = {
  id: string
  name: string
  iconUrl?: string
  inviteUrl?: string
  team?: { slug: string; name: string }
}

const byName = (a: Partner, b: Partner) => a.name.localeCompare(b.name, 'ru')

function demoPartners(): Partner[] {
  return DEMO_SERVERS.map(server => {
    const team = DEMO_TEAMS.find(team => team.server.id === server.id)
    return { ...server, team: team && { slug: team.slug, name: team.name } }
  }).sort(byName)
}

export async function getPartners(): Promise<Partner[]> {
  if (!__DB_MODE__) return demoPartners()
  const servers = await db().server.findMany({
    orderBy: { name: 'asc' },
    include: { team: { select: { slug: true, name: true } } },
  })
  return servers.map(server => ({
    id: server.id,
    name: server.name,
    iconUrl: server.iconUrl ?? undefined,
    inviteUrl: server.inviteUrl ?? undefined,
    team: server.team ?? undefined,
  }))
}
