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
await page.waitForSelector('.leaflet-container')
await page.waitForTimeout(1200)
await page.getByRole('button', { name: /垂起3/ }).click()
await page.waitForTimeout(400)

const checks = [
  '剩余电量',
  '降落',
  '16.7v',
  '120.98m',
  '总任务时间',
  '15mins',
  '已飞行时间',
  '1:30mins',
  '单架次里程',
  '12.06km',
  '剩余里程数',
  '0.33km',
  '多旋翼油门',
  '固定翼油门',
  '海拔高度',
  '138.00m',
  '相对高度',
  '110.00m',
  '空速',
  '地速',
  '风向',
  '风速',
  '8.0m/s',
]
const result = {}
for (const t of checks) {
  result[t] = (await page.getByText(t, { exact: true }).count()) > 0
}
console.log(JSON.stringify(result, null, 2))
await page.screenshot({ path: 'output/detail-drone.png' })
await browser.close()
