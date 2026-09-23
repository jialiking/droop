import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useHangarStore } from '@/stores/useHangarStore'
import {
  AC_LABEL,
  L3_METHODS,
  METHOD_META,
  RAINFALL_LABEL,
  WORK_MODE_LABEL,
} from './methodMeta'
import { cn } from '@/lib/cn'
import type { HangarMethod } from '@/types/hangar'

export function HangarMoreDialog() {
  const open = useHangarStore((s) => s.moreDialogOpen)
  const setOpen = useHangarStore((s) => s.setMoreDialogOpen)
  const osd = useHangarStore((s) => s.osd)
  const sendMethod = useHangarStore((s) => s.sendMethod)
  const clearOn = useHangarStore((s) => s.clearEmergencySignalOn)
  const setPendingDanger = useHangarStore((s) => s.setPendingDanger)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (!open) return null

  const rows: [string, string][] = [
    ['顶门', stateText(osd.cover_state)],
    ['归中', stateText(osd.position_center_state)],
    ['充电夹具', stateText(osd.charging_center_state)],
    ['升降', stateText(osd.lifting_platform_state)],
    ['外温', `${osd.external_temperature} ℃`],
    ['外湿', `${osd.external_humidity} %`],
    ['内温', `${osd.internal_temperature} ℃`],
    ['内湿', `${osd.internal_humidity} %`],
    ['雨雪', `${RAINFALL_LABEL[osd.rainfall] ?? osd.rainfall} (${osd.rainfall})`],
    ['空调', AC_LABEL[osd.air_conditioner_state] ?? '—'],
    ['工作模式', WORK_MODE_LABEL[osd.dock_work_mode] ?? '—'],
    ['心跳序号', String(osd.heart_beat)],
  ]

  const groups: { title: string; methods: HangarMethod[] }[] = [
    {
      title: '机构点动',
      methods: [
        'position_center_close',
        'position_center_open',
        'charging_center_close',
        'charging_center_open',
        'door_center_clamp',
        'door_center_release',
      ],
    },
    {
      title: '外设与环境',
      methods: ['remote_control_turn_open_off', 'air_conditioner_close'],
    },
    {
      title: '系统',
      methods: ['reset', 'restart_pc'],
    },
  ]

  const onRun = (m: HangarMethod) => {
    const meta = METHOD_META[m]
    if (meta.danger && (m === 'reset' || m === 'restart_pc')) {
      setPendingDanger(m)
      return
    }
    void sendMethod(m)
  }

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hangar-more-title"
        className="flex max-h-[88vh] w-full max-w-[840px] flex-col overflow-hidden rounded-panel border border-app-border bg-app-header shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-app-border px-4">
          <h2 id="hangar-more-title" className="text-sm font-semibold">
            更多控制 / 明细
          </h2>
          <button
            type="button"
            aria-label="关闭弹窗"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-panel text-ink-secondary hover:bg-white/5 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 md:grid-cols-2">
          <section>
            <h3 className="mb-2 text-sm font-semibold">OSD 明细</h3>
            <div className="space-y-1.5 rounded-card border border-app-borderSoft bg-app-card/40 p-3">
              {rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-white/5 pb-1 text-xs last:border-0 last:pb-0"
                >
                  <span className="text-ink-muted">{k}</span>
                  <span className="font-medium text-ink-primary">{v}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">次要指令</h3>
            {clearOn && (
              <p className="mb-2 rounded-md border border-status-warn/40 bg-status-warn/10 px-2 py-1.5 text-xxs text-status-warn">
                清除急停信号为 ON，次要指令已锁定。
              </p>
            )}
            <div className="space-y-3">
              {groups.map((g) => (
                <div key={g.title}>
                  <div className="mb-1.5 text-xxs text-ink-muted">{g.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.methods.map((m) => {
                      const meta = METHOD_META[m]
                      const disabled = clearOn && !meta.allowWhenClearSignalOn
                      return (
                        <button
                          key={m}
                          type="button"
                          disabled={disabled}
                          onClick={() => onRun(m)}
                          className={cn(
                            'h-8 rounded-panel border px-2.5 text-xs font-medium transition',
                            'focus-visible:outline-none focus-visible:ring-2',
                            disabled && 'cursor-not-allowed opacity-40',
                            meta.danger
                              ? 'border-status-danger/45 bg-status-danger/15 text-status-danger hover:bg-status-danger/25 focus-visible:ring-status-danger/40'
                              : 'border-app-border bg-app-card text-ink-primary hover:bg-app-cardHover focus-visible:ring-accent-cyan/40',
                          )}
                        >
                          {meta.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-ink-muted">
              未列入弹窗的作业指令（开关门、升降、出/入库、充放电、急停）在主面板操作。
              当前共 {L3_METHODS.length} 个次要 method。
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

function stateText(s: number): string {
  return s === 1 ? '1 · 到位A' : s === 2 ? '2 · 到位B' : '3 · 运动中'
}
