export type CoverState = 1 | 2 | 3
export type TriState = 1 | 2 | 3
export type Rainfall = 1 | 2 | 3 | 10 | 11
export type AcState = 0 | 1 | 2
export type DockWorkMode = 1 | 2 | 3

export interface HangarOsd {
  cover_state: CoverState
  position_center_state: TriState
  charging_center_state: TriState
  lifting_platform_state: TriState
  out_bound_complete: boolean
  in_bound_complete: boolean
  device_online_state: boolean
  charging_state: boolean
  drone_in_dock: boolean
  wind_speed: number
  external_temperature: number
  external_humidity: number
  internal_temperature: number
  internal_humidity: number
  rainfall: Rainfall
  heart_beat: number
  mains_signal: boolean
  reset_complete: boolean
  air_conditioner_state: AcState
  stop_state: boolean
  dock_work_mode: DockWorkMode
}

export type HangarMethod =
  | 'cover_open'
  | 'cover_close'
  | 'lifting_platform_up'
  | 'lifting_platform_down'
  | 'position_center_close'
  | 'position_center_open'
  | 'charging_center_close'
  | 'charging_center_open'
  | 'door_center_clamp'
  | 'door_center_release'
  | 'out_bound'
  | 'in_bound'
  | 'drone_open'
  | 'drone_close'
  | 'charging_open'
  | 'charging_close'
  | 'remote_control_turn_open_off'
  | 'reset'
  | 'stop'
  | 'clear_emergency_stop'
  | 'restart_pc'
  | 'air_conditioner_close'

export type MethodTier = 'L0' | 'L1' | 'L3'
export type MethodGroup =
  | 'safety'
  | 'cover-lift'
  | 'drone-power'
  | 'jog'
  | 'peripheral'
  | 'system'

export interface MethodMeta {
  method: HangarMethod
  label: string
  tier: MethodTier
  danger: boolean
  group: MethodGroup
  /** true：联锁 ON 时仍允许下发（仅 stop / clear_emergency_stop） */
  allowWhenClearSignalOn?: boolean
}

export interface HangarCommandResult {
  tid: string
  bid: string
  method: HangarMethod
  result: 0 | -1
  message?: string
  timestamp: number
}

export type HangarProgressKind = 'out_bound' | 'in_bound' | null
