import { cn } from '~/lib/cn'

export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div
      className={cn('motion-safe:animate-rise', className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}

export function RiseWords({
  children,
  delay = 0,
  wordClassName,
}: {
  children: string
  delay?: number
  wordClassName?: string
}) {
  const words = children.split(' ')
  return words.map((word, i) => (
    <span
      key={i}
      className={cn(
        'inline-block motion-safe:animate-rise',
        i < words.length - 1 && 'mr-[0.25em]',
        wordClassName
      )}
      style={{ animationDelay: `${delay + i * 0.08}s` }}
    >
      {word}
    </span>
  ))
}
