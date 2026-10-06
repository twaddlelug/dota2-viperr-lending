import { siDiscord, siSteam } from 'simple-icons'
import { Avatar } from '~/components/ui/avatar'
import { BrandIcon } from '~/components/ui/brand-icon'
import { CaptainBadge } from './captain-badge'
import { SlotMarker } from './slot-marker'
import { type Player, playerAvatar, positionLabel } from './team'

export function RosterList({ players }: { players: Player[] }) {
  return (
    <ol className="divide-y divide-line border-line border-y">
      {players.map(player => (
        <li key={player.id} className="flex items-center gap-4 py-4 sm:gap-6">
          <span className="w-8 shrink-0 text-center text-2xl sm:w-10 sm:text-3xl">
            <SlotMarker position={player.position} />
          </span>
          <span className="relative shrink-0">
            <Avatar
              src={playerAvatar(player)}
              name={player.nickname}
              size="md"
              shape="circle"
            />
            {player.captain && <CaptainBadge />}
          </span>
          <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-6">
            <p className="truncate font-semibold text-lg sm:w-56 sm:shrink-0">
              {player.nickname}
            </p>
            <p className="text-muted text-xs uppercase tracking-wider">
              {positionLabel(player.position)}
            </p>
          </div>
          <Accounts player={player} />
        </li>
      ))}
    </ol>
  )
}

function Accounts({ player }: { player: Player }) {
  const { discord, steam } = player

  return (
    <div className="flex shrink-0 items-center gap-5 text-sm text-white/70">
      {discord && (
        <span className="hidden items-center gap-2 md:flex">
          <BrandIcon icon={siDiscord} className="text-discord" />
          <span>@{discord.username}</span>
        </span>
      )}
      {steam?.profileUrl ? (
        <a
          href={steam.profileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Steam: ${steam.name}`}
          className="flex items-center gap-2 transition-colors hover:text-accent"
        >
          <BrandIcon icon={siSteam} />
          <span className="hidden md:inline">{steam.name}</span>
        </a>
      ) : (
        steam && (
          <span className="hidden items-center gap-2 md:flex">
            <BrandIcon icon={siSteam} />
            {steam.name}
          </span>
        )
      )}
    </div>
  )
}
