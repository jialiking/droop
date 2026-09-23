import { useEffect } from 'react'
import { X } from 'lucide-react'
import { HangarEnvGlance } from './HangarEnvGlance'
import { HangarMoreDialog } from './HangarMoreDialog'
import { HangarPrimaryCards } from './HangarPrimaryCards'
import { HangarSafetyBanner } from './HangarSafetyBanner'
import { HangarStatusStrip } from './HangarStatusStrip'
import { METHOD_META } from './methodMeta'
import { useHangarStore } from '@/stores/useHangarStore'
import type { HangarMethod } from '@/types/hangar'

export function HangarToasts() {
  const toasts = useHangarStore((s) => s.toasts)
  const dismiss = useHangarStore((s) => s.dismissToast)

  return (
    <div className="pointer-events-none fixed right-4 top-16 z-[9500] flex w-[320px] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto rounded-panel border px-3 py-2 text-left text-xs shadow-panel ${
            t.type === 'error'
              ? 'border-status-danger/50 bg-status-danger/20 text-status-danger'
              : t.type === 'ok'
                ? 'border-status-online/40 bg-status-online/15 text-status-online'
                : 'border-app-border bg-app-card text-ink-primary'
          }`}
        >
          {t.text}
        </button>
      ))}
    </div>
  )
}

function DangerConfirm() {
  const pending = useHangarStore((s) => s.pendingDanger)
  const setPending = useHangarStore((s) => s.setPendingDanger)
  const sendMethod = useHangarStore((s) => s.sendMethod)

  if (!pending) return null
  const meta = METHOD_META[pending]

  return (
    <div
      className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={() => setPending(null)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="hangar-danger-title"
        className="w-[360px] rounded-panel border border-app-border bg-app-header p-5 shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="hangar-danger-title" className="text-base font-semibold">
          确认执行「{meta.label}」？
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">该操作为危险动作，是否继续？</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setPending(null)}
            className="h-9 rounded-panel border border-app-border bg-app-card px-4 text-sm text-ink-primary hover:bg-app-cardHover"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => {
              const m = pending
              setPending(null)
              void sendMethod(m)
            }}
            className="h-9 rounded-panel border border-status-danger/50 bg-status-danger/20 px-4 text-sm font-medium text-status-danger hover:bg-status-danger/30"
          >
            确认执行
          </button>
        </div>
      </div>
    </div>
  )
}

export function HangarDrawer() {
  const open = useHangarStore((s) => s.drawerOpen)
  const setOpen = useHangarStore((s) => s.setDrawerOpen)
  const deviceName = useHangarStore((s) => s.deviceName)
  const airportName = useHangarStore((s) => s.airportName)
  const gatewaySn = useHangarStore((s) => s.gatewaySn)
  const tickOsd = useHangarStore((s) => s.tickOsd)
  const tickHb = useHangarStore((s) => s.tickPlatformHb)
  const ingestHb = useHangarStore((s) => s.ingestPlatformHeartbeat)
  const setMoreOpen = useHangarStore((s) => s.setMoreDialogOpen)

  useEffect(() => {
    if (!open) return
    ingestHb()
    const osdTimer = window.setInterval(() => {
      ingestHb()
      tickOsd()
    }, 2000)
    const hbTimer = window.setInterval(() => tickHb(), 1000)
    return () => {
      window.clearInterval(osdTimer)
      window.clearInterval(hbTimer)
    }
  }, [open, ingestHb, tickOsd, tickHb])

  useEffect(() => {
    if (!open) setMoreOpen(false)
  }, [open, setMoreOpen])

  return (
    <>
      <div
        className={`fixed inset-0 z-[8000] bg-black/45 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        aria-hidden={!open}
        aria-label="机库控制"
        className={`fixed bottom-0 right-0 top-0 z-[8100] flex w-full max-w-[440px] flex-col border-l border-app-border bg-app-sidebar shadow-panel transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-app-border px-4">
          <div>
            <div className="text-base font-semibold">机库控制</div>
            <div className="text-xxs text-ink-secondary">
              {deviceName} · {airportName} · {gatewaySn}
            </div>
          </div>
          <button
            type="button"
            aria-label="关闭机库抽屉"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-panel text-ink-secondary hover:bg-white/5 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/40"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
          <HangarSafetyBanner />
          <HangarPrimaryCards />
          <HangarStatusStrip />
          <HangarEnvGlance />
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="h-9 rounded-panel border border-accent-cyan/40 bg-accent-cyan/15 text-xs font-semibold text-accent-cyan hover:bg-accent-cyan/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/40"
          >
            更多控制 / 明细
          </button>
        </div>
      </aside>
      <HangarMoreDialog />
      <DangerConfirm />
      <HangarToasts />
    </>
  )
}

export type { HangarMethod }
