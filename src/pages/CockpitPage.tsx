import { Activity, ChevronDown, Compass, Gauge, Search, Layers, PenLine, Satellite, X } from 'lucide-react'
import { divIcon } from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import { AMAP_LABEL, AMAP_SAT, AMAP_SUBDOMAINS, ESRI_SATELLITE, TIANDITU_CIA, TIANDITU_IMG } from '@/config/mapTiles'

const COCKPIT_CENTER: [number, number] = [23.295716, 113.6864277]
const COCKPIT_ZOOM = 16

type ViewMode = 'map' | 'fpv' | 'airport'
type LayoutMode = 'single' | 'multi'

export function CockpitPage() {
  const [confirmClose, setConfirmClose] = useState(false)
  const [layout, setLayout] = useState<LayoutMode>('single')
  const [view, setView] = useState<ViewMode>('map')

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#071018] text-ink-primary">
      <TopBar
        layout={layout}
        onLayoutChange={setLayout}
        onClose={() => setConfirmClose(true)}
      />
      <div className="flex min-h-0 flex-1">
        {layout === 'single' ? (
          <div className="relative min-w-0 flex-1 bg-[#0a1628]">
            {view === 'map' && (
              <>
                <CockpitMap />
                <TelemetryPopup />
                <MapControlStack />
              </>
            )}
            {view === 'fpv' && <LiveFeedView title="FPV 无人机直播" mode="fpv" />}
            {view === 'airport' && <LiveFeedView title="机场直播" mode="airport" />}
            <BottomViewTabs active={view} onChange={setView} />
          </div>
        ) : (
          <MultiWindowStage />
        )}
        <RightPanels />
      </div>

      <CloseConfirmDialog
        open={confirmClose}
        onCancel={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false)
          window.close()
        }}
      />
    </div>
  )
}

/** 多窗口：左地图 + 右上 FPV + 右下机场监控 */
function MultiWindowStage() {
  return (
    <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] grid-rows-2 gap-2 bg-[#071018] p-2">
      <div className="relative row-span-2 min-h-0 overflow-hidden rounded-md border border-white/10">
        <div className="absolute left-0 right-0 top-0 z-[500] flex h-7 items-center border-b border-white/10 bg-[#0b1520]/90 px-2 text-xs font-semibold">
          态势地图
        </div>
        <div className="absolute inset-0 pt-7">
          <CockpitMap />
          <TelemetryPopup />
          <MapControlStack />
        </div>
      </div>

      <VideoPanel title="无人机 FPV" badge="1080P超清" mode="fpv" />
      <VideoPanel title="机场监控" badge="1080P超清" mode="airport" />
    </div>
  )
}

function VideoPanel({
  title,
  badge,
  mode,
}: {
  title: string
  badge: string
  mode: 'fpv' | 'airport'
}) {
  return (
    <div className="relative flex min-h-0 flex-col overflow-hidden rounded-md border border-white/10 bg-[#0b1520]">
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/10 px-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-2 w-2 rounded-full bg-status-danger" />
          <span className="text-xs font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-ink-secondary">
          <span>{badge}</span>
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-white/20 text-[9px]">
            ⛶
          </span>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        {mode === 'fpv' ? <DroneFpvScene /> : <AirportHangarScene />}
        <div className="pointer-events-none absolute bottom-2 right-2 text-[10px] text-white/70">
          {mode === 'fpv' ? 'AI' : ''}
        </div>
      </div>
    </div>
  )
}

function CloseConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cockpit-close-title"
        className="w-[360px] rounded-panel border border-white/15 bg-[#122033] p-5 shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cockpit-close-title" className="text-base font-semibold text-ink-primary">
          确认关闭驾驶舱？
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-secondary">
          关闭后将退出当前驾驶舱页面，是否继续？
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-panel border border-white/20 bg-white/5 px-4 text-sm text-ink-primary transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-panel border border-status-danger/50 bg-status-danger/20 px-4 text-sm font-medium text-status-danger transition hover:bg-status-danger/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger/50"
          >
            确认关闭
          </button>
        </div>
      </div>
    </div>
  )
}

function TopBar({
  layout,
  onLayoutChange,
  onClose,
}: {
  layout: LayoutMode
  onLayoutChange: (v: LayoutMode) => void
  onClose: () => void
}) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-[#0b1520] px-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onLayoutChange('single')}
          aria-label="单窗口布局"
          aria-pressed={layout === 'single'}
          title="单窗口"
          className={`flex h-9 w-9 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50 ${
            layout === 'single'
              ? 'border-accent-cyan/50 bg-accent-cyan'
              : 'border-white/20 bg-white/10 hover:bg-white/15'
          }`}
        >
          <span
            className={`h-4 w-4 rounded-sm ${
              layout === 'single' ? 'bg-white' : 'bg-white/80'
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => onLayoutChange('multi')}
          aria-label="多窗口布局"
          aria-pressed={layout === 'multi'}
          title="多窗口"
          className={`flex h-9 w-10 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50 ${
            layout === 'multi'
              ? 'border-accent-cyan/50 bg-accent-cyan'
              : 'border-white/20 bg-white/10 hover:bg-white/15'
          }`}
        >
          <div
            className={`grid h-4 w-5 grid-cols-2 gap-0.5 ${
              layout === 'multi' ? 'text-[#071018]' : 'text-white'
            }`}
          >
            <span className={`rounded-[1px] ${layout === 'multi' ? 'bg-[#071018]' : 'bg-white/90'}`} />
            <span className={`rounded-[1px] ${layout === 'multi' ? 'bg-[#071018]/70' : 'bg-white/40'}`} />
            <span className={`rounded-[1px] ${layout === 'multi' ? 'bg-[#071018]/70' : 'bg-white/40'}`} />
            <span className={`rounded-[1px] ${layout === 'multi' ? 'bg-[#071018]' : 'bg-white/90'}`} />
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-9 items-center rounded-panel border border-white/20 bg-white/5 px-4 font-mono text-sm tracking-wide">
          N 23.2957160° · E 113.6864277°
        </div>
        <div className="flex h-9 items-center gap-2 rounded-panel border border-white/20 bg-white/5 px-3">
          <span className="text-sm font-semibold">100%</span>
          <SignalBars />
        </div>
        <div className="flex h-9 items-center gap-2 rounded-panel border border-white/20 bg-white/5 px-3">
          <span className="text-sm font-semibold">20</span>
          <SatelliteIcon />
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="关闭驾驶舱"
        title="关闭驾驶舱"
        className="flex h-9 w-9 items-center justify-center rounded-panel border border-status-danger/40 bg-status-danger/10 text-status-danger transition hover:border-status-danger hover:bg-status-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger/50"
      >
        <X className="h-4 w-4" />
      </button>
    </header>
  )
}

function SignalBars() {
  return (
    <svg width="28" height="16" viewBox="0 0 28 16" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={i * 5.5}
          y={12 - i * 2.5}
          width="4"
          height={4 + i * 2.5}
          rx="0.5"
          fill="#e8f1fb"
        />
      ))}
    </svg>
  )
}

function SatelliteIcon() {
  return <Satellite className="h-4 w-4 text-ink-primary" aria-hidden />
}

const PATH_YELLOW: [number, number][] = [
  [23.2948, 113.6848],
  [23.2962, 113.6865],
  [23.2971, 113.6888],
  [23.2965, 113.6902],
  [23.2952, 113.6895],
  [23.2942, 113.6878],
  [23.2938, 113.6862],
  [23.2945, 113.6852],
  [23.2948, 113.6848],
]

const PATH_RED: [number, number][] = [
  [23.2962, 113.6865],
  [23.2968, 113.6872],
  [23.2971, 113.688],
]

const waypointIcon = (n: number) =>
  divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="width:22px;height:22px;border-radius:999px;background:#f59e0b;border:2px solid #fff;color:#111;font:700 12px/22px system-ui,sans-serif;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.4)">${n}</div>`,
  })

const airportIcon = divIcon({
  className: '',
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  html: `<div style="width:48px;height:48px;border-radius:999px;border:3px solid #f59e0b;background:rgba(245,158,11,.15);display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(245,158,11,.45)"><div style="width:18px;height:18px;border-radius:4px;background:#f59e0b"></div></div>`,
})

function FixMapSize() {
  const map = useMap()
  useEffect(() => {
    const t = window.setTimeout(() => map.invalidateSize({ animate: false }), 200)
    return () => window.clearTimeout(t)
  }, [map])
  return null
}

function CockpitMap() {
  return (
    <MapContainer
      center={COCKPIT_CENTER}
      zoom={COCKPIT_ZOOM}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
      style={{ background: '#0d2137' }}
    >
      <TileLayer url={ESRI_SATELLITE} maxZoom={18} />
      <TileLayer url={AMAP_SAT} subdomains={AMAP_SUBDOMAINS} maxZoom={18} />
      <TileLayer url={AMAP_LABEL} subdomains={AMAP_SUBDOMAINS} opacity={0.7} maxZoom={18} />
      <TileLayer url={TIANDITU_IMG.url} subdomains={TIANDITU_IMG.subdomains} maxZoom={18} />
      <TileLayer url={TIANDITU_CIA.url} subdomains={TIANDITU_CIA.subdomains} opacity={0.9} maxZoom={18} />
      <Polyline positions={PATH_YELLOW} pathOptions={{ color: '#facc15', weight: 3, opacity: 0.95 }} />
      <Polyline positions={PATH_RED} pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.95 }} />
      <Marker position={[23.2962, 113.6865]} icon={waypointIcon(1)} />
      <Marker position={[23.2942, 113.6878]} icon={waypointIcon(2)} />
      <Marker position={[23.2945, 113.6855]} icon={airportIcon} />
      <FixMapSize />
    </MapContainer>
  )
}

function TelemetryPopup() {
  const rows: [string, string][] = [
    ['空速', '0.00m/s'],
    ['高度', '0m(相对) 14m(绝对)'],
    ['模式', '全自动模式'],
    ['电量', '100%(16.8V)'],
    ['信号', '100%'],
    ['定位', '3D定位'],
    ['快门', '0'],
    ['照片', '0'],
  ]
  return (
    <div className="pointer-events-none absolute left-[32%] top-[28%] z-[600] w-[200px] rounded-panel border border-white/15 bg-[#1e3a5fcc] p-2.5 shadow-panel backdrop-blur-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2 py-0.5 text-xs">
          <span className="text-white/70">{k}:</span>
          <span className="font-semibold text-white">{v}</span>
        </div>
      ))}
    </div>
  )
}

function MapControlStack() {
  return (
    <div className="absolute right-3 top-3 z-[600] flex flex-col items-end gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white shadow-card">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200">
          <Compass className="h-5 w-5 text-slate-700" />
          <span className="absolute -top-0.5 text-[8px] font-bold text-red-500">N</span>
        </div>
      </div>
      <MapCtrl label="搜索"><Search className="h-4 w-4 text-slate-700" /></MapCtrl>
      <MapCtrl label="2D"><span className="text-xs font-bold text-slate-700">2D</span></MapCtrl>
      <MapCtrl label="绘制"><PenLine className="h-4 w-4 text-slate-700" /></MapCtrl>
      <MapCtrl label="图层"><Layers className="h-4 w-4 text-slate-700" /></MapCtrl>
      <MapCtrl label="罗盘" className="rounded-full">
        <Compass className="h-4 w-4 text-slate-700" />
      </MapCtrl>
    </div>
  )
}

function MapCtrl({
  children,
  label,
  className,
}: {
  children: React.ReactNode
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-panel border border-white/80 bg-white shadow-card hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60 ${className ?? ''}`}
    >
      {children}
    </button>
  )
}

function BottomViewTabs({
  active,
  onChange,
}: {
  active: ViewMode
  onChange: (v: ViewMode) => void
}) {
  const tabs: { id: ViewMode; label: string; dot: string }[] = [
    { id: 'map', label: '地图', dot: 'bg-emerald-400' },
    { id: 'fpv', label: 'FPV', dot: 'bg-emerald-400' },
    { id: 'airport', label: '机场', dot: 'bg-emerald-400' },
  ]
  return (
    <div className="absolute bottom-4 left-1/2 z-[600] flex -translate-x-1/2 items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          aria-pressed={active === tab.id}
          className={`flex h-12 w-24 flex-col items-center justify-center rounded-md border text-xs transition ${
            active === tab.id
              ? 'border-accent-cyan/70 bg-[#12304f]/90 text-ink-primary shadow-glow'
              : 'border-white/15 bg-[#0b1520]/90 text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <span className="relative flex h-7 w-16 items-center justify-center rounded-sm bg-black/40">
            {tab.id === 'map' && (
              <MiniMapThumb active={active === tab.id} />
            )}
            {tab.id === 'fpv' && <MiniFpvThumb active={active === tab.id} />}
            {tab.id === 'airport' && (
              <MiniAirportThumb active={active === tab.id} />
            )}
            <span
              className={`absolute bottom-0.5 right-1 h-1.5 w-1.5 rounded-full ${tab.dot}`}
            />
          </span>
          <span className="mt-0.5">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

function MiniMapThumb({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 28" className="h-full w-full opacity-90" aria-hidden>
      <rect width="64" height="28" fill="#2d4a3e" />
      <path d="M0 18 Q16 8 32 14 T64 10" stroke={active ? '#facc15' : '#94a3b8'} strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="12" r="2.5" fill={active ? '#2fd4e8' : '#64748b'} />
    </svg>
  )
}

function MiniFpvThumb({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 28" className="h-full w-full" aria-hidden>
      <rect width="64" height="28" fill="#1a2740" />
      <rect x="8" y="8" width="48" height="14" rx="2" fill={active ? '#2a5080' : '#24344d'} />
      <circle cx="32" cy="15" r="3" fill={active ? '#2fd4e8' : '#64748b'} />
      <text x="32" y="25" textAnchor="middle" fill="#94a3b8" fontSize="5">FPV</text>
    </svg>
  )
}

function MiniAirportThumb({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 28" className="h-full w-full" aria-hidden>
      <rect width="64" height="28" fill="#243044" />
      <rect x="12" y="8" width="40" height="12" rx="2" fill={active ? '#3d4f68' : '#2c3a50'} />
      <rect x="22" y="12" width="20" height="4" rx="1" fill={active ? '#2fd4e8' : '#64748b'} />
      <text x="32" y="25" textAnchor="middle" fill="#94a3b8" fontSize="5">机场</text>
    </svg>
  )
}

function LiveFeedView({
  title,
  mode,
}: {
  title: string
  mode: 'fpv' | 'airport'
}) {
  const isFpv = mode === 'fpv'
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0b1520]/90 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-status-danger shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <span className="text-xs text-ink-secondary">
          {isFpv ? '垂起3 · 机载相机' : '机场3east · 舱内相机'}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 bg-black">
        {isFpv ? (
          <DroneFpvScene />
        ) : (
          <AirportHangarScene />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 to-transparent p-4">
          <div className="rounded-panel border border-white/15 bg-black/50 px-3 py-1.5 text-xs backdrop-blur-sm">
            <span className="mr-3 text-ink-secondary">LIVE</span>
            <span className="font-semibold text-white">
              {isFpv ? '空速 18.0m/s · 高度 110m' : '舱盖关闭 · 待命'}
            </span>
          </div>
          <div className="rounded-panel border border-white/15 bg-black/50 px-3 py-1.5 font-mono text-xs text-white/90 backdrop-blur-sm">
            {isFpv ? '1080P · 30FPS' : '1080P · 30FPS'}
          </div>
        </div>
      </div>
    </div>
  )
}

function DroneFpvScene() {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label="无人机 FPV 直播画面"
      >
        <defs>
          <linearGradient id="fpv-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4b6b8a" />
            <stop offset="45%" stop-color="#7a9a70" />
            <stop offset="100%" stop-color="#3d4a38" />
          </linearGradient>
        </defs>
        <rect width="960" height="540" fill="url(#fpv-sky)" />
        <rect y="220" width="960" height="320" fill="#5a7a4a" />
        <path d="M0 260 L180 200 L360 240 L520 190 L700 230 L960 180 L960 320 L0 320 Z" fill="#6d8f55" opacity="0.85" />
        <rect x="120" y="280" width="200" height="40" fill="#c4b59a" opacity="0.5" />
        <rect x="400" y="250" width="80" height="50" fill="#8a9aaa" opacity="0.45" />
        <circle cx="620" cy="300" r="28" fill="#3d5a3a" />
        <circle cx="700" cy="310" r="20" fill="#3d5a3a" />
        <rect x="780" y="270" width="90" height="30" fill="#9aaa88" opacity="0.4" />
        <line x1="480" y1="240" x2="480" y2="300" stroke="#e8f1fb" strokeWidth="1" opacity="0.5" />
        <line x1="440" y1="270" x2="520" y2="270" stroke="#e8f1fb" strokeWidth="1" opacity="0.5" />
        <rect x="470" y="260" width="20" height="20" fill="none" stroke="#2fd4e8" strokeWidth="1.5" opacity="0.8" />
      </svg>
      <div className="absolute left-4 top-4 rounded-panel border border-white/20 bg-black/45 px-3 py-2 font-mono text-[11px] text-white/90 backdrop-blur-sm">
        <div>ALT 110.00m</div>
        <div>SPD 18.2m/s</div>
        <div>HDG 090°</div>
      </div>
    </div>
  )
}

function AirportHangarScene() {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label="机场舱内直播画面"
      >
        <defs>
          <linearGradient id="hang-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8a9099" />
            <stop offset="50%" stop-color="#6d737c" />
            <stop offset="100%" stop-color="#3a3f46" />
          </linearGradient>
        </defs>
        <rect width="960" height="540" fill="url(#hang-wall)" />
        <rect y="360" width="960" height="180" fill="#2f343c" />
        <rect x="40" y="40" width="18" height="300" fill="#9aa3ad" opacity="0.4" />
        <rect x="900" y="40" width="18" height="300" fill="#9aa3ad" opacity="0.4" />
        <rect x="320" y="60" width="320" height="280" fill="#c5d0db" opacity="0.25" />
        <rect x="340" y="70" width="280" height="24" fill="#d0d8e0" opacity="0.7" />
        <rect x="80" y="140" width="160" height="200" rx="4" fill="#555c66" stroke="#7d8692" stroke-width="2" />
        <rect x="100" y="170" width="120" height="16" rx="2" fill="#2fd4e8" opacity="0.5" />
        <rect x="100" y="200" width="90" height="12" rx="2" fill="#22c55e" opacity="0.4" />
        <rect x="720" y="130" width="160" height="210" rx="4" fill="#4e555e" stroke="#7d8692" stroke-width="2" />
        <rect x="740" y="160" width="120" height="70" rx="3" fill="#1a1f26" />
        <circle cx="800" cy="195" r="16" fill="#3b82f6" opacity="0.45" />
        <rect x="400" y="300" width="160" height="40" rx="8" fill="#2b3138" />
        <circle cx="480" cy="285" r="18" fill="#2b3138" />
        <path d="M300 380 H660" stroke="#c5d0db" strokeWidth="2" opacity="0.2" stroke-dasharray="10 8" />
      </svg>
      <div className="absolute left-4 top-4 rounded-panel border border-white/20 bg-black/45 px-3 py-2 text-[11px] text-white/90 backdrop-blur-sm">
        <div className="font-semibold">机场3east</div>
        <div className="text-white/70">舱内监控 · 通道1</div>
      </div>
    </div>
  )
}

function RightPanels() {
  return (
    <aside className="flex w-[340px] shrink-0 flex-col gap-2 overflow-y-auto border-l border-white/10 bg-[#0b1520] p-3 scrollbar-thin">
      <Panel title="任务信息预览">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat value="4.5km" label="总里程" />
          <Stat value="9mins" label="总任务时间" />
          <Stat value="0" label="预计拍照数量" />
        </div>
      </Panel>

      <Panel title="飞行参数">
        <div className="grid grid-cols-3 gap-2">
          <MetricCard value="100%" label="固定翼 (16.75v)" icon={<Gauge className="h-4 w-4 text-emerald-400" />} bars />
          <MetricCard value="100%" label="信号" icon={<Activity className="h-4 w-4 text-emerald-400" />} bars />
          <MetricCard value="20(3D)" label="GPS" icon={<Satellite className="h-4 w-4 text-emerald-400" />} />
        </div>
        <div className="mt-3 space-y-2">
          <KV k="已飞行时间" v="00:00" />
          <KV k="起点距离" v="22.56m" />
          <KV k="单架次里程" v="0.0 km" />
          <KV k="剩余里程" v="5.20 km" accent />
          <KV k="相对高度" v="0.00m" />
          <KV k="绝对高度" v="14.28m" />
          <KV k="空速" v="0.0m/s" />
          <KV k="地速" v="0.0m/s" />
          <KV k="多旋翼油门" v="0%" />
          <KV k="固定翼油门" v="0%" />
        </div>
      </Panel>

      <Panel title="飞行状态及仪表">
        <div className="mb-2 rounded-md border border-status-warn/60 bg-status-warn/15 px-3 py-2 text-center text-sm font-semibold text-status-warn">
          锁定状态，等待解锁
        </div>
        <AttitudeIndicator />
      </Panel>
    </aside>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <section className="rounded-panel border border-white/10 bg-[#122033]/80 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? `收起${title}` : `展开${title}`}
        className="mb-3 flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
      >
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-1 rounded-full bg-accent-cyan" />
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition hover:bg-white/5 hover:text-ink-primary ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      {open && <div className="panel-body">{children}</div>}
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[11px] text-ink-secondary">{label}</div>
    </div>
  )
}

function MetricCard({
  value,
  label,
  icon,
  bars,
}: {
  value: string
  label: string
  icon: React.ReactNode
  bars?: boolean
}) {
  return (
    <div className="rounded-md border border-white/10 bg-[#0e243c] p-2 text-center">
      {bars ? (
        <div className="mx-auto mb-1 flex h-6 items-end justify-center gap-0.5">
          {[4, 7, 10, 13, 16].map((h, i) => (
            <span key={i} className="w-1.5 rounded-sm bg-emerald-400" style={{ height: h }} />
          ))}
        </div>
      ) : (
        <div className="mb-1 flex justify-center">{icon}</div>
      )}
      <div className="text-sm font-bold text-emerald-400">{value}</div>
      <div className="mt-0.5 text-[10px] text-ink-secondary">{label}</div>
    </div>
  )
}

function KV({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-xs last:border-0">
      <span className="text-ink-secondary">{k}</span>
      <span className={accent ? 'font-semibold text-accent-cyan' : 'font-medium text-white'}>
        {v}
      </span>
    </div>
  )
}

function AttitudeIndicator() {
  return (
    <div className="relative mx-auto h-[150px] w-[220px] overflow-hidden rounded-md border border-white/15 bg-[#0a1628]">
      <div className="absolute inset-x-0 top-0 text-center text-[10px] text-ink-secondary">
        <span className="mx-2">空速</span>
        <span>70</span>
        <span className="mx-1">80</span>
        <span className="mx-1 text-white font-bold">E</span>
        <span className="mx-1">100</span>
        <span>110</span>
        <span className="mx-2">高度</span>
      </div>
      <svg viewBox="0 0 220 120" className="absolute bottom-0 left-0 h-[120px] w-full">
        <rect x="20" y="10" width="180" height="100" rx="4" fill="#3b82f6" />
        <rect x="20" y="70" width="180" height="40" rx="4" fill="#eab308" />
        <line x1="20" y1="70" x2="200" y2="70" stroke="#e8f1fb" strokeWidth="2" />
        <line x1="90" y1="70" x2="130" y2="70" stroke="#0b1c30" strokeWidth="3" />
        <polygon points="110,58 104,70 116,70" fill="#0b1c30" />
        <text x="30" y="40" fill="#e8f1fb" fontSize="9">10</text>
        <text x="30" y="55" fill="#e8f1fb" fontSize="9">5</text>
        <text x="30" y="72" fill="#e8f1fb" fontSize="9">0</text>
        <text x="30" y="88" fill="#1f2937" fontSize="9">-5</text>
        <text x="30" y="102" fill="#1f2937" fontSize="9">-10</text>
        <text x="185" y="40" fill="#e8f1fb" fontSize="9">10</text>
        <text x="185" y="55" fill="#e8f1fb" fontSize="9">5</text>
        <text x="185" y="72" fill="#e8f1fb" fontSize="9">0</text>
        <text x="185" y="88" fill="#1f2937" fontSize="9">-5</text>
        <text x="185" y="102" fill="#1f2937" fontSize="9">-10</text>
      </svg>
    </div>
  )
}
