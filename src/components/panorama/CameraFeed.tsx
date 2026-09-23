export function CameraFeed({ label, src }: { label: string; src: string }) {
  return (
    <section className="flex min-h-[140px] flex-1 flex-col" aria-label="实时监控">
      <div className="mb-1.5 flex shrink-0 items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-full bg-status-danger shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
        <h2 className="text-sm font-semibold text-ink-primary">{label}</h2>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-card border border-app-border bg-black">
        <img
          src={src}
          alt={`${label} 实时画面`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
          <span className="text-[11px] font-medium text-ink-primary/90">LIVE</span>
          <span className="text-[11px] text-ink-secondary">{label}</span>
        </div>
      </div>
    </section>
  )
}
