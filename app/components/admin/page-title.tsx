export function PageTitle({
  title,
  back,
  children,
}: {
  title: React.ReactNode
  back?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="mb-8">
      {back && <div className="mb-3 text-sm">{back}</div>}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-black font-display text-2xl uppercase sm:text-3xl">
          {title}
        </h1>
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </div>
    </div>
  )
}
