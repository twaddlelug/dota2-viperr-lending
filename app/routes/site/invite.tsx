import { data, Form, redirect, useNavigation } from 'react-router'
import { PageHeader } from '~/components/layout/page-header'
import { Avatar } from '~/components/ui/avatar'
import { ButtonLink, CtaButton } from '~/components/ui/button-link'
import { SITE } from '~/config/site'
import { getCurrentUser, requireUser } from '~/features/auth/session.server'
import { claimInvite, getInvite } from '~/features/teams/roster.server'
import { positionWithNumber, teamLogo, toPosition } from '~/features/teams/team'
import type { Route } from './+types/invite'

const INVITE_GONE = 'Приглашение не найдено или уже использовано'

export async function loader({ request, params }: Route.LoaderArgs) {
  const [invite, user] = await Promise.all([
    getInvite(params.code),
    getCurrentUser(request),
  ])
  if (!invite) throw data(INVITE_GONE, { status: 404 })

  return {
    invite: {
      nickname: invite.nickname,
      position: toPosition(invite.position),
      captain: invite.isCaptain,
      team: {
        name: invite.team.name,
        tag: invite.team.tag,
        logoUrl: teamLogo(invite.team),
      },
      server: invite.team.server.name,
    },
    user: user && {
      name: user.globalName ?? user.username,
      username: user.username,
      avatarUrl: user.avatarUrl,
      currentTeam: user.player?.team.name ?? null,
    },
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const user = await requireUser(request)
  if (user.player) {
    throw data(`Ваш аккаунт уже в составе ${user.player.team.name}`, {
      status: 409,
    })
  }

  switch (await claimInvite(params.code, user.id)) {
    case 'claimed':
      return redirect('/me?joined=1')
    case 'already-on-roster':
      throw data('Ваш аккаунт уже в составе другой команды', { status: 409 })
    case 'not-found':
      throw data(INVITE_GONE, { status: 404 })
  }
}

export const meta = () => [
  { title: `Приглашение — ${SITE.name}` },
  { name: 'robots', content: 'noindex' },
]

export default function InvitePage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { invite, user } = loaderData
  const navigation = useNavigation()
  const role = positionWithNumber(invite.position)

  return (
    <>
      <PageHeader title="Приглашение" />

      <section className="container mx-auto max-w-xl px-6 pt-6">
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <Avatar
            src={invite.team.logoUrl}
            name={invite.team.name}
            initials={invite.team.tag}
            size="lg"
            className="mx-auto"
          />
          <p className="mt-6 text-lg">
            Вас приглашают в состав{' '}
            <span className="font-bold">{invite.team.name}</span>
          </p>
          <p className="mt-2 text-muted text-sm">
            Сервер {invite.server} · {role}
            {invite.captain && ' · Капитан'}
          </p>

          <div className="mt-8 border-line border-t pt-8">
            {!user ? (
              <>
                <p className="mb-6 text-muted text-sm">
                  Войдите через Discord — ник и аватарка подтянутся из вашего
                  аккаунта.
                </p>
                <ButtonLink
                  href={`/auth/discord?returnTo=${encodeURIComponent(`/invite/${params.code}`)}`}
                  reloadDocument
                >
                  Войти через Discord
                </ButtonLink>
              </>
            ) : user.currentTeam ? (
              <p className="text-muted">
                Вы уже в составе {user.currentTeam}. Один Discord-аккаунт — одно
                место в составе.
              </p>
            ) : (
              <Form method="post">
                <div className="mb-6 flex items-center justify-center gap-3">
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    name={user.name}
                    size="sm"
                    shape="circle"
                  />
                  <span>
                    {user.name}{' '}
                    <span className="text-muted">@{user.username}</span>
                  </span>
                </div>
                <CtaButton disabled={navigation.state !== 'idle'}>
                  Принять приглашение
                </CtaButton>
              </Form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
