import { cn } from '~/lib/cn'

export function Card({
  title,
  actions,
  children,
  className,
}: {
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn('rounded-2xl border border-line bg-surface', className)}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 border-line border-b px-5 py-4">
          {title && (
            <h2 className="font-bold font-display text-sm uppercase tracking-wide">
              {title}
            </h2>
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}
