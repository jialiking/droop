# 丰东科技信息管理系统 — 垂起全景原型

基于 React 18 + TypeScript + Vite + TailwindCSS 的运维大屏 Demo，首屏交付「垂起全景」。

## 启动

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`，默认进入 `/vertical-panorama`。

## 构建 / 类型检查

```bash
npm run typecheck
npm run build
npm run preview
```

## 技术栈

- React 18 + TypeScript + Vite
- TailwindCSS + 自定义暗色 Token（对齐截图深蓝指挥中心风格）
- React Router v6（HashRouter，便于静态预览）/ Zustand / TanStack Query / Framer Motion / Lucide
- Leaflet + **天地图卫星影像/注记**（已配置 Key，见 `src/config/mapTiles.ts`），高德/Esri 作兜底
- Radix UI / React Hook Form / Zod / Recharts / MSW（能力预置）

## 页面结构

- 顶栏：系统名、通知/帮助、「进入大屏」、头像
- 侧栏：智能巡查 / 消防 / AI 等导航，当前高亮「垂起全景」
- 中央：卫星地图 + 机场标记 + 右侧地图控件
- 左浮层：设备筛选、机场列表卡片、设备详情（电量环）、舱内监控
- 底栏：在线设备 / 今日航次 / 飞行时长 / 飞行里程

## 说明

- 地图瓦片使用 Esri 免费卫星影像，叠加英文地名图层；中文 POI 以自定义标注呈现。
- 若需高德/百度/天地图中文底图，替换 `src/components/map/SatelliteMap.tsx` 中的 TileLayer URL 即可。
- 业务数据在 `src/data/mock.ts`，MSW handlers 在 `src/mocks/handlers.ts`。
