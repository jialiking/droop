/** 天地图瓦片 Key（浏览器端调用，仅用于底图服务） */
export const TIANDITU_KEY = '51d788f3e9cf7a3b09a55c815ac803bb'

const TD_SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7']

/**
 * 天地图 WMTS（Web Mercator）
 * LAYER=img 卫星影像；LAYER=cia 中文注记
 */
export const TIANDITU_IMG = {
  url: `https://t{0}.tianditu.gov.cn/img_w/wmts?tk=${TIANDITU_KEY}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`.replace(
    '{0}',
    '{s}',
  ),
  subdomains: TD_SUBDOMAINS,
}

export const TIANDITU_CIA = {
  url: `https://t{0}.tianditu.gov.cn/cia_w/wmts?tk=${TIANDITU_KEY}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`.replace(
    '{0}',
    '{s}',
  ),
  subdomains: TD_SUBDOMAINS,
}

/** 备用：高德 / Esri */
export const AMAP_SAT =
  'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
export const AMAP_LABEL =
  'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
export const AMAP_SUBDOMAINS = ['1', '2', '3', '4']
export const ESRI_SATELLITE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
export const ESRI_LABELS =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
