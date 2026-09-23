import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath:
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
})
const page = await browser.newPage({
  viewport: { width: 1680, height: 945 },
  locale: 'zh-CN',
})
await page.goto('http://127.0.0.1:4173/#/cockpit', {
  waitUntil: 'networkidle',
  timeout: 60000,
})
await page.waitForSelector('.leaflet-container')
await page.waitForTimeout(1200)

const hasMap = await page.locator('.leaflet-container').count()
await page.screenshot({ path: 'output/cockpit-map.png' })

await page.getByRole('button', { name: /FPV/ }).click()
await page.waitForTimeout(400)
const fpvTitle = await page.getByText('FPV 无人机直播').count()
const fpvLive = await page.getByText('垂起3 · 机载相机').count()
await page.screenshot({ path: 'output/cockpit-fpv.png' })

await page.getByRole('button', { name: /机场/ }).click()
await page.waitForTimeout(400)
const airportTitle = await page.getByText('机场直播').count()
const airportLive = await page.getByText('机场3east · 舱内相机').count()
await page.screenshot({ path: 'output/cockpit-airport.png' })

await page.getByRole('button', { name: /地图/ }).click()
await page.waitForTimeout(400)
const backMap = await page.locator('.leaflet-container').count()

console.log(
  JSON.stringify(
    {
      hasMap: hasMap > 0,
      fpvTitle: fpvTitle > 0,
      fpvLive: fpvLive > 0,
      airportTitle: airportTitle > 0,
      airportLive: airportLive > 0,
      backMap: backMap > 0,
    },
    null,
    2,
  ),
)
await browser.close()
