import { useHangarStore } from '@/stores/useHangarStore'
import { triLabel } from './methodMeta'
import { cn } from '@/lib/cn'

export function HangarStatusStrip() {
  const osd = useHangarStore((s) => s.osd)

  const items = [
    { label: '出库完成', value: osd.out_bound_complete ? '是' : '否', ok: osd.out_bound_complete },
    { label: '入库完成', value: osd.in_bound_complete ? '是' : '否', ok: osd.in_bound_complete },
    { label: '复位完成', value: osd.reset_complete ? '是' : '否', ok: osd.reset_complete },
    { label: '市电', value: osd.mains_signal ? '正常' : '断电', ok: osd.mains_signal },
    { label: '归中', value: triLabel(osd.position_center_state, '夹紧', '松开'), ok: osd.position_center_state === 1 },
  ]

  return (
    <section
      aria-label="作业与联锁"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-card border border-app-borderSoft bg-app-card/40 px-2 py-1.5 text-center"
        >
          <div className="text-[10px] text-ink-muted">{item.label}</div>
          <div
            className={cn(
              'mt-0.5 text-xs font-semibold',
              item.ok ? 'text-status-online' : 'text-ink-primary',
            )}
          >
            {item.value}
          </div>
        </div>
      ))}
    </section>
  )
}
