export function EmptyState({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
      <p className="text-muted">{title}</p>
      {action}
    </div>
  )
}
