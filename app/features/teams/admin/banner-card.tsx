import { ImageUp, LoaderCircle, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '~/components/admin/button'
import { Card } from '~/components/admin/card'
import { ConfirmButton } from '~/components/admin/confirm-button'
import { useToast } from '~/components/admin/toast'
import { useAdminFetcher } from '~/components/admin/use-admin-fetcher'
import { BANNER_ACCEPT, BANNER_MAX_BYTES, bannerUrl } from '../banner'
import type { AdminTeam } from '../teams.server'

export function BannerCard({ team }: { team: AdminTeam }) {
  const toast = useToast()
  const uploader = useAdminFetcher({ success: 'Баннер обновлён' })
  const remover = useAdminFetcher({ success: 'Баннер убран' })
  const input = useRef<HTMLInputElement>(null)
  const uploading = uploader.state !== 'idle'
  const busy = uploading || remover.state !== 'idle'
  const src = team.banner && bannerUrl(team.id, team.banner.updatedAt)

  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > BANNER_MAX_BYTES) {
      toast.error('Картинка больше 4 МБ')
      return
    }
    const form = new FormData()
    form.set('intent', 'uploadBanner')
    form.set('banner', file)
    uploader.submit(form, { method: 'post', encType: 'multipart/form-data' })
  }

  return (
    <Card title="Баннер" className="mb-6">
      <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center">
        <div className="relative aspect-[3/1] overflow-hidden rounded-xl border border-line bg-gradient-to-r from-stage-edge via-stage-glow to-stage-edge">
          {src ? (
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-muted text-xs">
              Сейчас красный фон
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-black/60">
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </span>
          )}
        </div>

        <div>
          <p className="text-muted text-sm">
            Фон шапки на странице команды и карточки в списке команд. JPG, PNG,
            WebP или GIF до 4 МБ, лучше 1920×1080 — края могут обрезаться,
            главное держите в центре.
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
              <ImageUp /> {src ? 'Заменить' : 'Загрузить'}
            </Button>
            {src && (
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
