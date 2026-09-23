export function BatteryGauge({
  value,
  caption = '电量',
}: {
  value: number
  caption?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = 30
  const stroke = 7
  const normalized = clamped / 100
  const circumference = 2 * Math.PI * radius
  const dash = circumference * normalized

  return (
    <div
      className="relative h-[68px] w-[68px] shrink-0"
      role="img"
      aria-label={`${caption} ${clamped}%`}
    >
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#163050"
          strokeWidth={stroke}
          transform="rotate(-90 40 40)"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-base font-bold leading-none text-status-online tabular-nums">
          {clamped}
        </div>
        <div className="text-[9px] leading-3 text-ink-secondary">%</div>
        <div className="max-w-full truncate px-0.5 text-center text-[8px] leading-3 text-ink-muted">
          {caption}
        </div>
      </div>
    </div>
  )
}
