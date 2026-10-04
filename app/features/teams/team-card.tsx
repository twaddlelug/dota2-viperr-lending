import { Link } from 'react-router'
import { Avatar } from '~/components/ui/avatar'
import {
  type Player,
  playerAvatar,
  positionWithNumber,
  type Team,
} from './team'

export function TeamCard({
  team,
  status,
}: {
  team: Team
  status: React.ReactNode
}) {
  return (
    <Link
      to={`/teams/${team.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/50"
    >
      <div className="mb-5 flex items-center gap-2 border-line border-b pb-4 text-muted text-xs uppercase tracking-wider">
        <Avatar
          src={team.server.iconUrl}
          name={team.server.name}
          size="xs"
          shape="circle"
        />
        <span className="truncate">{team.server.name}</span>
      </div>

      <div className="flex items-center gap-4">
        <Avatar src={team.logoUrl} name={team.name} initials={team.tag} />
        <div className="min-w-0">
          <h3 className="truncate font-bold font-display uppercase">
            {team.name}
          </h3>
          <p className="font-mono text-muted text-xs">[{team.tag}]</p>
        </div>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {team.players.map(player => (
          <PlayerRow key={player.id} player={player} />
        ))}
        {team.substitute && <PlayerRow player={team.substitute} />}
      </ul>

      <div className="mt-6 flex items-center justify-between border-line border-t pt-4">
        {status}
        <span
          aria-hidden
          className="text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
        >
          →
        </span>
      </div>
    </Link>
  )
}

function PlayerRow({ player }: { player: Player }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <Avatar
        src={playerAvatar(player)}
        name={player.nickname}
        size="sm"
        shape="circle"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {player.nickname}
          {player.captain && (
            <span className="ml-2 text-[11px] text-accent uppercase">C</span>
          )}
        </p>
        <p className="truncate font-mono text-muted text-xs">
          {player.discord ? `@${player.discord.username}` : 'ждёт инвайт'}
        </p>
      </div>
      <span className="shrink-0 text-muted text-xs">
        {positionWithNumber(player.position)}
      </span>
    </li>
  )
}
