import { AnimatedPanel, PageFrame } from '@/components/layout/AppLayout'
import { HangarHost } from '@/components/hangar/HangarHost'
import { SatelliteMap } from '@/components/map/SatelliteMap'
import { AirportList } from '@/components/panorama/AirportList'
import { CameraFeed } from '@/components/panorama/CameraFeed'
import { DeviceDetail } from '@/components/panorama/DeviceDetail'
import { StatsBar } from '@/components/panorama/StatsBar'
import { useDeviceStore } from '@/stores/useDeviceStore'

export function VerticalPanoramaPage() {
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId)
  const details = useDeviceStore((s) => s.details)
  const detail = details[selectedDeviceId]

  return (
    <PageFrame title="垂起全景">
      <div className="absolute inset-0">
        <SatelliteMap />
      </div>

      <AnimatedPanel
        className="pointer-events-auto absolute bottom-3 left-3 top-3 z-[500] flex w-[320px] flex-col gap-2"
        delay={0.05}
      >
        <AirportList className="min-h-0 shrink" />

        <div className="panel-glass flex min-h-0 flex-1 flex-col overflow-hidden rounded-panel p-3">
          <div className="shrink-0">
            <DeviceDetail detail={detail} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col pt-2">
            <CameraFeed
              label={detail?.cameraLabel ?? '机场'}
              src="/mock/camera.svg"
            />
          </div>
        </div>
      </AnimatedPanel>

      <StatsBar />
      <HangarHost />
    </PageFrame>
  )
}
