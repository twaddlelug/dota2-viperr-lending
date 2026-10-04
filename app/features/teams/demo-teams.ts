import type { Player, Position, Server, Team } from './team'

export const DEMO_SERVERS: Server[] = [
  { id: 'viperr', name: 'Viperr' },
  { id: 'nightfall', name: 'Nightfall Hub' },
  { id: 'iron-tower', name: 'Iron Tower' },
  { id: 'north-wind', name: 'North Wind' },
  { id: 'red-moon', name: 'Red Moon' },
  { id: 'frost-throne', name: 'Frost Throne' },
  { id: 'ancient-hall', name: 'Ancient Hall' },
  { id: 'dire-den', name: 'Dire Den' },
]

function demoServer(id: string) {
  const server = DEMO_SERVERS.find(server => server.id === id)
  if (!server) throw new Error(`Unknown demo server: ${id}`)
  return server
}

const player = (
  slug: string,
  nickname: string,
  position: Position | null,
  captain = false
): Player => ({
  id: `${slug}-${nickname.toLowerCase()}`,
  nickname,
  position,
  captain,
  discord: { username: nickname.toLowerCase() },
  steam: { name: nickname },
})

const team = (
  slug: string,
  name: string,
  tag: string,
  serverId: string,
  seed: number,
  names: [string, string, string, string, string],
  captain: Position,
  substitute?: string
): Team => ({
  id: slug,
  slug,
  name,
  tag,
  seed,
  server: demoServer(serverId),
  players: names.map((nickname, i) => {
    const position = (i + 1) as Position
    return player(slug, nickname, position, position === captain)
  }),
  substitute: substitute ? player(slug, substitute, null) : undefined,
})

export const DEMO_TEAMS: Team[] = [
  team(
    'venom-squad',
    'Venom Squad',
    'VNM',
    'viperr',
    1,
    ['Fang', 'Toxin', 'Coil', 'Hiss', 'Scale'],
    2,
    'Mamba'
  ),
  team(
    'iron-guard',
    'Iron Guard',
    'IRG',
    'iron-tower',
    2,
    ['Anvil', 'Rivet', 'Bastion', 'Forge', 'Plate'],
    3
  ),
  team(
    'last-light',
    'Last Light',
    'LST',
    'north-wind',
    3,
    ['Ember', 'Flare', 'Wick', 'Glow', 'Spark'],
    5
  ),
  team(
    'green-cobra',
    'Green Cobra',
    'GCB',
    'red-moon',
    4,
    ['Jade', 'Spit', 'Hood', 'Moss', 'Leaf'],
    5
  ),
  team(
    'night-owls',
    'Night Owls',
    'NOW',
    'nightfall',
    5,
    ['Talon', 'Hoot', 'Dusk', 'Feather', 'Gaze'],
    3,
    'Wing'
  ),
  team(
    'eclipse',
    'Eclipse',
    'ECL',
    'frost-throne',
    6,
    ['Umbra', 'Corona', 'Phase', 'Halo', 'Void'],
    2
  ),
  team(
    'black-mamba',
    'Black Mamba',
    'BLM',
    'dire-den',
    7,
    ['Shade', 'Raze', 'Onyx', 'Drift', 'Ash'],
    4,
    'Cinder'
  ),
  team(
    'rust-legion',
    'Rust Legion',
    'RST',
    'ancient-hall',
    8,
    ['Oxide', 'Gear', 'Crank', 'Bolt', 'Weld'],
    1
  ),
]
