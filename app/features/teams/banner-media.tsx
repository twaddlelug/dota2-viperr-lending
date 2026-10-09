import { BackgroundVideo } from '~/components/ui/background-video'
import type { Banner } from './banner'

export function BannerMedia({
  banner,
  className,
}: {
  banner: Banner
  className?: string
}) {
  if (banner.kind === 'video') {
    return (
      <BackgroundVideo
        src={banner.url}
        poster={banner.posterUrl}
        className={className}
      />
    )
  }
  return <img src={banner.url} alt="" className={className} />
}
