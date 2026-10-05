import { randomBytes } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import { DEMO_RESULTS } from '../app/features/bracket/demo-results'
import { DEMO_SERVERS, DEMO_TEAMS } from '../app/features/teams/demo-teams'
import { PrismaClient } from '../app/generated/prisma/client'

const STATUS = {
  upcoming: 'UPCOMING',
  live: 'LIVE',
  finished: 'FINISHED',
} as const

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

async function main() {
  if ((await db.server.count()) > 0) {
    console.log('Database is not empty, seed skipped.')
    return
  }

  for (const server of DEMO_SERVERS) {
    const team = DEMO_TEAMS.find(t => t.server.id === server.id)
    const created = await db.server.create({ data: { name: server.name } })
    if (!team) continue

    const players = team.coach ? [...team.players, team.coach] : team.players
    await db.team.create({
      data: {
        slug: team.slug,
        name: team.name,
        tag: team.tag,
        seed: team.seed,
        serverId: created.id,
        players: {
          create: players.map(player => ({
            nickname: player.nickname,
            position: player.position,
            isCaptain: player.captain,
            inviteCode: randomBytes(16).toString('base64url'),
          })),
        },
      },
    })
  }

  for (const [id, result] of Object.entries(DEMO_RESULTS)) {
    await db.match.create({
      data: {
        id,
        scoreA: result.score?.[0],
        scoreB: result.score?.[1],
        status: STATUS[result.status ?? 'upcoming'],
        startsAt: result.startsAt ? new Date(result.startsAt) : null,
      },
    })
  }

  console.log(
    `Seeded ${DEMO_SERVERS.length} servers, ${DEMO_TEAMS.length} teams and ${Object.keys(DEMO_RESULTS).length} matches.`
  )
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
