import { useEffect, useMemo } from 'react'
import { Settings, X } from 'lucide-react'
import { METHOD_META } from './methodMeta'
import { useHangarStore } from '@/stores/useHangarStore'
import { cn } from '@/lib/cn'
import type { HangarMethod } from '@/types/hangar'

type SwitchState = 'on' | 'off' | 'moving'

interface ToggleDef {
  id: string
  title: string
  onLabel: string
  offLabel: string
  methodOn: HangarMethod
  methodOff: HangarMethod
  state: SwitchState
  danger?: boolean
}

interface ActionDef {
  id: string
  label: string
  method: HangarMethod
  danger?: boolean
}

export function HangarCommandDialog() {
  const open = useHangarStore((s) => s.drawerOpen)
  const setOpen = useHangarStore((s) => s.setDrawerOpen)
  const osd = useHangarStore((s) => s.osd)
  const clearOn = useHangarStore((s) => s.clearEmergencySignalOn)
  const sendMethod = useHangarStore((s) => s.sendMethod)
  const setPendingDanger = useHangarStore((s) => s.setPendingDanger)
  const doorCenterClamped = useHangarStore((s) => s.doorCenterClamped)
  const remoteControlOn = useHangarStore((s) => s.remoteControlOn)
  const progress = useHangarStore((s) => s.progress)
  const deviceName = useHangarStore((s) => s.deviceName)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const run = (m: HangarMethod) => {
    const meta = METHOD_META[m]
    const needConfirm =
      meta.danger &&
      (m === 'out_bound' ||
        m === 'in_bound' ||
        m === 'drone_open' ||
        m === 'drone_close' ||
        m === 'reset' ||
        m === 'restart_pc' ||
        m === 'stop')
    if (needConfirm) {
      setPendingDanger(m)
      return
    }
    void sendMethod(m)
  }

  const toggles: ToggleDef[] = useMemo(() => {
    const tri = (s: number, onV: number): SwitchState =>
      s === 3 ? 'moving' : s === onV ? 'on' : 'off'

    return [
      {
        id: 'cover',
        title: '舱体与升降',
        onLabel: '顶门打开',
        offLabel: '顶门关闭',
        methodOn: 'cover_open',
        methodOff: 'cover_close',
        state: tri(osd.cover_state, 1),
      },
      {
        id: 'lift',
        title: '舱体与升降',
        onLabel: '升降上升',
        offLabel: '升降下降',
        methodOn: 'lifting_platform_up',
        methodOff: 'lifting_platform_down',
        state: tri(osd.lifting_platform_state, 1),
      },
      {
        id: 'door_center',
        title: '舱体与升降',
        onLabel: '顶门归中夹紧',
        offLabel: '顶门归中松开',
        methodOn: 'door_center_clamp',
        methodOff: 'door_center_release',
        state: doorCenterClamped ? 'on' : 'off',
      },
      {
        id: 'position',
        title: '归中与充电',
        onLabel: '归中夹紧',
        offLabel: '归中松开',
        methodOn: 'position_center_close',
        methodOff: 'position_center_open',
        state: tri(osd.position_center_state, 1),
      },
      {
        id: 'charge_clamp',
        title: '归中与充电',
        onLabel: '充电夹具伸出',
        offLabel: '充电夹具缩回',
        methodOn: 'charging_center_close',
        methodOff: 'charging_center_open',
        state: tri(osd.charging_center_state, 1),
      },
      {
        id: 'charging',
        title: '归中与充电',
        onLabel: '充电中',
        offLabel: '未充电',
        methodOn: 'charging_open',
        methodOff: 'charging_close',
        state: osd.charging_state ? 'on' : 'off',
      },
      {
        id: 'bound',
        title: '作业与动力',
        onLabel: '出库',
        offLabel: '在库',
        methodOn: 'out_bound',
        methodOff: 'in_bound',
        state: osd.drone_in_dock ? 'off' : 'on',
        danger: true,
      },
      {
        id: 'drone_power',
        title: '作业与动力',
        onLabel: '飞机开机',
        offLabel: '飞机关机',
        methodOn: 'drone_open',
        methodOff: 'drone_close',
        state: osd.device_online_state ? 'on' : 'off',
        danger: true,
      },
      {
        id: 'rc',
        title: '作业与动力',
        onLabel: '遥控器开',
        offLabel: '遥控器关',
        methodOn: 'remote_control_turn_open_off',
        methodOff: 'remote_control_turn_open_off',
        state: remoteControlOn ? 'on' : 'off',
      },
      {
        id: 'estop',
        title: '系统与维保',
        onLabel: '急停中·清除',
        offLabel: '急停',
        methodOn: 'clear_emergency_stop',
        methodOff: 'stop',
        state: osd.stop_state || clearOn ? 'on' : 'off',
        danger: true,
      },
    ]
  }, [osd, clearOn, doorCenterClamped, remoteControlOn])

  const actions: ActionDef[] = [
    { id: 'reset', label: '机场复位', method: 'reset', danger: true },
    { id: 'restart', label: '重启工控机', method: 'restart_pc', danger: true },
    { id: 'ac_off', label: '关空调', method: 'air_conditioner_close' },
  ]

  const groups = ['舱体与升降', '归中与充电', '作业与动力', '系统与维保'] as const

  // 出入库动画中禁用出入库切换
  const boundBusy = progress !== null

  return (
    <>
      <div
        className={`fixed inset-0 z-[8000] bg-black/45 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div
        className={`fixed inset-0 z-[8100] flex items-center justify-center p-4 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hangar-cmd-title"
          className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-panel border border-app-border bg-app-header p-4 shadow-panel scrollbar-thin"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 id="hangar-cmd-title" className="flex items-center gap-2 text-base font-semibold">
                <Settings className="h-4 w-4 text-accent-cyan" />
                机库控制
              </h2>
              <p className="mt-0.5 text-xxs text-ink-secondary">{deviceName}</p>
            </div>
            <button
              type="button"
              aria-label="关闭机库控制"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-panel text-ink-secondary hover:bg-white/5 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {clearOn && (
            <p
              role="alert"
              className="mb-3 rounded-md border border-status-warn/50 bg-status-warn/15 px-2.5 py-2 text-xs text-status-warn"
            >
              清除急停信号为 ON，请先将其置为 OFF。除急停/清除外操作已锁定。
            </p>
          )}

          {groups.map((g) => {
            const items = toggles.filter((t) => t.title === g)
            const acts = g === '系统与维保' ? actions : []
            if (items.length === 0 && acts.length === 0) return null
            return (
              <section key={g} className="mb-4 last:mb-0">
                <h3 className="mb-2 text-xs font-medium text-ink-muted">{g}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((t) => {
                    const locked = clearOn && t.id !== 'estop'
                    const disabled = locked || t.state === 'moving' || (t.id === 'bound' && boundBusy)
                    const label =
                      t.state === 'moving'
                        ? '运动中…'
                        : t.state === 'on'
                          ? t.onLabel
                          : t.offLabel
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          if (t.state === 'on') run(t.methodOff)
                          else run(t.methodOn)
                        }}
                        className={cn(
                          'h-9 min-w-[108px] rounded-panel border px-3 text-xs font-semibold transition',
                          'focus-visible:outline-none focus-visible:ring-2',
                          disabled && 'cursor-not-allowed opacity-40',
                          t.state === 'on'
                            ? t.danger
                              ? 'border-status-danger bg-status-danger/30 text-status-danger focus-visible:ring-status-danger/40'
                              : 'border-accent-cyan bg-accent-cyan/30 text-accent-cyan shadow-glow focus-visible:ring-accent-cyan/40'
                            : t.danger
                              ? 'border-status-danger/40 bg-status-danger/10 text-status-danger hover:bg-status-danger/20 focus-visible:ring-status-danger/40'
                              : 'border-app-border bg-app-card text-ink-primary hover:bg-app-cardHover focus-visible:ring-accent-cyan/40',
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                  {acts.map((a) => {
                    const locked = clearOn
                    return (
                      <button
                        key={a.id}
                        type="button"
                        disabled={locked}
                        onClick={() => run(a.method)}
                        className={cn(
                          'h-9 min-w-[108px] rounded-panel border px-3 text-xs font-semibold transition',
                          'focus-visible:outline-none focus-visible:ring-2',
                          locked && 'cursor-not-allowed opacity-40',
                          a.danger
                            ? 'border-status-danger/40 bg-status-danger/10 text-status-danger hover:bg-status-danger/20 focus-visible:ring-status-danger/40'
                            : 'border-app-border bg-app-card text-ink-primary hover:bg-app-cardHover focus-visible:ring-accent-cyan/40',
                        )}
                      >
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}

        </div>
      </div>
    </>
  )
}
