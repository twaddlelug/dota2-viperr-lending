import { useId } from 'react'
import { siDota2 } from 'simple-icons'
import { cn } from '~/lib/cn'

export function DotaMark({ className }: { className?: string }) {
  const gradientId = useId()

  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('h-8 w-8', className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--color-accent)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-brand)' }} />
        </linearGradient>
      </defs>
      <path d={siDota2.path} fill={`url(#${gradientId})`} />
    </svg>
  )
}
