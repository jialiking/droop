import { create } from 'zustand'
import { CLEAR_SIGNAL_ON_MESSAGE, METHOD_META } from '@/components/hangar/methodMeta'
import {
  HANGAR_AIRPORT_NAME,
  HANGAR_DEVICE_NAME,
  HANGAR_GATEWAY_SN,
  INITIAL_OSD,
} from '@/data/hangarMock'
import type {
  HangarCommandResult,
  HangarMethod,
  HangarOsd,
  HangarProgressKind,
} from '@/types/hangar'

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface ToastItem {
  id: string
  type: 'ok' | 'error' | 'info'
  text: string
}

interface HangarState {
  gatewaySn: string
  deviceName: string
  airportName: string
  osd: HangarOsd
  /** 本地模拟：清除急停信号 */
  clearEmergencySignalOn: boolean
  platformHb: boolean
  lastPlatformHbAt: number
  drawerOpen: boolean
  moreDialogOpen: boolean
  toasts: ToastItem[]
  pendingDanger: HangarMethod | null
  progress: HangarProgressKind
  progressPercent: number
  /** 本地镜像：顶门归中夹紧 */
  doorCenterClamped: boolean
  /** 本地镜像：遥控器开机 */
  remoteControlOn: boolean
  setDrawerOpen: (open: boolean) => void
  setMoreDialogOpen: (open: boolean) => void
  setPendingDanger: (m: HangarMethod | null) => void
  toast: (type: ToastItem['type'], text: string) => void
  dismissToast: (id: string) => void
  ingestPlatformHeartbeat: () => void
  tickPlatformHb: () => void
  tickOsd: () => void
  sendMethod: (method: HangarMethod) => Promise<HangarCommandResult>
  setClearEmergencySignal: (on: boolean) => void
}

export const useHangarStore = create<HangarState>((set, get) => ({
  gatewaySn: HANGAR_GATEWAY_SN,
  deviceName: HANGAR_DEVICE_NAME,
  airportName: HANGAR_AIRPORT_NAME,
  osd: { ...INITIAL_OSD },
  clearEmergencySignalOn: false,
  platformHb: true,
  lastPlatformHbAt: Date.now(),
  drawerOpen: false,
  moreDialogOpen: false,
  toasts: [],
  pendingDanger: null,
  progress: null,
  progressPercent: 0,
  doorCenterClamped: true,
  remoteControlOn: false,

  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setMoreDialogOpen: (open) => set({ moreDialogOpen: open }),
  setPendingDanger: (m) => set({ pendingDanger: m }),

  toast: (type, text) => {
    const item: ToastItem = { id: uuid(), type, text }
    set((s) => ({ toasts: [...s.toasts.slice(-3), item] }))
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== item.id) }))
    }, 2000)
  },
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  ingestPlatformHeartbeat: () =>
    set({ platformHb: true, lastPlatformHbAt: Date.now() }),

  tickPlatformHb: () => {
    const { lastPlatformHbAt, platformHb } = get()
    const expired = Date.now() - lastPlatformHbAt > 10_000
    if (expired && platformHb) set({ platformHb: false })
  },

  tickOsd: () => {
    const osd = { ...get().osd }
    osd.heart_beat = osd.heart_beat >= 65535 ? 1 : osd.heart_beat + 1
    osd.wind_speed = Math.max(0, +(osd.wind_speed + (Math.random() - 0.5) * 0.2).toFixed(1))
    osd.external_temperature = +(
      osd.external_temperature +
      (Math.random() - 0.5) * 0.2
    ).toFixed(1)
    set({ osd })
  },

  sendMethod: async (method) => {
    const meta = METHOD_META[method]
    const tid = uuid()
    const bid = uuid()
    const timestamp = Date.now()
    const { clearEmergencySignalOn, gatewaySn } = get()

    // 协议 §3.4 联锁
    if (clearEmergencySignalOn && !meta.allowWhenClearSignalOn) {
      const result: HangarCommandResult = {
        tid,
        bid,
        method,
        result: -1,
        message: CLEAR_SIGNAL_ON_MESSAGE,
        timestamp,
      }
      get().toast('error', CLEAR_SIGNAL_ON_MESSAGE)
      return result
    }

    await new Promise((r) => setTimeout(r, 280 + Math.random() * 220))

    const osd = { ...get().osd }
    const apply = () => {
      switch (method) {
        case 'cover_open':
          osd.cover_state = 1
          break
        case 'cover_close':
          osd.cover_state = 2
          break
        case 'lifting_platform_up':
          osd.lifting_platform_state = 1
          break
        case 'lifting_platform_down':
          osd.lifting_platform_state = 2
          break
        case 'position_center_close':
          osd.position_center_state = 1
          break
        case 'position_center_open':
          osd.position_center_state = 2
          break
        case 'charging_center_close':
          osd.charging_center_state = 1
          break
        case 'charging_center_open':
          osd.charging_center_state = 2
          break
        case 'door_center_clamp':
          set({ doorCenterClamped: true })
          break
        case 'door_center_release':
          set({ doorCenterClamped: false })
          break
        case 'out_bound':
          osd.out_bound_complete = true
          osd.in_bound_complete = false
          osd.drone_in_dock = false
          break
        case 'in_bound':
          osd.in_bound_complete = true
          osd.out_bound_complete = false
          osd.drone_in_dock = true
          break
        case 'drone_open':
          osd.device_online_state = true
          break
        case 'drone_close':
          osd.device_online_state = false
          break
        case 'charging_open':
          osd.charging_state = true
          break
        case 'charging_close':
          osd.charging_state = false
          break
        case 'reset':
          osd.reset_complete = true
          osd.stop_state = false
          osd.dock_work_mode = 1
          break
        case 'stop':
          osd.stop_state = true
          osd.dock_work_mode = 3
          break
        case 'clear_emergency_stop':
          set({ clearEmergencySignalOn: false })
          osd.stop_state = false
          osd.dock_work_mode = 1
          break
        case 'air_conditioner_close':
          osd.air_conditioner_state = 0
          break
        case 'remote_control_turn_open_off':
          set({ remoteControlOn: !get().remoteControlOn })
          break
      }
      set({ osd })
    }

    // 出/入库：简易进度动画
    if (method === 'out_bound' || method === 'in_bound') {
      set({ progress: method, progressPercent: 0 })
      for (let p = 10; p <= 100; p += 10) {
        await new Promise((r) => setTimeout(r, 120))
        set({ progressPercent: p })
      }
      apply()
      set({ progress: null, progressPercent: 0 })
      get().toast('ok', `${meta.label}完成 · gateway=${gatewaySn}`)
    } else if (method === 'stop') {
      apply()
      // 急停：模拟写「清除急停信号」为 ON，需手动清除
      set({ clearEmergencySignalOn: true })
      get().toast('ok', '急停已下发，清除急停信号为 ON')
    } else if (method === 'clear_emergency_stop') {
      apply()
      get().toast('ok', '清除急停成功，信号已置 OFF')
    } else {
      apply()
      get().toast('ok', `${meta.label}成功`)
    }

    return { tid, bid, method, result: 0, timestamp }
  },

  setClearEmergencySignal: (on) => set({ clearEmergencySignalOn: on }),
}))
