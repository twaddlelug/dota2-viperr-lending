import { BANNER_PART_BYTES } from '~/features/teams/banner'
import {
  bannerResponse,
  canEditBanner,
  getBannerFile,
  receiveBannerPart,
} from '~/features/teams/banner.server'
import { fail } from '~/lib/action-result'
import { isOwnOrigin } from '~/lib/env.server'
import type { Route } from './+types/team-banner'

export async function loader({ request, params }: Route.LoaderArgs) {
  return bannerResponse(request, await getBannerFile(params.teamId, 'file'))
}

export async function action({ request, params }: Route.ActionArgs) {
  if (!isOwnOrigin(request) || !(await canEditBanner(request, params.teamId))) {
    return Response.json(fail('Нет доступа к баннеру этой команды'), {
      status: 403,
    })
  }

  const length = Number(request.headers.get('content-length'))
  if (!(length > 0 && length <= BANNER_PART_BYTES)) {
    return Response.json(fail('Загрузка прервалась, попробуйте ещё раз'), {
      status: 413,
    })
  }

  const search = new URL(request.url).searchParams
  const result = await receiveBannerPart(params.teamId, {
    upload: search.get('upload') ?? '',
    kind: search.get('kind') ?? '',
    part: Number(search.get('part')),
    parts: Number(search.get('parts')),
    bytes: new Uint8Array(await request.arrayBuffer()),
  })
  return Response.json(result, { status: result.ok ? 200 : 400 })
}
