import { createCookieSessionStorage, data, redirect } from 'react-router'
import { db } from '~/lib/db.server'
import { env } from '~/lib/env.server'

type SessionData = {
  userId: string
  oauthState: string
  returnTo: string
}

let storage: ReturnType<typeof createCookieSessionStorage<SessionData>>

function sessionStorage() {
  storage ??= createCookieSessionStorage<SessionData>({
    cookie: {
      name: '__viperr_session',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      secrets: [env.sessionSecret],
      maxAge: 60 * 60 * 24 * 30,
    },
  })
  return storage
}

export const getSession = (request: Request) =>
  sessionStorage().getSession(request.headers.get('Cookie'))

type Session = Awaited<ReturnType<typeof getSession>>

export const commitSession = (session: Session) =>
  sessionStorage().commitSession(session)

export const destroySession = (session: Session) =>
  sessionStorage().destroySession(session)

export async function getCurrentUser(request: Request) {
  const userId = (await getSession(request)).get('userId')
  if (!userId) return null
  return db().user.findUnique({
    where: { id: userId },
    include: { player: { include: { team: { include: { server: true } } } } },
  })
}

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>

export async function requireUser(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    const url = new URL(request.url)
    const returnTo = encodeURIComponent(url.pathname + url.search)
    throw redirect(`/auth/discord?returnTo=${returnTo}`)
  }
  return user
}

export const isAdmin = (user: { discordId: string }) =>
  env.adminDiscordIds.includes(user.discordId)

export async function requireAdmin(request: Request) {
  const user = await requireUser(request)
  if (!isAdmin(user)) {
    throw data('Нет доступа к админке', { status: 403 })
  }
  return user
}
