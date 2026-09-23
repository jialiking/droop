import { useEffect } from 'react'
import { HangarCommandDialog } from './HangarCommandDialog'
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

  useEffect(() => {
    if (!pending) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPending(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pending, setPending])

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

export function HangarHost() {
  const open = useHangarStore((s) => s.drawerOpen)
  const tickOsd = useHangarStore((s) => s.tickOsd)
  const tickHb = useHangarStore((s) => s.tickPlatformHb)
  const ingestHb = useHangarStore((s) => s.ingestPlatformHeartbeat)

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

  return (
    <>
      <HangarCommandDialog />
      <DangerConfirm />
      <HangarToasts />
    </>
  )
}

export type { HangarMethod }
