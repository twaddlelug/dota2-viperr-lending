import { getBanner } from '~/features/teams/banner.server'
import type { Route } from './+types/team-banner'

export async function loader({ request, params }: Route.LoaderArgs) {
  const banner = await getBanner(params.teamId)
  if (!banner) return new Response(null, { status: 404 })

  const versioned = new URL(request.url).searchParams.has('v')
  return new Response(banner.data, {
    headers: {
      'Content-Type': banner.contentType,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': versioned
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=60',
    },
  })
}
