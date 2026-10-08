import { Form, Link, useSearchParams } from 'react-router'
import { siDiscord, siSteam } from 'simple-icons'
import { PageHeader } from '~/components/layout/page-header'
import { Avatar } from '~/components/ui/avatar'
import { BrandIcon } from '~/components/ui/brand-icon'
import { SITE } from '~/config/site'
import { isAdmin, requireUser } from '~/features/auth/session.server'
import { listManagedServers } from '~/features/servers/manager.server'
import { positionWithNumber, toPosition } from '~/features/teams/team'
import { cn } from '~/lib/cn'
import type { Route } from './+types/profile'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request)
  const { player } = user
  const managed = await listManagedServers(user.discordId)

  return {
    discord: {
      name: user.globalName ?? user.username,
      username: user.username,
      avatarUrl: user.avatarUrl,
    },
    steam: user.steamId
      ? {
          name: user.steamName ?? user.steamId,
          avatarUrl: user.steamAvatarUrl,
          profileUrl: user.steamProfileUrl,
        }
      : null,
    roster: player && {
      team: player.team.name,
      slug: player.team.slug,
      server: player.team.server.name,
      position: toPosition(player.position),
      captain: player.isCaptain,
    },
    managedServers: managed.map(server => server.name),
    isAdmin: isAdmin(user),
  }
}

export const meta = () => [
  { title: `Профиль — ${SITE.name}` },
  { name: 'robots', content: 'noindex' },
]

type Notice = { text: string; failed?: boolean }

const JOINED: Notice = { text: 'Вы в составе! Осталось привязать Steam.' }

const STEAM_NOTICES: Record<string, Notice> = {
  linked: { text: 'Steam привязан.' },
  failed: {
    text: 'Не удалось подтвердить вход в Steam, попробуйте ещё раз.',
    failed: true,
  },
  taken: {
    text: 'Этот Steam-аккаунт уже привязан к другому игроку.',
    failed: true,
  },
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { discord, steam, roster, managedServers, isAdmin } = loaderData
  const [params] = useSearchParams()
  const notice = params.get('joined')
    ? JOINED
    : STEAM_NOTICES[params.get('steam') ?? '']

  return (
    <>
      <PageHeader title="Профиль" />

      <section className="container mx-auto max-w-xl px-6 pt-6">
        {notice && (
          <p
            className={cn(
              'mb-5 rounded-xl border px-5 py-3 text-sm',
              notice.failed
                ? 'border-accent/40 bg-accent/10'
                : 'border-success/40 bg-success/10'
            )}
          >
            {notice.text}
          </p>
        )}

        <article className="overflow-hidden rounded-2xl border border-line bg-surface">
          <header className="flex items-center gap-5 p-6">
            <Avatar
              src={discord.avatarUrl ?? undefined}
              name={discord.name}
              size="lg"
              shape="circle"
            />
            <div className="min-w-0">
              <h2 className="truncate font-bold font-display text-xl uppercase">
                {discord.name}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-muted text-sm">
                <BrandIcon icon={siDiscord} className="text-discord" />@
                {discord.username}
              </p>
            </div>
          </header>

          <dl className="divide-y divide-line border-line border-t">
            <Row label="Steam">
              {steam ? (
                <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <a
                    href={steam.profileUrl ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-0 items-center gap-2 hover:text-accent"
                  >
                    <BrandIcon icon={siSteam} />
                    <span className="truncate">{steam.name}</span>
                  </a>
                  <Link
                    to="/auth/steam"
                    reloadDocument
                    className="text-muted text-xs hover:text-white"
                  >
                    Сменить
                  </Link>
                </span>
              ) : (
                <Link
                  to="/auth/steam"
                  reloadDocument
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Привязать Steam →
                </Link>
              )}
            </Row>

            <Row label="Команда">
              {roster ? (
                <span>
                  <Link
                    to={`/teams/${roster.slug}`}
                    className="font-semibold hover:text-accent"
                  >
                    {roster.team}
                  </Link>
                  <span className="block text-muted text-xs">
                    {positionWithNumber(roster.position)}
                    {roster.captain && ' · Капитан'} · {roster.server}
                  </span>
                </span>
              ) : (
                <span className="text-muted text-sm">
                  Пока не в составе — ссылку-приглашение даёт менеджер команды
                  вашего сервера.
                </span>
              )}
            </Row>

            {managedServers.length > 0 && (
              <Row label="Менеджер">
                <Link to="/manage" className="font-semibold hover:text-accent">
                  {managedServers.join(', ')} →
                </Link>
              </Row>
            )}

            {isAdmin && (
              <Row label="Организатор">
                <Link to="/admin" className="font-semibold hover:text-accent">
                  Админка →
                </Link>
              </Row>
            )}
          </dl>

          <footer className="flex items-center justify-between gap-4 border-line border-t px-6 py-4">
            <p className="text-muted text-xs">
              Ник и аватарка обновляются при каждом входе.
            </p>
            <Form method="post" action="/auth/logout">
              <button
                type="submit"
                className="cursor-pointer text-muted text-sm hover:text-white"
              >
                Выйти
              </button>
            </Form>
          </footer>
        </article>
      </section>
    </>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4 px-6 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <dt className="font-mono text-[11px] text-muted uppercase tracking-[0.2em]">
        {label}
      </dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}
