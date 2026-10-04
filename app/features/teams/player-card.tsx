import { siDiscord, siSteam } from 'simple-icons'
import { Avatar } from '~/components/ui/avatar'
import { BrandIcon } from '~/components/ui/brand-icon'
import { type Player, playerAvatar, positionLabel } from './team'

export function PlayerCard({ player }: { player: Player }) {
  const substitute = player.position === null

  return (
    <div
      className={
        substitute
          ? 'rounded-2xl border border-line border-dashed p-5'
          : 'rounded-2xl border border-line bg-surface p-5'
      }
    >
      <div className="flex items-start justify-between">
        <Avatar
          src={playerAvatar(player)}
          name={player.nickname}
          size="lg"
          shape="circle"
        />
        <span className="font-black font-display text-3xl text-metal">
          {player.position ?? 'S'}
        </span>
      </div>

      <p className="mt-4 truncate font-semibold text-lg">{player.nickname}</p>
      <p className="text-muted text-xs uppercase tracking-wider">
        {positionLabel(player.position)}
        {player.captain && <span className="ml-2 text-accent">Капитан</span>}
      </p>

      <ul className="mt-4 space-y-2 border-line border-t pt-4 text-sm">
        <li className="flex items-center gap-2 text-white/80">
          <BrandIcon icon={siDiscord} className="text-discord" />
          <span className="truncate">
            {player.discord ? `@${player.discord.username}` : 'не привязан'}
          </span>
        </li>
        <li className="flex items-center gap-2 text-white/80">
          <BrandIcon icon={siSteam} />
          {player.steam?.profileUrl ? (
            <a
              href={player.steam.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate hover:text-accent"
            >
              {player.steam.name}
            </a>
          ) : (
            <span className="truncate">
              {player.steam?.name ?? 'не привязан'}
            </span>
          )}
        </li>
      </ul>
    </div>
  )
}
