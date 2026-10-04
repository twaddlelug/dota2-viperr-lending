import { redirect } from 'react-router'
import {
  discordAuthorizeUrl,
  upsertDevUser,
} from '~/features/auth/discord-login.server'
import { safeReturnTo } from '~/features/auth/return-to'
import { commitSession, getSession } from '~/features/auth/session.server'
import { env, siteUrl } from '~/lib/env.server'
import type { Route } from './+types/discord'

export async function loader({ request }: Route.LoaderArgs) {
  const returnTo = safeReturnTo(
    new URL(request.url).searchParams.get('returnTo')
  )
  const session = await getSession(request)

  const devId = env.devLoginDiscordId
  if (import.meta.env.DEV && devId) {
    const user = await upsertDevUser(devId)
    session.set('userId', user.id)
    return redirect(returnTo, {
      headers: { 'Set-Cookie': await commitSession(session) },
    })
  }

  const state = crypto.randomUUID()
  session.set('oauthState', state)
  session.set('returnTo', returnTo)
  return redirect(
    discordAuthorizeUrl(state, siteUrl(request, '/auth/discord/callback')),
    { headers: { 'Set-Cookie': await commitSession(session) } }
  )
}
