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
page.on('pageerror', (e) => console.log('PAGE_ERROR', e.message))

await page.goto('http://127.0.0.1:4173/#/cockpit', {
  waitUntil: 'networkidle',
  timeout: 60000,
})
await page.waitForSelector('.leaflet-container', { timeout: 30000 })
await page.waitForTimeout(2500)

const texts = [
  'N 23.2957160° · E 113.6864277°',
  '100%',
  '20',
  '空速',
  '全自动模式',
  '任务信息预览',
  '4.5km',
  '9mins',
  '预计拍照数量',
  '飞行参数',
  '已飞行时间',
  '剩余里程',
  '飞行状态及仪表',
  '锁定状态，等待解锁',
  '地图',
  'FPV',
  '机场',
]
const found = {}
for (const t of texts) {
  found[t] = (await page.getByText(t, { exact: false }).count()) > 0
}
console.log(JSON.stringify(found, null, 2))
console.log('tiles', await page.locator('.leaflet-tile-loaded').count())
await page.screenshot({ path: 'output/cockpit.png' })
await browser.close()
console.log('saved output/cockpit.png')
