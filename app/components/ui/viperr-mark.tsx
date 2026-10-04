import { useId } from 'react'
import { cn } from '~/lib/cn'

export function ViperrMark({ className }: { className?: string }) {
  const gradientId = useId()

  return (
    <svg viewBox="0 0 40 36" aria-hidden className={cn('h-9 w-10', className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5f5f5" />
          <stop offset="1" stopColor="#7a7a7a" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <rect x="0" y="4" width="40" height="4" />
        <rect x="0" y="16" width="40" height="4" />
        <rect x="0" y="28" width="40" height="4" />
        <rect x="18" y="0" width="4" height="36" />
      </g>
    </svg>
  )
}
