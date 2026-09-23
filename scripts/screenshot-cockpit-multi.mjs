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

await page.getByRole('button', { name: '多窗口布局' }).click()
await page.waitForTimeout(1500)

const checks = {
  situMap: (await page.getByText('态势地图').count()) > 0,
  fpv: (await page.getByText('无人机 FPV').count()) > 0,
  airportMon: (await page.getByText('机场监控').count()) > 0,
  ultra: (await page.getByText('1080P超清').count()) >= 2,
  taskPanel: (await page.getByText('任务信息预览').count()) > 0,
  mapTiles: await page.locator('.leaflet-tile-loaded').count(),
}
console.log(JSON.stringify(checks, null, 2))
await page.screenshot({ path: 'output/cockpit-multi.png' })

await page.getByRole('button', { name: '单窗口布局' }).click()
await page.waitForTimeout(800)
const backSingle = (await page.getByText('地图', { exact: true }).count()) > 0
console.log('back_single', backSingle)
await browser.close()
