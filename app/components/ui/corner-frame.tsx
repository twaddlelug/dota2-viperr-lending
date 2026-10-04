import { cn } from '~/lib/cn'

export function CornerFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const corner =
    'pointer-events-none absolute h-4 w-4 border-white/70 sm:h-5 sm:w-5'

  return (
    <div className={cn('relative', className)}>
      <span className={cn(corner, 'top-0 left-0 border-t-2 border-l-2')} />
      <span className={cn(corner, 'top-0 right-0 border-t-2 border-r-2')} />
      <span className={cn(corner, 'bottom-0 left-0 border-b-2 border-l-2')} />
      <span className={cn(corner, 'right-0 bottom-0 border-r-2 border-b-2')} />
      {children}
    </div>
  )
}
