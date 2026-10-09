import { ImageUp, LoaderCircle, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useRevalidator } from 'react-router'
import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { ConfirmButton } from '~/components/admin/confirm-button'
import { useToast } from '~/components/admin/toast'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { BANNER_ACCEPT, toBanner } from '../banner'
import { BannerMedia } from '../banner-media'
import type { AdminTeam } from '../teams.server'
import { prepareBanner, uploadBanner } from './upload-banner'

export function BannerCard({ team }: { team: AdminTeam }) {
  const toast = useToast()
  const revalidator = useRevalidator()
  const remover = useAdminFetcher({ success: 'Баннер убран' })
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const busy = progress !== null || remover.state !== 'idle'
  const banner = team.banner && toBanner(team.id, team.banner)

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setProgress(0)
    try {
      await uploadBanner(team.id, await prepareBanner(file), setProgress)
      await revalidator.revalidate()
      toast.success('Баннер обновлён')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Не получилось загрузить баннер'
      )
    } finally {
      setProgress(null)
    }
  }

  return (
    <Card title="Баннер" className="mb-6">
      <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center">
        <div className="relative aspect-[3/1] overflow-hidden rounded-xl border border-line bg-gradient-to-r from-stage-edge via-stage-glow to-stage-edge">
          {banner ? (
            <BannerMedia
              key={banner.url}
              banner={banner}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-muted text-xs">
              Сейчас красный фон
            </span>
          )}
          {progress !== null && (
            <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/65 text-sm">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {progress === 0
                ? 'Готовим файл…'
                : `Загрузка ${Math.round(progress * 100)}%`}
            </span>
          )}
        </div>

        <div>
          <p className="text-muted text-sm">
            Фон шапки на странице команды и карточки в списке команд. Картинка
            (JPG, PNG, WebP, GIF) или короткое видео MP4/WebM без звука, до 16
            МБ. Картинки сжимаются сами. Лучше 1920×1080 — края могут
            обрезаться, главное держите в центре.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              ref={input}
              type="file"
              accept={BANNER_ACCEPT}
              className="hidden"
              onChange={upload}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => input.current?.click()}
            >
              <ImageUp /> {banner ? 'Заменить' : 'Загрузить'}
            </Button>
            {banner && (
              <ConfirmButton
                variant="ghost"
                size="md"
                title="Убрать баннер"
                confirmLabel="Убрать"
                message="Вместо баннера снова будет красный фон."
                busy={busy}
                onConfirm={() =>
                  remover.submit({ intent: 'removeBanner' }, { method: 'post' })
                }
              >
                <Trash2 /> Убрать
              </ConfirmButton>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
