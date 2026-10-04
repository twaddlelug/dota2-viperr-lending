import type { SimpleIcon } from 'simple-icons'
import { cn } from '~/lib/cn'

export function BrandIcon({
  icon,
  className,
}: {
  icon: SimpleIcon
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('h-4 w-4 shrink-0 fill-current', className)}
    >
      <path d={icon.path} />
    </svg>
  )
}
