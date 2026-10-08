export type Server = {
  id: string
  name: string
  iconUrl?: string
  inviteUrl?: string
}

export type Position = 1 | 2 | 3 | 4 | 5

export type Player = {
  id: string
  nickname: string
  position: Position | null
  captain: boolean
  discord?: {
    username: string
    avatarUrl?: string
  }
  steam?: {
    name: string
    profileUrl?: string
    avatarUrl?: string
  }
}

export type Team = {
  id: string
  slug: string
  name: string
  tag: string
  logoUrl?: string
  bannerUrl?: string
  server: Server
  seed?: number
  players: Player[]
  coach?: Player
}

export const NAME_MAX_LENGTH = 32

export const TAG_MAX_LENGTH = 5

export const POSITIONS: Position[] = [1, 2, 3, 4, 5]

export const ROSTER_SLOTS: Array<Position | null> = [...POSITIONS, null]

const POSITION_LABELS: Record<Position, string> = {
  1: 'Carry',
  2: 'Mid',
  3: 'Offlane',
  4: 'Soft Support',
  5: 'Hard Support',
}

const isPosition = (value: unknown): value is Position =>
  typeof value === 'number' && value >= 1 && value <= 5

export const toPosition = (value: unknown): Position | null =>
  isPosition(value) ? value : null

export const positionLabel = (position: Position | null) =>
  position === null ? 'Тренер' : POSITION_LABELS[position]

export const positionWithNumber = (position: Position | null) =>
  position === null
    ? positionLabel(position)
    : `${position} · ${POSITION_LABELS[position]}`

export const playerAvatar = (player: Player) =>
  player.discord?.avatarUrl ?? player.steam?.avatarUrl

export const teamLogo = (team: {
  logoUrl: string | null
  server: { iconUrl: string | null }
}) => team.logoUrl ?? team.server.iconUrl ?? undefined
