import { siteUrl } from '~/lib/env.server'
import { robotsTxt } from '~/lib/sitemap'
import type { Route } from './+types/robots'

const PRIVATE_PATHS = ['/admin', '/manage', '/auth/']

export function loader({ request }: Route.LoaderArgs) {
  return new Response(
    robotsTxt(siteUrl(request, '/sitemap.xml'), PRIVATE_PATHS),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  )
}
