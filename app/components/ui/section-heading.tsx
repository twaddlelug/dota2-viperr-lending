import { cn } from '~/lib/cn'

export function SectionHeading({
  index,
  title,
  aside,
  className,
}: {
  index?: string
  title: string
  aside?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-8 flex items-center gap-4', className)}>
      <Crosshair />
      {index && <span className="font-mono text-muted text-xs">{index}</span>}
      <h2 className="font-bold font-display text-lg uppercase tracking-wide sm:text-2xl">
        {title}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent" />
      {aside && (
        <div className="shrink-0 text-muted text-xs uppercase tracking-wider">
          {aside}
        </div>
      )}
    </div>
  )
}

function Crosshair() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="h-4 w-4 shrink-0 text-white/50"
    >
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
