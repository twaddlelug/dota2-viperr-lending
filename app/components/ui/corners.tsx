import { cn } from '~/lib/cn'

const CORNERS = [
  {
    position: 'top-0 left-0 border-t-2 border-l-2',
    lockOn:
      'group-hover:translate-x-1 group-hover:translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:translate-y-1',
  },
  {
    position: 'top-0 right-0 border-t-2 border-r-2',
    lockOn:
      'group-hover:-translate-x-1 group-hover:translate-y-1 group-focus-visible:-translate-x-1 group-focus-visible:translate-y-1',
  },
  {
    position: 'bottom-0 left-0 border-b-2 border-l-2',
    lockOn:
      'group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1',
  },
  {
    position: 'right-0 bottom-0 border-r-2 border-b-2',
    lockOn:
      'group-hover:-translate-x-1 group-hover:-translate-y-1 group-focus-visible:-translate-x-1 group-focus-visible:-translate-y-1',
  },
]

export function Corners({
  className,
  cornerClassName,
  lockOn = false,
}: {
  className?: string
  cornerClassName?: string
  lockOn?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      {CORNERS.map(corner => (
        <span
          key={corner.position}
          className={cn(
            'absolute h-4 w-4 border-white/70 sm:h-5 sm:w-5',
            corner.position,
            lockOn &&
              cn('transition-transform duration-150 ease-enter', corner.lockOn),
            cornerClassName
          )}
        />
      ))}
    </span>
  )
}
