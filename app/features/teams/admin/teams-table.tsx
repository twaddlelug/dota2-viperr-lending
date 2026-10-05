import { ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Avatar } from '~/components/ui/avatar'
import { cn } from '~/lib/cn'
import { ROSTER_SLOTS, teamLogo } from '../team'
import type { AdminTeamSummary } from '../teams.server'

export function TeamsTable({ teams }: { teams: AdminTeamSummary[] }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-muted text-xs">
          <tr>
            <th className="px-5 py-3 font-normal">#</th>
            <th className="px-5 py-3 font-normal">Команда</th>
            <th className="px-5 py-3 font-normal">Сервер</th>
            <th className="px-5 py-3 font-normal">Состав</th>
            <th className="px-5 py-3 font-normal">Инвайт</th>
            <th className="px-5 py-3 font-normal">Steam</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {teams.map(team => {
            const linked = team.players.filter(p => p.userId).length
            const steam = team.players.filter(p => p.user?.steamId).length
            const total = team.players.length
            return (
              <tr
                key={team.id}
                onClick={() => navigate(`/admin/teams/${team.id}`)}
                className="cursor-pointer border-line border-t transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-5 py-3 font-mono text-muted">
                  {team.seed ?? '—'}
                </td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-3">
                    <Avatar
                      src={teamLogo(team)}
                      name={team.name}
                      initials={team.tag}
                      size="sm"
                    />
                    <Link
                      to={`/admin/teams/${team.id}`}
                      className="font-semibold"
                    >
                      {team.name}
                    </Link>
                    <span className="font-mono text-muted text-xs">
                      {team.tag}
                    </span>
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2 text-muted">
                    <Avatar
                      src={team.server.iconUrl ?? undefined}
                      name={team.server.name}
                      size="xs"
                      shape="circle"
                    />
                    {team.server.name}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="flex gap-1">
                    {ROSTER_SLOTS.map(slot => (
                      <span
                        key={slot ?? 'coach'}
                        className={cn(
                          'h-2 w-4 rounded-full',
                          team.players.some(p => p.position === slot)
                            ? slot === null
                              ? 'bg-white/50'
                              : 'bg-success'
                            : 'bg-white/10'
                        )}
                      />
                    ))}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Progress value={linked} total={total} />
                </td>
                <td className="px-5 py-3">
                  <Progress value={steam} total={total} />
                </td>
                <td className="px-5 py-3 text-right text-muted">
                  <ChevronRight className="inline h-4 w-4" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Progress({ value, total }: { value: number; total: number }) {
  return (
    <span
      className={cn(
        'font-mono',
        total > 0 && value === total ? 'text-success' : 'text-muted'
      )}
    >
      {value}/{total}
    </span>
  )
}
