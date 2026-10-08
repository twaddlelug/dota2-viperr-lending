export function Board({
  count,
  label,
  children,
}: {
  count: number
  label: string
  children: React.ReactNode
}) {
  const narrowGaps = count % 2
  const wideGaps = (4 - (count % 4)) % 4

  return (
    <ul
      aria-label={label}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4 [&>li]:bg-bg"
    >
      {children}
      {Array.from({ length: narrowGaps }, (_, i) => (
        <li key={`narrow-${i}`} aria-hidden className="lg:hidden" />
      ))}
      {Array.from({ length: wideGaps }, (_, i) => (
        <li key={`wide-${i}`} aria-hidden className="hidden lg:block" />
      ))}
    </ul>
  )
}
