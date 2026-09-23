import type { HangarMethod, MethodMeta } from '@/types/hangar'

export const METHOD_META: Record<HangarMethod, MethodMeta> = {
  cover_open: {
    method: 'cover_open',
    label: '顶门打开',
    tier: 'L1',
    danger: false,
    group: 'cover-lift',
  },
  cover_close: {
    method: 'cover_close',
    label: '顶门关闭',
    tier: 'L1',
    danger: false,
    group: 'cover-lift',
  },
  lifting_platform_up: {
    method: 'lifting_platform_up',
    label: '升降上升',
    tier: 'L1',
    danger: false,
    group: 'cover-lift',
  },
  lifting_platform_down: {
    method: 'lifting_platform_down',
    label: '升降下降',
    tier: 'L1',
    danger: false,
    group: 'cover-lift',
  },
  position_center_close: {
    method: 'position_center_close',
    label: '归中夹紧',
    tier: 'L3',
    danger: false,
    group: 'jog',
  },
  position_center_open: {
    method: 'position_center_open',
    label: '归中松开',
    tier: 'L3',
    danger: false,
    group: 'jog',
  },
  charging_center_close: {
    method: 'charging_center_close',
    label: '充电伸出',
    tier: 'L3',
    danger: false,
    group: 'jog',
  },
  charging_center_open: {
    method: 'charging_center_open',
    label: '充电缩回',
    tier: 'L3',
    danger: false,
    group: 'jog',
  },
  door_center_clamp: {
    method: 'door_center_clamp',
    label: '顶门归中夹紧',
    tier: 'L3',
    danger: false,
    group: 'jog',
  },
  door_center_release: {
    method: 'door_center_release',
    label: '顶门归中松开',
    tier: 'L3',
    danger: false,
    group: 'jog',
  },
  out_bound: {
    method: 'out_bound',
    label: '出库',
    tier: 'L1',
    danger: true,
    group: 'drone-power',
  },
  in_bound: {
    method: 'in_bound',
    label: '入库',
    tier: 'L1',
    danger: true,
    group: 'drone-power',
  },
  drone_open: {
    method: 'drone_open',
    label: '飞机开机',
    tier: 'L1',
    danger: true,
    group: 'drone-power',
  },
  drone_close: {
    method: 'drone_close',
    label: '飞机关机',
    tier: 'L1',
    danger: true,
    group: 'drone-power',
  },
  charging_open: {
    method: 'charging_open',
    label: '充电',
    tier: 'L1',
    danger: false,
    group: 'drone-power',
  },
  charging_close: {
    method: 'charging_close',
    label: '停止充电',
    tier: 'L1',
    danger: false,
    group: 'drone-power',
  },
  remote_control_turn_open_off: {
    method: 'remote_control_turn_open_off',
    label: '遥控器开关机',
    tier: 'L3',
    danger: false,
    group: 'peripheral',
  },
  reset: {
    method: 'reset',
    label: '机场复位',
    tier: 'L3',
    danger: true,
    group: 'system',
  },
  stop: {
    method: 'stop',
    label: '急停',
    tier: 'L0',
    danger: true,
    group: 'safety',
    allowWhenClearSignalOn: true,
  },
  clear_emergency_stop: {
    method: 'clear_emergency_stop',
    label: '清除急停',
    tier: 'L0',
    danger: true,
    group: 'safety',
    allowWhenClearSignalOn: true,
  },
  restart_pc: {
    method: 'restart_pc',
    label: '重启工控机',
    tier: 'L3',
    danger: true,
    group: 'system',
  },
  air_conditioner_close: {
    method: 'air_conditioner_close',
    label: '关空调',
    tier: 'L3',
    danger: false,
    group: 'peripheral',
  },
}

export const L3_METHODS = Object.values(METHOD_META).filter((m) => m.tier === 'L3')

export const RAINFALL_LABEL: Record<number, string> = {
  1: '小雨',
  2: '中雨',
  3: '大雨',
  10: '无雨',
  11: '有雨',
}

export const AC_LABEL: Record<number, string> = {
  0: '没工作',
  1: '制冷',
  2: '制热',
}

export const WORK_MODE_LABEL: Record<number, string> = {
  1: '自动',
  2: '手动',
  3: '急停',
}

export function triLabel(state: number, on: string, off: string): string {
  if (state === 1) return on
  if (state === 2) return off
  return '运动中'
}

export const CLEAR_SIGNAL_ON_MESSAGE =
  '清除急停信号为 ON，请先将其置为 OFF。'
