import { cn } from '~/lib/cn'

const CORNERS = [
  'top-0 left-0 border-t-2 border-l-2',
  'top-0 right-0 border-t-2 border-r-2',
  'bottom-0 left-0 border-b-2 border-l-2',
  'right-0 bottom-0 border-r-2 border-b-2',
]

export function Corners({
  className,
  cornerClassName,
}: {
  className?: string
  cornerClassName?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      {CORNERS.map(position => (
        <span
          key={position}
          className={cn(
            'absolute h-4 w-4 border-white/70 sm:h-5 sm:w-5',
            position,
            cornerClassName
          )}
        />
      ))}
    </span>
  )
}
