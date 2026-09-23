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

page.on('pageerror', (err) => {
  console.log('PAGE_ERROR', err.message)
})

await page.goto('http://127.0.0.1:4173/#/vertical-panorama', {
  waitUntil: 'networkidle',
  timeout: 60000,
})

await page.waitForSelector('.leaflet-container', { timeout: 30000 })
await page.waitForTimeout(2000)

// interaction: select 垂起3
const drone3 = page.getByRole('button', { name: /垂起3/ })
await drone3.click()
await page.waitForTimeout(500)

const batteryText = await page.locator('[aria-label*="电量"]').first().getAttribute('aria-label')
const cameraLabel = await page.getByText('垂起3', { exact: true }).count()
const onlineText = await page.getByText('在线设备').count()
const tiles = await page.locator('.leaflet-tile-loaded').count()

console.log(
  JSON.stringify(
    {
      batteryText,
      hasCameraLabel: cameraLabel > 0,
      onlineText: onlineText > 0,
      leafletTiles: tiles,
      title: await page.title(),
    },
    null,
    2,
  ),
)

await page.screenshot({ path: 'output/panorama-final.png' })

// empty filter state
await page.getByPlaceholder('请输入设备名称筛选').fill('不存在')
await page.waitForTimeout(300)
const empty = await page.getByText('未找到匹配设备').count()
console.log('empty_filter_ok', empty > 0)

await page.screenshot({ path: 'output/panorama-filter-empty.png' })

await browser.close()
console.log('done')
