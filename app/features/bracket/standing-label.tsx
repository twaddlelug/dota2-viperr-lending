import { cn } from '~/lib/cn'
import type { Standing } from './bracket'

export function StandingLabel({
  standing,
  className,
}: {
  standing: Standing | undefined
  className?: string
}) {
  const base =
    'inline-flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-wider'

  if (!standing) {
    return <span className={cn(base, 'text-muted', className)}>Без посева</span>
  }

  switch (standing.state) {
    case 'champion':
      return (
        <span className={cn(base, 'font-bold text-accent', className)}>
          Чемпион
        </span>
      )
    case 'runner-up':
      return <span className={cn(base, 'text-white', className)}>Финалист</span>
    case 'alive':
      return (
        <span className={cn(base, 'text-white', className)}>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {standing.roundName}
        </span>
      )
    case 'eliminated':
      return (
        <span className={cn(base, 'text-muted', className)}>
          Вылет · {standing.roundName}
        </span>
      )
  }
}
