import { useHangarStore } from '@/stores/useHangarStore'
import { METHOD_META, triLabel } from './methodMeta'
import { cn } from '@/lib/cn'
import type { HangarMethod } from '@/types/hangar'

function PrimaryBtn({
  method,
  onRun,
}: {
  method: HangarMethod
  onRun: (m: HangarMethod) => void
}) {
  const meta = METHOD_META[method]
  const clearOn = useHangarStore((s) => s.clearEmergencySignalOn)
  const progress = useHangarStore((s) => s.progress)
  const busy = (method === 'out_bound' || method === 'in_bound') && progress !== null
  const disabled = (clearOn && !meta.allowWhenClearSignalOn) || busy

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onRun(method)}
      title={meta.danger ? `${meta.label}（危险操作）` : meta.label}
      className={cn(
        'h-8 min-w-[64px] rounded-panel border px-2.5 text-xs font-semibold transition',
        'focus-visible:outline-none focus-visible:ring-2',
        disabled && 'cursor-not-allowed opacity-40',
        meta.danger
          ? 'border-status-danger/45 bg-status-danger/15 text-status-danger hover:bg-status-danger/25 focus-visible:ring-status-danger/40'
          : 'border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan/25 focus-visible:ring-accent-cyan/40',
      )}
    >
      {busy ? '执行中…' : meta.label}
    </button>
  )
}

function runOrConfirm(
  method: HangarMethod,
  setPendingDanger: (m: HangarMethod | null) => void,
  sendMethod: (m: HangarMethod) => Promise<unknown>,
) {
  if (METHOD_META[method].danger && (method === 'out_bound' || method === 'in_bound' || method === 'drone_open' || method === 'drone_close')) {
    setPendingDanger(method)
    return
  }
  void sendMethod(method)
}

export function HangarPrimaryCards() {
  const osd = useHangarStore((s) => s.osd)
  const sendMethod = useHangarStore((s) => s.sendMethod)
  const setPendingDanger = useHangarStore((s) => s.setPendingDanger)
  const progress = useHangarStore((s) => s.progress)
  const progressPercent = useHangarStore((s) => s.progressPercent)

  const run = (m: HangarMethod) => runOrConfirm(m, setPendingDanger, sendMethod)

  return (
    <div className="grid gap-2 md:grid-cols-2">
      <section className="rounded-panel border border-app-border bg-app-card/50 p-3" aria-label="顶盖与升降">
        <h3 className="mb-2 text-sm font-semibold text-ink-primary">顶盖与升降</h3>
        <div className="space-y-1.5 text-xs">
          <Row label="顶门状态" value={triLabel(osd.cover_state, '打开', '关闭')} />
          <Row label="升降平台" value={triLabel(osd.lifting_platform_state, '上升到位', '下降到位')} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <PrimaryBtn method="cover_open" onRun={run} />
          <PrimaryBtn method="cover_close" onRun={run} />
          <PrimaryBtn method="lifting_platform_up" onRun={run} />
          <PrimaryBtn method="lifting_platform_down" onRun={run} />
        </div>
      </section>

      <section className="rounded-panel border border-app-border bg-app-card/50 p-3" aria-label="飞机与能源">
        <h3 className="mb-2 text-sm font-semibold text-ink-primary">飞机与能源</h3>
        <div className="space-y-1.5 text-xs">
          <Row label="飞机在位" value={osd.drone_in_dock ? '是' : '否'} tone={osd.drone_in_dock ? 'ok' : 'warn'} />
          <Row label="飞机开机" value={osd.device_online_state ? '完成' : '关闭'} tone={osd.device_online_state ? 'ok' : undefined} />
          <Row label="充电状态" value={osd.charging_state ? '充电中' : '未充电'} tone={osd.charging_state ? 'warn' : undefined} />
          <Row
            label="充电夹具"
            value={triLabel(osd.charging_center_state, '伸出', '缩回')}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <PrimaryBtn method="out_bound" onRun={run} />
          <PrimaryBtn method="in_bound" onRun={run} />
          <PrimaryBtn method="drone_open" onRun={run} />
          <PrimaryBtn method="drone_close" onRun={run} />
          <PrimaryBtn method="charging_open" onRun={run} />
          <PrimaryBtn method="charging_close" onRun={run} />
        </div>

        {(progress === 'out_bound' || progress === 'in_bound') && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xxs text-ink-secondary">
              <span>{progress === 'out_bound' ? '出库进度' : '入库进度'}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-pill bg-app-input">
              <div
                className="h-full rounded-pill bg-accent-cyan transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function Row({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'ok' | 'warn'
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-app-borderSoft bg-app-input/50 px-2 py-1.5">
      <span className="text-ink-muted">{label}</span>
      <span
        className={cn(
          'font-semibold',
          tone === 'ok' && 'text-status-online',
          tone === 'warn' && 'text-status-warn',
          !tone && 'text-ink-primary',
        )}
      >
        {value}
      </span>
    </div>
  )
}
