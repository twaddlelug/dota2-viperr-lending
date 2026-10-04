import { cn } from '~/lib/cn'

export function ShineText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'bg-[length:200%_100%] bg-[linear-gradient(120deg,#fff_30%,rgba(255,255,255,0.5),#fff_70%)] bg-clip-text text-[#b5b5b5a4] motion-safe:animate-shine',
        className
      )}
    >
      {children}
    </span>
  )
}
