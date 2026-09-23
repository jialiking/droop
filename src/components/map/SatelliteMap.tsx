import { divIcon } from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { Compass, Layers, MapPin, PenLine, Search } from 'lucide-react'
import {
  AMAP_LABEL,
  AMAP_SAT,
  AMAP_SUBDOMAINS,
  ESRI_LABELS,
  ESRI_SATELLITE,
  TIANDITU_CIA,
  TIANDITU_IMG,
} from '@/config/mapTiles'
import { MAP_CENTER, MAP_POIS, MAP_ZOOM } from '@/data/mock'
import { useDeviceStore } from '@/stores/useDeviceStore'

const airportIcon = divIcon({
  className: '',
  iconSize: [72, 72],
  iconAnchor: [36, 36],
  html: `
    <div style="position:relative;width:72px;height:72px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:999px;background:radial-gradient(circle,rgba(47,212,232,0.35) 0%,rgba(47,212,232,0.05) 55%,transparent 70%);"></div>
      <div style="width:48px;height:48px;border-radius:999px;background:linear-gradient(160deg,#2fd4e8 0%,#0891b2 55%,#0e7490 100%);box-shadow:0 0 18px rgba(47,212,232,0.65);display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.55);">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 18V7.5L12 4l8 3.5V18" stroke="white" stroke-width="2" stroke-linejoin="round"/>
          <path d="M8 18v-6h8v6" stroke="white" stroke-width="2"/>
          <path d="M4 18h16" stroke="white" stroke-width="2"/>
        </svg>
      </div>
      <div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);white-space:nowrap;font:600 12px 'Microsoft YaHei',sans-serif;color:#e8f1fb;text-shadow:0 1px 3px rgba(0,0,0,0.85);background:rgba(8,21,34,0.72);padding:2px 6px;border-radius:4px;border:1px solid rgba(47,212,232,0.45);">机场3east</div>
    </div>
  `,
})

const patrolIcon = (index: number) =>
  divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `
      <div style="width:22px;height:22px;border-radius:999px;background:#2563eb;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);color:#fff;font:700 11px/22px system-ui,sans-serif;text-align:center;">${index}</div>
    `,
  })

const poiIcon = (label: string) =>
  divIcon({
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    html: `
      <div style="display:flex;align-items:center;gap:4px;white-space:nowrap;">
        <span style="width:8px;height:8px;border-radius:999px;background:#f59e0b;box-shadow:0 0 6px rgba(245,158,11,0.7);border:1px solid #fff;"></span>
        <span style="font:500 11px 'Microsoft YaHei',sans-serif;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.9);">${label}</span>
      </div>
    `,
  })

function FixMapSize() {
  const map = useMap()
  useEffect(() => {
    const handle = () => map.invalidateSize({ animate: false })
    handle()
    const t = window.setTimeout(handle, 200)
    const t2 = window.setTimeout(handle, 800)
    const ro = new ResizeObserver(handle)
    ro.observe(map.getContainer())
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
      ro.disconnect()
    }
  }, [map])
  return null
}

function AirportMarkers() {
  const setSelectedDevice = useDeviceStore((s) => s.setSelectedDevice)
  const map = useMap()

  return (
    <>
      {MAP_POIS.filter((p) => p.kind === 'airport').map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={airportIcon}
          eventHandlers={{
            click: () => {
              setSelectedDevice('cabin-3')
              map.flyTo([poi.lat, poi.lng], 17, { duration: 0.7 })
            },
          }}
        >
          <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
            <span style={{ color: '#0b1c30', fontWeight: 600 }}>{poi.name}</span>
          </Tooltip>
        </Marker>
      ))}
      {MAP_POIS.filter((p) => p.kind === 'patrol').map((poi, idx) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={patrolIcon(idx + 1)}
        />
      ))}
      {MAP_POIS.filter((p) => p.kind === 'poi').map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={poiIcon(poi.name)}
        />
      ))}
    </>
  )
}

export function SatelliteMap() {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[MAP_CENTER[0], MAP_CENTER[1]]}
        zoom={MAP_ZOOM}
        minZoom={3}
        maxZoom={18}
        zoomControl={false}
        attributionControl
        className="h-full w-full"
        style={{ background: '#0d2137' }}
      >
        {/* 兜底层：高德 / Esri（天地图瓦片失败时仍可见） */}
        <TileLayer url={ESRI_SATELLITE} attribution="Esri" maxZoom={18} />
        <TileLayer url={ESRI_LABELS} attribution="" opacity={0.4} maxZoom={18} />
        <TileLayer
          url={AMAP_SAT}
          subdomains={AMAP_SUBDOMAINS}
          attribution="高德"
          maxZoom={18}
        />
        <TileLayer
          url={AMAP_LABEL}
          subdomains={AMAP_SUBDOMAINS}
          attribution=""
          opacity={0.5}
          maxZoom={18}
        />

        {/* 主底图：天地图卫星 + 中文注记 */}
        <TileLayer
          url={TIANDITU_IMG.url}
          subdomains={TIANDITU_IMG.subdomains}
          attribution="&copy; 天地图"
          maxZoom={18}
        />
        <TileLayer
          url={TIANDITU_CIA.url}
          subdomains={TIANDITU_CIA.subdomains}
          attribution=""
          opacity={0.95}
          maxZoom={18}
        />

        <FixMapSize />
        <AirportMarkers />
      </MapContainer>

      <MapControlStack />
    </div>
  )
}

function MapControlStack() {
  return (
    <div className="absolute right-3 top-3 z-[600] flex flex-col items-end gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white shadow-card">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200">
          <Compass className="h-6 w-6 text-slate-700" />
          <span className="absolute -top-1 text-[9px] font-bold text-red-500">N</span>
        </div>
      </div>
      <MapCtrlBtn label="搜索">
        <Search className="h-4 w-4 text-slate-700" />
      </MapCtrlBtn>
      <MapCtrlBtn label="2D">
        <span className="text-xs font-bold text-slate-700">2D</span>
      </MapCtrlBtn>
      <MapCtrlBtn label="绘制">
        <PenLine className="h-4 w-4 text-slate-700" />
      </MapCtrlBtn>
      <MapCtrlBtn label="图层" className="rounded-full">
        <Layers className="h-4 w-4 text-slate-700" />
      </MapCtrlBtn>
      <MapCtrlBtn label="标注" className="rounded-full">
        <MapPin className="h-4 w-4 text-slate-700" />
      </MapCtrlBtn>
    </div>
  )
}

function MapCtrlBtn({
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
      className={`flex h-10 w-10 items-center justify-center rounded-panel border border-white/80 bg-white shadow-card transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60 ${className ?? ''}`}
    >
      {children}
    </button>
  )
}
