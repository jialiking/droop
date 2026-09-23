import type { HangarOsd } from '@/types/hangar'

export const HANGAR_GATEWAY_SN = '4TADL2L262701'
export const HANGAR_DEVICE_NAME = '方舱3'
export const HANGAR_AIRPORT_NAME = '机场3east'

export const INITIAL_OSD: HangarOsd = {
  cover_state: 2,
  position_center_state: 1,
  charging_center_state: 2,
  lifting_platform_state: 2,
  out_bound_complete: false,
  in_bound_complete: true,
  device_online_state: false,
  charging_state: false,
  drone_in_dock: true,
  wind_speed: 1.2,
  external_temperature: 26.5,
  external_humidity: 48.0,
  internal_temperature: 24.0,
  internal_humidity: 42.0,
  rainfall: 10,
  heart_beat: 1,
  mains_signal: true,
  reset_complete: true,
  air_conditioner_state: 0,
  stop_state: false,
  dock_work_mode: 1,
}
