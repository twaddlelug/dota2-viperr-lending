import { redirect } from 'react-router'
import { requireUser } from '~/features/auth/session.server'
import { steamLoginUrl } from '~/features/auth/steam-login.server'
import { siteUrl } from '~/lib/env.server'
import type { Route } from './+types/steam'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  return redirect(steamLoginUrl(siteUrl(request, '/auth/steam/callback')))
}
