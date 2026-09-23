import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { CockpitPage } from '@/pages/CockpitPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { VerticalPanoramaPage } from '@/pages/VerticalPanoramaPage'

export default function App() {
  return (
    <Routes>
      <Route path="/cockpit" element={<CockpitPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/vertical-panorama" replace />} />
        <Route path="/vertical-panorama" element={<VerticalPanoramaPage />} />
        <Route path="/situation" element={<PlaceholderPage title="态势显示" />} />
        <Route path="/route-plan" element={<PlaceholderPage title="航线规划" />} />
        <Route path="/map-mark" element={<PlaceholderPage title="信息标注" />} />
        <Route path="/alarm-detect" element={<PlaceholderPage title="警情侦查" />} />
        <Route path="/alarm-records" element={<PlaceholderPage title="警情记录" />} />
        <Route path="/alarm-config" element={<PlaceholderPage title="接警配置" />} />
        <Route path="/fire-detect" element={<PlaceholderPage title="消防侦查" />} />
        <Route path="/fire-records" element={<PlaceholderPage title="消防记录" />} />
        <Route path="/fire-config" element={<PlaceholderPage title="消防配置" />} />
        <Route path="/ai/alert" element={<PlaceholderPage title="预警事件" />} />
        <Route path="/ai/config" element={<PlaceholderPage title="算法配置" />} />
        <Route path="/ai/library" element={<PlaceholderPage title="AI算法库" />} />
        <Route path="/ai/case" element={<PlaceholderPage title="案件上报" />} />
        <Route path="*" element={<Navigate to="/vertical-panorama" replace />} />
      </Route>
    </Routes>
  )
}
