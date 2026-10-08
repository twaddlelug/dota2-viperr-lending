import { cn } from '~/lib/cn'
import { Corners } from './corners'

export function CornerFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Corners />
      {children}
    </div>
  )
}
