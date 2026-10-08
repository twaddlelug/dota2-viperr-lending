import { useState } from 'react'
import { Aurora, auroraIsWarm } from '~/components/effects/aurora'
import { NoiseOverlay } from '~/components/effects/noise-overlay'
import { cn } from '~/lib/cn'

export function Stage({
  children,
  overlay,
  image,
  className,
}: {
  children: React.ReactNode
  overlay?: React.ReactNode
  image?: string
  className?: string
}) {
  const [auroraShown, setAuroraShown] = useState(auroraIsWarm)
  return (
    <div
      className={cn(
        'relative flex justify-center overflow-hidden rounded-[16px] sm:rounded-[32px]',
        className
      )}
    >
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-stage-edge via-stage-glow to-stage-edge" />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-0 transition-opacity duration-700',
              auroraShown ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Aurora onReady={() => setAuroraShown(true)} />
          </div>
        </>
      )}
      <NoiseOverlay />
      {overlay}
      <div className="container relative z-10 px-6 md:px-8 2xl:px-0">
        {children}
      </div>
    </div>
  )
}
