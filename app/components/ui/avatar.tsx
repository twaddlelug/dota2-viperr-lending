import { useState } from 'react'
import { cn } from '~/lib/cn'

const SIZES = {
  '2xs': 'h-[18px] w-[18px] text-[5px]',
  xs: 'h-6 w-6 text-[8px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-12 w-12 text-xs',
  lg: 'h-20 w-20 text-lg',
  xl: 'h-28 w-28 text-2xl',
}

const FALLBACKS = [
  'from-[#1d3b21] to-[#0b140c]',
  'from-[#2a2a2a] to-[#0f0f0f]',
  'from-[#23402f] to-[#0c1510]',
  'from-[#33361f] to-[#11120a]',
]

const hash = (value: string) =>
  [...value].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) | 0, 0)

export function Avatar({
  src,
  name,
  initials,
  size = 'md',
  shape = 'rounded',
  className,
}: {
  src?: string
  name: string
  initials?: string
  size?: keyof typeof SIZES
  shape?: 'rounded' | 'circle'
  className?: string
}) {
  const [brokenSrc, setBrokenSrc] = useState<string>()
  const url = src
  const classes = cn(
    'shrink-0 overflow-hidden border border-line',
    shape === 'circle' ? 'rounded-full' : 'rounded-[28%]',
    SIZES[size],
    className
  )

  if (url && url !== brokenSrc) {
    const retryLoadFailedBeforeHydration = (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth === 0) img.src = url
    }

    return (
      <img
        src={url}
        alt={name}
        loading="lazy"
        className={classes}
        onError={() => setBrokenSrc(url)}
        ref={retryLoadFailedBeforeHydration}
      />
    )
  }

  const letters = initials ?? name.slice(0, 2)
  const tone = FALLBACKS[Math.abs(hash(name)) % FALLBACKS.length]

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        classes,
        'flex items-center justify-center bg-gradient-to-br font-black font-display uppercase',
        tone
      )}
    >
      <span className="text-metal">{letters}</span>
    </span>
  )
}
