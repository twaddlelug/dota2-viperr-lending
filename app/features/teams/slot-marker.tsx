import { Headset } from 'lucide-react'
import { cn } from '~/lib/cn'
import type { Position } from './team'

export function SlotMarker({
  position,
  className,
}: {
  position: Position | null
  className?: string
}) {
  if (position === null) {
    return (
      <Headset
        aria-hidden
        className={cn('h-[1em] w-[1em] text-white/70', className)}
      />
    )
  }

  return (
    <span
      className={cn(
        'font-black font-display text-metal leading-none',
        className
      )}
    >
      {position}
    </span>
  )
}
