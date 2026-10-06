import { ExternalLink, Server } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '~/components/admin/badge'
import { PageTitle } from '~/components/admin/page-title'
import { Avatar } from '~/components/ui/avatar'
import { teamLogo } from '../team'
import type { AdminTeam } from '../teams.server'

export function TeamTitle({
  team,
  back,
  children,
}: {
  team: AdminTeam
  back?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <PageTitle
        back={back}
        title={
          <span className="flex items-center gap-4">
            <Avatar
              src={teamLogo(team)}
              name={team.name}
              initials={team.tag}
              size="md"
            />
            <span>
              {team.name}
              <span className="ml-3 font-mono text-base text-muted">
                {team.tag}
              </span>
            </span>
          </span>
        }
      >
        <Link
          to={`/teams/${team.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 font-semibold text-sm transition-colors hover:border-white/30 hover:bg-white/5"
        >
          <ExternalLink className="h-4 w-4" /> На сайте
        </Link>
        {children}
      </PageTitle>

      <div className="-mt-4 mb-8 flex flex-wrap gap-2">
        <Badge>
          <Server />
          {team.server.name}
        </Badge>
        <Badge tone={team.seed ? 'green' : 'gray'}>
          {team.seed ? `Посев ${team.seed}` : 'Без посева'}
        </Badge>
      </div>
    </>
  )
}
