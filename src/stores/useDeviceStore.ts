import { create } from 'zustand'
import { AIRPORT_CARDS, DEVICE_DETAILS } from '@/data/mock'
import type { AirportCardItem, DailyStats, DeviceDetail } from '@/types'
import { DAILY_STATS } from '@/data/mock'

interface DeviceState {
  devices: AirportCardItem[]
  details: Record<string, DeviceDetail>
  selectedDeviceId: string
  filterKeyword: string
  stats: DailyStats
  setSelectedDevice: (id: string) => void
  setFilterKeyword: (keyword: string) => void
  filteredDevices: () => AirportCardItem[]
  selectedDetail: () => DeviceDetail | undefined
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: AIRPORT_CARDS,
  details: DEVICE_DETAILS,
  selectedDeviceId: 'cabin-3',
  filterKeyword: '',
  stats: DAILY_STATS,
  setSelectedDevice: (id) => set({ selectedDeviceId: id }),
  setFilterKeyword: (keyword) => set({ filterKeyword: keyword }),
  filteredDevices: () => {
    const { devices, filterKeyword } = get()
    const kw = filterKeyword.trim()
    if (!kw) return devices
    return devices.filter(
      (d) => d.name.includes(kw) || d.runStateLabel.includes(kw),
    )
  },
  selectedDetail: () => {
    const { details, selectedDeviceId } = get()
    return details[selectedDeviceId]
  },
}))
