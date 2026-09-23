import { ChevronDown, Search } from 'lucide-react'
import { useDeviceStore } from '@/stores/useDeviceStore'
import { cn } from '@/lib/cn'
import type { AirportCardItem } from '@/types'

const STATE_PILL: Record<string, string> = {
  open: 'bg-status-warn text-black',
  flying: 'bg-status-warn text-black',
  charging: 'bg-status-warn text-black',
  idle: 'bg-status-online text-black',
  normal: 'bg-app-card text-ink-secondary',
  offline: 'bg-app-card text-ink-secondary border border-app-border',
}

interface CabinGroup {
  cabin: AirportCardItem
  drones: AirportCardItem[]
}

function buildGroups(devices: AirportCardItem[]): CabinGroup[] {
  const cabins = devices.filter((d) => d.role === 'cabin')
  return cabins.map((cabin) => ({
    cabin,
    drones: devices.filter((d) => d.parentId === cabin.id),
  }))
}

export function AirportList({ className }: { className?: string }) {
  const filterKeyword = useDeviceStore((s) => s.filterKeyword)
  const setFilterKeyword = useDeviceStore((s) => s.setFilterKeyword)
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId)
  const setSelectedDevice = useDeviceStore((s) => s.setSelectedDevice)
  const allDevices = useDeviceStore((s) => s.devices)

  const kw = filterKeyword.trim()
  const filtered = kw
    ? allDevices.filter(
        (d) =>
          d.name.includes(kw) ||
          d.runStateLabel.includes(kw) ||
          (d.parentId &&
            allDevices.find((p) => p.id === d.parentId)?.name.includes(kw)),
      )
    : allDevices

  // 筛选时：命中子设备则保留其父方舱
  const visibleIds = new Set(filtered.map((d) => d.id))
  for (const d of filtered) {
    if (d.parentId) visibleIds.add(d.parentId)
  }
  const visible = allDevices.filter((d) => visibleIds.has(d.id))
  const groups = buildGroups(visible)

  return (
    <section
      className={cn('panel-glass rounded-panel p-2.5', className)}
      aria-label="机场列表"
    >
      <label className="relative mb-2 block">
        <span className="sr-only">请输入设备名称筛选</span>
        <input
          type="search"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          placeholder="请输入设备名称筛选"
          className={cn(
            'h-9 w-full rounded-panel border border-app-border bg-app-input',
            'pl-3 pr-9 text-sm text-ink-primary placeholder:text-ink-muted',
            'focus:border-accent-cyan/60 focus:outline-none focus:ring-1 focus:ring-accent-cyan/40',
          )}
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      </label>

      <div className="mb-2 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rotate-45 bg-accent-cyan" />
          <h2 className="text-sm font-semibold text-ink-primary">机场列表</h2>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
      </div>

      <ul className="scrollbar-thin flex max-h-[220px] flex-col gap-2 overflow-y-auto pr-0.5">
        {groups.length === 0 && (
          <li className="rounded-card border border-app-borderSoft bg-app-card/40 px-3 py-4 text-center text-sm text-ink-muted">
            未找到匹配设备
          </li>
        )}

        {groups.map(({ cabin, drones }) => (
          <li key={cabin.id} className="flex flex-col gap-1.5">
            <AirportCard
              device={cabin}
              active={cabin.id === selectedDeviceId}
              onSelect={() => setSelectedDevice(cabin.id)}
              level="parent"
            />

            {drones.map((drone) => (
              <div key={drone.id} className="relative pl-5">
                {/* 从属连线：方舱 → 垂起 */}
                <span
                  aria-hidden
                  className="absolute left-2 top-0 h-3 w-px bg-app-border"
                />
                <span
                  aria-hidden
                  className="absolute left-2 top-3 h-[calc(50%-3px)] w-2 rounded-l border-l border-b border-app-border"
                />
                <AirportCard
                  device={drone}
                  active={drone.id === selectedDeviceId}
                  onSelect={() => setSelectedDevice(drone.id)}
                  level="child"
                />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </section>
  )
}

function AirportCard({
  device,
  active,
  onSelect,
  level,
}: {
  device: AirportCardItem
  active: boolean
  onSelect: () => void
  level: 'parent' | 'child'
}) {
  const isChild = level === 'child'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-card border p-2 text-left transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50',
        active
          ? 'border-accent-cyan/70 bg-app-cardHover shadow-glow'
          : isChild
            ? 'border-app-borderSoft bg-app-card/70 hover:border-accent-cyan/40 hover:bg-app-cardHover'
            : 'border-app-border bg-app-card hover:border-accent-cyan/40 hover:bg-app-cardHover',
      )}
    >
      <div className="flex items-start gap-2">
        <div
          className={cn(
            'shrink-0 overflow-hidden rounded-md border border-app-border bg-app-input',
            isChild ? 'h-10 w-14' : 'h-12 w-16',
          )}
        >
          <img
            src={device.thumbnail}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  'truncate font-semibold text-ink-primary',
                  isChild ? 'text-xs' : 'text-sm',
                )}
              >
                {device.name}
              </span>
            </div>
            <span
              className={cn(
                'shrink-0 font-medium',
                isChild ? 'text-[9px]' : 'text-xxs',
                device.online === 'online'
                  ? 'text-status-online'
                  : 'text-status-offline',
              )}
            >
              {device.onlineLabel}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-status-online/20 px-1 text-xxs font-bold text-status-online">
              {device.badge}
            </span>
            <span
              className={cn(
                'inline-flex h-5 items-center rounded-sm px-2 text-xxs font-semibold',
                STATE_PILL[device.runState] ?? STATE_PILL.normal,
              )}
            >
              {device.runStateLabel}
            </span>
            <span className="ml-auto rounded-sm border border-app-border px-2 py-0.5 text-xxs text-ink-secondary">
              查看
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
