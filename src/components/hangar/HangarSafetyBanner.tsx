import { useHangarStore } from '@/stores/useHangarStore'
import { WORK_MODE_LABEL } from './methodMeta'
import { cn } from '@/lib/cn'

export function HangarSafetyBanner() {
  const osd = useHangarStore((s) => s.osd)
  const clearOn = useHangarStore((s) => s.clearEmergencySignalOn)
  const sendMethod = useHangarStore((s) => s.sendMethod)
  const setPendingDanger = useHangarStore((s) => s.setPendingDanger)
  const platformHb = useHangarStore((s) => s.platformHb)

  const locked = clearOn
  const mode = WORK_MODE_LABEL[osd.dock_work_mode] ?? '—'

  return (
    <section
      aria-label="安全与联锁"
      role={locked ? 'alert' : undefined}
      className={cn(
        'rounded-panel border p-3',
        locked || osd.stop_state
          ? 'border-status-danger/60 bg-status-danger/15'
          : 'border-app-border bg-app-card/60',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-pill px-2 py-0.5 text-xxs font-bold',
            osd.stop_state
              ? 'bg-status-danger text-white'
              : 'bg-status-online/20 text-status-online',
          )}
        >
          急停 {osd.stop_state ? 'ON' : 'OFF'}
        </span>
        <span className="rounded-pill border border-app-border bg-app-input px-2 py-0.5 text-xxs text-ink-secondary">
          模式 {mode}
        </span>
        <span
          className={cn(
            'rounded-pill px-2 py-0.5 text-xxs font-semibold',
            platformHb
              ? 'bg-status-online/15 text-status-online'
              : 'bg-status-offline/20 text-status-offline',
          )}
        >
          平台心跳 {platformHb ? 'ON' : 'OFF'}
        </span>
        <span
          className={cn(
            'rounded-pill border px-2 py-0.5 text-xxs font-semibold',
            clearOn
              ? 'border-status-warn/60 bg-status-warn/20 text-status-warn'
              : 'border-app-border bg-app-input text-ink-muted',
          )}
        >
          清除急停信号 {clearOn ? 'ON' : 'OFF'}
        </span>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setPendingDanger('stop')}
            className="h-8 rounded-panel border border-status-danger/50 bg-status-danger/25 px-3 text-xs font-semibold text-status-danger transition hover:bg-status-danger/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger/50"
          >
            急停
          </button>
          <button
            type="button"
            onClick={() => sendMethod('clear_emergency_stop')}
            className={cn(
              'h-8 rounded-panel border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2',
              clearOn
                ? 'border-status-warn bg-status-warn/30 text-status-warn hover:bg-status-warn/40 focus-visible:ring-status-warn/50'
                : 'border-app-border bg-app-card text-ink-secondary hover:bg-app-cardHover focus-visible:ring-accent-cyan/40',
            )}
          >
            清除急停
          </button>
        </div>
      </div>
      {locked && (
        <p className="mt-2 text-xs font-medium text-status-danger">
          清除急停信号为 ON，请先将其置为 OFF。除「急停 / 清除急停」外操作已锁定。
        </p>
      )}
    </section>
  )
}
