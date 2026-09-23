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

await page.goto('http://127.0.0.1:4173/#/vertical-panorama', {
  waitUntil: 'networkidle',
  timeout: 60000,
})
await page.waitForSelector('.leaflet-container', { timeout: 30000 })
await page.waitForTimeout(2000)

const pairs = [
  '机场状态',
  '舱盖状态',
  '补光灯',
  '声光警报',
  '任务状态',
  '标定状态',
  '风速',
  '环境温度',
  '空中回传',
  '静音模式',
  '降雨量',
  '网速',
]
const present = {}
for (const label of pairs) {
  present[label] = (await page.getByText(label, { exact: true }).count()) > 0
}

console.log(JSON.stringify(present, null, 2))
await page.screenshot({ path: 'output/panorama-detail-2col.png' })
await browser.close()
console.log('saved output/panorama-detail-2col.png')
