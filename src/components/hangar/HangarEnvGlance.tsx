import { useHangarStore } from '@/stores/useHangarStore'
import { RAINFALL_LABEL } from './methodMeta'

export function HangarEnvGlance() {
  const osd = useHangarStore((s) => s.osd)
  const setMoreDialogOpen = useHangarStore((s) => s.setMoreDialogOpen)

  return (
    <section
      aria-label="环境速览"
      className="rounded-panel border border-app-border bg-app-card/50 p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-primary">环境速览</h3>
        <button
          type="button"
          onClick={() => setMoreDialogOpen(true)}
          className="rounded-panel border border-app-border px-2 py-1 text-xxs text-ink-secondary transition hover:border-accent-cyan/50 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/40"
        >
          环境与更多明细 →
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <EnvItem label="风速" value={`${osd.wind_speed} m/s`} />
        <EnvItem label="降雨量" value={RAINFALL_LABEL[osd.rainfall] ?? String(osd.rainfall)} />
        <EnvItem label="外温" value={`${osd.external_temperature}℃`} />
      </div>
    </section>
  )
}

function EnvItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-app-borderSoft bg-app-input/50 px-2 py-1.5 text-center">
      <div className="text-[10px] text-ink-muted">{label}</div>
      <div className="mt-0.5 text-xs font-semibold text-ink-primary">{value}</div>
    </div>
  )
}
