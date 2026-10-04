import { redirect } from 'react-router'
import { requireUser } from '~/features/auth/session.server'
import {
  linkSteamAccount,
  verifySteamLogin,
} from '~/features/auth/steam-login.server'
import { siteUrl } from '~/lib/env.server'
import type { Route } from './+types/steam-callback'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request)
  const steamId = await verifySteamLogin(
    new URL(request.url),
    siteUrl(request, '/auth/steam/callback')
  )
  if (!steamId) return redirect('/me?steam=failed')

  const outcome = await linkSteamAccount(user.id, steamId)
  return redirect(`/me?steam=${outcome}`)
}
