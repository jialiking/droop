import { Activity, Clock3, Gauge, Plane } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDeviceStore } from '@/stores/useDeviceStore'

export function StatsBar() {
  const stats = useDeviceStore((s) => s.stats)

  const items = [
    {
      id: 'online',
      icon: Activity,
      value: String(stats.onlineDevices),
      suffix: '',
      label: '在线设备',
      iconClass: 'text-accent-cyan',
    },
    {
      id: 'flights',
      icon: Plane,
      value: String(stats.todayFlights),
      suffix: '',
      label: '今日航次',
      iconClass: 'text-accent-blue',
    },
    {
      id: 'hours',
      icon: Clock3,
      value: String(stats.todayFlightHours),
      suffix: 'h',
      label: '今日飞行时长',
      iconClass: 'text-status-warn',
    },
    {
      id: 'km',
      icon: Gauge,
      value: String(stats.todayFlightKm),
      suffix: 'km',
      label: '今日飞行里程',
      iconClass: 'text-emerald-400',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute inset-x-3 bottom-3 z-[500]"
    >
      <div className="panel-glass-soft pointer-events-auto mx-auto flex w-fit items-center gap-8 rounded-panel px-8 py-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <Icon className={`h-4 w-4 ${item.iconClass}`} />
              </div>
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-bold leading-none text-white">
                    {item.value}
                  </span>
                  {item.suffix ? (
                    <span className="text-xs font-medium text-white/70">
                      {item.suffix}
                    </span>
                  ) : null}
                </div>
                <div className="mt-0.5 text-xxs text-white/70">{item.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
