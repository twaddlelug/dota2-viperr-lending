import { useEffect, useState } from 'react'

const TILE_SIZE = 200

function createNoiseTile(size: number): Promise<string | null> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return resolve(null)

    const image = ctx.createImageData(size, size)
    const pixels = new Uint32Array(image.data.buffer)

    for (let i = 0; i < pixels.length; i++) {
      const shade = (Math.random() * 20) | 0
      const alpha = Math.random() < 0.7 ? 255 : 0
      pixels[i] = (alpha << 24) | (shade << 16) | (shade << 8) | shade
    }

    ctx.putImageData(image, 0, 0)
    canvas.toBlob(
      blob => resolve(blob && URL.createObjectURL(blob)),
      'image/png'
    )
  })
}

export function NoiseOverlay({ opacity = 0.085 }: { opacity?: number }) {
  const [tileUrl, setTileUrl] = useState<string | null>(null)

  useEffect(() => {
    let url: string | null = null
    let cancelled = false

    createNoiseTile(TILE_SIZE).then(blobUrl => {
      if (!blobUrl) return
      if (cancelled) {
        URL.revokeObjectURL(blobUrl)
        return
      }
      url = blobUrl
      setTileUrl(blobUrl)
    })

    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  if (!tileUrl) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      <div
        className="absolute motion-safe:animate-noise motion-safe:will-change-transform"
        style={{ inset: -TILE_SIZE, backgroundImage: `url(${tileUrl})` }}
      />
    </div>
  )
}
