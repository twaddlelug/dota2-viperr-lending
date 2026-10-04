import { data, redirect } from 'react-router'
import {
  fetchDiscordProfile,
  saveDiscordUser,
} from '~/features/auth/discord-login.server'
import { safeReturnTo } from '~/features/auth/return-to'
import { commitSession, getSession } from '~/features/auth/session.server'
import { siteUrl } from '~/lib/env.server'
import type { Route } from './+types/discord-callback'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const session = await getSession(request)
  const expectedState = session.get('oauthState')

  if (
    !code ||
    !expectedState ||
    url.searchParams.get('state') !== expectedState
  ) {
    throw data('Не удалось войти через Discord, попробуйте ещё раз', {
      status: 400,
    })
  }

  let profile: Awaited<ReturnType<typeof fetchDiscordProfile>>
  try {
    profile = await fetchDiscordProfile(
      code,
      siteUrl(request, '/auth/discord/callback')
    )
  } catch (error) {
    console.error('Discord sign-in failed:', error)
    throw data('Discord не ответил, попробуйте войти ещё раз', {
      status: 502,
    })
  }
  const user = await saveDiscordUser(profile)

  const returnTo = safeReturnTo(session.get('returnTo'))
  session.unset('oauthState')
  session.unset('returnTo')
  session.set('userId', user.id)

  return redirect(returnTo, {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
