import { asset } from '@/lib/asset'
import type {
  AirportCardItem,
  CabinDeviceDetail,
  DailyStats,
  DeviceDetail,
  DroneDeviceDetail,
  MapPoi,
  NavItem,
} from '@/types'

/** 徐州泉山/矿大文昌片区 — 与截图卫星图一致的中心点 */
export const MAP_CENTER: [number, number] = [34.2568, 117.1932]
export const MAP_ZOOM = 16

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'smart-patrol',
    label: '智能巡查',
    icon: 'shield',
    children: [
      { id: 'situation', label: '态势显示', icon: 'monitor', path: '/situation' },
      {
        id: 'vertical-panorama',
        label: '垂起全景',
        icon: 'grid',
        path: '/vertical-panorama',
      },
      { id: 'route-plan', label: '航线规划', icon: 'route', path: '/route-plan' },
      { id: 'map-mark', label: '信息标注', icon: 'map-pin', path: '/map-mark' },
      { id: 'alarm-detect', label: '警情侦查', icon: 'search', path: '/alarm-detect' },
    ],
  },
  { id: 'alarm-records', label: '警情记录', icon: 'file-text', path: '/alarm-records' },
  { id: 'alarm-config', label: '接警配置', icon: 'phone', path: '/alarm-config' },
  { id: 'fire-detect', label: '消防侦查', icon: 'flame', path: '/fire-detect' },
  { id: 'fire-records', label: '消防记录', icon: 'clipboard', path: '/fire-records' },
  { id: 'fire-config', label: '消防配置', icon: 'settings', path: '/fire-config' },
  {
    id: 'ai',
    label: '人工智能',
    icon: 'cpu',
    children: [
      { id: 'ai-alert', label: '预警事件', icon: 'alert', path: '/ai/alert' },
      { id: 'ai-config', label: '算法配置', icon: 'sliders', path: '/ai/config' },
      { id: 'ai-library', label: 'AI算法库', icon: 'database', path: '/ai/library' },
      { id: 'ai-case', label: '案件上报', icon: 'upload', path: '/ai/case' },
    ],
  },
]

/** 方舱为父节点，垂起为其从属设备（1:1） */
export const AIRPORT_CARDS: AirportCardItem[] = [
  {
    id: 'cabin-3',
    name: '方舱3',
    role: 'cabin',
    badge: '1',
    runState: 'open',
    runStateLabel: '打开',
    online: 'online',
    onlineLabel: '在线',
    deviceId: 'cabin-3',
    thumbnail: asset('mock/cabin.svg'),
  },
  {
    id: 'drone-3',
    name: '垂起3',
    role: 'drone',
    badge: '1',
    runState: 'flying',
    runStateLabel: '飞在空中',
    online: 'online',
    onlineLabel: '在线',
    deviceId: 'drone-3',
    thumbnail: asset('mock/drone.svg'),
    parentId: 'cabin-3',
  },
  {
    id: 'cabin-2',
    name: '方舱2',
    role: 'cabin',
    badge: '1',
    runState: 'charging',
    runStateLabel: '空充电',
    online: 'online',
    onlineLabel: '在线',
    deviceId: 'cabin-2',
    thumbnail: asset('mock/cabin.svg'),
  },
  {
    id: 'drone-2',
    name: '垂起2',
    role: 'drone',
    badge: '0',
    runState: 'offline',
    runStateLabel: '当前正常',
    online: 'offline',
    onlineLabel: '离线',
    deviceId: 'drone-2',
    thumbnail: asset('mock/drone.svg'),
    parentId: 'cabin-2',
  },
]

const cabin3: CabinDeviceDetail = {
  id: 'cabin-3',
  role: 'cabin',
  airportName: '机场3east',
  badge: '机场3east',
  battery: 88,
  chargeStatus: '空闲',
  batteryTemp: '32.2°C',
  inCabin: '不在舱',
  airportStatus: '作业中',
  hatchStatus: '关闭',
  searchLight: '关闭',
  audioAlarm: '关闭',
  taskStatus: '飞行作业中',
  calibStatus: '已标定',
  windSpeed: '0m/s',
  ambientTemp: '33.8°C',
  airReturn: '关闭',
  quietMode: '关闭',
  drizzle: '无雨',
  network: '587KB/s',
  cameraLabel: '机场3east',
}

const cabin2: CabinDeviceDetail = {
  id: 'cabin-2',
  role: 'cabin',
  airportName: '机场2west',
  badge: '机场2west',
  battery: 45,
  chargeStatus: '充电中',
  batteryTemp: '30.5°C',
  inCabin: '在舱',
  airportStatus: '充电中',
  hatchStatus: '关闭',
  searchLight: '关闭',
  audioAlarm: '关闭',
  taskStatus: '待命',
  calibStatus: '已标定',
  windSpeed: '0.4m/s',
  ambientTemp: '32.9°C',
  airReturn: '关闭',
  quietMode: '开启',
  drizzle: '无雨',
  network: '391KB/s',
  cameraLabel: '机场2west',
}

/** 垂起详情 — 字段与数值对齐最新附件 */
const drone3: DroneDeviceDetail = {
  id: 'drone-3',
  role: 'drone',
  name: '垂起3',
  badge: '垂起3',
  battery: 90,
  status: '降落',
  voltage: '16.7v',
  distToAirport: '120.98m',
  totalMissionTime: '15mins',
  flightTime: '1:30mins',
  sortieRange: '12.06km',
  remainRange: '0.33km',
  multiRotorThrottle: '0%',
  fixedWingThrottle: '60%',
  altitude: '138.00m',
  relativeAltitude: '110.00m',
  airSpeed: '18.0m/s',
  groundSpeed: '18.2m/s',
  windDirection: '东',
  windSpeed: '8.0m/s',
  cameraLabel: '垂起3',
}

const drone2: DroneDeviceDetail = {
  id: 'drone-2',
  role: 'drone',
  name: '垂起2',
  badge: '垂起2',
  battery: 12,
  status: '离线',
  voltage: '—',
  distToAirport: '—',
  totalMissionTime: '—',
  flightTime: '—',
  sortieRange: '—',
  remainRange: '—',
  multiRotorThrottle: '—',
  fixedWingThrottle: '—',
  altitude: '—',
  relativeAltitude: '—',
  airSpeed: '—',
  groundSpeed: '—',
  windDirection: '—',
  windSpeed: '—',
  cameraLabel: '垂起2',
}

export const DEVICE_DETAILS: Record<string, DeviceDetail> = {
  'cabin-3': cabin3,
  'drone-3': drone3,
  'cabin-2': cabin2,
  'drone-2': drone2,
}

export const MAP_POIS: MapPoi[] = [
  {
    id: 'airport-3east',
    name: '机场3east',
    lng: 117.1948,
    lat: 34.2562,
    kind: 'airport',
  },
  { id: 'poi-1', name: '点位1', lng: 117.1865, lat: 34.2538, kind: 'patrol' },
  { id: 'poi-2', name: '点位2', lng: 117.1862, lat: 34.2508, kind: 'patrol' },
  { id: 'poi-3', name: '点位3', lng: 117.1898, lat: 34.2536, kind: 'patrol' },
  {
    id: 'label-square',
    name: '科技广场',
    lng: 117.1925,
    lat: 34.2605,
    kind: 'poi',
  },
  {
    id: 'label-cscec',
    name: '江苏中建工程设计研究院',
    lng: 117.1952,
    lat: 34.2548,
    kind: 'poi',
  },
  {
    id: 'label-cumt',
    name: '中国矿业大学徐海学院',
    lng: 117.1935,
    lat: 34.2475,
    kind: 'poi',
  },
]

export const DAILY_STATS: DailyStats = {
  onlineDevices: 3,
  todayFlights: 12,
  todayFlightHours: 3.6,
  todayFlightKm: 12.8,
}
