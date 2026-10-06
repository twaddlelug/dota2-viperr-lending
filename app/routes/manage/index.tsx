import { ChevronRight } from 'lucide-react'
import { Link, redirect } from 'react-router'
import { Card } from '~/components/admin/card'
import { PageTitle } from '~/components/admin/page-title'
import { Avatar } from '~/components/ui/avatar'
import { managerContext } from '~/features/servers/manager.server'
import type { Route } from './+types/index'

export function loader({ context }: Route.LoaderArgs) {
  const { servers } = context.get(managerContext)
  if (servers.length === 1) throw redirect(`/manage/${servers[0].id}`)
  return { servers }
}

export default function ManageIndex({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <PageTitle title="Ваши серверы" />
      <Card>
        <ul className="divide-y divide-line">
          {loaderData.servers.map(server => (
            <li key={server.id}>
              <Link
                to={`/manage/${server.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5"
              >
                <Avatar
                  src={server.iconUrl ?? undefined}
                  name={server.name}
                  shape="circle"
                />
                <span className="flex-1 truncate font-semibold">
                  {server.name}
                </span>
                <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
