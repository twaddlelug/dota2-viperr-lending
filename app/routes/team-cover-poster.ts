import { bannerResponse, getBannerFile } from '~/features/teams/banner.server'
import type { Route } from './+types/team-cover-poster'

export async function loader({ request, params }: Route.LoaderArgs) {
  return bannerResponse(request, await getBannerFile(params.teamId, 'poster'))
}
