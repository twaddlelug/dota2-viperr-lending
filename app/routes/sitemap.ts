import { NAV_LINKS } from '~/config/site'
import { getTeams } from '~/features/teams/teams.server'
import { siteUrl } from '~/lib/env.server'
import { sitemapXml } from '~/lib/sitemap'
import type { Route } from './+types/sitemap'

export async function loader({ request }: Route.LoaderArgs) {
  const teams = await getTeams()
  const paths = [
    ...NAV_LINKS.map(link => link.href),
    ...teams.map(team => `/teams/${team.slug}`),
  ]

  return new Response(sitemapXml(paths.map(path => siteUrl(request, path))), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
