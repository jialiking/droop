import { Activity, Gauge, MapPin, Settings } from 'lucide-react'
import { BatteryGauge } from './BatteryGauge'
import { useHangarStore } from '@/stores/useHangarStore'
import type {
  CabinDeviceDetail,
  DeviceDetail as DeviceDetailType,
  DroneDeviceDetail,
} from '@/types'

const TONE_CLASS: Record<string, string> = {
  warn: 'text-status-warn',
  ok: 'text-status-online',
  info: 'text-[#5ec8ff]',
  default: 'text-ink-primary',
}

export function DeviceDetail({ detail }: { detail: DeviceDetailType | undefined }) {
  const setHangarOpen = useHangarStore((s) => s.setDrawerOpen)

  if (!detail) {
    return (
      <div className="mb-2 rounded-card border border-app-border bg-app-card/40 px-3 py-4 text-center text-xs text-ink-muted">
        请选择设备查看详情
      </div>
    )
  }

  return (
    <section className="mb-1" aria-label="设备详情">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full border border-accent-cyan bg-accent-cyan/40" />
          <h2 className="text-[13px] font-semibold text-ink-primary">设备详情</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const base = `${window.location.origin}${window.location.pathname}`
              window.open(`${base}#/cockpit`, '_blank', 'noopener,noreferrer')
            }}
            title="进入驾驶舱"
            className="h-7 rounded-panel border border-status-warn/50 bg-status-warn/15 px-2.5 text-[10px] font-semibold text-status-warn transition hover:border-status-warn hover:bg-status-warn/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-warn/50"
          >
            驾驶舱
          </button>
          {detail.role === 'cabin' && (
            <button
              type="button"
              onClick={() => setHangarOpen(true)}
              aria-label="机库控制"
              title="机库控制"
              className="flex h-7 w-7 items-center justify-center rounded-panel border border-accent-cyan/45 bg-accent-cyan/15 text-accent-cyan transition hover:bg-accent-cyan/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {detail.role === 'drone' ? (
        <DroneDetailPanel detail={detail} />
      ) : (
        <CabinDetailPanel detail={detail} />
      )}
    </section>
  )
}

function CabinDetailPanel({ detail }: { detail: CabinDeviceDetail }) {
  const fields = [
    { label: '机场状态', value: detail.airportStatus, tone: 'warn' },
    { label: '舱盖状态', value: detail.hatchStatus, tone: 'info' },
    { label: '补光灯', value: detail.searchLight, tone: 'info' },
    { label: '声光警报', value: detail.audioAlarm, tone: 'info' },
    { label: '任务状态', value: detail.taskStatus, tone: 'warn' },
    { label: '标定状态', value: detail.calibStatus, tone: 'ok' },
    { label: '风速', value: detail.windSpeed, tone: 'info' },
    { label: '环境温度', value: detail.ambientTemp, tone: 'warn' },
    { label: '空中回传', value: detail.airReturn, tone: 'info' },
    { label: '静音模式', value: detail.quietMode, tone: 'info' },
    { label: '降雨量', value: detail.drizzle, tone: 'info' },
    { label: '网速', value: detail.network, tone: 'default' },
  ]

  return (
    <div className="rounded-card border border-app-borderSoft bg-app-card/50 p-2">
      <div className="flex items-center gap-2.5">
        <BatteryGauge value={detail.battery} caption="电量" />
        <div className="min-w-0 flex-1 space-y-1">
          <TopPair label="充电状态" value={detail.chargeStatus} tone="ok" />
          <TopPair label="电池温度" value={detail.batteryTemp} tone="warn" />
          <TopPair label="是否在舱" value={detail.inCabin} tone="warn" />
        </div>
      </div>
      <FieldGrid fields={fields} />
    </div>
  )
}

function DroneDetailPanel({ detail }: { detail: DroneDeviceDetail }) {
  const fields = [
    { label: '总任务时间', value: detail.totalMissionTime, tone: 'info' },
    { label: '已飞行时间', value: detail.flightTime, tone: 'info' },
    { label: '单架次里程', value: detail.sortieRange, tone: 'info' },
    { label: '剩余里程数', value: detail.remainRange, tone: 'warn' },
    { label: '多旋翼油门', value: detail.multiRotorThrottle, tone: 'info' },
    { label: '固定翼油门', value: detail.fixedWingThrottle, tone: 'ok' },
    { label: '海拔高度', value: detail.altitude, tone: 'info' },
    { label: '相对高度', value: detail.relativeAltitude, tone: 'info' },
    { label: '空速', value: detail.airSpeed, tone: 'info' },
    { label: '地速', value: detail.groundSpeed, tone: 'info' },
    { label: '风向', value: detail.windDirection, tone: 'default' },
    { label: '风速', value: detail.windSpeed, tone: 'warn' },
  ]

  return (
    <div className="rounded-card border border-app-borderSoft bg-app-card/50 p-2">
      <div className="flex items-center gap-2.5">
        <BatteryGauge value={detail.battery} caption="剩余电量" />
        <div className="min-w-0 flex-1 space-y-1">
          <TopPair
            label="状态"
            value={detail.status}
            tone="warn"
            icon={<Activity className="h-3 w-3" />}
          />
          <TopPair
            label="电压"
            value={detail.voltage}
            tone="info"
            icon={<Gauge className="h-3 w-3" />}
          />
          <TopPair
            label="距离机场"
            value={detail.distToAirport}
            tone="info"
            icon={<MapPin className="h-3 w-3" />}
          />
        </div>
      </div>
      <FieldGrid fields={fields} />
    </div>
  )
}

function FieldGrid({
  fields,
}: {
  fields: { label: string; value: string; tone?: string }[]
}) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-x-2.5 gap-y-1 border-t border-app-borderSoft pt-2">
      {fields.map((item) => (
        <div
          key={item.label}
          className="flex min-w-0 items-center justify-between gap-1"
        >
          <span className="shrink-0 text-[10px] leading-[14px] text-ink-muted">
            {item.label}
          </span>
          <span
            className={`min-w-0 truncate text-[10px] font-semibold leading-[14px] ${
              TONE_CLASS[item.tone ?? 'default'] ?? TONE_CLASS.default
            }`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function TopPair({
  label,
  value,
  tone,
  icon,
}: {
  label: string
  value: string
  tone?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-app-borderSoft bg-app-input/60 px-1.5 py-[3px]">
      <span className="flex items-center gap-1 text-[10px] leading-[14px] text-ink-muted">
        {icon}
        {label}
      </span>
      <span
        className={`text-[10px] font-semibold leading-[14px] ${
          TONE_CLASS[tone ?? 'default'] ?? TONE_CLASS.default
        }`}
      >
        {value}
      </span>
    </div>
  )
}
