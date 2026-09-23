export type DeviceOnlineStatus = 'online' | 'offline'

export type DeviceRunState =
  | 'open'
  | 'flying'
  | 'charging'
  | 'idle'
  | 'normal'
  | 'offline'

export type DeviceRole = 'cabin' | 'drone'

export interface AirportCardItem {
  id: string
  name: string
  role: DeviceRole
  badge: string
  runState: DeviceRunState
  runStateLabel: string
  online: DeviceOnlineStatus
  onlineLabel: string
  deviceId: string
  thumbnail: string
  /** 所属方舱 id；垂起挂载在方舱下，体现从属关系 */
  parentId?: string
}

/** 方舱（地面舱段）详情 */
export interface CabinDeviceDetail {
  id: string
  role: 'cabin'
  airportName: string
  badge: string
  battery: number
  chargeStatus: string
  batteryTemp: string
  inCabin: string
  airportStatus: string
  hatchStatus: string
  searchLight: string
  audioAlarm: string
  taskStatus: string
  calibStatus: string
  windSpeed: string
  ambientTemp: string
  airReturn: string
  quietMode: string
  drizzle: string
  network: string
  cameraLabel: string
}

/** 垂起（无人机）详情 — 对齐附件飞行参数 */
export interface DroneDeviceDetail {
  id: string
  role: 'drone'
  name: string
  badge: string
  /** 剩余电量 % */
  battery: number
  status: string
  voltage: string
  distToAirport: string
  totalMissionTime: string
  flightTime: string
  sortieRange: string
  remainRange: string
  multiRotorThrottle: string
  fixedWingThrottle: string
  altitude: string
  relativeAltitude: string
  airSpeed: string
  groundSpeed: string
  windDirection: string
  windSpeed: string
  cameraLabel: string
}

export type DeviceDetail = CabinDeviceDetail | DroneDeviceDetail

export interface MapPoi {
  id: string
  name: string
  lng: number
  lat: number
  kind: 'airport' | 'poi' | 'patrol'
}

export interface DailyStats {
  onlineDevices: number
  todayFlights: number
  todayFlightHours: number
  todayFlightKm: number
}

export interface NavItem {
  id: string
  label: string
  icon: string
  children?: NavItem[]
  path?: string
}
