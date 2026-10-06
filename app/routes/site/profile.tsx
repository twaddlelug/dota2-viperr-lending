import { Form, Link, useSearchParams } from 'react-router'
import { siDiscord, siSteam } from 'simple-icons'
import { PageHeader } from '~/components/layout/page-header'
import { Avatar } from '~/components/ui/avatar'
import { BrandIcon } from '~/components/ui/brand-icon'
import { ButtonLink } from '~/components/ui/button-link'
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
  const { discord, steam, roster, managedServers } = loaderData
  const [params] = useSearchParams()
  const notice = params.get('joined')
    ? JOINED
    : STEAM_NOTICES[params.get('steam') ?? '']

  return (
    <>
      <PageHeader title="Профиль" />

      <section className="container mx-auto max-w-3xl space-y-5 px-6 pt-6">
        {notice && (
          <p
            className={cn(
              'rounded-xl border px-5 py-3 text-sm',
              notice.failed
                ? 'border-accent/40 bg-accent/10'
                : 'border-success/40 bg-success/10'
            )}
          >
            {notice.text}
          </p>
        )}

        <Account
          icon={<BrandIcon icon={siDiscord} className="h-5 w-5 text-discord" />}
          title="Discord"
        >
          <div className="flex items-center gap-4">
            <Avatar
              src={discord.avatarUrl ?? undefined}
              name={discord.name}
              size="md"
              shape="circle"
            />
            <div>
              <p className="font-semibold">{discord.name}</p>
              <p className="text-muted text-sm">@{discord.username}</p>
            </div>
          </div>
          <p className="mt-4 text-muted text-xs">
            Ник и аватарка обновляются при каждом входе.
          </p>
        </Account>

        <Account
          icon={<BrandIcon icon={siSteam} className="h-5 w-5" />}
          title="Steam"
        >
          {steam ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={steam.avatarUrl ?? undefined}
                  name={steam.name}
                  size="md"
                  shape="circle"
                />
                <div>
                  <p className="font-semibold">{steam.name}</p>
                  {steam.profileUrl && (
                    <a
                      href={steam.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted text-sm hover:text-accent"
                    >
                      Профиль в Steam →
                    </a>
                  )}
                </div>
              </div>
              <Link
                to="/auth/steam"
                reloadDocument
                className="text-muted text-sm hover:text-accent"
              >
                Привязать другой
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-muted text-sm">
                Привяжите аккаунт Steam, на котором будете играть.
              </p>
              <ButtonLink href="/auth/steam" reloadDocument>
                Привязать Steam
              </ButtonLink>
            </div>
          )}
        </Account>

        <Account title="Команда">
          {roster ? (
            <p>
              <Link
                to={`/teams/${roster.slug}`}
                className="font-semibold hover:text-accent"
              >
                {roster.team}
              </Link>{' '}
              <span className="text-muted">
                · {roster.server} · {positionWithNumber(roster.position)}
                {roster.captain && ' · Капитан'}
              </span>
            </p>
          ) : (
            <p className="text-muted text-sm">
              Вы пока не в составе. Попросите ссылку-приглашение у менеджера
              команды своего сервера.
            </p>
          )}
        </Account>

        {managedServers.length > 0 && (
          <Account title="Менеджер команды">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{managedServers.join(', ')}</p>
                <p className="mt-1 text-muted text-sm">
                  Соберите состав и раздайте игрокам приглашения.
                </p>
              </div>
              <ButtonLink href="/manage">Управлять командой</ButtonLink>
            </div>
          </Account>
        )}

        <div className="flex items-center justify-between pt-4">
          {loaderData.isAdmin ? (
            <Link to="/admin" className="text-accent text-sm">
              Админка →
            </Link>
          ) : (
            <span />
          )}
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              className="cursor-pointer text-muted text-sm hover:text-white"
            >
              Выйти
            </button>
          </Form>
        </div>
      </section>
    </>
  )
}

function Account({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <p className="mb-5 flex items-center gap-2 text-muted text-xs uppercase tracking-[0.2em]">
        {icon}
        {title}
      </p>
      {children}
    </div>
  )
}
