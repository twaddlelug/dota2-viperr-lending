import { cn } from '~/lib/cn'

export function ViperrMark({ className }: { className?: string }) {
  return (
    <img
      src="/admin-main.svg"
      alt=""
      aria-hidden
      className={cn('h-4 w-4 shrink-0', className)}
    />
  )
}
